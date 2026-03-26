import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "secondary" | "danger" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white border-transparent",
    secondary: "bg-accent/20 text-text-primary border-transparent",
    outline: "text-text-primary border-border border",
    danger: "bg-danger text-white border-transparent",
    success: "bg-success text-white border-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
