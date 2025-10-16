"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import { Button } from "@proof-of-fit/ui";

interface SecureAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "employer" | "candidate" | "admin";
  redirectTo?: string;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function SecureAuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo,
  loadingFallback,
  errorFallback,
}: SecureAuthGuardProps) {
  const { user, loading, error, isAuthenticated, isEmployer, isCandidate } =
    useAuth();

  // Show loading state
  if (loading) {
    if (loadingFallback) return <>{loadingFallback}</>;
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    if (errorFallback) return <>{errorFallback}</>;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in to access this page.
          </p>
          <Button
            onClick={() => window.location.href = redirectTo || "/auth/signin"}
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requireRole && isAuthenticated) {
    let hasRequiredRole = false;

    switch (requireRole) {
      case "employer":
        hasRequiredRole = isEmployer;
        break;
      case "candidate":
        hasRequiredRole = isCandidate;
        break;
      case "admin":
        hasRequiredRole = user?.user_metadata?.role === "admin";
        break;
    }

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this page.
              {requireRole === "employer" &&
                " This page is for employers only."}
              {requireRole === "candidate" &&
                " This page is for job seekers only."}
              {requireRole === "admin" &&
                " This page is for administrators only."}
            </p>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
