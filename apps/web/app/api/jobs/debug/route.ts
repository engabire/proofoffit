import { NextRequest, NextResponse } from "next/server";
import { JobMatcher } from "@/lib/jobs/job-matcher";

// Mock job data
const mockJobs = [
    {
        id: "job-1",
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        remote: true,
        salaryMin: 120000,
        salaryMax: 180000,
        experienceRequired: 5,
        requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "We're looking for a senior software engineer to join our team...",
    },
    {
        id: "job-2",
        title: "Product Manager",
        company: "StartupXYZ",
        location: "New York, NY",
        remote: false,
        salaryMin: 100000,
        salaryMax: 140000,
        experienceRequired: 3,
        requiredSkills: ["Product Management", "Analytics", "Agile"],
        educationRequired: ["Bachelor's Degree"],
        industry: "Technology",
        jobType: "Full-time",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Join our growing product team...",
    },
];

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const {
            skills = ["JavaScript", "React", "TypeScript"],
            experience = 3,
            education = ["Bachelor's Degree"],
            location = "San Francisco, CA",
            salaryRange = [80000, 150000],
            jobTypes = ["Full-time"],
            industries = ["Technology"],
            remote = true,
        } = body;

        // Mock user profile
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

        // Create job matcher
        const matcher = new JobMatcher(mockJobs, userProfile);

        // Generate criteria
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

        // Get matches with debug info
        const matches = matcher.findMatches(criteria, 10);

        return NextResponse.json({
            success: true,
            data: {
                criteria,
                matches: matches.map(match => ({
                    jobId: match.job.id,
                    jobTitle: match.job.title,
                    company: match.job.company,
                    fitScore: match.fitScore,
                    confidence: match.confidence,
                    skillMatch: match.skillMatch,
                    experienceMatch: match.experienceMatch,
                    salaryMatch: match.salaryMatch,
                    locationMatch: match.locationMatch,
                    reasons: match.reasons,
                    improvements: match.improvements,
                })),
                totalJobs: mockJobs.length,
                totalMatches: matches.length,
            },
        });
    } catch (error) {
        console.error("Error in debug endpoint:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
};
