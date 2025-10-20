"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReplitLogin } from "@/components/auth/replit-login";
import EnterpriseLogin from "@/components/auth/enterprise-login";

function SignInPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const userType = searchParams.get("type") || "seeker";
  const variant = searchParams.get("variant") || "standard";

  // Convert userType to audience format
  const defaultAudience = userType === "employer" ? "hirer" : "seeker";

  // Use enterprise login if variant is 'enterprise'
  if (variant === "enterprise") {
    return <EnterpriseLogin />;
  }

  return (
    <ReplitLogin
      defaultUserType={defaultAudience}
      redirectTo={redirectTo}
    />
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-proof-blue mx-auto mb-4">
            </div>
            <p className="text-gray-600">Loading sign in...</p>
          </div>
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}
