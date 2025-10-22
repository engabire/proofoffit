"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileText,
  Globe,
  Key,
  Lock,
  Network,
  RefreshCw,
  Shield,
  User,
  XCircle,
} from "lucide-react";

interface SecurityAuditProps {
  // No props needed for now
}

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "warning";
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  details: string;
  recommendation?: string;
}

export function SecurityAudit({}: SecurityAuditProps) {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const runSecurityAudit = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate running security checks
        // In a real app, this would call actual security validation functions
        const checks = await performSecurityChecks();
        setSecurityChecks(checks);

        // Calculate overall score
        const totalChecks = checks.length;
        const passedChecks = checks.filter((check) =>
          check.status === "pass"
        ).length;
        const score = Math.round((passedChecks / totalChecks) * 100);
        setOverallScore(score);
      } catch (err) {
        setError("Failed to run security audit");
        console.error("Security audit error:", err);
      } finally {
        setLoading(false);
      }
    };

    runSecurityAudit();
  }, []);

  const performSecurityChecks = async (): Promise<SecurityCheck[]> => {
    // Simulate async security checks
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return [
      {
        id: "https-enforcement",
        name: "HTTPS Enforcement",
        description: "Check if HTTPS is properly enforced",
        status: "pass",
        severity: "high",
        category: "Transport Security",
        details: "All requests are properly redirected to HTTPS",
        recommendation: "Continue monitoring HTTPS enforcement",
      },
      {
        id: "security-headers",
        name: "Security Headers",
        description: "Verify security headers are present",
        status: "pass",
        severity: "medium",
        category: "Headers",
        details:
          "All required security headers are present and properly configured",
        recommendation: "Regularly audit security headers for compliance",
      },
      {
        id: "csrf-protection",
        name: "CSRF Protection",
        description: "Check CSRF protection implementation",
        status: "pass",
        severity: "high",
        category: "Authentication",
        details: "CSRF tokens are properly generated and validated",
        recommendation: "Monitor CSRF attack attempts",
      },
      {
        id: "rate-limiting",
        name: "Rate Limiting",
        description: "Verify rate limiting is active",
        status: "pass",
        severity: "medium",
        category: "API Security",
        details: "Rate limiting is properly configured for all API endpoints",
        recommendation: "Adjust rate limits based on usage patterns",
      },
      {
        id: "input-validation",
        name: "Input Validation",
        description: "Check input validation and sanitization",
        status: "warning",
        severity: "medium",
        category: "Data Security",
        details:
          "Most inputs are validated, but some edge cases need attention",
        recommendation:
          "Implement stricter input validation for all user inputs",
      },
      {
        id: "sql-injection",
        name: "SQL Injection Protection",
        description: "Verify SQL injection protection",
        status: "pass",
        severity: "critical",
        category: "Database Security",
        details: "Parameterized queries are used throughout the application",
        recommendation:
          "Continue using parameterized queries and avoid dynamic SQL",
      },
      {
        id: "xss-protection",
        name: "XSS Protection",
        description: "Check XSS protection measures",
        status: "pass",
        severity: "high",
        category: "Client Security",
        details: "Content Security Policy and input sanitization are active",
        recommendation: "Regularly test XSS protection with security tools",
      },
      {
        id: "authentication",
        name: "Authentication Security",
        description: "Verify authentication mechanisms",
        status: "pass",
        severity: "critical",
        category: "Authentication",
        details: "Strong authentication with proper session management",
        recommendation: "Consider implementing multi-factor authentication",
      },
      {
        id: "authorization",
        name: "Authorization Controls",
        description: "Check authorization and access controls",
        status: "pass",
        severity: "high",
        category: "Access Control",
        details: "Role-based access control is properly implemented",
        recommendation: "Regularly audit user permissions and access levels",
      },
      {
        id: "data-encryption",
        name: "Data Encryption",
        description: "Verify data encryption at rest and in transit",
        status: "pass",
        severity: "critical",
        category: "Data Security",
        details: "Data is encrypted in transit and at rest",
        recommendation: "Regularly rotate encryption keys",
      },
      {
        id: "logging",
        name: "Security Logging",
        description: "Check security event logging",
        status: "pass",
        severity: "medium",
        category: "Monitoring",
        details: "Security events are properly logged and monitored",
        recommendation:
          "Implement automated alerting for critical security events",
      },
      {
        id: "dependency-security",
        name: "Dependency Security",
        description: "Check for vulnerable dependencies",
        status: "warning",
        severity: "medium",
        category: "Dependencies",
        details:
          "Most dependencies are up to date, but some minor vulnerabilities exist",
        recommendation: "Update dependencies with known vulnerabilities",
      },
    ];
  };

  const getStatusIcon = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: SecurityCheck["status"]) => {
    switch (status) {
      case "pass":
        return "bg-green-500";
      case "fail":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
    }
  };

  const getSeverityColor = (severity: SecurityCheck["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Transport Security":
        return <Network className="h-4 w-4" />;
      case "Headers":
        return <FileText className="h-4 w-4" />;
      case "Authentication":
        return <User className="h-4 w-4" />;
      case "API Security":
        return <Globe className="h-4 w-4" />;
      case "Data Security":
        return <Database className="h-4 w-4" />;
      case "Client Security":
        return <Eye className="h-4 w-4" />;
      case "Access Control":
        return <Lock className="h-4 w-4" />;
      case "Monitoring":
        return <Clock className="h-4 w-4" />;
      case "Dependencies":
        return <Key className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600">Running security audit...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg">Error: {error}</p>
        <p className="text-sm text-gray-500">
          Please try running the audit again
        </p>
      </div>
    );
  }

  const passedChecks =
    securityChecks.filter((check) => check.status === "pass").length;
  const failedChecks =
    securityChecks.filter((check) => check.status === "fail").length;
  const warningChecks =
    securityChecks.filter((check) => check.status === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Audit</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Run Audit
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Overall Security Score
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-blue-600">{overallScore}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {passedChecks} passed, {warningChecks} warnings, {failedChecks}{" "}
            failed
          </p>
          <Progress value={overallScore} className="h-3 mt-4" />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Checks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {passedChecks}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((passedChecks / securityChecks.length) * 100)}% of
              total checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {warningChecks}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((warningChecks / securityChecks.length) * 100)}% of
              total checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failedChecks}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((failedChecks / securityChecks.length) * 100)}% of
              total checks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Security Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecks.map((check) => (
              <div
                key={check.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{check.name}</h4>
                        <Badge
                          variant="outline"
                          className={`${
                            getSeverityColor(check.severity)
                          } text-white`}
                        >
                          {check.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${
                            getStatusColor(check.status)
                          } text-white`}
                        >
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {check.description}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        {check.details}
                      </p>
                      {check.recommendation && (
                        <p className="text-sm text-blue-600 font-medium">
                          Recommendation: {check.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {getCategoryIcon(check.category)}
                    <span>{check.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
