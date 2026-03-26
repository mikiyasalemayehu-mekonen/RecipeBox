export interface User {
  email: string;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  time_minutes: number;
  price: string;
  link: string;
  tags: Tag[];
  description: string;
  ingredients: Ingredient[];
}

export interface RecipeDetail extends Recipe {
  image: string | null;
}

export interface RecipeImage {
  id: number;
  image: string;
}

export interface AuthToken {
  token: string;
}
