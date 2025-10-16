"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Mail,
  Send,
  Settings,
  Users,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: "daily" | "weekly" | "monthly" | "alert";
  enabled: boolean;
  recipients: string[];
  lastSent?: Date;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  dailyDigest: boolean;
  weeklyReport: boolean;
  alertNotifications: boolean;
  monthlySummary: boolean;
}

export function EmailNotifications() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [settings, setSettings] = useState<EmailSettings>({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "Agile Cockpit",
    dailyDigest: true,
    weeklyReport: true,
    alertNotifications: true,
    monthlySummary: false,
  });
  const [activeTab, setActiveTab] = useState<
    "templates" | "settings" | "history"
  >("templates");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmailTemplates();
  }, []);

  const loadEmailTemplates = async () => {
    // Mock email templates
    const mockTemplates: EmailTemplate[] = [
      {
        id: "1",
        name: "Daily Sprint Update",
        subject: "Daily Sprint Update - {date}",
        content: `Hi Team,

Here's your daily sprint update:

**Sprint Progress:**
• Completed: {completed_items} items
• In Progress: {in_progress_items} items
• Remaining: {remaining_items} items
• Velocity: {velocity} points

**Today's Focus:**
{priority_items}

**Blockers:**
{blockers}

**Team Performance:**
• Cycle Time: {cycle_time} days
• WIP: {wip_count}/{wip_limit}
• Quality Score: {quality_score}%

Keep up the great work!

Best regards,
Agile Cockpit`,
        type: "daily",
        enabled: true,
        recipients: ["team@company.com"],
        lastSent: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        name: "Weekly Sprint Report",
        subject: "Weekly Sprint Report - Week of {week_start}",
        content: `Hi Team,

Here's your weekly sprint report:

**Sprint Summary:**
• Sprint Goal: {sprint_goal}
• Completed: {completed_stories} stories ({completed_points} points)
• Velocity: {velocity} points (Target: {target_velocity})
• Success Rate: {success_rate}%

**Key Achievements:**
{achievements}

**Areas for Improvement:**
{improvements}

**Next Sprint Preview:**
{next_sprint_preview}

**Team Metrics:**
• Average Cycle Time: {avg_cycle_time} days
• WIP Efficiency: {wip_efficiency}%
• Quality Score: {quality_score}%

Great work this week!

Best regards,
Agile Cockpit`,
        type: "weekly",
        enabled: true,
        recipients: ["team@company.com", "manager@company.com"],
        lastSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        name: "Alert Notification",
        subject: "🚨 Agile Cockpit Alert: {alert_type}",
        content: `Hi Team,

This is an automated alert from Agile Cockpit:

**Alert Type:** {alert_type}
**Severity:** {severity}
**Time:** {timestamp}

**Details:**
{alert_details}

**Recommended Actions:**
{recommended_actions}

**View Dashboard:** {dashboard_url}

Please take appropriate action.

Best regards,
Agile Cockpit`,
        type: "alert",
        enabled: true,
        recipients: ["team@company.com", "manager@company.com"],
      },
      {
        id: "4",
        name: "Monthly Summary",
        subject: "Monthly Agile Summary - {month} {year}",
        content: `Hi Team,

Here's your monthly agile summary:

**Monthly Overview:**
• Total Stories Completed: {total_stories}
• Average Velocity: {avg_velocity} points
• Team Satisfaction: {team_satisfaction}/10
• Quality Score: {quality_score}%

**Key Metrics:**
• Cycle Time Trend: {cycle_time_trend}
• WIP Efficiency: {wip_efficiency}%
• Sprint Success Rate: {sprint_success_rate}%

**Achievements:**
{monthly_achievements}

**Goals for Next Month:**
{next_month_goals}

**Team Performance:**
{team_performance_summary}

Keep up the excellent work!

Best regards,
Agile Cockpit`,
        type: "monthly",
        enabled: false,
        recipients: [
          "team@company.com",
          "manager@company.com",
          "executives@company.com",
        ],
      },
    ];

    setTemplates(mockTemplates);
  };

  const sendTestEmail = async (templateId: string) => {
    setLoading(true);
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update last sent time
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === templateId
            ? { ...template, lastSent: new Date() }
            : template
        )
      );

      alert("Test email sent successfully!");
    } catch (error) {
      alert("Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, enabled: !template.enabled }
          : template
      )
    );
  };

  const renderTemplates = () => (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <Badge variant={template.enabled ? "default" : "secondary"}>
                    {template.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge variant="outline">
                    {template.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <div className="text-sm text-gray-500">
                  Recipients: {template.recipients.join(", ")}
                </div>
                {template.lastSent && (
                  <div className="text-xs text-gray-500 mt-1">
                    Last sent: {template.lastSent.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTemplate(template.id)}
                >
                  {template.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail(template.id)}
                  disabled={loading}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Test
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {template.content.substring(0, 200)}...
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    smtpHost: e.target.value,
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    smtpPort: parseInt(e.target.value),
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    smtpUser: e.target.value,
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    smtpPassword: e.target.value,
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="App password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                From Email
              </label>
              <input
                type="email"
                value={settings.fromEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    fromEmail: e.target.value,
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="noreply@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                From Name
              </label>
              <input
                type="text"
                value={settings.fromName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    fromName: e.target.value,
                  }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button>
              <CheckCircle className="w-4 h-4 mr-2" />
              Test SMTP Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.dailyDigest}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    dailyDigest: e.target.checked,
                  }))}
                className="rounded border-gray-300"
              />
              <span>Daily Sprint Digest</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    weeklyReport: e.target.checked,
                  }))}
                className="rounded border-gray-300"
              />
              <span>Weekly Sprint Report</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.alertNotifications}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    alertNotifications: e.target.checked,
                  }))}
                className="rounded border-gray-300"
              />
              <span>Alert Notifications</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.monthlySummary}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    monthlySummary: e.target.checked,
                  }))}
                className="rounded border-gray-300"
              />
              <span>Monthly Summary</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                template: "Daily Sprint Update",
                sent: "2 hours ago",
                status: "delivered",
                recipients: 5,
              },
              {
                template: "Weekly Sprint Report",
                sent: "1 day ago",
                status: "delivered",
                recipients: 8,
              },
              {
                template: "Alert Notification",
                sent: "3 days ago",
                status: "delivered",
                recipients: 3,
              },
              {
                template: "Daily Sprint Update",
                sent: "4 days ago",
                status: "failed",
                recipients: 0,
              },
            ].map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-sm">{email.template}</div>
                    <div className="text-xs text-gray-500">
                      Sent {email.sent} • {email.recipients} recipients
                    </div>
                  </div>
                </div>
                <Badge
                  variant={email.status === "delivered"
                    ? "default"
                    : "destructive"}
                >
                  {email.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Notifications</h2>
          <p className="text-gray-600">
            Configure email templates and SMTP settings
          </p>
        </div>
        <Button>
          <Mail className="w-4 h-4 mr-2" />
          Send Test Email
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          {
            key: "templates",
            label: "Templates",
            icon: <Mail className="w-4 h-4" />,
          },
          {
            key: "settings",
            label: "Settings",
            icon: <Settings className="w-4 h-4" />,
          },
          {
            key: "history",
            label: "History",
            icon: <Clock className="w-4 h-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "templates" && renderTemplates()}
      {activeTab === "settings" && renderSettings()}
      {activeTab === "history" && renderHistory()}

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Configure SMTP Settings</h4>
                <p className="text-sm text-gray-600">
                  Set up your email provider&apos;s SMTP settings (Gmail,
                  Outlook, etc.)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Customize Email Templates</h4>
                <p className="text-sm text-gray-600">
                  Edit the email templates to match your team&apos;s
                  communication style
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Test and Enable</h4>
                <p className="text-sm text-gray-600">
                  Send test emails and enable the notifications you want
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
