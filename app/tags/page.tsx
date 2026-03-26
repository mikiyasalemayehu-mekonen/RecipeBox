"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { InformationCircleIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { api } from "@/lib/api";
import { Tag } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export default function TagsPage() {
  const [assignedOnly, setAssignedOnly] = useState(false);
  
  // Data fetch
  const qs = assignedOnly ? "?assigned_only=1" : "";
  const { data: tags, isLoading, mutate } = useSWR<Tag[]>(`tags-${qs}`, () => api.getTags(assignedOnly ? { assigned_only: "1" } : undefined));

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);


  const handleUpdate = async () => {
    if (!editingId || !editName.trim()) return;
    setIsSaving(true);
    try {
      await api.updateTag(editingId, { name: editName.trim() });
      await mutate();
      toast.success("Tag updated");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update tag");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteTag(deleteId);
      await mutate();
      toast.success("Tag deleted");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tag");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-1">Tags</h1>
          <p className="text-text-secondary">Manage the tags used to organize your recipes.</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 mb-8 text-sm text-text-secondary">
        <InformationCircleIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <span>Tags are created automatically when you add them to a recipe in the recipe editor. You can rename or delete them here.</span>
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-border bg-surface/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <Switch.Group as="div" className="flex items-center">
            <Switch
              checked={assignedOnly}
              onChange={setAssignedOnly}
              className={cn(
                assignedOnly ? "bg-primary" : "bg-border",
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  assignedOnly ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
            <Switch.Label as="span" className="ml-3 text-sm font-medium text-text-primary cursor-pointer">
              Show only tags used in recipes
            </Switch.Label>
          </Switch.Group>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><Spinner /></div>
        ) : tags?.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <p>No tags found.</p>
            {!assignedOnly && <p className="mt-2 text-sm">Tags help you organize your recipes. Create one above!</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="bg-background text-text-secondary uppercase text-xs font-semibold tracking-wider border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tags?.map((tag) => (
                  <tr key={tag.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">#{tag.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === tag.id ? (
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <Input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-9 px-2 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdate();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                        </div>
                      ) : (
                        <span className="font-medium">{tag.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === tag.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={handleUpdate} 
                            disabled={isSaving}
                            className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors disabled:opacity-50"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg bg-border/50 text-text-secondary hover:bg-border hover:text-text-primary transition-colors disabled:opacity-50"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <button
                            onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}
                            className="text-text-secondary hover:text-primary transition-colors p-1"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(tag.id)}
                            className="text-text-secondary hover:text-danger transition-colors p-1"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Tag" description="Are you sure you want to delete this tag? Recipes will no longer be associated with it.">
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
