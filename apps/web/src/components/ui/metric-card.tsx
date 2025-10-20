import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    change?: {
        value: string;
        type: "increase" | "decrease" | "neutral";
    };
    variant?: "default" | "success" | "warning" | "info";
    className?: string;
}

export function MetricCard({
    icon: Icon,
    value,
    label,
    change,
    variant = "default",
    className,
}: MetricCardProps) {
    const baseClasses = "rounded-xl p-6 border transition-all duration-200";

    const variantClasses = {
        default: "bg-white border-gray-200",
        success:
            "bg-gradient-to-br from-proof-green/5 to-proof-blue/5 border-proof-green/20",
        warning:
            "bg-gradient-to-br from-proof-orange/5 to-proof-purple/5 border-proof-orange/20",
        info:
            "bg-gradient-to-br from-proof-blue/5 to-proof-purple/5 border-proof-blue/20",
    };

    const iconClasses = {
        default: "text-gray-600",
        success: "text-proof-green",
        warning: "text-proof-orange",
        info: "text-proof-blue",
    };

    const changeClasses = {
        increase: "text-proof-green",
        decrease: "text-red-500",
        neutral: "text-gray-500",
    };

    return (
        <div className={cn(baseClasses, variantClasses[variant], className)}>
            <div className="flex items-center justify-between mb-4">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        variant === "default"
                            ? "bg-gray-100"
                            : "bg-white/80 backdrop-blur-sm",
                    )}
                >
                    <Icon className={cn("h-5 w-5", iconClasses[variant])} />
                </div>

                {change && (
                    <div
                        className={cn(
                            "text-sm font-medium flex items-center space-x-1",
                            changeClasses[change.type],
                        )}
                    >
                        <span>{change.value}</span>
                        {change.type === "increase" && <span>↗</span>}
                        {change.type === "decrease" && <span>↘</span>}
                        {change.type === "neutral" && <span>→</span>}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                    {value}
                </div>
                <div className="text-sm text-gray-600">
                    {label}
                </div>
            </div>
        </div>
    );
}
