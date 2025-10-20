import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";

export interface ToastProps {
  id: string;
  type?: "success" | "error" | "warning" | "info"; // Made optional for backward compatibility
  variant?: "success" | "error" | "warning" | "info" | "default"; // For backward compatibility
  title: string;
  message?: string;
  description?: string; // For backward compatibility
  duration?: number;
  onClose?: (id: string) => void; // Made optional for compatibility with existing hook
  className?: string;
}

export function Toast({
  id,
  type,
  variant,
  title,
  message,
  description,
  duration = 5000,
  onClose,
  className,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-proof-green/10",
      borderColor: "border-proof-green/20",
      iconColor: "text-proof-green",
      titleColor: "text-proof-green",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      titleColor: "text-red-700",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-proof-orange/10",
      borderColor: "border-proof-orange/20",
      iconColor: "text-proof-orange",
      titleColor: "text-proof-orange",
    },
    info: {
      icon: Info,
      bgColor: "bg-proof-blue/10",
      borderColor: "border-proof-blue/20",
      iconColor: "text-proof-blue",
      titleColor: "text-proof-blue",
    },
    default: {
      icon: Info,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      iconColor: "text-gray-600",
      titleColor: "text-gray-700",
    },
  };

  const toastType = variant || type || "info"; // Use variant for backward compatibility, fallback to info
  const config = typeConfig[toastType];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex items-start space-x-3 p-4 rounded-lg border shadow-lg transition-all duration-300",
        config.bgColor,
        config.borderColor,
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
        className,
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} />

      <div className="flex-1 min-w-0">
        <h4 className={cn("text-sm font-medium", config.titleColor)}>
          {title}
        </h4>
        {(message || description) && (
          <p className="mt-1 text-sm text-gray-600">{message || description}</p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type?: "success" | "error" | "warning" | "info";
    variant?: "success" | "error" | "warning" | "info" | "default";
    title: string;
    message?: string;
    description?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function ToastContainer({
  toasts,
  onClose,
  position = "top-right",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={cn(
        "fixed z-50 space-y-2 max-w-sm w-full",
        positionClasses[position],
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
