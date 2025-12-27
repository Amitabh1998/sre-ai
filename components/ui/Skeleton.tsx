import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-700 rounded",
        {
          "rounded-full": variant === "circular",
          "rounded-lg": variant === "rectangular",
          "h-4": variant === "text" && !height,
        },
        className
      )}
      style={{
        width: width || (variant === "text" ? "100%" : undefined),
        height: height || (variant === "circular" ? width : undefined),
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-700 bg-surface-dark p-6 space-y-4">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="80%" height={16} />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
          <Skeleton variant="rectangular" width={100} height={24} />
          <Skeleton variant="text" width="15%" height={20} />
          <Skeleton variant="text" width="10%" height={20} />
        </div>
      ))}
    </div>
  );
}

