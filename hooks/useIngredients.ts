import useSWR from "swr";
import { api } from "@/lib/api";
import { Ingredient } from "@/types";

export function useIngredients(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const key = `ingredients-${qs}`;
  
  const { data, error, isLoading, mutate } = useSWR<Ingredient[]>(key, () => api.getIngredients(params));

  return {
    ingredients: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
