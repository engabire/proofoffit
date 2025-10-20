import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { ApplicationTracker } from "@/lib/applications/application-tracker";

// Mock applications data - same as in the main route
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
            postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: "We're looking for a senior software engineer to join our team...",
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
        ],
        notes: [],
        events: [],
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        source: "direct" as const,
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        interviewCount: 0,
        responseTime: 24,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
];

const applicationTracker = new ApplicationTracker(mockApplications);

export const GET = withAuditLogging(async (req: NextRequest, { params }: { params: { id: string } }) => {
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

        const applicationId = params.id;
        const application = applicationTracker.getApplication(applicationId);

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                application,
            },
        });
    } catch (error) {
        console.error("Error fetching application:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});

export const PUT = withAuditLogging(async (req: NextRequest, { params }: { params: { id: string } }) => {
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

        const applicationId = params.id;
        const body = await req.json();
        const { action, ...data } = body;

        let updatedApplication = null;

        switch (action) {
            case 'update-status':
                updatedApplication = applicationTracker.updateStatus(
                    applicationId,
                    data.status,
                    data.notes,
                    data.updatedBy || 'user'
                );
                break;

            case 'add-document':
                updatedApplication = applicationTracker.addDocument(applicationId, data.document);
                break;

            case 'add-note':
                updatedApplication = applicationTracker.addNote(
                    applicationId,
                    data.content,
                    data.type || 'user',
                    data.isPrivate || false
                );
                break;

            case 'schedule-interview':
                updatedApplication = applicationTracker.scheduleInterview(applicationId, data.interviewDetails);
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        if (!updatedApplication) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                application: updatedApplication,
                message: "Application updated successfully",
            },
        });
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});

export const DELETE = withAuditLogging(async (req: NextRequest, { params }: { params: { id: string } }) => {
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

        const applicationId = params.id;
        const success = applicationTracker.deleteApplication(applicationId);

        if (!success) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});
