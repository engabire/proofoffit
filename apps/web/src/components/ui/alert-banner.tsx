"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertTriangle,
    CheckCircle,
    ExternalLink,
    Info,
    X,
} from "lucide-react";
import { jobFeedConfig } from "@/lib/config/job-feeds";

interface AlertBannerProps {
    variant?: "info" | "warning" | "success" | "error";
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

export function AlertBanner({
    variant = "info",
    dismissible = true,
    onDismiss,
    className = "",
}: AlertBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isRealDataEnabled, setIsRealDataEnabled] = useState(false);

    useEffect(() => {
        // Check if real data feeds are enabled
        setIsRealDataEnabled(
            jobFeedConfig.enableExternalJobFeeds ||
                jobFeedConfig.enableSupabaseJobSearch,
        );
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) {
        return null;
    }

    const getVariantStyles = () => {
        switch (variant) {
            case "warning":
                return "border-yellow-200 bg-yellow-50 text-yellow-800";
            case "success":
                return "border-green-200 bg-green-50 text-green-800";
            case "error":
                return "border-red-200 bg-red-50 text-red-800";
            default:
                return "border-blue-200 bg-blue-50 text-blue-800";
        }
    };

    const getIcon = () => {
        switch (variant) {
            case "warning":
                return <AlertTriangle className="h-4 w-4" />;
            case "success":
                return <CheckCircle className="h-4 w-4" />;
            case "error":
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getBannerContent = () => {
        if (isRealDataEnabled) {
            return {
                title: "Live Job Feeds Active",
                description:
                    "You're now seeing real job postings from our partner networks. Data is updated in real-time.",
                variant: "success" as const,
                showLearnMore: true,
            };
        } else {
            return {
                title: "Demo Mode - Sample Data",
                description:
                    "You're currently viewing sample job postings. Enable live feeds in production to see real job opportunities.",
                variant: "info" as const,
                showLearnMore: true,
            };
        }
    };

    const content = getBannerContent();
    const effectiveVariant = content.variant;

    return (
        <Alert className={`${getVariantStyles()} ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    {getIcon()}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{content.title}</h4>
                            <Badge
                                variant={effectiveVariant === "success"
                                    ? "default"
                                    : "secondary"}
                                className={effectiveVariant === "success"
                                    ? "bg-green-100 text-green-800"
                                    : ""}
                            >
                                {isRealDataEnabled ? "Live" : "Demo"}
                            </Badge>
                        </div>
                        <AlertDescription className="text-sm">
                            {content.description}
                        </AlertDescription>
                        {content.showLearnMore && (
                            <div className="mt-2 flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() =>
                                        window.open(
                                            "/about/data-sources",
                                            "_blank",
                                        )}
                                >
                                    Learn More
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                                {!isRealDataEnabled && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() =>
                                            window.open("/contact", "_blank")}
                                    >
                                        Enable Live Feeds
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {dismissible && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </Alert>
    );
}

// Specialized banner for job search results
export function JobSearchAlertBanner() {
    const [isRealDataEnabled, setIsRealDataEnabled] = useState(false);

    useEffect(() => {
        setIsRealDataEnabled(
            jobFeedConfig.enableExternalJobFeeds ||
                jobFeedConfig.enableSupabaseJobSearch,
        );
    }, []);

    if (isRealDataEnabled) {
        return null; // Don't show banner when real data is enabled
    }

    return (
        <AlertBanner
            variant="info"
            dismissible={true}
            className="mb-4"
        />
    );
}

// Banner for production deployment status
export function DeploymentStatusBanner() {
    const [deploymentStatus, setDeploymentStatus] = useState<
        {
            environment: string;
            features: string[];
            lastUpdated: Date;
        } | null
    >(null);

    useEffect(() => {
        // In a real app, this would fetch from an API
        setDeploymentStatus({
            environment: process.env.NODE_ENV || "development",
            features: [
                jobFeedConfig.enableExternalJobFeeds
                    ? "External Job Feeds"
                    : "Mock Data",
                jobFeedConfig.enableSupabaseJobSearch
                    ? "Database Search"
                    : "Local Search",
                jobFeedConfig.enableAnalytics ? "Analytics" : "No Analytics",
            ],
            lastUpdated: new Date(),
        });
    }, []);

    if (!deploymentStatus || deploymentStatus.environment === "production") {
        return null;
    }

    return (
        <AlertBanner
            variant="warning"
            dismissible={true}
            className="mb-4"
        />
    );
}

