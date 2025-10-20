"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    User, 
    Briefcase, 
    GraduationCap, 
    Award, 
    Code, 
    Target,
    TrendingUp,
    Star,
    MapPin,
    Mail,
    Phone,
    Globe,
    Github,
    Linkedin,
    Edit,
    Plus,
    CheckCircle,
    Clock,
    AlertCircle
} from "lucide-react";

interface ProfileSection {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completionPercentage: number;
}

interface SkillAssessment {
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    evidence: string[];
    verified: boolean;
    lastAssessed: Date;
}

interface CareerInsights {
    strengths: string[];
    areasForImprovement: string[];
    careerPath: string[];
    marketPosition: string;
    salaryBenchmark: {
        current: number;
        market: number;
        percentile: number;
    };
}

interface ProfileDashboardProps {
    userId?: string;
}

export function ProfileDashboard({ userId }: ProfileDashboardProps) {
    const [profile, setProfile] = useState<any>(null);
    const [insights, setInsights] = useState<CareerInsights | null>(null);
    const [sections, setSections] = useState<ProfileSection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/profile");
            
            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await response.json();
            setProfile(data.data.profile);
            setInsights(data.data.insights);
            setSections(data.data.profile.sections);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'intermediate': return 'bg-green-100 text-green-800 border-green-200';
            case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCompletionColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-blue-600';
        if (percentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProfile}>Try Again</Button>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No profile data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {profile.firstName?.[0]}{profile.lastName?.[0]}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">
                                    {profile.firstName} {profile.lastName}
                                </h1>
                                <p className="text-lg text-gray-600 mb-2">{profile.headline}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{profile.yearsOfExperience} years experience</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>{insights?.marketPosition}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {profile.linkedinUrl && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-4 w-4 mr-2" />
                                                LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    {profile.githubUrl && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4 mr-2" />
                                                GitHub
                                            </a>
                                        </Button>
                                    )}
                                    {profile.portfolioUrl && (
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                                <Globe className="h-4 w-4 mr-2" />
                                                Portfolio
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Profile Completeness
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-bold">{profile.profileCompleteness}%</span>
                        </div>
                        <Progress value={profile.profileCompleteness} className="h-2" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sections.map((section) => (
                                <div key={section.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {section.completed ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-yellow-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{section.title}</p>
                                            <p className="text-xs text-gray-500">{section.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-bold ${getCompletionColor(section.completionPercentage)}`}>
                                            {Math.round(section.completionPercentage)}%
                                        </div>
                                        <Progress value={section.completionPercentage} className="w-16 h-1 mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Professional Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Professional Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    {profile.summary}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{profile.email}</span>
                                </div>
                                {profile.phone && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{profile.phone}</span>
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center space-x-2">
                                        <Globe className="h-4 w-4 text-gray-500" />
                                        <a href={profile.website} className="text-sm text-blue-600 hover:underline">
                                            {profile.website}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Career Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Career Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {profile.careerGoals?.map((goal: string, index: number) => (
                                    <Badge key={index} variant="secondary">
                                        {goal}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Skills & Assessments
                                </div>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.skills?.map((skill: SkillAssessment, index: number) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{skill.skill}</h4>
                                            <Badge className={getLevelColor(skill.level)}>
                                                {skill.level}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Confidence</span>
                                                <span>{skill.confidence}%</span>
                                            </div>
                                            <Progress value={skill.confidence} className="h-2" />
                                            {skill.verified && (
                                                <div className="flex items-center text-xs text-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Work Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {profile.experience?.map((exp: any, index: number) => (
                                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold">{exp.title}</h4>
                                                <p className="text-gray-600">{exp.company}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(exp.startDate).toLocaleDateString()} - 
                                                    {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">{exp.location}</p>
                                            </div>
                                            <Badge variant="outline">{exp.type}</Badge>
                                        </div>
                                        <p className="mt-2 text-gray-700">{exp.description}</p>
                                        {exp.skills && exp.skills.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {exp.skills.map((skill: string, skillIndex: number) => (
                                                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Projects & Portfolio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.projects?.map((project: any, index: number) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold">{project.name}</h4>
                                            <div className="flex space-x-2">
                                                {project.url && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                            <Globe className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {project.githubUrl && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                            <Github className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.technologies?.map((tech: string, techIndex: number) => (
                                                <Badge key={techIndex} variant="secondary" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                        {project.achievements && project.achievements.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 mb-1">Achievements:</p>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    {project.achievements.map((achievement: string, achIndex: number) => (
                                                        <li key={achIndex} className="flex items-center">
                                                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                                            {achievement}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                    {insights && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Strengths
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {insights.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    <span className="text-sm">{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Areas for Improvement
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {insights.areasForImprovement.map((area, index) => (
                                                <li key={index} className="flex items-center">
                                                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                                                    <span className="text-sm">{area}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Career Path Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {insights.careerPath.map((step, index) => (
                                            <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Salary Benchmark
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">
                                                ${insights.salaryBenchmark.current.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">Current Expectation</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">
                                                ${insights.salaryBenchmark.market.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">Market Average</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {insights.salaryBenchmark.percentile}%
                                            </p>
                                            <p className="text-sm text-gray-500">Percentile</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
