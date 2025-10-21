import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { ApplicationTracker } from "@/lib/applications/application-tracker";

// Mock applications data - in production, this would come from your database
const mockApplications = [
    {
        id: "app-1",
        userId: "user-123",
        job: {
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
            postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                .toISOString(),
            description:
                "We're looking for a senior software engineer to join our team...",
            source: "direct",
            org: "TechCorp",
            workType: "Full-time",
            pay: { min: 120000, max: 180000 },
            requirements: {},
            constraints: {},
            tos: {},
            fetchedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        status: {
            status: "under-review" as const,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updatedBy: "employer" as const,
            notes: "Application is being reviewed by the hiring team",
        },
        statusHistory: [
            {
                status: "submitted" as const,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                updatedBy: "user" as const,
            },
        ],
        documents: [
            {
                id: "doc-1",
                type: "resume" as const,
                name: "John_Doe_Resume.pdf",
                url: "/documents/resume.pdf",
                uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                size: 245760,
                isPrimary: true,
            },
            {
                id: "doc-2",
                type: "cover-letter" as const,
                name: "TechCorp_Cover_Letter.pdf",
                url: "/documents/cover-letter.pdf",
                uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                size: 128000,
                isPrimary: false,
            },
        ],
        notes: [
            {
                id: "note-1",
                content:
                    "Applied through company website. Position looks like a great fit for my skills.",
                type: "user" as const,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                isPrivate: true,
            },
        ],
        events: [
            {
                id: "event-1",
                type: "status-change" as const,
                title: "Application Created",
                description:
                    "Application created for Senior Software Engineer at TechCorp",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
            {
                id: "event-2",
                type: "status-change" as const,
                title: "Status Updated",
                description: "Status changed from submitted to under-review",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                metadata: { oldStatus: "submitted", newStatus: "under-review" },
            },
        ],
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        source: "direct" as const,
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        interviewCount: 0,
        responseTime: 24, // 24 hours
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: "app-2",
        userId: "user-123",
        job: {
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
            postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                .toISOString(),
            description: "Join our growing product team...",
            source: "recommendation",
            org: "StartupXYZ",
            workType: "Full-time",
            pay: { min: 100000, max: 140000 },
            requirements: {},
            constraints: {},
            tos: {},
            fetchedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        status: {
            status: "interview-scheduled" as const,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            updatedBy: "employer" as const,
            notes: "Phone interview scheduled for next week",
        },
        statusHistory: [
            {
                status: "submitted" as const,
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                updatedBy: "user" as const,
            },
            {
                status: "under-review" as const,
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updatedBy: "employer" as const,
            },
        ],
        documents: [
            {
                id: "doc-3",
                type: "resume" as const,
                name: "John_Doe_Resume.pdf",
                url: "/documents/resume.pdf",
                uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                size: 245760,
                isPrimary: true,
            },
        ],
        notes: [
            {
                id: "note-2",
                content:
                    "Referred by Sarah Johnson who works at StartupXYZ. She mentioned they're looking for someone with strong technical background.",
                type: "user" as const,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                isPrivate: true,
            },
        ],
        events: [
            {
                id: "event-3",
                type: "status-change" as const,
                title: "Application Created",
                description:
                    "Application created for Product Manager at StartupXYZ",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                id: "event-4",
                type: "interview-scheduled" as const,
                title: "Interview Scheduled",
                description: "Phone interview scheduled for 2024-01-15",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                metadata: {
                    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    type: "phone",
                    interviewer: "Jane Smith",
                },
            },
        ],
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        source: "recommendation" as const,
        referralContact: "Sarah Johnson",
        lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        interviewCount: 1,
        nextAction: {
            type: "interview-prep" as const,
            dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
            description: "Prepare for phone interview with Jane Smith",
        },
        responseTime: 48, // 48 hours
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
];

const applicationTracker = new ApplicationTracker(mockApplications);

export const GET = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId") || "user-123";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status")?.split(",");
        const source = searchParams.get("source")?.split(",");
        const company = searchParams.get("company")?.split(",");
        const jobTitle = searchParams.get("jobTitle")?.split(",");
        const hasInterview = searchParams.get("hasInterview") === "true"
            ? true
            : searchParams.get("hasInterview") === "false"
            ? false
            : undefined;
        const hasOffer = searchParams.get("hasOffer") === "true"
            ? true
            : searchParams.get("hasOffer") === "false"
            ? false
            : undefined;

        const filters = {
            status,
            source,
            company,
            jobTitle,
            hasInterview,
            hasOffer,
        };

        const result = applicationTracker.getApplications(
            userId,
            filters,
            page,
            limit,
        );
        const stats = applicationTracker.getApplicationStats(userId);
        const needsFollowUp = applicationTracker.getApplicationsNeedingFollowUp(
            userId,
        );

        return NextResponse.json({
            success: true,
            data: {
                applications: result.applications,
                pagination: {
                    page: result.page,
                    limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
                stats,
                needsFollowUp: needsFollowUp.length,
            },
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
});

export const POST = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const body = await req.json();
        const { job, source = "direct", customData } = body;
        const userId = "user-123"; // In production, use user.id

        if (!job) {
            return NextResponse.json(
                { error: "Job data is required" },
                { status: 400 },
            );
        }

        const application = applicationTracker.createApplication(
            userId,
            job,
            source,
            customData,
        );

        return NextResponse.json({
            success: true,
            data: {
                application,
                message: "Application created successfully",
            },
        });
    } catch (error) {
        console.error("Error creating application:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
});
