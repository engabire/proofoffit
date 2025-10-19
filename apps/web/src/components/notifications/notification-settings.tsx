"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Switch } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Alert, AlertDescription, AlertTitle } from "@proof-of-fit/ui";
import { 
  Bell, 
  BellOff, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TestTube,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";
import { 
  pushNotificationManager, 
  requestNotificationPermission, 
  subscribeToNotifications, 
  unsubscribeFromNotifications,
  showNotification,
  getNotificationPermission,
  isNotificationSubscribed,
  type NotificationPayload
} from "@/lib/notifications/push-notifications";

interface NotificationSettingsProps {
  onSettingsChange?: (settings: NotificationSettings) => void;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
}

export function NotificationSettings({ onSettingsChange }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: false,
    emailNotifications: true,
    inAppNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const [permissionStatus, setPermissionStatus] = useState(getNotificationPermission());
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    setIsSubscribed(isNotificationSubscribed());
    pushNotificationManager.setupClickHandlers();
  }, []);

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    try {
      const granted = await requestNotificationPermission();
      setPermissionStatus(getNotificationPermission());
      
      if (granted) {
        await handleSubscribe();
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToNotifications();
      setIsSubscribed(!!subscription);
      if (subscription) {
        setSettings(prev => ({ ...prev, pushNotifications: true }));
        onSettingsChange?.(settings);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromNotifications();
      if (success) {
        setIsSubscribed(false);
        setSettings(prev => ({ ...prev, pushNotifications: false }));
        onSettingsChange?.(settings);
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const payload: NotificationPayload = {
        title: "Test Notification",
        body: "This is a test notification from ProofOfFit",
        icon: "/icons/icon-192x192.png",
        tag: "test-notification",
        data: { url: "/" },
        actions: [
          { action: "open", title: "Open App" },
          { action: "dismiss", title: "Dismiss" }
        ]
      };

      await showNotification(payload);
      setTestResult("success");
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      console.error('Failed to show test notification:', error);
      setTestResult("error");
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const getPermissionStatusBadge = () => {
    if (permissionStatus.granted) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Granted</Badge>;
    } else if (permissionStatus.denied) {
      return <Badge variant="destructive">Denied</Badge>;
    } else {
      return <Badge variant="secondary">Not Requested</Badge>;
    }
  };

  const getSubscriptionStatusBadge = () => {
    if (isSubscribed) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Subscribed</Badge>;
    } else {
      return <Badge variant="outline">Not Subscribed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Push Notification Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Browser Permission</h3>
              <p className="text-sm text-gray-600">Allow notifications in your browser</p>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionStatusBadge()}
              {!permissionStatus.granted && (
                <Button
                  onClick={handlePermissionRequest}
                  disabled={isLoading || permissionStatus.denied}
                  size="sm"
                >
                  {permissionStatus.denied ? "Permission Denied" : "Request Permission"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Subscription Status</h3>
              <p className="text-sm text-gray-600">Receive push notifications from our servers</p>
            </div>
            <div className="flex items-center gap-2">
              {getSubscriptionStatusBadge()}
              {permissionStatus.granted && (
                <Button
                  onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={isLoading}
                  variant={isSubscribed ? "destructive" : "default"}
                  size="sm"
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              )}
            </div>
          </div>

          {permissionStatus.granted && isSubscribed && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Test Notification</h3>
                <p className="text-sm text-gray-600">Send a test notification to verify setup</p>
              </div>
              <Button
                onClick={handleTestNotification}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                Test
              </Button>
            </div>
          )}

          {testResult && (
            <Alert className={testResult === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {testResult === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={testResult === "success" ? "text-green-800" : "text-red-800"}>
                {testResult === "success" ? "Test Successful" : "Test Failed"}
              </AlertTitle>
              <AlertDescription className={testResult === "success" ? "text-green-700" : "text-red-700"}>
                {testResult === "success" 
                  ? "Test notification sent successfully!" 
                  : "Failed to send test notification. Please check your settings."
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              disabled={!permissionStatus.granted || !isSubscribed}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <h3 className="font-medium">In-App Notifications</h3>
                <p className="text-sm text-gray-600">Show notifications within the app</p>
              </div>
            </div>
            <Switch
              checked={settings.inAppNotifications}
              onCheckedChange={(checked) => handleSettingChange('inAppNotifications', checked)}
            />
          </div>

          {/* Job Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-orange-500" />
              <div>
                <h3 className="font-medium">Job Alerts</h3>
                <p className="text-sm text-gray-600">Get notified about new job matches</p>
              </div>
            </div>
            <Switch
              checked={settings.jobAlerts}
              onCheckedChange={(checked) => handleSettingChange('jobAlerts', checked)}
            />
          </div>

          {/* Application Updates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Application Updates</h3>
                <p className="text-sm text-gray-600">Get notified about application status changes</p>
              </div>
            </div>
            <Switch
              checked={settings.applicationUpdates}
              onCheckedChange={(checked) => handleSettingChange('applicationUpdates', checked)}
            />
          </div>

          {/* System Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium">System Alerts</h3>
                <p className="text-sm text-gray-600">Receive important system notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.systemAlerts}
              onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Marketing Emails</h3>
                <p className="text-sm text-gray-600">Receive promotional content and updates</p>
              </div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Push Notifications:</strong> Receive real-time notifications even when the app is closed.</p>
            <p><strong>Email Notifications:</strong> Get important updates delivered to your email inbox.</p>
            <p><strong>In-App Notifications:</strong> See notifications while using the application.</p>
            <p><strong>Job Alerts:</strong> Get notified when new jobs match your criteria.</p>
            <p><strong>Application Updates:</strong> Stay informed about your job application status.</p>
            <p><strong>System Alerts:</strong> Receive important system notifications and security alerts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
