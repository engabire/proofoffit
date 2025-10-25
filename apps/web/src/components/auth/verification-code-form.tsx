"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface VerificationCodeFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function VerificationCodeForm({ email, onSuccess, onBack }: VerificationCodeFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Timer for code expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Check verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, [email]);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/auth/verification-code?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.hasCode && !data.isExpired) {
        const expiresIn = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
        setTimeLeft(expiresIn);
        setAttempts(data.attempts);
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  const generateNewCode = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate",
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeLeft(600); // 10 minutes
        setAttempts(0);
        setCode("");
        
        // In development, show the code
        if (process.env.NODE_ENV === "development" && data.code) {
          setCode(data.code);
        }
      } else {
        setError(data.error || "Failed to generate verification code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify",
          email,
          code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.error || "Invalid verification code");
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Email Verified!</h3>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={verifyCode} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>

          {timeLeft > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Code expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          )}

          {attempts > 0 && (
            <div className="text-center text-sm text-amber-600">
              Attempts: {attempts}/3
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={generateNewCode}
            disabled={isGenerating || timeLeft > 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : "Resend Code"}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            Back to Sign Up
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> Check the console for the verification code.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
