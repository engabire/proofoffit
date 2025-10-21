import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { supabase } from "@/lib/supabase";

export const GET = withAuditLogging(async (req: NextRequest) => {
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

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const location = searchParams.get("location") || "";
        const remote = searchParams.get("remote") === "true";
        const salaryMin = parseInt(searchParams.get("salaryMin") || "0");
        const salaryMax = parseInt(searchParams.get("salaryMax") || "1000000");
        const experience = parseInt(searchParams.get("experience") || "0");
        const industry = searchParams.get("industry") || "";
        const jobType = searchParams.get("jobType") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        // Mock job data - in production, this would come from your database
        const allJobs = [
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
            {
                id: "job-4",
                source: "direct",
                org: "WebCorp",
                title: "Frontend Developer",
                location: "Austin, TX",
                workType: "Full-time",
                pay: { min: 80000, max: 120000 },
                description: "Join our frontend development team...",
                requirements: {},
                constraints: {},
                tos: {},
                fetchedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                company: "WebCorp",
                remote: true,
                salaryMin: 80000,
                salaryMax: 120000,
                experienceRequired: 2,
                requiredSkills: ["React", "CSS", "JavaScript", "HTML"],
                educationRequired: ["Bachelor's Degree"],
                industry: "Technology",
                jobType: "Full-time",
                postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: "job-5",
                source: "direct",
                org: "GrowthCorp",
                title: "Marketing Manager",
                location: "Chicago, IL",
                workType: "Full-time",
                pay: { min: 70000, max: 100000 },
                description: "Lead our marketing initiatives...",
                requirements: {},
                constraints: {},
                tos: {},
                fetchedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                company: "GrowthCorp",
                remote: false,
                salaryMin: 70000,
                salaryMax: 100000,
                experienceRequired: 3,
                requiredSkills: ["Digital Marketing", "Analytics", "SEO", "Social Media"],
                educationRequired: ["Bachelor's Degree"],
                industry: "Marketing",
                jobType: "Full-time",
                postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];

        // Filter jobs based on search criteria
        let filteredJobs = allJobs.filter((job) => {
            // Text search
            if (query) {
                const searchText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
                if (!searchText.includes(query.toLowerCase())) {
                    return false;
                }
            }

            // Location filter
            if (location && !job.remote) {
                if (!job.location.toLowerCase().includes(location.toLowerCase())) {
                    return false;
                }
            }

            // Remote filter
            if (remote && !job.remote) {
                return false;
            }

            // Salary filter
            if (salaryMin > 0 && job.salaryMax && job.salaryMax < salaryMin) {
                return false;
            }
            if (salaryMax < 1000000 && job.salaryMin && job.salaryMin > salaryMax) {
                return false;
            }

            // Experience filter
            if (experience > 0 && job.experienceRequired && job.experienceRequired > experience) {
                return false;
            }

            // Industry filter
            if (industry && job.industry !== industry) {
                return false;
            }

            // Job type filter
            if (jobType && job.jobType !== jobType) {
                return false;
            }

            return true;
        });

        // Sort by posting date (newest first)
        filteredJobs.sort((a, b) => 
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

        // Calculate pagination info
        const totalJobs = filteredJobs.length;
        const totalPages = Math.ceil(totalJobs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
            success: true,
            data: {
                jobs: paginatedJobs,
                pagination: {
                    page,
                    limit,
                    totalJobs,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                },
                filters: {
                    query,
                    location,
                    remote,
                    salaryMin,
                    salaryMax,
                    experience,
                    industry,
                    jobType,
                },
            },
        });
    } catch (error) {
        console.error("Error searching jobs:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});