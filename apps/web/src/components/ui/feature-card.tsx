import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "default" | "highlighted" | "minimal";
  className?: string;
  onClick?: () => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = "default",
  className,
  onClick,
}: FeatureCardProps) {
  const baseClasses = "rounded-xl p-6 transition-all duration-200 cursor-pointer";
  
  const variantClasses = {
    default: "bg-white border border-gray-200 hover:border-proof-blue/30 hover:shadow-lg hover:-translate-y-1",
    highlighted: "bg-gradient-to-br from-proof-blue/5 to-proof-purple/5 border border-proof-blue/20 hover:border-proof-blue/40 hover:shadow-xl hover:-translate-y-1",
    minimal: "bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
  };

  const iconClasses = {
    default: "text-proof-blue",
    highlighted: "text-proof-blue",
    minimal: "text-gray-600"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
          variant === "highlighted" 
            ? "bg-gradient-to-br from-proof-blue to-proof-purple text-white" 
            : "bg-proof-blue/10"
        )}>
          <Icon className={cn("h-6 w-6", iconClasses[variant])} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
