import { ButtonHTMLAttributes, forwardRef, ReactElement, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, asChild, ...props }, ref) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary text-white hover:bg-primary/90 active:bg-primary/80": variant === "primary",
        "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:bg-white/15":
          variant === "secondary",
        "bg-severity-p1 text-white hover:bg-severity-p1/90 active:bg-severity-p1/80 shadow-sm hover:shadow-md":
          variant === "danger",
        "text-slate-300 hover:bg-white/5 hover:text-white active:bg-white/10":
          variant === "ghost",
        "h-9 px-4 text-sm": size === "sm",
        "h-11 px-5 text-sm": size === "md",
        "h-12 px-8 text-base": size === "lg",
      },
      className
    );

    if (asChild && typeof children === "object" && children && "type" in children) {
      // Handle Next.js Link component
      const child = children as ReactElement<{ href?: string; children?: ReactNode }>;
      return (
        <Link
          href={child.props.href || "#"}
          className={baseClasses}
          ref={ref as any}
          {...(props as any)}
        >
          {child.props.children || children}
        </Link>
      );
    }

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

