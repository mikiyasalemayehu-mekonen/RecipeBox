import { Recipe } from "@/types";
import { RecipeCard } from "./RecipeCard";
import { Spinner } from "@/components/ui/Spinner";

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: React.ReactNode;
}

export function RecipeGrid({
  recipes,
  isLoading,
  onEdit,
  onDelete,
  emptyStateTitle = "No recipes found",
  emptyStateDescription = "Get started by creating a new recipe.",
  emptyStateAction,
}: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[380px] w-full bg-border/40 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border bg-surface/50">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{emptyStateTitle}</h3>
        <p className="text-text-secondary max-w-sm mb-6">{emptyStateDescription}</p>
        {emptyStateAction}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
