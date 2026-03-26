"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { User } from "@/types";

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<User, any>("userMe", api.getMe, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  return {
    user: data,
    isLoading,
    isError: error,
    isAuthenticated: !!data && !error,
    mutate,
  };
}
