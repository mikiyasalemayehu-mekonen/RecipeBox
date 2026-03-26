import useSWR from "swr";
import { api } from "@/lib/api";
import { RecipeDetail } from "@/types";

export function useRecipe(id: number | null) {
  const key = id ? `recipe-${id}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<RecipeDetail>(key, () => {
    if (!id) throw new Error("No ID");
    return api.getRecipe(id);
  });

  return {
    recipe: data,
    isLoading,
    isError: error,
    mutate,
  };
}
