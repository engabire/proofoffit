import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { NotificationManager } from "@/lib/notifications/notification-manager";

// Initialize notification manager with some sample data
const notificationManager = new NotificationManager();

// Create some sample notifications for testing
const sampleNotifications = [
    {
        id: "notif-1",
        userId: "user-123",
        type: {
            type: "job-match" as const,
            priority: "high" as const,
            category: "job" as const,
        },
        data: {
            title: "Perfect Job Match Found!",
            message: "Senior Software Engineer at TechCorp - 95% fit score",
            actionUrl: "/jobs/job-1",
            actionText: "View Job",
            metadata: {
                jobId: "job-1",
                fitScore: 0.95,
                confidence: 0.9,
                matchType: "perfect",
                reasons: [
                    "Strong skill alignment",
                    "Experience level matches",
                    "Salary expectations align",
                ],
            },
        },
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
        id: "notif-2",
        userId: "user-123",
        type: {
            type: "application-update" as const,
            priority: "high" as const,
            category: "application" as const,
        },
        data: {
            title: "Application Status Updated",
            message:
                "Product Manager at StartupXYZ: submitted → interview-scheduled",
            actionUrl: "/applications/app-2",
            actionText: "View Application",
            metadata: {
                applicationId: "app-2",
                oldStatus: "submitted",
                newStatus: "interview-scheduled",
                notes: "Phone interview scheduled for next week",
            },
        },
        read: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
        id: "notif-3",
        userId: "user-123",
        type: {
            type: "interview-reminder" as const,
            priority: "urgent" as const,
            category: "application" as const,
        },
        data: {
            title: "Interview Reminder",
            message: "Product Manager at StartupXYZ in 2 hours",
            actionUrl: "/applications/app-2",
            actionText: "View Details",
            metadata: {
                applicationId: "app-2",
                interviewDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
                interviewType: "phone",
                interviewer: "Jane Smith",
                preparationTips: [
                    "Review company background",
                    "Prepare questions about the role",
                ],
            },
        },
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
        id: "notif-4",
        userId: "user-123",
        type: {
            type: "skill-assessment" as const,
            priority: "medium" as const,
            category: "profile" as const,
        },
        data: {
            title: "Skill Assessment Complete",
            message: "JavaScript: 85% (Advanced level)",
            actionUrl: "/assessment/results",
            actionText: "View Results",
            metadata: {
                skill: "JavaScript",
                score: 85,
                level: "advanced",
            },
        },
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
        id: "notif-5",
        userId: "user-123",
        type: {
            type: "profile-completion" as const,
            priority: "low" as const,
            category: "profile" as const,
        },
        data: {
            title: "Profile Completion Update",
            message:
                "Your profile is 80% complete. Missing: Projects, Certifications",
            actionUrl: "/profile",
            actionText: "Complete Profile",
            metadata: {
                completionPercentage: 80,
                missingSections: ["Projects", "Certifications"],
            },
        },
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
];

// Add sample notifications to the manager
sampleNotifications.forEach((notif) => {
    (notificationManager as any).notifications.push(notif);
});

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
        const limit = parseInt(searchParams.get("limit") || "50");
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const includeStats = searchParams.get("includeStats") === "true";

        const notifications = notificationManager.getUserNotifications(
            userId,
            limit,
            unreadOnly,
        );
        const stats = includeStats
            ? notificationManager.getUserNotificationStats(userId)
            : null;
        const preferences = notificationManager.getPreferences(userId);

        return NextResponse.json({
            success: true,
            data: {
                notifications,
                stats,
                preferences,
            },
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
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
        const { action, ...data } = body;
        const userId = "user-123"; // In production, use user.id

        switch (action) {
            case "mark-read":
                const { notificationId } = data;
                const success = notificationManager.markAsRead(notificationId);
                return NextResponse.json({
                    success,
                    message: success
                        ? "Notification marked as read"
                        : "Notification not found",
                });

            case "mark-all-read":
                const markedCount = notificationManager.markAllAsRead(userId);
                return NextResponse.json({
                    success: true,
                    message: `${markedCount} notifications marked as read`,
                    data: { markedCount },
                });

            case "delete":
                const { notificationId: deleteId } = data;
                const deleted = notificationManager.deleteNotification(
                    deleteId,
                );
                return NextResponse.json({
                    success: deleted,
                    message: deleted
                        ? "Notification deleted"
                        : "Notification not found",
                });

            case "click":
                const { notificationId: clickId } = data;
                const clicked = notificationManager.markAsClicked(clickId);
                return NextResponse.json({
                    success: clicked,
                    message: clicked
                        ? "Notification click recorded"
                        : "Notification not found",
                });

            case "update-preferences":
                const updatedPrefs = notificationManager.updatePreferences(
                    userId,
                    data.preferences,
                );
                return NextResponse.json({
                    success: true,
                    message: "Preferences updated successfully",
                    data: { preferences: updatedPrefs },
                });

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("Error processing notification action:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
});
