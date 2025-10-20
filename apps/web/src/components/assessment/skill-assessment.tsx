"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    Brain, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Target,
    TrendingUp,
    Star,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

interface AssessmentQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'rating' | 'text' | 'scenario';
    options?: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'technical' | 'soft' | 'domain-specific';
    timeLimit?: number;
}

interface AssessmentResult {
    skill: string;
    score: number;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    timeSpent: number;
    questionsAnswered: number;
    totalQuestions: number;
    correctAnswers: number;
    recommendations: string[];
    nextSteps: string[];
}

interface SkillAssessmentProps {
    skill: string;
    difficulty?: string;
    onComplete?: (result: AssessmentResult) => void;
}

export function SkillAssessment({ skill, difficulty, onComplete }: SkillAssessmentProps) {
    const [session, setSession] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    const startAssessment = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/assessment/skills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "start",
                    skill,
                    difficulty,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to start assessment");
            }

            const data = await response.json();
            setSession(data.data.session);
            setCurrentQuestion(data.data.currentQuestion);
            setAnswers(new Map());
            setSelectedAnswer("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!session || !currentQuestion || !selectedAnswer) {
            return;
        }

        setLoading(true);

        try {
            const newAnswers = new Map(answers);
            newAnswers.set(currentQuestion.id, selectedAnswer);
            setAnswers(newAnswers);

            const response = await fetch("/api/assessment/skills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "submit-answer",
                    sessionId: session.id,
                    questionId: currentQuestion.id,
                    answer: selectedAnswer,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit answer");
            }

            const data = await response.json();
            setSession(data.data.session);
            setCurrentQuestion(data.data.nextQuestion);
            setSelectedAnswer("");

            // If assessment is complete, get results
            if (data.data.session.status === "completed") {
                await completeAssessment();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const completeAssessment = async () => {
        if (!session) return;

        try {
            const response = await fetch("/api/assessment/skills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "complete",
                    sessionId: session.id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to complete assessment");
            }

            const data = await response.json();
            setResult(data.data.result);
            onComplete?.(data.data.result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'intermediate': return 'bg-green-100 text-green-800 border-green-200';
            case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'expert': return 'text-purple-600';
            case 'advanced': return 'text-blue-600';
            case 'intermediate': return 'text-green-600';
            case 'beginner': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Timer effect
    useEffect(() => {
        if (currentQuestion?.timeLimit && timeRemaining !== null) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentQuestion, timeRemaining]);

    if (result) {
        return (
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        Assessment Complete!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Score Overview */}
                    <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
                            {result.score}%
                        </div>
                        <div className={`text-2xl font-semibold ${getLevelColor(result.level)} mb-4`}>
                            {result.level.charAt(0).toUpperCase() + result.level.slice(1)} Level
                        </div>
                        <div className="text-gray-600">
                            {result.correctAnswers} out of {result.totalQuestions} questions correct
                        </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{result.confidence}%</div>
                            <div className="text-sm text-gray-600">Confidence</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {Math.round(result.timeSpent / 60)}m
                            </div>
                            <div className="text-sm text-gray-600">Time Spent</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {result.questionsAnswered}
                            </div>
                            <div className="text-sm text-gray-600">Questions</div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recommendations
                        </h3>
                        <div className="space-y-2">
                            {result.recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{recommendation}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Next Steps
                        </h3>
                        <div className="space-y-2">
                            {result.nextSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button onClick={() => {
                            setResult(null);
                            setSession(null);
                            setCurrentQuestion(null);
                            setAnswers(new Map());
                            setSelectedAnswer("");
                        }}>
                            Take Another Assessment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!session) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Brain className="h-6 w-6" />
                        {skill} Assessment
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            Test your knowledge of {skill} with our comprehensive assessment.
                        </p>
                        {difficulty && (
                            <Badge className={getDifficultyColor(difficulty)}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm">Multiple choice questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            <span className="text-sm">Timed assessment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-500" />
                            <span className="text-sm">Detailed results and recommendations</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <span className="text-red-700">{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button onClick={startAssessment} disabled={loading} size="lg">
                            {loading ? "Starting..." : "Start Assessment"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading next question...</p>
            </div>
        );
    }

    const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        {skill} Assessment
                    </CardTitle>
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                        {currentQuestion.difficulty}
                    </Badge>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{session.currentQuestionIndex + 1} of {session.questions.length}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                {timeRemaining !== null && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span>{timeRemaining}s remaining</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                    
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                        selectedAnswer === option
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="answer"
                                        value={option}
                                        checked={selectedAnswer === option}
                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="text-sm">{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <Button variant="outline" disabled>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button 
                        onClick={submitAnswer} 
                        disabled={!selectedAnswer || loading}
                    >
                        {loading ? "Submitting..." : "Next"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
