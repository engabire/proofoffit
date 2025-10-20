"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    MapPin, 
    Building, 
    DollarSign, 
    Clock, 
    Users, 
    TrendingUp,
    Star,
    ExternalLink,
    Filter,
    Search
} from "lucide-react";

interface JobRecommendation {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        remote: boolean;
        salaryMin?: number;
        salaryMax?: number;
        experienceRequired?: number;
        requiredSkills?: string[];
        industry?: string;
        jobType?: string;
        postedAt?: string;
        description?: string;
    };
    fitScore: number;
    confidence: number;
    reasons: string[];
    improvements: string[];
    recommendationType: "perfect_match" | "good_match" | "explore" | "stretch";
    priority: number;
    tags: string[];
    estimatedResponseRate: number;
    timeToApply: string;
}

interface RecommendationInsights {
    totalJobs: number;
    perfectMatches: number;
    goodMatches: number;
    exploreOpportunities: number;
    stretchGoals: number;
    averageFitScore: number;
    topSkills: string[];
    topIndustries: string[];
    salaryInsights: {
        average: number;
        range: [number, number];
        percentile: number;
    };
    locationInsights: {
        remotePercentage: number;
        topLocations: string[];
    };
}

interface JobRecommendationsProps {
    userId?: string;
    initialCriteria?: any;
}

export function JobRecommendations({ userId, initialCriteria }: JobRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
    const [insights, setInsights] = useState<RecommendationInsights | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const fetchRecommendations = async (criteria: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/jobs/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(criteria),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch recommendations");
            }

            const data = await response.json();
            setRecommendations(data.data.recommendations);
            setInsights(data.data.insights);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialCriteria) {
            fetchRecommendations(initialCriteria);
        }
    }, [initialCriteria]);

    const getRecommendationTypeColor = (type: string) => {
        switch (type) {
            case "perfect_match":
                return "bg-green-100 text-green-800 border-green-200";
            case "good_match":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "explore":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "stretch":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getRecommendationTypeLabel = (type: string) => {
        switch (type) {
            case "perfect_match":
                return "Perfect Match";
            case "good_match":
                return "Good Match";
            case "explore":
                return "Explore";
            case "stretch":
                return "Stretch Goal";
            default:
                return "Unknown";
        }
    };

    const formatSalary = (min?: number, max?: number) => {
        if (!min || !max) return "Salary not specified";
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const filteredRecommendations = recommendations.filter((rec) => {
        if (activeTab === "all") return true;
        return rec.recommendationType === activeTab;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchRecommendations(initialCriteria)}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Insights Overview */}
            {insights && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Market Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {insights.perfectMatches}
                                </div>
                                <div className="text-sm text-gray-600">Perfect Matches</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {insights.goodMatches}
                                </div>
                                <div className="text-sm text-gray-600">Good Matches</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {insights.exploreOpportunities}
                                </div>
                                <div className="text-sm text-gray-600">Explore</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {insights.stretchGoals}
                                </div>
                                <div className="text-sm text-gray-600">Stretch Goals</div>
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Top Skills in Demand</h4>
                                <div className="flex flex-wrap gap-2">
                                    {insights.topSkills.slice(0, 5).map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Top Industries</h4>
                                <div className="flex flex-wrap gap-2">
                                    {insights.topIndustries.slice(0, 3).map((industry) => (
                                        <Badge key={industry} variant="outline">
                                            {industry}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recommendations Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({recommendations.length})</TabsTrigger>
                    <TabsTrigger value="perfect_match">
                        Perfect ({insights?.perfectMatches || 0})
                    </TabsTrigger>
                    <TabsTrigger value="good_match">
                        Good ({insights?.goodMatches || 0})
                    </TabsTrigger>
                    <TabsTrigger value="explore">
                        Explore ({insights?.exploreOpportunities || 0})
                    </TabsTrigger>
                    <TabsTrigger value="stretch">
                        Stretch ({insights?.stretchGoals || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {filteredRecommendations.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No recommendations found for this category.</p>
                        </div>
                    ) : (
                        filteredRecommendations.map((rec) => (
                            <Card key={rec.job.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold">
                                                    {rec.job.title}
                                                </h3>
                                                <Badge className={getRecommendationTypeColor(rec.recommendationType)}>
                                                    {getRecommendationTypeLabel(rec.recommendationType)}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Building className="h-4 w-4" />
                                                    {rec.job.company}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {rec.job.remote ? "Remote" : rec.job.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    {formatSalary(rec.job.salaryMin, rec.job.salaryMax)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {rec.job.postedAt ? formatDate(rec.job.postedAt) : "Unknown"}
                                                </div>
                                            </div>

                                            {/* Fit Score and Confidence */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">Fit Score:</span>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={rec.fitScore * 100} 
                                                            className="w-20 h-2"
                                                        />
                                                        <span className="text-sm font-semibold">
                                                            {Math.round(rec.fitScore * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">Confidence:</span>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={rec.confidence * 100} 
                                                            className="w-20 h-2"
                                                        />
                                                        <span className="text-sm font-semibold">
                                                            {Math.round(rec.confidence * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {rec.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Reasons */}
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-2">Why this is a good match:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {rec.reasons.map((reason, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <Star className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                                                            {reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Improvements */}
                                            {rec.improvements.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-2">Areas for improvement:</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {rec.improvements.map((improvement, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <TrendingUp className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                                {improvement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Skills */}
                                            {rec.job.requiredSkills && rec.job.requiredSkills.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-2">Required Skills:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {rec.job.requiredSkills.map((skill) => (
                                                            <Badge key={skill} variant="secondary" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button size="sm" className="w-full">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Apply Now
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-full">
                                                Save Job
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Response Rate and Time to Apply */}
                                    <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t">
                                        <div>
                                            Estimated response rate: {Math.round(rec.estimatedResponseRate * 100)}%
                                        </div>
                                        <div className="font-medium">
                                            {rec.timeToApply}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
