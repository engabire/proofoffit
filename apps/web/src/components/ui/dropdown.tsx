import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

interface DropdownProps {
    items: DropdownItem[];
    value?: string;
    placeholder?: string;
    onSelect?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
}

export function Dropdown({
    items,
    value,
    placeholder = "Select an option",
    onSelect,
    className,
    disabled = false,
    size = "md",
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-4 py-3 text-lg",
    };

    const selectedItem = items.find((item) => item.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: DropdownItem) => {
        if (item.disabled) return;
        
        onSelect?.(item.value);
        item.onClick?.();
        setIsOpen(false);
    };

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-left shadow-sm transition-colors",
                    sizeClasses[size],
                    disabled
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "hover:border-proof-blue focus:border-proof-blue focus:ring-2 focus:ring-proof-blue/20",
                )}
            >
                <div className="flex items-center space-x-2">
                    {selectedItem?.icon}
                    <span className={cn(
                        selectedItem ? "text-gray-900" : "text-gray-500"
                    )}>
                        {selectedItem?.label || placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        isOpen && "rotate-180",
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="py-1">
                        {items.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => handleSelect(item)}
                                disabled={item.disabled}
                                className={cn(
                                    "w-full flex items-center space-x-2 px-4 py-2 text-left text-sm transition-colors",
                                    item.disabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-900 hover:bg-gray-50 focus:bg-gray-50",
                                    item.value === value && "bg-proof-blue/10 text-proof-blue",
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
