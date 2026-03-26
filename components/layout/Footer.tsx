import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-border bg-surface py-8", className)}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">RecipeBox</span>
          <span className="text-sm text-text-secondary">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex space-x-6 text-sm text-text-secondary">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
