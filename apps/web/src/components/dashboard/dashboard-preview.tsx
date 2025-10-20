import React from "react";
import {
    Award,
    BarChart3,
    CheckCircle,
    Clock,
    Shield,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import { MetricCard } from "@/components/ui/metric-card";
import { ProgressRing } from "@/components/ui/progress-ring";

export function DashboardPreview() {
    const metrics = [
        {
            icon: TrendingUp,
            value: "87%",
            label: "Fit Score",
            change: { value: "+12%", type: "increase" as const },
            variant: "success" as const,
        },
        {
            icon: Users,
            value: "24",
            label: "Active Matches",
            change: { value: "+3", type: "increase" as const },
            variant: "info" as const,
        },
        {
            icon: Target,
            value: "12",
            label: "Proof Points",
            change: { value: "100%", type: "neutral" as const },
            variant: "default" as const,
        },
        {
            icon: Award,
            value: "5",
            label: "Interviews",
            change: { value: "+2", type: "increase" as const },
            variant: "warning" as const,
        },
    ];

    const features = [
        {
            icon: Shield,
            title: "Verified Credentials",
            description:
                "Cryptographically verified proof points that build trust with employers.",
            variant: "highlighted" as const,
        },
        {
            icon: CheckCircle,
            title: "Smart Matching",
            description:
                "AI-powered job matching based on skills, experience, and cultural fit.",
            variant: "default" as const,
        },
        {
            icon: Clock,
            title: "Real-time Updates",
            description:
                "Get instant notifications when new opportunities match your profile.",
            variant: "default" as const,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your ProofOfFit Dashboard
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Track your progress, manage applications, and see how you're
                    performing in the job market.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <MetricCard
                        key={index}
                        icon={metric.icon}
                        value={metric.value}
                        label={metric.label}
                        change={metric.change}
                        variant={metric.variant}
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Profile Completion
                        </h3>
                        <div className="flex flex-col items-center space-y-6">
                            <ProgressRing
                                value={87}
                                size={140}
                                strokeWidth={10}
                                variant="success"
                            />
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    Almost there! Complete your profile to
                                    unlock more opportunities.
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3 text-proof-green" />
                                        <span>Skills</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3 text-proof-green" />
                                        <span>Experience</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3 text-proof-orange" />
                                        <span>Portfolio</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Key Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    variant={feature.variant}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Application Activity
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <BarChart3 className="h-4 w-4" />
                        <span>Last 30 days</span>
                    </div>
                </div>

                {/* Mock Chart */}
                <div className="h-64 bg-gradient-to-br from-proof-blue/5 to-proof-purple/5 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-proof-blue/50 mx-auto mb-4" />
                        <p className="text-gray-500">
                            Application activity chart would appear here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
