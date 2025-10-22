"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    Info,
    Lightbulb,
    Minus,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { AdvancedMatchResult } from "@/lib/ai/advanced-matcher";

interface AdvancedMatchResultsProps {
    matches: AdvancedMatchResult[];
    userProfile?: any;
    insights?: any;
    onJobSelect?: (jobId: string) => void;
}

export function AdvancedMatchResults({
    matches,
    userProfile,
    insights,
    onJobSelect,
}: AdvancedMatchResultsProps) {
    const [selectedMatch, setSelectedMatch] = useState<
        AdvancedMatchResult | null
    >(null);

    useEffect(() => {
        if (matches.length > 0 && !selectedMatch) {
            setSelectedMatch(matches[0]);
        }
    }, [matches, selectedMatch]);

    const getFitScoreColor = (score: number) => {
        if (score >= 0.8) return "text-green-600";
        if (score >= 0.6) return "text-yellow-600";
        return "text-red-600";
    };

    const getFitScoreBg = (score: number) => {
        if (score >= 0.8) return "bg-green-100";
        if (score >= 0.6) return "bg-yellow-100";
        return "bg-red-100";
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return "text-blue-600";
        if (confidence >= 0.6) return "text-purple-600";
        return "text-gray-600";
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "rising":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "declining":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            default:
                return <Minus className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case "rising":
                return "text-green-600";
            case "declining":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Average Fit Score
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {Math.round(
                                            insights.averageFitScore * 100,
                                        )}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Jobs Analyzed
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {matches.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Top Skills Match
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {insights.topSkills?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Matches List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Job Matches</h3>
                    {matches.map((match) => (
                        <Card
                            key={match.jobId}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedMatch?.jobId === match.jobId
                                    ? "ring-2 ring-blue-500 shadow-md"
                                    : ""
                            }`}
                            onClick={() => setSelectedMatch(match)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">
                                            Job #{match.jobId}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Advanced AI Match
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                                                getFitScoreBg(match.fitScore)
                                            } ${
                                                getFitScoreColor(match.fitScore)
                                            }`}
                                        >
                                            {Math.round(match.fitScore * 100)}%
                                            Fit
                                        </div>
                                        <div
                                            className={`text-xs mt-1 ${
                                                getConfidenceColor(
                                                    match.confidence,
                                                )
                                            }`}
                                        >
                                            {Math.round(
                                                match.confidence * 100,
                                            )}% Confidence
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Fit Score</span>
                                            <span>
                                                {Math.round(
                                                    match.fitScore * 100,
                                                )}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={match.fitScore * 100}
                                            className="h-2"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Confidence</span>
                                            <span>
                                                {Math.round(
                                                    match.confidence * 100,
                                                )}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={match.confidence * 100}
                                            className="h-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-3">
                                    {match.strengths.slice(0, 3).map((
                                        strength,
                                    ) => (
                                        <Badge
                                            key={strength}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {strength}
                                        </Badge>
                                    ))}
                                    {match.strengths.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{match.strengths.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Detailed Match Analysis */}
                {selectedMatch && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Match Analysis
                        </h3>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="insights">
                                    Insights
                                </TabsTrigger>
                                <TabsTrigger value="recommendations">
                                    Recommendations
                                </TabsTrigger>
                                <TabsTrigger value="market">Market</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="h-5 w-5" />
                                            <span>Match Overview</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Fit Score
                                                </p>
                                                <p
                                                    className={`text-2xl font-bold ${
                                                        getFitScoreColor(
                                                            selectedMatch
                                                                .fitScore,
                                                        )
                                                    }`}
                                                >
                                                    {Math.round(
                                                        selectedMatch.fitScore *
                                                            100,
                                                    )}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Confidence
                                                </p>
                                                <p
                                                    className={`text-2xl font-bold ${
                                                        getConfidenceColor(
                                                            selectedMatch
                                                                .confidence,
                                                        )
                                                    }`}
                                                >
                                                    {Math.round(
                                                        selectedMatch
                                                            .confidence * 100,
                                                    )}%
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">
                                                Why This Match Works
                                            </h4>
                                            <ul className="space-y-1">
                                                {selectedMatch.reasoning.map((
                                                    reason,
                                                    index,
                                                ) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start space-x-2 text-sm"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lightbulb className="h-5 w-5" />
                                            <span>Skills Analysis</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2 text-green-600">
                                                Your Strengths
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMatch.strengths.map((
                                                    strength,
                                                ) => (
                                                    <Badge
                                                        key={strength}
                                                        variant="secondary"
                                                        className="bg-green-100 text-green-800"
                                                    >
                                                        {strength}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedMatch.skillGaps.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2 text-orange-600">
                                                    Skill Gaps
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedMatch.skillGaps
                                                        .map((gap) => (
                                                            <Badge
                                                                key={gap}
                                                                variant="outline"
                                                                className="border-orange-300 text-orange-700"
                                                            >
                                                                {gap}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedMatch.improvements.length >
                                                0 && (
                                            <div>
                                                <h4 className="font-medium mb-2 text-blue-600">
                                                    Areas for Improvement
                                                </h4>
                                                <ul className="space-y-1">
                                                    {selectedMatch.improvements
                                                        .map((
                                                            improvement,
                                                            index,
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start space-x-2 text-sm"
                                                            >
                                                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                <span>
                                                                    {improvement}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="recommendations"
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <ArrowRight className="h-5 w-5" />
                                            <span>
                                                Personalized Recommendations
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value="skills">
                                                <AccordionTrigger>
                                                    Skill Development
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {selectedMatch
                                                            .personalizedRecommendations
                                                            .skillDevelopment
                                                            .map((
                                                                rec,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-start space-x-2 text-sm"
                                                                >
                                                                    <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                                    <span>
                                                                        {rec}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="networking">
                                                <AccordionTrigger>
                                                    Networking
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {selectedMatch
                                                            .personalizedRecommendations
                                                            .networking.map((
                                                                rec,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-start space-x-2 text-sm"
                                                                >
                                                                    <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <span>
                                                                        {rec}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>

                                            <AccordionItem value="strategy">
                                                <AccordionTrigger>
                                                    Application Strategy
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {selectedMatch
                                                            .personalizedRecommendations
                                                            .applicationStrategy
                                                            .map((
                                                                rec,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-start space-x-2 text-sm"
                                                                >
                                                                    <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                                                    <span>
                                                                        {rec}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="market" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <TrendingUp className="h-5 w-5" />
                                            <span>Market Insights</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        Market Demand
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        How much demand exists
                                                        for this role
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {Math.round(
                                                            selectedMatch
                                                                .marketInsights
                                                                .demand * 100,
                                                        )}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        Competition Level
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        How competitive this
                                                        role is
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {Math.round(
                                                            selectedMatch
                                                                .marketInsights
                                                                .competition *
                                                                100,
                                                        )}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        Salary Trend
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Current salary market
                                                        direction
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getTrendIcon(
                                                        selectedMatch
                                                            .marketInsights
                                                            .salaryTrend,
                                                    )}
                                                    <span
                                                        className={`font-medium ${
                                                            getTrendColor(
                                                                selectedMatch
                                                                    .marketInsights
                                                                    .salaryTrend,
                                                            )
                                                        }`}
                                                    >
                                                        {selectedMatch
                                                            .marketInsights
                                                            .salaryTrend}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {onJobSelect && (
                            <Button
                                onClick={() => onJobSelect(selectedMatch.jobId)}
                                className="w-full"
                                size="lg"
                            >
                                View Job Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
