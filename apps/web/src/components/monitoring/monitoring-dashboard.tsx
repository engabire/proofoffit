"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@proof-of-fit/ui";
import { 
  Activity, 
  Smartphone, 
  BarChart3, 
  TestTube,
  Monitor,
  Bell,
  Settings,
  RefreshCw
} from "lucide-react";
import { PerformanceAlerts } from "./performance-alerts";
import { PWATestingDashboard } from "../pwa/pwa-testing-dashboard";
import { AnalyticsReviewDashboard } from "../analytics/analytics-review-dashboard";
import { TestSuiteDashboard } from "../testing/test-suite-dashboard";

interface MonitoringDashboardProps {
  onAlertClick?: (alert: any) => void;
  onTestComplete?: (results: any[]) => void;
}

export function MonitoringDashboard({ onAlertClick, onTestComplete }: MonitoringDashboardProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshAll = () => {
    setLastRefresh(new Date());
    // Trigger refresh of all components
    window.dispatchEvent(new CustomEvent('refresh-monitoring'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              Monitoring & Testing Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
              <button
                onClick={refreshAll}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Refresh all data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Monitor application performance, test PWA features, review analytics, and run comprehensive tests.
          </p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            PWA Testing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testing
          </TabsTrigger>
        </TabsList>

        {/* Performance Monitoring Tab */}
        <TabsContent value="performance" className="space-y-4">
          <PerformanceAlerts onAlertClick={onAlertClick} />
        </TabsContent>

        {/* PWA Testing Tab */}
        <TabsContent value="pwa" className="space-y-4">
          <PWATestingDashboard />
        </TabsContent>

        {/* Analytics Review Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsReviewDashboard onInsightClick={onAlertClick} />
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <TestSuiteDashboard onTestComplete={onTestComplete} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab("performance")}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Activity className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-medium">Check Performance</h3>
              <p className="text-sm text-gray-600">Monitor Core Web Vitals</p>
            </button>
            
            <button
              onClick={() => setActiveTab("pwa")}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Smartphone className="h-6 w-6 text-green-500 mb-2" />
              <h3 className="font-medium">Test PWA Features</h3>
              <p className="text-sm text-gray-600">Verify offline functionality</p>
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <BarChart3 className="h-6 w-6 text-purple-500 mb-2" />
              <h3 className="font-medium">Review Analytics</h3>
              <p className="text-sm text-gray-600">Check user behavior data</p>
            </button>
            
            <button
              onClick={() => setActiveTab("testing")}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <TestTube className="h-6 w-6 text-orange-500 mb-2" />
              <h3 className="font-medium">Run Tests</h3>
              <p className="text-sm text-gray-600">Execute test suite</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
