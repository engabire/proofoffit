/**
 * Push Notification System for PWA
 * Handles registration, subscription, and notification management
 */

export interface NotificationPermission {
    granted: boolean;
    denied: boolean;
    default: boolean;
}

export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    data?: any;
    actions?: NotificationAction[];
    requireInteraction?: boolean;
    silent?: boolean;
}

export interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}

class PushNotificationManager {
    private registration: ServiceWorkerRegistration | null = null;
    private subscription: PushSubscription | null = null;
    private isSupported: boolean = false;

    constructor() {
        this.isSupported = this.checkSupport();
        this.initialize();
    }

    private checkSupport(): boolean {
        return (
            "serviceWorker" in navigator &&
            "PushManager" in window &&
            "Notification" in window
        );
    }

    private async initialize(): Promise<void> {
        if (!this.isSupported) {
            console.warn(
                "Push notifications are not supported in this browser",
            );
            return;
        }

        try {
            this.registration = await navigator.serviceWorker.ready;
        } catch (error) {
            console.error("Failed to get service worker registration:", error);
        }
    }

    /**
     * Check current notification permission status
     */
    public getPermissionStatus(): NotificationPermission {
        if (!this.isSupported) {
            return { granted: false, denied: false, default: false };
        }

        const permission = Notification.permission;
        return {
            granted: permission === "granted",
            denied: permission === "denied",
            default: permission === "default",
        };
    }

    /**
     * Request notification permission from user
     */
    public async requestPermission(): Promise<boolean> {
        if (!this.isSupported) {
            throw new Error("Push notifications are not supported");
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        } catch (error) {
            console.error("Failed to request notification permission:", error);
            return false;
        }
    }

    /**
     * Subscribe to push notifications
     */
    public async subscribe(): Promise<PushSubscription | null> {
        if (!this.isSupported || !this.registration) {
            throw new Error(
                "Push notifications are not supported or service worker not ready",
            );
        }

        try {
            // Check if already subscribed
            const existingSubscription = await this.registration.pushManager
                .getSubscription();
            if (existingSubscription) {
                this.subscription = existingSubscription as any;
                return existingSubscription as any;
            }

            // Create new subscription
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
                ) as any,
            });

            this.subscription = subscription as any;

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription as any);

            return subscription as any;
        } catch (error) {
            console.error("Failed to subscribe to push notifications:", error);
            return null;
        }
    }

    /**
     * Unsubscribe from push notifications
     */
    public async unsubscribe(): Promise<boolean> {
        if (!this.subscription) {
            return true;
        }

        try {
            const result = await (this.subscription as any).unsubscribe();
            if (result) {
                this.subscription = null;
                await this.removeSubscriptionFromServer();
            }
            return result;
        } catch (error) {
            console.error(
                "Failed to unsubscribe from push notifications:",
                error,
            );
            return false;
        }
    }

    /**
     * Send a local notification
     */
    public async showNotification(payload: NotificationPayload): Promise<void> {
        if (!this.isSupported || !this.registration) {
            throw new Error("Notifications are not supported");
        }

        const permission = this.getPermissionStatus();
        if (!permission.granted) {
            throw new Error("Notification permission not granted");
        }

        try {
            await this.registration.showNotification(payload.title, {
                body: payload.body,
                icon: payload.icon || "/icons/icon-192x192.png",
                badge: payload.badge || "/icons/icon-72x72.png",
                tag: payload.tag,
                data: payload.data,
                requireInteraction: payload.requireInteraction,
                silent: payload.silent,
            });
        } catch (error) {
            console.error("Failed to show notification:", error);
            throw error;
        }
    }

    /**
     * Get current subscription
     */
    public getSubscription(): PushSubscription | null {
        return this.subscription;
    }

    /**
     * Check if user is subscribed
     */
    public isSubscribed(): boolean {
        return this.subscription !== null;
    }

    /**
     * Send subscription to server
     */
    private async sendSubscriptionToServer(
        subscription: PushSubscription,
    ): Promise<void> {
        try {
            await fetch("/api/notifications/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subscription: subscription,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch (error) {
            console.error("Failed to send subscription to server:", error);
        }
    }

    /**
     * Remove subscription from server
     */
    private async removeSubscriptionFromServer(): Promise<void> {
        try {
            await fetch("/api/notifications/unsubscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endpoint: this.subscription?.endpoint,
                }),
            });
        } catch (error) {
            console.error("Failed to remove subscription from server:", error);
        }
    }

    /**
     * Convert VAPID key to Uint8Array
     */
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Setup notification click handlers
     */
    public setupClickHandlers(): void {
        if (!this.registration) return;

        // Handle notification clicks
        this.registration.addEventListener("notificationclick", (event: any) => {
            event.notification.close();

            const data = event.notification.data;
            const action = event.action;

            if (action === "open") {
                // Open the app
                event.waitUntil(
                    (self as any).clients.openWindow(data?.url || "/"),
                );
            } else if (action === "dismiss") {
                // Just close the notification
                return;
            } else {
                // Default action - open the app
                event.waitUntil(
                    (self as any).clients.openWindow(data?.url || "/"),
                );
            }
        });

        // Handle notification close
        this.registration.addEventListener("notificationclose", (event: any) => {
            console.log("Notification closed:", event.notification.tag);
        });
    }
}

// Create singleton instance
export const pushNotificationManager = new PushNotificationManager();

// Export convenience functions
export const requestNotificationPermission = () =>
    pushNotificationManager.requestPermission();
export const subscribeToNotifications = () =>
    pushNotificationManager.subscribe();
export const unsubscribeFromNotifications = () =>
    pushNotificationManager.unsubscribe();
export const showNotification = (payload: NotificationPayload) =>
    pushNotificationManager.showNotification(payload);
export const getNotificationPermission = () =>
    pushNotificationManager.getPermissionStatus();
export const isNotificationSubscribed = () =>
    pushNotificationManager.isSubscribed();
