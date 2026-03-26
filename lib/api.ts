import { User, Tag, Ingredient, Recipe, RecipeDetail, AuthToken } from "../types";

// Base URL for API calls from the client. We proxy through Next.js API routes
// to safely attach the httpOnly cookie to external API calls.
const API_BASE = "/api/proxy";

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchWithProxy(endpoint: string, options: RequestInit = {}) {
  const isQuery = endpoint.includes('?');
  const cacheBuster = `_cb=${Date.now()}`;
  const url = `${API_BASE}${endpoint}${isQuery ? '&' : '?'}${cacheBuster}`;
  
  const headers = {
    ...options.headers,
  } as Record<string, string>;

  // Only set Application/json if it is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new ApiError(401, "Unauthorized", null);
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = await response.text();
    }
    throw new ApiError(response.status, response.statusText, errorData);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Recipes
  getRecipes: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchWithProxy(`/recipe/recipes/${qs}`);
  },
  getRecipe: (id: number): Promise<RecipeDetail> => fetchWithProxy(`/recipe/recipes/${id}/`),
  createRecipe: (data: any) => fetchWithProxy(`/recipe/recipes/`, { method: "POST", body: JSON.stringify(data) }),
  updateRecipe: (id: number, data: any) => fetchWithProxy(`/recipe/recipes/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteRecipe: (id: number) => fetchWithProxy(`/recipe/recipes/${id}/`, { method: "DELETE" }),
  uploadRecipeImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetchWithProxy(`/recipe/recipes/${id}/upload-image/`, {
      method: "POST",
      body: formData,
    });
  },

  // Tags
  getTags: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchWithProxy(`/recipe/tags/${qs}`);
  },
  createTag: (data: any) => fetchWithProxy(`/recipe/tags/`, { method: "POST", body: JSON.stringify(data) }),
  updateTag: (id: number, data: any) => fetchWithProxy(`/recipe/tags/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTag: (id: number) => fetchWithProxy(`/recipe/tags/${id}/`, { method: "DELETE" }),

  // Ingredients
  getIngredients: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchWithProxy(`/recipe/ingredients/${qs}`);
  },
  createIngredient: (data: any) => fetchWithProxy(`/recipe/ingredients/`, { method: "POST", body: JSON.stringify(data) }),
  updateIngredient: (id: number, data: any) => fetchWithProxy(`/recipe/ingredients/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteIngredient: (id: number) => fetchWithProxy(`/recipe/ingredients/${id}/`, { method: "DELETE" }),

  // User
  createUser: (data: any) => fetchWithProxy(`/user/create/`, { method: "POST", body: JSON.stringify(data) }),
  getMe: (): Promise<User> => fetchWithProxy(`/user/me/`),
  updateMe: (data: any) => fetchWithProxy(`/user/me/`, { method: "PATCH", body: JSON.stringify(data) }),
};
