import { Job } from "@/types";

export interface ApplicationStatus {
    status:
        | "draft"
        | "submitted"
        | "under-review"
        | "interview-scheduled"
        | "interview-completed"
        | "offer-received"
        | "rejected"
        | "withdrawn"
        | "hired";
    timestamp: Date;
    notes?: string;
    updatedBy: "user" | "system" | "employer";
}

export interface ApplicationDocument {
    id: string;
    type: "resume" | "cover-letter" | "portfolio" | "certificate" | "other";
    name: string;
    url: string;
    uploadedAt: Date;
    size: number;
    isPrimary: boolean;
}

export interface ApplicationNote {
    id: string;
    content: string;
    type: "user" | "system" | "employer";
    createdAt: Date;
    isPrivate: boolean;
}

export interface ApplicationEvent {
    id: string;
    type:
        | "status-change"
        | "document-upload"
        | "note-added"
        | "interview-scheduled"
        | "email-sent"
        | "email-received"
        | "reminder-set";
    title: string;
    description: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface JobApplication {
    id: string;
    userId: string;
    job: Job;
    status: ApplicationStatus;
    statusHistory: ApplicationStatus[];
    documents: ApplicationDocument[];
    notes: ApplicationNote[];
    events: ApplicationEvent[];

    // Application details
    appliedAt: Date;
    source: "direct" | "recommendation" | "auto-apply" | "referral";
    referralContact?: string;
    expectedSalary?: number;
    availabilityDate?: Date;
    customMessage?: string;

    // Tracking
    lastActivityAt: Date;
    nextAction?: {
        type:
            | "follow-up"
            | "interview-prep"
            | "document-submission"
            | "salary-negotiation";
        dueDate: Date;
        description: string;
    };

    // Analytics
    responseTime?: number; // hours from application to first response
    interviewCount: number;
    rejectionReason?: string;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

export interface ApplicationStats {
    totalApplications: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    byMonth: Record<string, number>;
    averageResponseTime: number;
    interviewRate: number;
    offerRate: number;
    rejectionRate: number;
    topCompanies: Array<{ company: string; count: number }>;
    topJobTitles: Array<{ title: string; count: number }>;
    successRate: number;
}

export interface ApplicationFilters {
    status?: string[];
    source?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    company?: string[];
    jobTitle?: string[];
    hasInterview?: boolean;
    hasOffer?: boolean;
}

export class ApplicationTracker {
    private applications: JobApplication[] = [];

    constructor(applications: JobApplication[] = []) {
        this.applications = applications;
    }

    /**
     * Create a new job application
     */
    createApplication(
        userId: string,
        job: Job,
        source: JobApplication["source"] = "direct",
        customData?: Partial<JobApplication>,
    ): JobApplication {
        const application: JobApplication = {
            id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            job,
            status: {
                status: "draft",
                timestamp: new Date(),
                updatedBy: "user",
            },
            statusHistory: [],
            documents: [],
            notes: [],
            events: [],
            appliedAt: new Date(),
            source,
            lastActivityAt: new Date(),
            interviewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...customData,
        };

        // Add initial event
        this.addEvent(application, {
            type: "status-change",
            title: "Application Created",
            description: `Application created for ${job.title} at ${
                job.company || job.org
            }`,
            timestamp: new Date(),
        });

        this.applications.push(application);
        return application;
    }

    /**
     * Update application status
     */
    updateStatus(
        applicationId: string,
        newStatus: ApplicationStatus["status"],
        notes?: string,
        updatedBy: ApplicationStatus["updatedBy"] = "user",
    ): JobApplication | null {
        const application = this.applications.find((app) =>
            app.id === applicationId
        );
        if (!application) return null;

        const oldStatus = application.status.status;

        // Add to status history
        application.statusHistory.push({ ...application.status });

        // Update current status
        application.status = {
            status: newStatus,
            timestamp: new Date(),
            notes,
            updatedBy,
        };

        application.lastActivityAt = new Date();
        application.updatedAt = new Date();

        // Add event
        this.addEvent(application, {
            type: "status-change",
            title: "Status Updated",
            description: `Status changed from ${oldStatus} to ${newStatus}`,
            timestamp: new Date(),
            metadata: { oldStatus, newStatus, notes },
        });

        return application;
    }

    /**
     * Add a document to an application
     */
    addDocument(
        applicationId: string,
        document: Omit<ApplicationDocument, "id" | "uploadedAt">,
    ): JobApplication | null {
        const application = this.applications.find((app) =>
            app.id === applicationId
        );
        if (!application) return null;

        const newDocument: ApplicationDocument = {
            ...document,
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            uploadedAt: new Date(),
        };

        application.documents.push(newDocument);
        application.lastActivityAt = new Date();
        application.updatedAt = new Date();

        // Add event
        this.addEvent(application, {
            type: "document-upload",
            title: "Document Uploaded",
            description: `${document.name} uploaded`,
            timestamp: new Date(),
            metadata: {
                documentType: document.type,
                documentName: document.name,
            },
        });

        return application;
    }

    /**
     * Add a note to an application
     */
    addNote(
        applicationId: string,
        content: string,
        type: ApplicationNote["type"] = "user",
        isPrivate: boolean = false,
    ): JobApplication | null {
        const application = this.applications.find((app) =>
            app.id === applicationId
        );
        if (!application) return null;

        const note: ApplicationNote = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content,
            type,
            createdAt: new Date(),
            isPrivate,
        };

        application.notes.push(note);
        application.lastActivityAt = new Date();
        application.updatedAt = new Date();

        // Add event
        this.addEvent(application, {
            type: "note-added",
            title: "Note Added",
            description: type === "user"
                ? "Personal note added"
                : "System note added",
            timestamp: new Date(),
            metadata: { noteType: type, isPrivate },
        });

        return application;
    }

    /**
     * Schedule an interview
     */
    scheduleInterview(
        applicationId: string,
        interviewDetails: {
            date: Date;
            type: "phone" | "video" | "in-person" | "technical";
            location?: string;
            interviewer?: string;
            notes?: string;
        },
    ): JobApplication | null {
        const application = this.applications.find((app) =>
            app.id === applicationId
        );
        if (!application) return null;

        // Update status to interview scheduled
        this.updateStatus(
            applicationId,
            "interview-scheduled",
            interviewDetails.notes,
            "system",
        );

        // Add interview event
        this.addEvent(application, {
            type: "interview-scheduled",
            title: "Interview Scheduled",
            description:
                `${interviewDetails.type} interview scheduled for ${interviewDetails.date.toLocaleDateString()}`,
            timestamp: new Date(),
            metadata: interviewDetails,
        });

        // Set next action
        application.nextAction = {
            type: "interview-prep",
            dueDate: new Date(
                interviewDetails.date.getTime() - 24 * 60 * 60 * 1000,
            ), // 1 day before
            description: `Prepare for ${interviewDetails.type} interview`,
        };

        return application;
    }

    /**
     * Get applications with filtering and pagination
     */
    getApplications(
        userId: string,
        filters: ApplicationFilters = {},
        page: number = 1,
        limit: number = 20,
    ): {
        applications: JobApplication[];
        total: number;
        page: number;
        totalPages: number;
    } {
        let filteredApplications = this.applications.filter((app) =>
            app.userId === userId
        );

        // Apply filters
        if (filters.status && filters.status.length > 0) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.status!.includes(app.status.status)
            );
        }

        if (filters.source && filters.source.length > 0) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.source!.includes(app.source)
            );
        }

        if (filters.dateRange) {
            filteredApplications = filteredApplications.filter((app) =>
                app.appliedAt >= filters.dateRange!.start &&
                app.appliedAt <= filters.dateRange!.end
            );
        }

        if (filters.company && filters.company.length > 0) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.company!.some((company) =>
                    app.job.company?.toLowerCase().includes(
                        company.toLowerCase(),
                    ) ||
                    app.job.org?.toLowerCase().includes(company.toLowerCase())
                )
            );
        }

        if (filters.jobTitle && filters.jobTitle.length > 0) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.jobTitle!.some((title) =>
                    app.job.title.toLowerCase().includes(title.toLowerCase())
                )
            );
        }

        if (filters.hasInterview !== undefined) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.hasInterview
                    ? app.interviewCount > 0
                    : app.interviewCount === 0
            );
        }

        if (filters.hasOffer !== undefined) {
            filteredApplications = filteredApplications.filter((app) =>
                filters.hasOffer
                    ? app.status.status === "offer-received"
                    : app.status.status !== "offer-received"
            );
        }

        // Sort by last activity (most recent first)
        filteredApplications.sort((a, b) =>
            b.lastActivityAt.getTime() - a.lastActivityAt.getTime()
        );

        // Pagination
        const total = filteredApplications.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedApplications = filteredApplications.slice(
            startIndex,
            endIndex,
        );

        return {
            applications: paginatedApplications,
            total,
            page,
            totalPages,
        };
    }

    /**
     * Get application statistics
     */
    getApplicationStats(userId: string): ApplicationStats {
        const userApplications = this.applications.filter((app) =>
            app.userId === userId
        );

        if (userApplications.length === 0) {
            return {
                totalApplications: 0,
                byStatus: {},
                bySource: {},
                byMonth: {},
                averageResponseTime: 0,
                interviewRate: 0,
                offerRate: 0,
                rejectionRate: 0,
                topCompanies: [],
                topJobTitles: [],
                successRate: 0,
            };
        }

        // Status breakdown
        const byStatus: Record<string, number> = {};
        userApplications.forEach((app) => {
            byStatus[app.status.status] = (byStatus[app.status.status] || 0) +
                1;
        });

        // Source breakdown
        const bySource: Record<string, number> = {};
        userApplications.forEach((app) => {
            bySource[app.source] = (bySource[app.source] || 0) + 1;
        });

        // Monthly breakdown
        const byMonth: Record<string, number> = {};
        userApplications.forEach((app) => {
            const month = app.appliedAt.toISOString().substring(0, 7); // YYYY-MM
            byMonth[month] = (byMonth[month] || 0) + 1;
        });

        // Response time analysis
        const responseTimes = userApplications
            .filter((app) => app.responseTime !== undefined)
            .map((app) => app.responseTime!);
        const averageResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) /
                responseTimes.length
            : 0;

        // Interview and offer rates
        const applicationsWithInterviews =
            userApplications.filter((app) => app.interviewCount > 0).length;
        const applicationsWithOffers =
            userApplications.filter((app) =>
                app.status.status === "offer-received"
            ).length;
        const rejectedApplications =
            userApplications.filter((app) => app.status.status === "rejected")
                .length;

        const interviewRate =
            (applicationsWithInterviews / userApplications.length) * 100;
        const offerRate = (applicationsWithOffers / userApplications.length) *
            100;
        const rejectionRate = (rejectedApplications / userApplications.length) *
            100;
        const successRate = (applicationsWithOffers / userApplications.length) *
            100;

        // Top companies and job titles
        const companyCounts: Record<string, number> = {};
        const titleCounts: Record<string, number> = {};

        userApplications.forEach((app) => {
            const company = app.job.company || app.job.org || "Unknown";
            companyCounts[company] = (companyCounts[company] || 0) + 1;
            titleCounts[app.job.title] = (titleCounts[app.job.title] || 0) + 1;
        });

        const topCompanies = Object.entries(companyCounts)
            .map(([company, count]) => ({ company, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const topJobTitles = Object.entries(titleCounts)
            .map(([title, count]) => ({ title, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalApplications: userApplications.length,
            byStatus,
            bySource,
            byMonth,
            averageResponseTime,
            interviewRate,
            offerRate,
            rejectionRate,
            topCompanies,
            topJobTitles,
            successRate,
        };
    }

    /**
     * Get applications needing follow-up
     */
    getApplicationsNeedingFollowUp(userId: string): JobApplication[] {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        return this.applications.filter((app) => {
            if (app.userId !== userId) return false;

            // Applications submitted more than a week ago with no recent activity
            if (
                app.status.status === "submitted" &&
                app.lastActivityAt < oneWeekAgo
            ) {
                return true;
            }

            // Applications under review for more than two weeks
            if (
                app.status.status === "under-review" &&
                app.lastActivityAt < twoWeeksAgo
            ) {
                return true;
            }

            // Applications with upcoming actions
            if (app.nextAction && app.nextAction.dueDate <= now) {
                return true;
            }

            return false;
        });
    }

    /**
     * Add an event to an application
     */
    private addEvent(
        application: JobApplication,
        event: Omit<ApplicationEvent, "id">,
    ): void {
        const newEvent: ApplicationEvent = {
            ...event,
            id: `event-${Date.now()}-${
                Math.random().toString(36).substr(2, 9)
            }`,
        };

        application.events.push(newEvent);
    }

    /**
     * Get application by ID
     */
    getApplication(applicationId: string): JobApplication | null {
        return this.applications.find((app) => app.id === applicationId) ||
            null;
    }

    /**
     * Delete an application
     */
    deleteApplication(applicationId: string): boolean {
        const index = this.applications.findIndex((app) =>
            app.id === applicationId
        );
        if (index === -1) return false;

        this.applications.splice(index, 1);
        return true;
    }

    /**
     * Get all applications (for admin purposes)
     */
    getAllApplications(): JobApplication[] {
        return [...this.applications];
    }
}
