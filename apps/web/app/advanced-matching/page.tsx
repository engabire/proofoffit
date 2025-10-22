"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdvancedMatchResults } from "@/components/jobs/advanced-match-results";
import {
    ArrowRight,
    Brain,
    Lightbulb,
    RefreshCw,
    Target,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";

interface AdvancedMatchData {
    matches: any[];
    userProfile: any;
    insights: any;
}

export default function AdvancedMatchingPage() {
    const [matchData, setMatchData] = useState<AdvancedMatchData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAdvancedMatches = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/jobs/advanced-match");
            const data = await response.json();

            if (data.success) {
                setMatchData(data.data);
            } else {
                setError(data.error || "Failed to fetch advanced matches");
            }
        } catch (err) {
            setError("Network error occurred");
            console.error("Error fetching advanced matches:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvancedMatches();
    }, []);

    const handleJobSelect = (jobId: string) => {
        // Navigate to job details or open modal
        console.log("Selected job:", jobId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Brain className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Advanced AI Matching
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the power of machine learning-driven job
                        matching with detailed insights, personalized
                        recommendations, and market intelligence.
                    </p>
                </div>

                {/* Features Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                                <Brain className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                ML-Powered Matching
                            </h3>
                            <p className="text-sm text-gray-600">
                                Advanced algorithms analyze multiple factors for
                                precise job matching
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Personalized Insights
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get detailed analysis of your strengths, gaps,
                                and improvement areas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Market Intelligence
                            </h3>
                            <p className="text-sm text-gray-600">
                                Real-time market trends, demand, and competition
                                analysis
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
                                <Lightbulb className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Smart Recommendations
                            </h3>
                            <p className="text-sm text-gray-600">
                                Actionable advice for skill development and
                                career growth
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mb-8">
                    <Button
                        onClick={fetchAdvancedMatches}
                        disabled={loading}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading
                            ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            )
                            : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Generate New Matches
                                </>
                            )}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.location.href = "/jobs"}
                    >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        View All Jobs
                    </Button>
                </div>

                {/* Error State */}
                {error && (
                    <Card className="mb-8 border-red-200 bg-red-50">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2 text-red-600">
                                <div className="w-2 h-2 bg-red-600 rounded-full">
                                </div>
                                <span className="font-medium">
                                    Error: {error}
                                </span>
                            </div>
                            <p className="text-sm text-red-600 mt-2">
                                Please try again or contact support if the issue
                                persists.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Advanced Matching Results */}
                {matchData && !loading && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Your AI-Powered Matches
                            </h2>
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                            >
                                {matchData.matches.length} Matches Found
                            </Badge>
                        </div>

                        <AdvancedMatchResults
                            matches={matchData.matches}
                            userProfile={matchData.userProfile}
                            insights={matchData.insights}
                            onJobSelect={handleJobSelect}
                        />
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="text-lg font-medium text-gray-600">
                                Analyzing your profile...
                            </span>
                        </div>
                        <p className="text-gray-500">
                            Our AI is processing your skills, experience, and
                            preferences to find the best matches.
                        </p>
                    </div>
                )}

                {/* How It Works */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        How Advanced Matching Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    1
                                </span>
                            </div>
                            <h3 className="font-semibold mb-2">
                                Profile Analysis
                            </h3>
                            <p className="text-sm text-gray-600">
                                We analyze your skills, experience, preferences,
                                and career goals using advanced ML algorithms.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-600">
                                    2
                                </span>
                            </div>
                            <h3 className="font-semibold mb-2">
                                Multi-Factor Matching
                            </h3>
                            <p className="text-sm text-gray-600">
                                Jobs are scored across 10+ dimensions including
                                skills, culture, growth potential, and market
                                trends.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">
                                    3
                                </span>
                            </div>
                            <h3 className="font-semibold mb-2">
                                Personalized Insights
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get detailed analysis, improvement suggestions,
                                and actionable recommendations for each match.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Ready to Find Your Perfect Match?
                            </h2>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                Join thousands of professionals who have found
                                their dream jobs using our advanced AI matching
                                technology.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                    onClick={() =>
                                        window.location.href = "/auth/signup"}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Get Started Free
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-blue-600"
                                    onClick={() =>
                                        window.location.href = "/pricing"}
                                >
                                    View Pricing
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

