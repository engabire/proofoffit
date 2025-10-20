import React from "react";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
  avatar?: string;
  variant?: "default" | "featured" | "minimal";
  className?: string;
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  rating = 5,
  avatar,
  variant = "default",
  className,
}: TestimonialCardProps) {
  const baseClasses = "rounded-xl p-6 transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1",
    featured: "bg-gradient-to-br from-proof-blue/5 to-proof-purple/5 border border-proof-blue/20 shadow-lg",
    minimal: "bg-gray-50/50 border border-gray-100 hover:bg-white"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {/* Quote Icon */}
      <div className="flex items-start justify-between mb-4">
        <Quote className="h-6 w-6 text-proof-blue/60" />
        {variant === "featured" && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating ? "text-proof-orange fill-current" : "text-gray-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <blockquote className="text-gray-700 leading-relaxed mb-6">
        "{content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-proof-blue to-proof-purple flex items-center justify-center text-white font-semibold">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">
            {role} at {company}
          </div>
        </div>
      </div>

      {/* Rating for non-featured variants */}
      {variant !== "featured" && (
        <div className="flex items-center space-x-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < rating ? "text-proof-orange fill-current" : "text-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
