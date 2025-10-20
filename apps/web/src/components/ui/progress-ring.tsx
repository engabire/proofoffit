import React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "info";
  showLabel?: boolean;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showLabel = true,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;

  const variantClasses = {
    default: "text-proof-blue",
    success: "text-proof-green",
    warning: "text-proof-orange",
    info: "text-proof-purple"
  };

  const bgClasses = {
    default: "text-gray-200",
    success: "text-proof-green/20",
    warning: "text-proof-orange/20",
    info: "text-proof-purple/20"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={bgClasses[variant]}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-in-out",
            variantClasses[variant]
          )}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(value)}%
            </div>
            {value < 100 && (
              <div className="text-xs text-gray-500">
                Complete
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
