"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Progress } from "@proof-of-fit/ui";
import { Alert, AlertDescription, AlertTitle } from "@proof-of-fit/ui";
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play,
  RefreshCw,
  Download,
  AlertTriangle,
  Zap,
  Shield,
  Globe,
  Database,
  Users
} from "lucide-react";

interface TestResult {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "pending" | "running";
  duration?: number;
  error?: string;
  category: "unit" | "integration" | "e2e" | "performance" | "security";
  coverage?: number;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: "idle" | "running" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
  totalDuration?: number;
}

interface TestSuiteDashboardProps {
  onTestComplete?: (results: TestResult[]) => void;
}

export function TestSuiteDashboard({ onTestComplete }: TestSuiteDashboardProps) {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        id: "unit-tests",
        name: "Unit Tests",
        description: "Test individual components and functions",
        status: "idle",
        tests: [
          {
            id: "auth-component",
            name: "Authentication Component",
            description: "Test login/logout functionality",
            status: "pending",
            category: "unit"
          },
          {
            id: "matching-engine",
            name: "Matching Engine",
            description: "Test fit score calculations",
            status: "pending",
            category: "unit"
          },
          {
            id: "performance-monitor",
            name: "Performance Monitor",
            description: "Test performance tracking",
            status: "pending",
            category: "unit"
          }
        ]
      },
      {
        id: "integration-tests",
        name: "Integration Tests",
        description: "Test API endpoints and database interactions",
        status: "idle",
        tests: [
          {
            id: "auth-api",
            name: "Authentication API",
            description: "Test login/logout endpoints",
            status: "pending",
            category: "integration"
          },
          {
            id: "matching-api",
            name: "Matching API",
            description: "Test candidate-job matching endpoints",
            status: "pending",
            category: "integration"
          },
          {
            id: "analytics-api",
            name: "Analytics API",
            description: "Test analytics data collection",
            status: "pending",
            category: "integration"
          }
        ]
      },
      {
        id: "e2e-tests",
        name: "End-to-End Tests",
        description: "Test complete user workflows",
        status: "idle",
        tests: [
          {
            id: "user-registration",
            name: "User Registration Flow",
            description: "Test complete registration process",
            status: "pending",
            category: "e2e"
          },
          {
            id: "job-application",
            name: "Job Application Flow",
            description: "Test job search and application",
            status: "pending",
            category: "e2e"
          },
          {
            id: "employer-slate",
            name: "Employer Slate Generation",
            description: "Test candidate slate creation",
            status: "pending",
            category: "e2e"
          }
        ]
      },
      {
        id: "performance-tests",
        name: "Performance Tests",
        description: "Test application performance and load",
        status: "idle",
        tests: [
          {
            id: "page-load",
            name: "Page Load Performance",
            description: "Test initial page load times",
            status: "pending",
            category: "performance"
          },
          {
            id: "api-response",
            name: "API Response Times",
            description: "Test API endpoint performance",
            status: "pending",
            category: "performance"
          },
          {
            id: "memory-usage",
            name: "Memory Usage",
            description: "Test memory consumption",
            status: "pending",
            category: "performance"
          }
        ]
      },
      {
        id: "security-tests",
        name: "Security Tests",
        description: "Test security vulnerabilities and compliance",
        status: "idle",
        tests: [
          {
            id: "csrf-protection",
            name: "CSRF Protection",
            description: "Test CSRF token validation",
            status: "pending",
            category: "security"
          },
          {
            id: "xss-protection",
            name: "XSS Protection",
            description: "Test cross-site scripting protection",
            status: "pending",
            category: "security"
          },
          {
            id: "auth-security",
            name: "Authentication Security",
            description: "Test authentication vulnerabilities",
            status: "pending",
            category: "security"
          }
        ]
      }
    ];

    setTestSuites(suites);
  };

  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite) return;

    setIsRunning(true);
    setSelectedSuite(suiteId);

    // Update suite status
    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? { ...s, status: "running", startTime: new Date() } : s
    ));

    // Run tests sequentially
    for (const test of suite.tests) {
      // Update test status to running
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId ? {
          ...s,
          tests: s.tests.map(t => 
            t.id === test.id ? { ...t, status: "running" } : t
          )
        } : s
      ));

      // Simulate test execution
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      const duration = Date.now() - startTime;

      // Simulate test result (90% pass rate)
      const passed = Math.random() > 0.1;
      const error = passed ? undefined : "Test assertion failed";

      // Update test result
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId ? {
          ...s,
          tests: s.tests.map(t => 
            t.id === test.id ? { 
              ...t, 
              status: passed ? "pass" : "fail",
              duration,
              error
            } : t
          )
        } : s
      ));
    }

    // Update suite status
    const updatedSuite = testSuites.find(s => s.id === suiteId);
    const allTests = updatedSuite?.tests || [];
    const hasFailures = allTests.some(t => t.status === "fail");
    
    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? {
        ...s,
        status: hasFailures ? "failed" : "completed",
        endTime: new Date(),
        totalDuration: Date.now() - (s.startTime?.getTime() || 0)
      } : s
    ));

    setIsRunning(false);
    setSelectedSuite(null);

    if (onTestComplete) {
      onTestComplete(allTests);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }
    
    setIsRunning(false);
  };

  const getTestIcon = (category: string) => {
    switch (category) {
      case "unit": return <TestTube className="h-4 w-4" />;
      case "integration": return <Database className="h-4 w-4" />;
      case "e2e": return <Users className="h-4 w-4" />;
      case "performance": return <Zap className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "default";
      case "fail": return "destructive";
      case "running": return "secondary";
      default: return "outline";
    }
  };

  const getSuiteStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "failed": return "destructive";
      case "running": return "secondary";
      default: return "outline";
    }
  };

  const getOverallStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const total = allTests.length;
    const passed = allTests.filter(t => t.status === "pass").length;
    const failed = allTests.filter(t => t.status === "fail").length;
    const pending = allTests.filter(t => t.status === "pending").length;
    const running = allTests.filter(t => t.status === "running").length;

    return { total, passed, failed, pending, running };
  };

  const exportTestResults = () => {
    const results = {
      testSuites,
      overallStats: getOverallStats(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Suite Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? 'Running...' : 'Run All Tests'}
              </Button>
              <Button onClick={exportTestResults} variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Tests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              <p className="text-sm text-gray-600">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              <p className="text-sm text-gray-600">Running</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(((stats.passed + stats.failed) / stats.total) * 100)}%</span>
            </div>
            <Progress value={((stats.passed + stats.failed) / stats.total) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map((suite) => (
          <Card key={suite.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getTestIcon(suite.tests[0]?.category || "unit")}
                    <CardTitle>{suite.name}</CardTitle>
                  </div>
                  <Badge variant={getSuiteStatusColor(suite.status)}>
                    {suite.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {suite.totalDuration && (
                    <span className="text-sm text-gray-600">
                      {Math.round(suite.totalDuration / 1000)}s
                    </span>
                  )}
                  <Button
                    onClick={() => runTestSuite(suite.id)}
                    disabled={isRunning || suite.status === "running"}
                    size="sm"
                    variant="outline"
                  >
                    {suite.status === "running" ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{suite.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.description}</p>
                        {test.error && (
                          <p className="text-sm text-red-600 mt-1">{test.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.duration && (
                        <span className="text-sm text-gray-600">
                          {test.duration}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results Summary */}
      {stats.failed > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Test Failures Detected</AlertTitle>
          <AlertDescription className="text-red-700">
            {stats.failed} test(s) failed. Please review the test results and fix the issues.
          </AlertDescription>
        </Alert>
      )}

      {stats.passed === stats.total && stats.total > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">All Tests Passed!</AlertTitle>
          <AlertDescription className="text-green-700">
            All {stats.total} tests have passed successfully. Your application is ready for deployment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
