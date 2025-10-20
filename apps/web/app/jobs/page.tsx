"use client";

import React, { useState } from "react";
import { JobSearch } from "@/components/jobs/job-search";
import { JobRecommendations } from "@/components/jobs/job-recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Sparkles, 
    TrendingUp, 
    MapPin, 
    DollarSign,
    Briefcase,
    GraduationCap
} from "lucide-react";

export default function JobsPage() {
    const [activeTab, setActiveTab] = useState("search");
    const [recommendationCriteria, setRecommendationCriteria] = useState({
        skills: ["JavaScript", "React", "TypeScript"],
        experience: 3,
        education: ["Bachelor's Degree"],
        location: "San Francisco, CA",
        salaryRange: [80000, 150000] as [number, number],
        jobTypes: ["Full-time"],
        industries: ["Technology"],
        remote: true,
    });

    const handleGenerateRecommendations = () => {
        // This will trigger the JobRecommendations component to fetch new recommendations
        setActiveTab("recommendations");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Find Your Perfect Job</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Discover opportunities that match your skills, experience, and career goals
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">1,200+</div>
                            <div className="text-sm text-gray-600">Active Jobs</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">85%</div>
                            <div className="text-sm text-gray-600">Match Accuracy</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">500+</div>
                            <div className="text-sm text-gray-600">Companies</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">24h</div>
                            <div className="text-sm text-gray-600">Avg Response</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="search" className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Search Jobs
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Recommendations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="search">
                        <JobSearch />
                    </TabsContent>

                    <TabsContent value="recommendations">
                        <div className="space-y-6">
                            {/* Recommendation Criteria Setup */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Customize Your Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="skills">Skills</Label>
                                            <Input
                                                id="skills"
                                                placeholder="JavaScript, React, Python..."
                                                value={recommendationCriteria.skills.join(", ")}
                                                onChange={(e) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                                }))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="experience">Experience (years)</Label>
                                            <Select
                                                value={recommendationCriteria.experience.toString()}
                                                onValueChange={(value) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    experience: parseInt(value)
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0-1 years</SelectItem>
                                                    <SelectItem value="2">2-3 years</SelectItem>
                                                    <SelectItem value="4">4-6 years</SelectItem>
                                                    <SelectItem value="7">7+ years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                placeholder="San Francisco, CA"
                                                value={recommendationCriteria.location}
                                                onChange={(e) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    location: e.target.value
                                                }))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="salaryMin">Min Salary</Label>
                                            <Input
                                                id="salaryMin"
                                                type="number"
                                                placeholder="80000"
                                                value={recommendationCriteria.salaryRange[0]}
                                                onChange={(e) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    salaryRange: [parseInt(e.target.value) || 0, prev.salaryRange[1]]
                                                }))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="salaryMax">Max Salary</Label>
                                            <Input
                                                id="salaryMax"
                                                type="number"
                                                placeholder="150000"
                                                value={recommendationCriteria.salaryRange[1]}
                                                onChange={(e) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    salaryRange: [prev.salaryRange[0], parseInt(e.target.value) || 0]
                                                }))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="industry">Industry</Label>
                                            <Select
                                                value={recommendationCriteria.industries[0] || ""}
                                                onValueChange={(value) => setRecommendationCriteria(prev => ({
                                                    ...prev,
                                                    industries: [value]
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <Button onClick={handleGenerateRecommendations} className="w-full">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate AI Recommendations
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Current Criteria Display */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Search Criteria</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {recommendationCriteria.experience} years experience
                                        </Badge>
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {recommendationCriteria.location}
                                        </Badge>
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            ${recommendationCriteria.salaryRange[0].toLocaleString()} - ${recommendationCriteria.salaryRange[1].toLocaleString()}
                                        </Badge>
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            {recommendationCriteria.industries[0]}
                                        </Badge>
                                        {recommendationCriteria.remote && (
                                            <Badge variant="secondary">Remote OK</Badge>
                                        )}
                                        {recommendationCriteria.skills.map((skill) => (
                                            <Badge key={skill} variant="outline">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <JobRecommendations initialCriteria={recommendationCriteria} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
