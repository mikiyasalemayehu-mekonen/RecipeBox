import useSWR from "swr";
import { api } from "@/lib/api";
import { Tag } from "@/types";

export function useTags(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const key = `tags-${qs}`;
  
  const { data, error, isLoading, mutate } = useSWR<Tag[]>(key, () => api.getTags(params));

  return {
    tags: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
