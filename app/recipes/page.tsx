"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { PlusIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

import { api } from "@/lib/api";
import { Recipe } from "@/types";
import { useTags } from "@/hooks/useTags";
import { useIngredients } from "@/hooks/useIngredients";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";

export default function RecipesPage() {
  const router = useRouter();
  
  // Filters state
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  
  // Data hooks
  const { tags } = useTags();
  const { ingredients } = useIngredients();

  // Fetch recipes based on tags and ingredients
  const qsParams: Record<string, string> = {};
  if (selectedTags.length > 0) qsParams.tags = selectedTags.join(",");
  if (selectedIngredients.length > 0) qsParams.ingredients = selectedIngredients.join(",");
  
  const qs = new URLSearchParams(qsParams).toString();
  const { data: recipesData, isLoading, mutate } = useSWR<Recipe[]>(`recipes-${qs}`, () => api.getRecipes(qsParams));

  // Client-side filtering by search string
  const recipes = recipesData || [];
  const filteredRecipes = search.trim() === "" 
    ? recipes 
    : recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  // Delete modal state
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleTag = (id: number) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleIngredient = (id: number) => {
    setSelectedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedIngredients([]);
    setSearch("");
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteRecipe(recipeToDelete);
      await mutate();
      toast.success("Recipe deleted");
      setRecipeToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete recipe");
    } finally {
      setIsDeleting(false);
    }
  };

  const recipeItemToDelete = recipes.find(r => r.id === recipeToDelete);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-8 bg-surface p-6 rounded-2xl border border-border">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Filters
              </h2>
              {(selectedTags.length > 0 || selectedIngredients.length > 0) && (
                <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Tags Filter */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-3">Tags</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 border-2 border-border rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                        />
                        <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:text-white transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                        {tag.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ingredients Filter */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-3">Ingredients</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {ingredients.map(ing => (
                    <label key={ing.id} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 border-2 border-border rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                          checked={selectedIngredients.includes(ing.id)}
                          onChange={() => toggleIngredient(ing.id)}
                        />
                        <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:text-white transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                        {ing.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">My Recipes</h1>
          
          <div className="flex items-center gap-4">
            <div className="w-full sm:w-64">
              <Input 
                placeholder="Search recipes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-surface h-12"
              />
            </div>
            <Link href="/recipes/new">
              <Button className="h-12 whitespace-nowrap pl-4 pr-5 gap-2">
                <PlusIcon className="h-5 w-5" />
                New recipe
              </Button>
            </Link>
          </div>
        </div>

        <RecipeGrid 
          recipes={filteredRecipes} 
          isLoading={isLoading} 
          onEdit={(id) => router.push(`/recipes/${id}/edit`)}
          onDelete={(id) => setRecipeToDelete(id)}
          emptyStateAction={
            <Link href="/recipes/new">
              <Button>Create your first recipe</Button>
            </Link>
          }
        />
      </main>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!recipeToDelete} 
        onClose={() => setRecipeToDelete(null)}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${recipeItemToDelete?.title}"? This action cannot be undone.`}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setRecipeToDelete(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
