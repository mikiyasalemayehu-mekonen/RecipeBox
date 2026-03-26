import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1">
        {label && (
          <label className="text-sm font-medium text-text-primary" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-[44px] w-full rounded-xl border-2 bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger focus-visible:border-danger" : "border-border",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger font-medium mt-1">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
