import { NextRequest, NextResponse } from "next/server";
import { JobRecommendationEngine } from "@/lib/jobs/recommendation-engine";
import { withAuditLogging } from "@/lib/audit";
import { supabase } from "@/lib/supabase";

// Mock job data - in production, this would come from your database
const mockJobs = [
    {
        id: "job-1",
        source: "direct",
        org: "TechCorp",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        workType: "Full-time",
        pay: { min: 120000, max: 180000 },
        description: "We're looking for a senior software engineer to join our team...",
        requirements: {},
        constraints: {},
        tos: {},
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: "TechCorp",
        remote: true,
        salaryMin: 120000,
        salaryMax: 180000,
        experienceRequired: 5,
        requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "job-2",
        source: "direct",
        org: "StartupXYZ",
        title: "Product Manager",
        location: "New York, NY",
        workType: "Full-time",
        pay: { min: 100000, max: 140000 },
        description: "Join our growing product team...",
        requirements: {},
        constraints: {},
        tos: {},
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: "StartupXYZ",
        remote: false,
        salaryMin: 100000,
        salaryMax: 140000,
        experienceRequired: 3,
        requiredSkills: ["Product Management", "Analytics", "Agile"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "job-3",
        source: "direct",
        org: "DataCorp",
        title: "Data Scientist",
        location: "Seattle, WA",
        workType: "Full-time",
        pay: { min: 110000, max: 160000 },
        description: "Exciting opportunity for a data scientist...",
        requirements: {},
        constraints: {},
        tos: {},
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: "DataCorp",
        remote: true,
        salaryMin: 110000,
        salaryMax: 160000,
        experienceRequired: 4,
        requiredSkills: ["Python", "Machine Learning", "SQL", "Statistics"],
        educationRequired: ["Master's Degree"],
        industry: "Data Science",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const POST = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabaseClient = supabase;
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const body = await req.json();
        const {
            skills = [],
            experience = 0,
            education = [],
            location = "",
            salaryRange = [50000, 150000],
            jobTypes = ["Full-time"],
            industries = [],
            remote = true,
            maxRecommendations = 10,
        } = body;

        // Mock user profile - in production, fetch from database
        const userProfile = {
            id: "test-user-123",
            name: "Test User",
            email: "test@example.com",
            experience: experience,
            skills: skills,
            education: education,
            location: location,
            preferences: {
                salaryRange: salaryRange,
                jobTypes: jobTypes,
                industries: industries,
                remote: remote,
            },
        };

        // Create recommendation engine
        const engine = new JobRecommendationEngine(mockJobs, userProfile, {
            maxRecommendations,
            minFitScore: 0.1, // Lower threshold for testing
            minConfidence: 0.2, // Lower threshold for testing
        });

        // Generate recommendations
        const criteria = {
            skills,
            experience,
            education,
            location,
            salaryRange,
            jobTypes,
            industries,
            remote,
        };

        const recommendations = engine.generateRecommendations(criteria);
        const insights = engine.generateInsights(recommendations);
        const scenarios = engine.getScenarioRecommendations(criteria);

        return NextResponse.json({
            success: true,
            data: {
                recommendations,
                insights,
                scenarios,
                totalJobs: mockJobs.length,
                criteria,
            },
        });
    } catch (error) {
        console.error("Error generating job recommendations:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});
