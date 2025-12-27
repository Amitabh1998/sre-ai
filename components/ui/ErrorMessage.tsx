import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/errors";

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  error?: unknown;
  message?: string;
  variant?: "default" | "inline";
}

export function ErrorMessage({
  className,
  error,
  message,
  variant = "default",
  ...props
}: ErrorMessageProps) {
  const errorMessage = message || (error ? getErrorMessage(error) : null);

  if (!errorMessage) return null;

  if (variant === "inline") {
    return (
      <p className={cn("text-xs text-severity-p1 mt-1", className)} {...props}>
        {errorMessage}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-severity-p1/50 bg-severity-p1/10 p-4",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-severity-p1">error</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-severity-p1">Error</p>
          <p className="text-sm text-slate-300 mt-1">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}

