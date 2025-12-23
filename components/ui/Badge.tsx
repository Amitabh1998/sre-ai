import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "severity-p1" | "severity-p2" | "severity-p3" | "success" | "default";
  children: React.ReactNode;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-severity-p1/20 text-severity-p1 border border-severity-p1/30":
            variant === "severity-p1",
          "bg-severity-p2/20 text-severity-p2 border border-severity-p2/30":
            variant === "severity-p2",
          "bg-severity-p3/20 text-severity-p3 border border-severity-p3/30":
            variant === "severity-p3",
          "bg-success/20 text-success border border-success/30":
            variant === "success",
          "bg-surface-dark text-slate-300 border border-slate-700":
            variant === "default",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

