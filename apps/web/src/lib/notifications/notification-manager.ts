import { Job } from "@/types";

export interface NotificationType {
    type:
        | "job-match"
        | "application-update"
        | "interview-reminder"
        | "new-job-alert"
        | "skill-assessment"
        | "profile-completion"
        | "system";
    priority: "low" | "medium" | "high" | "urgent";
    category: "job" | "application" | "profile" | "system";
}

export interface NotificationData {
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    data: NotificationData;
    read: boolean;
    createdAt: Date;
    expiresAt?: Date;
    deliveredAt?: Date;
    clickedAt?: Date;
}

export interface NotificationPreferences {
    userId: string;
    email: boolean;
    push: boolean;
    inApp: boolean;
    types: {
        jobMatch: boolean;
        applicationUpdate: boolean;
        interviewReminder: boolean;
        newJobAlert: boolean;
        skillAssessment: boolean;
        profileCompletion: boolean;
        system: boolean;
    };
    frequency: "immediate" | "daily" | "weekly";
    quietHours: {
        enabled: boolean;
        start: string; // HH:MM format
        end: string; // HH:MM format
        timezone: string;
    };
}

export interface JobMatchNotification {
    job: Job;
    fitScore: number;
    confidence: number;
    reasons: string[];
    matchType: "perfect" | "good" | "explore" | "stretch";
}

export interface ApplicationUpdateNotification {
    applicationId: string;
    jobTitle: string;
    company: string;
    oldStatus: string;
    newStatus: string;
    notes?: string;
}

export interface InterviewReminderNotification {
    applicationId: string;
    jobTitle: string;
    company: string;
    interviewDate: Date;
    interviewType: "phone" | "video" | "in-person" | "technical";
    location?: string;
    interviewer?: string;
    preparationTips?: string[];
}

export class NotificationManager {
    private notifications: Notification[] = [];
    private preferences: Map<string, NotificationPreferences> = new Map();

    constructor() {
        this.initializeDefaultPreferences();
    }

    /**
     * Create a new notification
     */
    createNotification(
        userId: string,
        type: NotificationType,
        data: NotificationData,
        expiresAt?: Date,
    ): Notification {
        const notification: Notification = {
            id: `notif-${Date.now()}-${
                Math.random().toString(36).substr(2, 9)
            }`,
            userId,
            type,
            data,
            read: false,
            createdAt: new Date(),
            expiresAt,
        };

        this.notifications.push(notification);
        return notification;
    }

    /**
     * Create job match notification
     */
    createJobMatchNotification(
        userId: string,
        jobMatch: JobMatchNotification,
    ): Notification {
        const type: NotificationType = {
            type: "job-match",
            priority: jobMatch.matchType === "perfect"
                ? "high"
                : jobMatch.matchType === "good"
                ? "medium"
                : "low",
            category: "job",
        };

        const data: NotificationData = {
            title: `New ${jobMatch.matchType} job match!`,
            message: `${jobMatch.job.title} at ${
                jobMatch.job.company || jobMatch.job.org
            } - ${Math.round(jobMatch.fitScore * 100)}% fit`,
            actionUrl: `/jobs/${jobMatch.job.id}`,
            actionText: "View Job",
            metadata: {
                jobId: jobMatch.job.id,
                fitScore: jobMatch.fitScore,
                confidence: jobMatch.confidence,
                matchType: jobMatch.matchType,
                reasons: jobMatch.reasons,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Create application update notification
     */
    createApplicationUpdateNotification(
        userId: string,
        update: ApplicationUpdateNotification,
    ): Notification {
        const type: NotificationType = {
            type: "application-update",
            priority: update.newStatus === "offer-received"
                ? "urgent"
                : update.newStatus === "interview-scheduled"
                ? "high"
                : update.newStatus === "rejected"
                ? "medium"
                : "low",
            category: "application",
        };

        const data: NotificationData = {
            title: "Application Status Updated",
            message:
                `${update.jobTitle} at ${update.company}: ${update.oldStatus} → ${update.newStatus}`,
            actionUrl: `/applications/${update.applicationId}`,
            actionText: "View Application",
            metadata: {
                applicationId: update.applicationId,
                oldStatus: update.oldStatus,
                newStatus: update.newStatus,
                notes: update.notes,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Create interview reminder notification
     */
    createInterviewReminderNotification(
        userId: string,
        reminder: InterviewReminderNotification,
    ): Notification {
        const type: NotificationType = {
            type: "interview-reminder",
            priority: "high",
            category: "application",
        };

        const timeUntilInterview = reminder.interviewDate.getTime() -
            Date.now();
        const hoursUntil = Math.round(timeUntilInterview / (1000 * 60 * 60));

        const data: NotificationData = {
            title: "Interview Reminder",
            message:
                `${reminder.jobTitle} at ${reminder.company} in ${hoursUntil} hours`,
            actionUrl: `/applications/${reminder.applicationId}`,
            actionText: "View Details",
            metadata: {
                applicationId: reminder.applicationId,
                interviewDate: reminder.interviewDate,
                interviewType: reminder.interviewType,
                location: reminder.location,
                interviewer: reminder.interviewer,
                preparationTips: reminder.preparationTips,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Create new job alert notification
     */
    createNewJobAlertNotification(
        userId: string,
        job: Job,
        reason: string,
    ): Notification {
        const type: NotificationType = {
            type: "new-job-alert",
            priority: "medium",
            category: "job",
        };

        const data: NotificationData = {
            title: "New Job Alert",
            message: `${job.title} at ${job.company || job.org} - ${reason}`,
            actionUrl: `/jobs/${job.id}`,
            actionText: "View Job",
            metadata: {
                jobId: job.id,
                reason,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Create skill assessment notification
     */
    createSkillAssessmentNotification(
        userId: string,
        skill: string,
        score: number,
        level: string,
    ): Notification {
        const type: NotificationType = {
            type: "skill-assessment",
            priority: "medium",
            category: "profile",
        };

        const data: NotificationData = {
            title: "Skill Assessment Complete",
            message: `${skill}: ${score}% (${level} level)`,
            actionUrl: `/assessment/results`,
            actionText: "View Results",
            metadata: {
                skill,
                score,
                level,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Create profile completion notification
     */
    createProfileCompletionNotification(
        userId: string,
        completionPercentage: number,
        missingSections: string[],
    ): Notification {
        const type: NotificationType = {
            type: "profile-completion",
            priority: completionPercentage >= 80 ? "low" : "medium",
            category: "profile",
        };

        const data: NotificationData = {
            title: "Profile Completion Update",
            message: `Your profile is ${completionPercentage}% complete. ${
                missingSections.length > 0
                    ? `Missing: ${missingSections.join(", ")}`
                    : "Great job!"
            }`,
            actionUrl: "/profile",
            actionText: "Complete Profile",
            metadata: {
                completionPercentage,
                missingSections,
            },
        };

        return this.createNotification(userId, type, data);
    }

    /**
     * Get notifications for a user
     */
    getUserNotifications(
        userId: string,
        limit: number = 50,
        unreadOnly: boolean = false,
    ): Notification[] {
        let userNotifications = this.notifications.filter((notif) =>
            notif.userId === userId
        );

        // Filter out expired notifications
        userNotifications = userNotifications.filter((notif) =>
            !notif.expiresAt || notif.expiresAt > new Date()
        );

        // Filter unread only if requested
        if (unreadOnly) {
            userNotifications = userNotifications.filter((notif) =>
                !notif.read
            );
        }

        // Sort by creation date (newest first)
        userNotifications.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        return userNotifications.slice(0, limit);
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId: string): boolean {
        const notification = this.notifications.find((notif) =>
            notif.id === notificationId
        );
        if (!notification) return false;

        notification.read = true;
        return true;
    }

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead(userId: string): number {
        const userNotifications = this.notifications.filter((notif) =>
            notif.userId === userId && !notif.read
        );

        userNotifications.forEach((notif) => {
            notif.read = true;
        });

        return userNotifications.length;
    }

    /**
     * Delete a notification
     */
    deleteNotification(notificationId: string): boolean {
        const index = this.notifications.findIndex((notif) =>
            notif.id === notificationId
        );
        if (index === -1) return false;

        this.notifications.splice(index, 1);
        return true;
    }

    /**
     * Get notification statistics for a user
     */
    getUserNotificationStats(userId: string): {
        total: number;
        unread: number;
        byType: Record<string, number>;
        byPriority: Record<string, number>;
        recentActivity: number; // notifications in last 7 days
    } {
        const userNotifications = this.notifications.filter((notif) =>
            notif.userId === userId
        );
        const unreadNotifications = userNotifications.filter((notif) =>
            !notif.read
        );

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentNotifications = userNotifications.filter((notif) =>
            notif.createdAt > sevenDaysAgo
        );

        const byType: Record<string, number> = {};
        const byPriority: Record<string, number> = {};

        userNotifications.forEach((notif) => {
            byType[notif.type.type] = (byType[notif.type.type] || 0) + 1;
            byPriority[notif.type.priority] =
                (byPriority[notif.type.priority] || 0) + 1;
        });

        return {
            total: userNotifications.length,
            unread: unreadNotifications.length,
            byType,
            byPriority,
            recentActivity: recentNotifications.length,
        };
    }

    /**
     * Update notification preferences
     */
    updatePreferences(
        userId: string,
        preferences: Partial<NotificationPreferences>,
    ): NotificationPreferences {
        const currentPrefs = this.preferences.get(userId) ||
            this.getDefaultPreferences(userId);
        const updatedPrefs = { ...currentPrefs, ...preferences };
        this.preferences.set(userId, updatedPrefs);
        return updatedPrefs;
    }

    /**
     * Get notification preferences
     */
    getPreferences(userId: string): NotificationPreferences {
        return this.preferences.get(userId) ||
            this.getDefaultPreferences(userId);
    }

    /**
     * Check if user should receive notification based on preferences
     */
    shouldSendNotification(userId: string, type: NotificationType): boolean {
        const preferences = this.getPreferences(userId);

        // Check if notification type is enabled
        const typeEnabled =
            preferences.types[type.type as keyof typeof preferences.types];
        if (!typeEnabled) return false;

        // Check quiet hours
        if (preferences.quietHours.enabled) {
            const now = new Date();
            const currentTime = now.toLocaleTimeString("en-US", {
                hour12: false,
                timeZone: preferences.quietHours.timezone,
            }).substring(0, 5);

            if (
                currentTime >= preferences.quietHours.start &&
                currentTime <= preferences.quietHours.end
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Clean up expired notifications
     */
    cleanupExpiredNotifications(): number {
        const now = new Date();
        const initialCount = this.notifications.length;

        this.notifications = this.notifications.filter((notif) =>
            !notif.expiresAt || notif.expiresAt > now
        );

        return initialCount - this.notifications.length;
    }

    /**
     * Get notifications that need to be delivered
     */
    getPendingNotifications(): Notification[] {
        return this.notifications.filter((notif) =>
            !notif.deliveredAt &&
            (!notif.expiresAt || notif.expiresAt > new Date())
        );
    }

    /**
     * Mark notification as delivered
     */
    markAsDelivered(notificationId: string): boolean {
        const notification = this.notifications.find((notif) =>
            notif.id === notificationId
        );
        if (!notification) return false;

        notification.deliveredAt = new Date();
        return true;
    }

    /**
     * Mark notification as clicked
     */
    markAsClicked(notificationId: string): boolean {
        const notification = this.notifications.find((notif) =>
            notif.id === notificationId
        );
        if (!notification) return false;

        notification.clickedAt = new Date();
        return true;
    }

    // Private helper methods
    private initializeDefaultPreferences(): void {
        // Initialize with some default preferences for testing
        this.preferences.set(
            "user-123",
            this.getDefaultPreferences("user-123"),
        );
    }

    private getDefaultPreferences(userId: string): NotificationPreferences {
        return {
            userId,
            email: true,
            push: true,
            inApp: true,
            types: {
                jobMatch: true,
                applicationUpdate: true,
                interviewReminder: true,
                newJobAlert: true,
                skillAssessment: true,
                profileCompletion: true,
                system: true,
            },
            frequency: "immediate",
            quietHours: {
                enabled: false,
                start: "22:00",
                end: "08:00",
                timezone: "America/New_York",
            },
        };
    }
}
