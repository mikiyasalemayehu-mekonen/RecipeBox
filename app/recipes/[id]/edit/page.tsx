"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { api } from "@/lib/api";
import { useRecipe } from "@/hooks/useRecipe";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Spinner } from "@/components/ui/Spinner";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { recipe, isLoading, isError, mutate } = useRecipe(id);

  const handleSubmit = async (data: any) => {
    try {
      await api.updateRecipe(id, data);
      await mutate(); // Revalidate recipe detail fetch cache
      toast.success("Recipe updated successfully!");
      router.push(`/recipes/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update recipe");
      throw error;
    }
  };

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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
        <Link href="/recipes" className="text-primary hover:underline font-medium">Back to recipes</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 flex-1">
      <div className="max-w-3xl mx-auto mb-8">
        <Link href={`/recipes/${id}`} className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Cancel editing
        </Link>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">Edit Recipe</h1>
          <p className="text-text-secondary mt-2">Update the details for "{recipe.title}"</p>
        </div>
      </div>
      
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} />
    </div>
  );
}
