"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Alert } from "@proof-of-fit/ui";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface Notification {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high" | "critical";
  category: "wip" | "velocity" | "cycle-time" | "blocked" | "deadline" | "team";
  actionable: boolean;
  actionUrl?: string;
  actionText?: string;
  dismissed?: boolean;
}

interface NotificationSettings {
  wipAlerts: boolean;
  velocityAlerts: boolean;
  cycleTimeAlerts: boolean;
  blockedItemAlerts: boolean;
  deadlineAlerts: boolean;
  teamAlerts: boolean;
  emailNotifications: boolean;
  slackNotifications: boolean;
  frequency: "immediate" | "hourly" | "daily";
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    wipAlerts: true,
    velocityAlerts: true,
    cycleTimeAlerts: true,
    blockedItemAlerts: true,
    deadlineAlerts: true,
    teamAlerts: true,
    emailNotifications: false,
    slackNotifications: false,
    frequency: "immediate",
  });
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "critical" | "wip" | "velocity" | "blocked"
  >("all");

  const generateSmartNotifications = useCallback(() => {
    const newNotifications: Notification[] = [];

    // WIP Limit Alerts
    if (settings.wipAlerts) {
      const wipCount = 8; // Mock current WIP
      const wipLimit = 6;
      if (wipCount > wipLimit) {
        newNotifications.push({
          id: `wip-${Date.now()}`,
          type: "warning",
          title: "WIP Limit Exceeded",
          message:
            `Current WIP (${wipCount}) exceeds limit (${wipLimit}). Consider finishing items before starting new ones.`,
          timestamp: new Date(),
          priority: "high",
          category: "wip",
          actionable: true,
          actionUrl: "/agile-cockpit",
          actionText: "Review WIP",
        });
      }
    }

    // Velocity Alerts
    if (settings.velocityAlerts) {
      const currentVelocity = 8;
      const targetVelocity = 10;
      const velocityTrend = "declining"; // Mock trend

      if (velocityTrend === "declining" && currentVelocity < targetVelocity) {
        newNotifications.push({
          id: `velocity-${Date.now()}`,
          type: "warning",
          title: "Velocity Declining",
          message:
            `Team velocity (${currentVelocity}) is below target (${targetVelocity}) and declining. Review sprint planning.`,
          timestamp: new Date(),
          priority: "medium",
          category: "velocity",
          actionable: true,
          actionUrl: "/agile-cockpit/velocity",
          actionText: "Analyze Velocity",
        });
      }
    }

    // Cycle Time Alerts
    if (settings.cycleTimeAlerts) {
      const avgCycleTime = 3.2;
      const targetCycleTime = 2.0;

      if (avgCycleTime > targetCycleTime * 1.5) {
        newNotifications.push({
          id: `cycle-time-${Date.now()}`,
          type: "error",
          title: "Cycle Time Too High",
          message:
            `Average cycle time (${avgCycleTime} days) is significantly above target (${targetCycleTime} days).`,
          timestamp: new Date(),
          priority: "high",
          category: "cycle-time",
          actionable: true,
          actionUrl: "/agile-cockpit/cycle-time",
          actionText: "Review Process",
        });
      }
    }

    // Blocked Items Alerts
    if (settings.blockedItemAlerts) {
      const blockedCount = 2;
      if (blockedCount > 0) {
        newNotifications.push({
          id: `blocked-${Date.now()}`,
          type: "warning",
          title: "Blocked Items Detected",
          message:
            `${blockedCount} items have been blocked for more than 24 hours. Immediate attention required.`,
          timestamp: new Date(),
          priority: "critical",
          category: "blocked",
          actionable: true,
          actionUrl: "/agile-cockpit/blocked",
          actionText: "Resolve Blockers",
        });
      }
    }

    // Deadline Alerts
    if (settings.deadlineAlerts) {
      const daysToSprintEnd = 2;
      const incompleteItems = 5;

      if (daysToSprintEnd <= 2 && incompleteItems > 0) {
        newNotifications.push({
          id: `deadline-${Date.now()}`,
          type: "warning",
          title: "Sprint Ending Soon",
          message:
            `${daysToSprintEnd} days left in sprint with ${incompleteItems} incomplete items.`,
          timestamp: new Date(),
          priority: "high",
          category: "deadline",
          actionable: true,
          actionUrl: "/agile-cockpit/sprint",
          actionText: "Review Sprint",
        });
      }
    }

    // Team Performance Alerts
    if (settings.teamAlerts) {
      const teamLoad = 85; // Percentage
      if (teamLoad > 80) {
        newNotifications.push({
          id: `team-load-${Date.now()}`,
          type: "info",
          title: "High Team Load",
          message:
            `Team utilization is at ${teamLoad}%. Consider redistributing work or adjusting sprint scope.`,
          timestamp: new Date(),
          priority: "medium",
          category: "team",
          actionable: true,
          actionUrl: "/agile-cockpit/team",
          actionText: "Review Load",
        });
      }
    }

    // Add positive notifications
    newNotifications.push({
      id: `success-${Date.now()}`,
      type: "success",
      title: "Sprint Goal Achieved",
      message:
        "Great job! The team has successfully completed the sprint goal with 2 days to spare.",
      timestamp: new Date(),
      priority: "low",
      category: "velocity",
      actionable: false,
    });

    setNotifications((prev) => [...newNotifications, ...prev].slice(0, 50)); // Keep last 50 notifications
  }, [settings]);

  useEffect(() => {
    generateSmartNotifications();
    const interval = setInterval(generateSmartNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [generateSmartNotifications]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, dismissed: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (notification.dismissed) return false;

    switch (activeFilter) {
      case "unread":
        return !notification.dismissed;
      case "critical":
        return notification.priority === "critical";
      case "wip":
        return notification.category === "wip";
      case "velocity":
        return notification.category === "velocity";
      case "blocked":
        return notification.category === "blocked";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.dismissed).length;
  const criticalCount =
    notifications.filter((n) => n.priority === "critical" && !n.dismissed)
      .length;

  return (
    <div className="space-y-6">
      {/* Notification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm text-gray-600">
                  Unread Notifications
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{criticalCount}</div>
                <div className="text-sm text-gray-600">Critical Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "critical", label: "Critical" },
          { key: "wip", label: "WIP" },
          { key: "velocity", label: "Velocity" },
          { key: "blocked", label: "Blocked" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeFilter === filter.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0
          ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          )
          : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-l-4 ${
                  notification.priority === "critical"
                    ? "border-l-red-500"
                    : notification.priority === "high"
                    ? "border-l-orange-500"
                    : notification.priority === "medium"
                    ? "border-l-yellow-500"
                    : "border-l-blue-500"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <Badge
                            className={getPriorityColor(notification.priority)}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                          </span>
                          <span className="capitalize">
                            {notification.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {notification.actionable && (
                        <Button size="sm" variant="outline">
                          {notification.actionText || "View"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Alert Types</h4>
              {[
                { key: "wipAlerts", label: "WIP Limit Alerts" },
                { key: "velocityAlerts", label: "Velocity Alerts" },
                { key: "cycleTimeAlerts", label: "Cycle Time Alerts" },
                { key: "blockedItemAlerts", label: "Blocked Item Alerts" },
                { key: "deadlineAlerts", label: "Deadline Alerts" },
                { key: "teamAlerts", label: "Team Performance Alerts" },
              ].map((setting) => (
                <label
                  key={setting.key}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={settings[
                      setting.key as keyof NotificationSettings
                    ] as boolean}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        [setting.key]: e.target.checked,
                      }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{setting.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Delivery Methods</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings((prev) => ({
                    ...prev,
                    emailNotifications: e.target.checked,
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Email Notifications</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.slackNotifications}
                  onChange={(e) => setSettings((prev) => ({
                    ...prev,
                    slackNotifications: e.target.checked,
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Slack Notifications</span>
              </label>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings((prev) => ({
                    ...prev,
                    frequency: e.target.value as any,
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
