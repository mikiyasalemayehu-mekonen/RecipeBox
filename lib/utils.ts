import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number) {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}min` : `${hrs}h`;
}

export function hashColor(str: string): string {
  const colors = [
    "#E8B86D", // Accent
    "#8DAA91", // Lighter sage
    "#E29578", // Soft terracotta
    "#83C5BE", // Soft teal
    "#006D77", // Deep teal
    "#FFDDD2", // Peach
    "#E29578", // Terracotta
    "#FFB703", // Yellow
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
