import { NextRequest, NextResponse } from "next/server";
import { AdvancedJobMatcher } from "@/lib/ai/advanced-matcher";
import { Job, UserProfile } from "@/types";

// Mock job data for demonstration
const mockJobs: Job[] = [
    {
        id: "job-1",
        source: "direct",
        org: "TechCorp",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        workType: "Full-time",
        pay: { min: 120000, max: 180000 },
        description:
            "We're looking for a senior software engineer to join our team. You'll work on cutting-edge projects using modern technologies.",
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
        requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "job-2",
        source: "direct",
        org: "DataCorp",
        title: "Machine Learning Engineer",
        location: "Seattle, WA",
        workType: "Full-time",
        pay: { min: 130000, max: 200000 },
        description:
            "Join our ML team to build innovative AI solutions. Work with large datasets and cutting-edge algorithms.",
        requirements: {},
        constraints: {},
        tos: {},
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: "DataCorp",
        remote: false,
        salaryMin: 130000,
        salaryMax: 200000,
        experienceRequired: 4,
        requiredSkills: [
            "Python",
            "Machine Learning",
            "TensorFlow",
            "PyTorch",
            "SQL",
        ],
        educationRequired: ["Master's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "job-3",
        source: "direct",
        org: "StartupXYZ",
        title: "Full Stack Developer",
        location: "Austin, TX",
        workType: "Full-time",
        pay: { min: 80000, max: 120000 },
        description:
            "Join our fast-growing startup as a full-stack developer. Work on both frontend and backend systems.",
        requirements: {},
        constraints: {},
        tos: {},
        fetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        company: "StartupXYZ",
        remote: true,
        salaryMin: 80000,
        salaryMax: 120000,
        experienceRequired: 3,
        requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "Docker"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Mock user profile for demonstration
const mockUserProfile: UserProfile = {
    id: "user-1",
    email: "user@example.com",
    name: "John Doe",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    experience: 4,
    education: ["Bachelor's Degree"],
    location: "San Francisco",
    preferences: {
        salaryRange: [120000, 180000],
        jobTypes: ["Full-time", "Remote"],
        industries: ["Technology"],
        remote: true,
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userProfile, jobIds, limit = 10 } = body;

        // Use provided user profile or fall back to mock
        const profile = userProfile || mockUserProfile;

        // Filter jobs if specific IDs provided
        const jobsToAnalyze = jobIds
            ? mockJobs.filter((job) => jobIds.includes(job.id))
            : mockJobs;

        const matcher = new AdvancedJobMatcher();
        const results = jobsToAnalyze.map((job) =>
            matcher.generateAdvancedMatch(job, profile)
        );

        // Sort by fit score and confidence
        results.sort((a, b) => {
            const scoreA = a.fitScore * a.confidence;
            const scoreB = b.fitScore * b.confidence;
            return scoreB - scoreA;
        });

        // Limit results
        const limitedResults = results.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: {
                matches: limitedResults,
                totalJobs: jobsToAnalyze.length,
                userProfile: profile,
                insights: {
                    averageFitScore: results.reduce((sum, r) =>
                        sum + r.fitScore, 0) / results.length,
                    topSkills: profile.skills?.slice(0, 5) || [],
                    marketTrends: {
                        highDemandSkills: [
                            "AI",
                            "Machine Learning",
                            "Cloud",
                            "DevOps",
                        ],
                        growingIndustries: [
                            "Technology",
                            "Healthcare",
                            "Finance",
                        ],
                    },
                },
            },
        });
    } catch (error) {
        console.error("Advanced matching error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to generate advanced matches",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit") || "5");

        // For demo purposes, return matches for mock user
        const matcher = new AdvancedJobMatcher();
        const results = mockJobs.map((job) =>
            matcher.generateAdvancedMatch(job, mockUserProfile)
        );

        // Sort by fit score and confidence
        results.sort((a, b) => {
            const scoreA = a.fitScore * a.confidence;
            const scoreB = b.fitScore * b.confidence;
            return scoreB - scoreA;
        });

        const limitedResults = results.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: {
                matches: limitedResults,
                totalJobs: mockJobs.length,
                userProfile: mockUserProfile,
                insights: {
                    averageFitScore: results.reduce((sum, r) =>
                        sum + r.fitScore, 0) / results.length,
                    topSkills: mockUserProfile.skills?.slice(0, 5) || [],
                    marketTrends: {
                        highDemandSkills: [
                            "AI",
                            "Machine Learning",
                            "Cloud",
                            "DevOps",
                        ],
                        growingIndustries: [
                            "Technology",
                            "Healthcare",
                            "Finance",
                        ],
                    },
                },
            },
        });
    } catch (error) {
        console.error("Advanced matching error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to generate advanced matches",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            },
            { status: 500 },
        );
    }
}
