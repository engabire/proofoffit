import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-200 text-gray-700",
    success: "bg-proof-green/10 text-proof-green border border-proof-green/20",
    warning:
      "bg-proof-orange/10 text-proof-orange border border-proof-orange/20",
    error: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-proof-blue/10 text-proof-blue border border-proof-blue/20",
    outline: "bg-transparent text-gray-700 border border-gray-300",
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
