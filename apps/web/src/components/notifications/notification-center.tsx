"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Bell, 
    BellRing, 
    Check, 
    CheckCheck, 
    Trash2, 
    ExternalLink,
    Clock,
    AlertCircle,
    TrendingUp,
    Briefcase,
    User,
    Settings,
    Eye,
    EyeOff
} from "lucide-react";

interface NotificationType {
    type: 'job-match' | 'application-update' | 'interview-reminder' | 'new-job-alert' | 'skill-assessment' | 'profile-completion' | 'system';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'job' | 'application' | 'profile' | 'system';
}

interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    data: {
        title: string;
        message: string;
        actionUrl?: string;
        actionText?: string;
        metadata?: Record<string, any>;
    };
    read: boolean;
    createdAt: Date;
    expiresAt?: Date;
    deliveredAt?: Date;
    clickedAt?: Date;
}

interface NotificationStats {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    recentActivity: number;
}

interface NotificationPreferences {
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
    frequency: 'immediate' | 'daily' | 'weekly';
    quietHours: {
        enabled: boolean;
        start: string;
        end: string;
        timezone: string;
    };
}

interface NotificationCenterProps {
    userId?: string;
    compact?: boolean;
}

export function NotificationCenter({ userId, compact = false }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/notifications?includeStats=true");
            
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();
            setNotifications(data.data.notifications);
            setStats(data.data.stats);
            setPreferences(data.data.preferences);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "mark-read",
                    notificationId,
                }),
            });

            if (response.ok) {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    )
                );
                if (stats) {
                    setStats(prev => prev ? { ...prev, unread: prev.unread - 1 } : null);
                }
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "mark-all-read",
                }),
            });

            if (response.ok) {
                setNotifications(prev => 
                    prev.map(notif => ({ ...notif, read: true }))
                );
                if (stats) {
                    setStats(prev => prev ? { ...prev, unread: 0 } : null);
                }
            }
        } catch (err) {
            console.error("Error marking all notifications as read:", err);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "delete",
                    notificationId,
                }),
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                if (stats) {
                    setStats(prev => prev ? { 
                        ...prev, 
                        total: prev.total - 1,
                        unread: prev.unread - (notifications.find(n => n.id === notificationId)?.read ? 0 : 1)
                    } : null);
                }
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'job-match': return <TrendingUp className="h-4 w-4" />;
            case 'application-update': return <Briefcase className="h-4 w-4" />;
            case 'interview-reminder': return <Clock className="h-4 w-4" />;
            case 'new-job-alert': return <Bell className="h-4 w-4" />;
            case 'skill-assessment': return <User className="h-4 w-4" />;
            case 'profile-completion': return <User className="h-4 w-4" />;
            case 'system': return <Settings className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
        }
    };

    const formatTimeAgo = (date: string | Date) => {
        const now = new Date();
        const past = new Date(date);
        const diffTime = Math.abs(now.getTime() - past.getTime());
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return past.toLocaleDateString();
    };

    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return !notif.read;
        return notif.type.type === activeTab;
    });

    if (compact) {
        return (
            <div className="relative">
                <Button variant="outline" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {stats && stats.unread > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {stats.unread}
                        </Badge>
                    )}
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchNotifications}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BellRing className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    {stats && stats.unread > 0 && (
                        <Badge variant="secondary">{stats.unread} unread</Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {stats && stats.unread > 0 && (
                        <Button size="sm" variant="outline" onClick={markAllAsRead}>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark All Read
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={fetchNotifications}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
                            <div className="text-sm text-gray-600">Unread</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.recentActivity}</div>
                            <div className="text-sm text-gray-600">This Week</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {Object.keys(stats.byType).length}
                            </div>
                            <div className="text-sm text-gray-600">Types</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Notifications Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="job-match">Jobs</TabsTrigger>
                    <TabsTrigger value="application-update">Applications</TabsTrigger>
                    <TabsTrigger value="skill-assessment">Skills</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-8">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No notifications found</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <Card key={notification.id} className={`${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                {getTypeIcon(notification.type.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold">{notification.data.title}</h4>
                                                    <Badge className={getPriorityColor(notification.type.priority)}>
                                                        {notification.type.priority}
                                                    </Badge>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{notification.data.message}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{formatTimeAgo(notification.createdAt)}</span>
                                                    <span className="capitalize">{notification.type.type.replace('-', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {notification.data.actionUrl && (
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={notification.data.actionUrl}>
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        {notification.data.actionText || 'View'}
                                                    </a>
                                                </Button>
                                            )}
                                            {!notification.read && (
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
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
