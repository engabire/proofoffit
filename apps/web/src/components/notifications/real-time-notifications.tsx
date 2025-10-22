"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle,
    Bell,
    BellOff,
    Briefcase,
    Check,
    CheckCheck,
    Clock,
    Info,
    Settings,
    Star,
    Target,
    Users,
    X,
    Zap,
} from "lucide-react";
import {
    NotificationPreferences,
    RealTimeNotification,
    RealTimeNotificationManager,
} from "@/lib/notifications/real-time-manager";

interface RealTimeNotificationsProps {
    className?: string;
}

export function RealTimeNotifications(
    { className }: RealTimeNotificationsProps,
) {
    const [notifications, setNotifications] = useState<RealTimeNotification[]>(
        [],
    );
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [preferences, setPreferences] = useState<
        NotificationPreferences | null
    >(null);
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    const managerRef = useRef<RealTimeNotificationManager | null>(null);

    useEffect(() => {
        // Initialize notification manager
        managerRef.current = new RealTimeNotificationManager();
        const manager = managerRef.current;

        // Load preferences
        manager.loadPreferences();
        setPreferences(manager.getPreferences());

        // Connect to real-time service
        manager.connect().then(() => {
            setIsConnected(true);
        });

        // Subscribe to notifications
        const unsubscribe = manager.subscribe((notification) => {
            setNotifications(manager.getNotifications());
            setUnreadCount(manager.getUnreadNotifications().length);
        });

        // Initial load
        setNotifications(manager.getNotifications());
        setUnreadCount(manager.getUnreadNotifications().length);

        return () => {
            unsubscribe();
            manager.disconnect();
        };
    }, []);

    const handleMarkAsRead = (notificationId: string) => {
        managerRef.current?.markAsRead(notificationId);
        setNotifications(managerRef.current?.getNotifications() || []);
        setUnreadCount(
            managerRef.current?.getUnreadNotifications().length || 0,
        );
    };

    const handleMarkAllAsRead = () => {
        managerRef.current?.markAllAsRead();
        setNotifications(managerRef.current?.getNotifications() || []);
        setUnreadCount(0);
    };

    const handleDeleteNotification = (notificationId: string) => {
        managerRef.current?.deleteNotification(notificationId);
        setNotifications(managerRef.current?.getNotifications() || []);
        setUnreadCount(
            managerRef.current?.getUnreadNotifications().length || 0,
        );
    };

    const handleClearAll = () => {
        managerRef.current?.clearAllNotifications();
        setNotifications([]);
        setUnreadCount(0);
    };

    const handlePreferenceChange = (key: string, value: any) => {
        if (!preferences) return;

        const newPreferences = { ...preferences };

        if (key.includes(".")) {
            const [parent, child] = key.split(".");
            (newPreferences as any)[parent][child] = value;
        } else {
            (newPreferences as any)[key] = value;
        }

        setPreferences(newPreferences);
        managerRef.current?.updatePreferences(newPreferences);
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "urgent":
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            case "high":
                return <Zap className="h-4 w-4 text-orange-600" />;
            case "medium":
                return <Info className="h-4 w-4 text-blue-600" />;
            case "low":
                return <Clock className="h-4 w-4 text-gray-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "job":
                return <Briefcase className="h-4 w-4 text-blue-600" />;
            case "application":
                return <Target className="h-4 w-4 text-green-600" />;
            case "system":
                return <Settings className="h-4 w-4 text-purple-600" />;
            case "marketing":
                return <Star className="h-4 w-4 text-yellow-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "border-red-200 bg-red-50";
            case "high":
                return "border-orange-200 bg-orange-50";
            case "medium":
                return "border-blue-200 bg-blue-50";
            case "low":
                return "border-gray-200 bg-gray-50";
            default:
                return "border-gray-200 bg-white";
        }
    };

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return !notification.read;
        return notification.category === activeTab;
    });

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Bell className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="error"
                                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                        )}
                    </div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <div className="flex items-center space-x-1">
                        <div
                            className={`w-2 h-2 rounded-full ${
                                isConnected ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                        </div>
                        <span className="text-xs text-gray-500">
                            {isConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="h-4 w-4" />
                        </Button>
                    )}

                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && preferences && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">
                            Notification Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">
                                    In-App Notifications
                                </label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={preferences.inApp}
                                        onChange={(e) =>
                                            handlePreferenceChange(
                                                "inApp",
                                                e.target.checked,
                                            )}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Show notifications in app
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Push Notifications
                                </label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={preferences.push}
                                        onChange={(e) =>
                                            handlePreferenceChange(
                                                "push",
                                                e.target.checked,
                                            )}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Browser push notifications
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Categories
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {Object.entries(preferences.categories).map((
                                    [category, enabled],
                                ) => (
                                    <div
                                        key={category}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={enabled}
                                            onChange={(e) =>
                                                handlePreferenceChange(
                                                    `categories.${category}`,
                                                    e.target.checked,
                                                )}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-600 capitalize">
                                            {category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="job">Jobs</TabsTrigger>
                    <TabsTrigger value="application">Applications</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-2">
                    {filteredNotifications.length === 0
                        ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No notifications
                                    </h3>
                                    <p className="text-gray-600">
                                        {activeTab === "unread"
                                            ? "You're all caught up! No unread notifications."
                                            : "No notifications to show."}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                        : (
                            filteredNotifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`transition-all duration-200 hover:shadow-md ${
                                        !notification.read
                                            ? "border-l-4 border-l-blue-500"
                                            : ""
                                    } ${
                                        getPriorityColor(notification.priority)
                                    }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    {getPriorityIcon(
                                                        notification.priority,
                                                    )}
                                                    {getCategoryIcon(
                                                        notification.category,
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="font-medium text-gray-900 truncate">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0">
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {notification.message}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                        <span>
                                                            {formatTimeAgo(
                                                                notification
                                                                    .timestamp,
                                                            )}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {notification
                                                                .priority}
                                                        </Badge>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {notification
                                                                .category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-1 ml-4">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification.id,
                                                            )}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {notification.actions &&
                                                    notification.actions
                                                            .length > 0 &&
                                                    (
                                                        <div className="flex space-x-1">
                                                            {notification
                                                                .actions.map((
                                                                    action,
                                                                ) => (
                                                                    <Button
                                                                        key={action
                                                                            .id}
                                                                        variant={action
                                                                                .type ===
                                                                                "primary"
                                                                            ? "default"
                                                                            : "outline"}
                                                                        size="sm"
                                                                        onClick={action
                                                                            .action}
                                                                    >
                                                                        {action
                                                                            .label}
                                                                    </Button>
                                                                ))}
                                                        </div>
                                                    )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteNotification(
                                                            notification.id,
                                                        )}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
