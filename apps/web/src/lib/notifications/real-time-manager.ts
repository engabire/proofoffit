import type {
    Notification,
    NotificationType,
} from "@/lib/notifications/notification-manager";

export interface RealTimeNotification {
    id: string;
    userId: string;
    type: NotificationType;
    data: Notification["data"] & Record<string, any>;
    read: boolean;
    createdAt: Date;
    expiresAt?: Date;
    deliveredAt?: Date;
    clickedAt?: Date;
    title: string;
    message: string;
    timestamp: Date;
    priority: "low" | "medium" | "high" | "urgent";
    category: "job" | "application" | "system" | "marketing";
    actions?: NotificationAction[];
}

export interface NotificationAction {
    id: string;
    label: string;
    type: "primary" | "secondary" | "danger";
    action: () => void;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    inApp: boolean;
    categories: {
        job: boolean;
        application: boolean;
        system: boolean;
        marketing: boolean;
    };
    frequency: "immediate" | "hourly" | "daily" | "weekly";
}

export class RealTimeNotificationManager {
    private notifications: Map<string, RealTimeNotification> = new Map();
    private subscribers: Set<(notification: RealTimeNotification) => void> =
        new Set();
    private preferences: NotificationPreferences;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 1000;

    constructor(preferences?: Partial<NotificationPreferences>) {
        this.preferences = {
            email: true,
            push: true,
            inApp: true,
            categories: {
                job: true,
                application: true,
                system: true,
                marketing: false,
            },
            frequency: "immediate",
            ...preferences,
        };

        this.initializeServiceWorker();
        this.setupEventListeners();
    }

    /**
     * Initialize service worker for push notifications
     */
    private async initializeServiceWorker(): Promise<void> {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            try {
                const registration = await navigator.serviceWorker.register(
                    "/sw.js",
                );
                console.log("Service Worker registered:", registration);

                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    console.log("Notification permission granted");
                }
            } catch (error) {
                console.error("Service Worker registration failed:", error);
            }
        }
    }

    /**
     * Setup event listeners for real-time updates
     */
    private setupEventListeners(): void {
        // Listen for visibility changes to reconnect when tab becomes active
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && !this.isConnected) {
                this.connect();
            }
        });

        // Listen for online/offline events
        window.addEventListener("online", () => {
            this.connect();
        });

        window.addEventListener("offline", () => {
            this.disconnect();
        });
    }

    /**
     * Connect to real-time notification service
     */
    public async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            // Simulate WebSocket connection
            // In a real implementation, this would connect to your WebSocket server
            this.isConnected = true;
            this.reconnectAttempts = 0;

            console.log("Connected to real-time notifications");

            // Start listening for notifications
            this.startNotificationListener();
        } catch (error) {
            console.error("Failed to connect to notification service:", error);
            this.handleReconnect();
        }
    }

    /**
     * Disconnect from real-time notification service
     */
    public disconnect(): void {
        this.isConnected = false;
        console.log("Disconnected from real-time notifications");
    }

    /**
     * Handle reconnection logic
     */
    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("Max reconnection attempts reached");
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay *
            Math.pow(2, this.reconnectAttempts - 1);

        setTimeout(() => {
            console.log(
                `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
            );
            this.connect();
        }, delay);
    }

    /**
     * Start listening for real-time notifications
     */
    private startNotificationListener(): void {
        // Simulate receiving notifications
        // In a real implementation, this would listen to WebSocket messages
        setInterval(() => {
            if (this.isConnected && Math.random() > 0.95) { // 5% chance every interval
                this.simulateNotification();
            }
        }, 10000); // Check every 10 seconds
    }

    /**
     * Simulate receiving a notification (for demo purposes)
     */
    private simulateNotification(): void {
        const notificationTypes: NotificationType[] = [
            {
                type: "job-match",
                priority: "high",
                category: "job",
            },
            {
                type: "application-update",
                priority: "medium",
                category: "application",
            },
            {
                type: "interview-reminder",
                priority: "high",
                category: "application",
            },
            {
                type: "new-job-alert",
                priority: "medium",
                category: "job",
            },
            {
                type: "skill-assessment",
                priority: "low",
                category: "profile",
            },
            {
                type: "profile-completion",
                priority: "low",
                category: "profile",
            },
        ];

        const randomType = notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
        ];
        const notification = this.createNotification(randomType);

        this.addNotification(notification);
    }

    /**
     * Create a notification based on type
     */
    private createNotification(type: NotificationType): RealTimeNotification {
        const baseNotification: Omit<RealTimeNotification, "id" | "timestamp"> =
            {
                userId: "demo-user",
                type,
                data: {
                    title: "",
                    message: "",
                },
                read: false,
                createdAt: new Date(),
                title: "",
                message: "",
                priority: "medium",
                category: "job",
            };

        switch (type.type) {
            case "job-match":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "New Job Match Found!",
                    message:
                        "We found a perfect match for your profile at TechCorp.",
                    priority: "high",
                    category: "job",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "view",
                            label: "View Job",
                            type: "primary",
                            action: () => console.log("View job"),
                        },
                        {
                            id: "dismiss",
                            label: "Dismiss",
                            type: "secondary",
                            action: () => console.log("Dismiss notification"),
                        },
                    ],
                };

            case "application-update":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "Application Status Update",
                    message:
                        "Your application at DataCorp has moved to the next stage.",
                    priority: "medium",
                    category: "application",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "view",
                            label: "View Details",
                            type: "primary",
                            action: () => console.log("View application"),
                        },
                    ],
                };

            case "interview-reminder":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "Interview Reminder",
                    message:
                        "You have an interview with StartupXYZ in 2 hours.",
                    priority: "urgent",
                    category: "application",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "join",
                            label: "Join Interview",
                            type: "primary",
                            action: () => console.log("Join interview"),
                        },
                        {
                            id: "reschedule",
                            label: "Reschedule",
                            type: "secondary",
                            action: () => console.log("Reschedule interview"),
                        },
                    ],
                };

            case "new-job-alert":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "New Job Alert",
                    message:
                        "A new job matching your criteria has been posted.",
                    priority: "medium",
                    category: "job",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "view",
                            label: "View Job",
                            type: "primary",
                            action: () => console.log("View new job"),
                        },
                    ],
                };

            case "skill-assessment":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "Skill Assessment Available",
                    message:
                        "Complete your skill assessment to improve job matches.",
                    priority: "low",
                    category: "system",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "start",
                            label: "Start Assessment",
                            type: "primary",
                            action: () => console.log("Start assessment"),
                        },
                    ],
                };

            case "profile-completion":
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "Complete Your Profile",
                    message:
                        "Add more details to your profile for better job matches.",
                    priority: "low",
                    category: "system",
                    timestamp: new Date(),
                    actions: [
                        {
                            id: "complete",
                            label: "Complete Profile",
                            type: "primary",
                            action: () => console.log("Complete profile"),
                        },
                    ],
                };

            default:
                return {
                    ...baseNotification,
                    id: this.generateId(),
                    title: "New Notification",
                    message: "You have a new notification.",
                    timestamp: new Date(),
                };
        }
    }

    /**
     * Add a notification and notify subscribers
     */
    public addNotification(notification: RealTimeNotification): void {
        // Check if user wants to receive this type of notification
        if (!this.shouldShowNotification(notification)) {
            return;
        }

        this.notifications.set(notification.id, notification);

        // Notify subscribers
        this.subscribers.forEach((callback) => {
            try {
                callback(notification);
            } catch (error) {
                console.error("Error in notification subscriber:", error);
            }
        });

        // Show browser notification if enabled
        if (this.preferences.push && notification.priority !== "low") {
            this.showBrowserNotification(notification);
        }
    }

    /**
     * Check if notification should be shown based on preferences
     */
    private shouldShowNotification(
        notification: RealTimeNotification,
    ): boolean {
        if (!this.preferences.inApp) return false;
        if (!this.preferences.categories[notification.category]) return false;

        return true;
    }

    /**
     * Show browser notification
     */
    private showBrowserNotification(notification: RealTimeNotification): void {
        if (
            !("Notification" in window) || Notification.permission !== "granted"
        ) {
            return;
        }

        const browserNotification = new Notification(notification.title, {
            body: notification.message,
            icon: "/icon-192x192.png",
            badge: "/badge-72x72.png",
            tag: notification.id,
            requireInteraction: notification.priority === "urgent",
        });

        browserNotification.onclick = () => {
            window.focus();
            this.markAsRead(notification.id);
            browserNotification.close();
        };

        // Auto-close after 5 seconds for non-urgent notifications
        if (notification.priority !== "urgent") {
            setTimeout(() => {
                browserNotification.close();
            }, 5000);
        }
    }

    /**
     * Subscribe to real-time notifications
     */
    public subscribe(
        callback: (notification: RealTimeNotification) => void,
    ): () => void {
        this.subscribers.add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }

    /**
     * Get all notifications
     */
    public getNotifications(): RealTimeNotification[] {
        return Array.from(this.notifications.values()).sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        );
    }

    /**
     * Get unread notifications
     */
    public getUnreadNotifications(): RealTimeNotification[] {
        return this.getNotifications().filter((notification) =>
            !notification.read
        );
    }

    /**
     * Mark notification as read
     */
    public markAsRead(notificationId: string): void {
        const notification = this.notifications.get(notificationId);
        if (notification) {
            notification.read = true;
            this.notifications.set(notificationId, notification);
        }
    }

    /**
     * Mark all notifications as read
     */
    public markAllAsRead(): void {
        this.notifications.forEach((notification, id) => {
            notification.read = true;
            this.notifications.set(id, notification);
        });
    }

    /**
     * Delete notification
     */
    public deleteNotification(notificationId: string): void {
        this.notifications.delete(notificationId);
    }

    /**
     * Clear all notifications
     */
    public clearAllNotifications(): void {
        this.notifications.clear();
    }

    /**
     * Update notification preferences
     */
    public updatePreferences(
        preferences: Partial<NotificationPreferences>,
    ): void {
        this.preferences = { ...this.preferences, ...preferences };

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "notificationPreferences",
                JSON.stringify(this.preferences),
            );
        }
    }

    /**
     * Get notification preferences
     */
    public getPreferences(): NotificationPreferences {
        return { ...this.preferences };
    }

    /**
     * Get notification statistics
     */
    public getStats(): {
        total: number;
        unread: number;
        byCategory: Record<string, number>;
        byPriority: Record<string, number>;
    } {
        const notifications = this.getNotifications();
        const unread = notifications.filter((n) => !n.read).length;

        const byCategory = notifications.reduce((acc, n) => {
            acc[n.category] = (acc[n.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byPriority = notifications.reduce((acc, n) => {
            acc[n.priority] = (acc[n.priority] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: notifications.length,
            unread,
            byCategory,
            byPriority,
        };
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `notification_${Date.now()}_${
            Math.random().toString(36).substr(2, 9)
        }`;
    }

    /**
     * Load preferences from localStorage
     */
    public loadPreferences(): void {
        if (typeof window === "undefined") return;

        try {
            const saved = localStorage.getItem("notificationPreferences");
            if (saved) {
                this.preferences = {
                    ...this.preferences,
                    ...JSON.parse(saved),
                };
            }
        } catch (error) {
            console.error("Failed to load notification preferences:", error);
        }
    }

    /**
     * Save preferences to localStorage
     */
    public savePreferences(): void {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(
                "notificationPreferences",
                JSON.stringify(this.preferences),
            );
        } catch (error) {
            console.error("Failed to save notification preferences:", error);
        }
    }
}

// Export singleton instance
export const realTimeNotificationManager = new RealTimeNotificationManager();
