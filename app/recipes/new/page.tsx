"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { api } from "@/lib/api";
import { RecipeForm } from "@/components/recipe/RecipeForm";

export default function CreateRecipePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const newRecipe = await api.createRecipe(data);
      toast.success("Recipe created!");
      router.push(`/recipes/${newRecipe.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create recipe");
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 flex-1">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">Create a New Recipe</h1>
        <p className="text-text-secondary mt-2">Add a new recipe to your collection in just a few steps.</p>
      </div>
      
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
}
