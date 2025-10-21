"use client";

import React, { useState } from "react";
import { SkillAssessment } from "@/components/assessment/skill-assessment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Brain, 
    Target, 
    TrendingUp, 
    Award,
    Clock,
    CheckCircle,
    Star
} from "lucide-react";

const availableSkills = [
    "JavaScript",
    "TypeScript", 
    "React",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "Go",
    "Rust",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Data Science"
];

const difficultyLevels = [
    { value: "beginner", label: "Beginner", description: "Basic concepts and fundamentals" },
    { value: "intermediate", label: "Intermediate", description: "Practical applications and patterns" },
    { value: "advanced", label: "Advanced", description: "Complex scenarios and optimization" },
    { value: "expert", label: "Expert", description: "Deep knowledge and best practices" }
];

export default function AssessmentPage() {
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
    const [showAssessment, setShowAssessment] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<any>(null);

    const handleStartAssessment = () => {
        if (selectedSkill) {
            setShowAssessment(true);
            setAssessmentResult(null);
        }
    };

    const handleAssessmentComplete = (result: any) => {
        setAssessmentResult(result);
    };

    const handleBackToSelection = () => {
        setShowAssessment(false);
        setAssessmentResult(null);
    };

    if (showAssessment) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <Button variant="outline" onClick={handleBackToSelection} className="mb-4">
                            ← Back to Skill Selection
                        </Button>
                        <h1 className="text-3xl font-bold">Skill Assessment</h1>
                        <p className="text-gray-600 mt-2">
                            Test your knowledge of {selectedSkill}
                        </p>
                    </div>
                    
                    <SkillAssessment 
                        skill={selectedSkill}
                        difficulty={selectedDifficulty}
                        onComplete={handleAssessmentComplete}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Skill Assessments</h1>
                    <p className="text-xl text-gray-600">
                        Test your technical skills and get personalized recommendations
                    </p>
                </div>

                {/* Assessment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">15+</div>
                            <div className="text-sm text-gray-600">Skills Available</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">4</div>
                            <div className="text-sm text-gray-600">Difficulty Levels</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">10-15</div>
                            <div className="text-sm text-gray-600">Minutes per Test</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">Instant</div>
                            <div className="text-sm text-gray-600">Results & Feedback</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Skill Selection */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Choose Your Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Skill</label>
                                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a skill to assess" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSkills.map((skill) => (
                                            <SelectItem key={skill} value={skill}>
                                                {skill}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose difficulty level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficultyLevels.map((level) => (
                                            <SelectItem key={level.value} value={level.value}>
                                                <div>
                                                    <div className="font-medium">{level.label}</div>
                                                    <div className="text-xs text-gray-500">{level.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button 
                                onClick={handleStartAssessment}
                                disabled={!selectedSkill}
                                size="lg"
                                className="px-8"
                            >
                                <Brain className="h-5 w-5 mr-2" />
                                Start Assessment
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Assessment Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Comprehensive Testing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Our assessments cover fundamental concepts, practical applications, 
                                and advanced scenarios to accurately evaluate your skill level.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Personalized Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Get detailed insights into your strengths and areas for improvement 
                                with actionable recommendations for skill development.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-purple-500" />
                                Skill Certification
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Earn verifiable skill badges that you can showcase on your profile 
                                and share with potential employers.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Popular Skills */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Popular Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {["JavaScript", "Python", "React", "AWS", "Docker", "Machine Learning"].map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => {
                                        setSelectedSkill(skill);
                                        setSelectedDifficulty("intermediate");
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Badge 
                                        variant="secondary" 
                                        className="hover:bg-blue-100"
                                    >
                                        {skill}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
