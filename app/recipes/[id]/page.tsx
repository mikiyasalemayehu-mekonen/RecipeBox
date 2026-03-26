"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  LinkIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

import { api } from "@/lib/api";
import { useRecipe } from "@/hooks/useRecipe";
import { formatTime, formatPrice, hashColor } from "@/lib/utils";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { recipe, isLoading, isError, mutate } = useRecipe(id);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-danger mb-4">Recipe not found</h1>
        <p className="text-text-secondary mb-8">The recipe you're looking for doesn't exist or you don't have access to it.</p>
        <Link href="/recipes">
          <Button>Back to recipes</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteRecipe(id);
      toast.success("Recipe deleted");
      router.push("/recipes");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete recipe");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    if (recipe.link) {
      navigator.clipboard.writeText(recipe.link);
      toast.success("Link copied to clipboard!");
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Page URL copied to clipboard!");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await api.uploadRecipeImage(id, file);
      await mutate();
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="flex-1 bg-background pb-16">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-accent/20 border-b border-border">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary/40 text-center px-4 mix-blend-multiply">
              {recipe.title}
            </h1>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Top actions */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center z-10 w-full max-w-7xl mx-auto">
          <Link href="/recipes" className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-full bg-surface/80 backdrop-blur text-text-primary hover:bg-surface transition-colors shadow-sm">
            <ArrowLeftIcon className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline font-medium text-sm">Back</span>
          </Link>
          <div className="flex gap-2">
            <button onClick={handleShare} className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-full bg-surface/80 backdrop-blur text-text-primary hover:bg-surface transition-colors shadow-sm" title="Share recipe">
              <ShareIcon className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline font-medium text-sm">Share</span>
            </button>
            <Link href={`/recipes/${id}/edit`} className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm" title="Edit recipe">
              <PencilIcon className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline font-medium text-sm">Edit</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="flex-1 lg:w-2/3">
            <Card className="p-8 shadow-lg min-h-[500px]">
              <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6 text-balance">
                {recipe.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border text-text-secondary font-medium">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-primary" />
                  <span>{formatTime(recipe.time_minutes)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary" />
                  <span>{formatPrice(recipe.price)}</span>
                </div>
                {recipe.link && (
                  <a href={recipe.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <LinkIcon className="h-6 w-6 text-primary" />
                    <span className="underline underline-offset-4 decoration-primary/30 text-primary">Original Recipe</span>
                  </a>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                  Description
                </h2>
                <div className="prose prose-p:text-text-secondary prose-p:leading-relaxed max-w-none">
                  {recipe.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                  Ingredients
                </h2>
                {recipe.ingredients.length > 0 ? (
                  <ul className="space-y-3">
                    {recipe.ingredients.map(ing => (
                      <li key={ing.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-text-primary font-medium">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-secondary italic">No ingredients specified.</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                  Tags
                </h2>
                {recipe.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-text-primary shadow-sm"
                        style={{ backgroundColor: hashColor(tag.name) + '33', border: `1px solid ${hashColor(tag.name)}` }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary italic">No tags added.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:mt-16">
            
            {/* Image Card */}
            <Card className="overflow-hidden">
              <div className="p-4 bg-surface border-b border-border font-bold text-text-primary flex items-center gap-2">
                <PhotoIcon className="h-5 w-5 text-primary" />
                Recipe Photo
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden bg-accent/10 border-2 border-dashed border-border flex items-center justify-center">
                    {recipe.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={recipe.image} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <PhotoIcon className="h-12 w-12 mx-auto text-text-secondary opacity-50 mb-2" />
                        <p className="text-sm text-text-secondary">No image uploaded</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-surface/80 flex items-center justify-center backdrop-blur-sm z-10">
                        <Spinner />
                      </div>
                    )}
                  </div>
                  <div className="w-full relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Button variant="outline" className="w-full pointer-events-none" isLoading={isUploading}>
                      {recipe.image ? "Change image" : "Upload new image"}
                    </Button>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 text-center">
                    Recommended: High-res square image (1:1).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <div className="p-4 bg-surface border-b border-border font-bold text-text-primary flex items-center gap-2">
                Quick Actions
              </div>
              <CardContent className="p-4 space-y-3">
                <Link href={`/recipes/${id}/edit`} className="block">
                  <Button variant="secondary" className="w-full justify-start text-left bg-surface text-text-primary hover:bg-surface border border-border shadow-none">
                    <PencilIcon className="h-5 w-5 mr-3 text-primary" />
                    Edit recipe details
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left text-danger hover:bg-danger/10 hover:text-danger" 
                  onClick={() => setShowDeleteModal(true)}
                >
                  <TrashIcon className="h-5 w-5 mr-3" />
                  Delete recipe permanently
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe permanently? This action cannot be undone."
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
