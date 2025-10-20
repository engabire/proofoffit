import React from "react";
import { cn } from "@/lib/utils";
import { Check, Star, Zap } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
  variant?: "default" | "popular" | "enterprise";
  className?: string;
  onSelect?: () => void;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  isEnterprise = false,
  variant = "default",
  className,
  onSelect,
}: PricingCardProps) {
  const baseClasses = "rounded-xl p-8 transition-all duration-200 cursor-pointer relative";
  
  const variantClasses = {
    default: "bg-white border-2 border-gray-200 hover:border-proof-blue/30 hover:shadow-lg hover:-translate-y-1",
    popular: "bg-gradient-to-br from-proof-blue/5 to-proof-purple/5 border-2 border-proof-blue shadow-xl hover:shadow-2xl hover:-translate-y-2",
    enterprise: "bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 text-white hover:border-proof-blue/50 hover:shadow-2xl hover:-translate-y-2"
  };

  const buttonClasses = {
    default: "bg-proof-blue hover:bg-proof-blue/90 text-white",
    popular: "bg-gradient-to-r from-proof-blue to-proof-purple hover:from-proof-blue/90 hover:to-proof-purple/90 text-white",
    enterprise: "bg-white hover:bg-gray-100 text-gray-900"
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onSelect}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-proof-blue to-proof-purple text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      {/* Enterprise Badge */}
      {isEnterprise && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-proof-orange text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Enterprise</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className={cn(
          "text-2xl font-bold mb-2",
          variant === "enterprise" ? "text-white" : "text-gray-900"
        )}>
          {name}
        </h3>
        <p className={cn(
          "text-sm mb-4",
          variant === "enterprise" ? "text-gray-300" : "text-gray-600"
        )}>
          {description}
        </p>
        <div className="mb-2">
          <span className={cn(
            "text-4xl font-bold",
            variant === "enterprise" ? "text-white" : "text-gray-900"
          )}>
            {price}
          </span>
          <span className={cn(
            "text-lg ml-1",
            variant === "enterprise" ? "text-gray-300" : "text-gray-600"
          )}>
            /{period}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className={cn(
              "h-5 w-5 mt-0.5 flex-shrink-0",
              variant === "enterprise" ? "text-proof-green" : "text-proof-blue"
            )} />
            <span className={cn(
              "text-sm",
              variant === "enterprise" ? "text-gray-300" : "text-gray-700"
            )}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={cn(
          "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200",
          buttonClasses[variant]
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        {isEnterprise ? "Contact Sales" : "Get Started"}
      </button>
    </div>
  );
}
