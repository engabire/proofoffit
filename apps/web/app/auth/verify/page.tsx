"use client";

import { VerificationCodeForm } from "@/components/auth/verification-code-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    // Redirect to dashboard or login
    window.location.href = "/dashboard";
  };

  const handleBack = () => {
    // Redirect back to signup
    window.location.href = "/auth/signup";
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification Required
          </h1>
          <p className="text-gray-600 mb-4">
            Please provide an email address to verify.
          </p>
          <a
            href="/auth/signup"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go to Sign Up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <VerificationCodeForm
        email={email}
        onSuccess={handleSuccess}
        onBack={handleBack}
      />
    </div>
  );
}
