"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import { detectEnterpriseDomain } from "@/lib/enterprise-domains";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { AlertCircle, Building2, CheckCircle, Loader2 } from "lucide-react";

function AuthCallbackPageContent() {
  const supabase = isSupabaseConfigured()
    ? createClientComponentClient()
    : null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing authentication...");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isEnterprise, setIsEnterprise] = useState(false);

  useEffect(() => {
    async function exchangeCodeForSession() {
      if (!supabase) {
        setStatus("error");
        setMessage("Authentication service not available");
        setTimeout(() => router.replace("/auth/signin"), 3000);
        return;
      }

      try {
        setStatus("loading");
        setMessage("Verifying authentication...");

        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          // Handle specific OAuth errors with user-friendly messages
          if (error === "access_denied") {
            setStatus("error");
            setMessage(
              "Authentication was cancelled. You can try signing in again or use email authentication instead.",
            );
            setTimeout(() => router.replace("/auth/signin"), 4000);
            return;
          } else if (error === "invalid_request") {
            setStatus("error");
            setMessage("Authentication request was invalid. Please try again.");
            setTimeout(() => router.replace("/auth/signin"), 4000);
            return;
          } else {
            const friendlyMessage = errorDescription || error;
            throw new Error(`Authentication error: ${friendlyMessage}`);
          }
        }

        const hashParams = typeof window !== "undefined" && window.location.hash
          ? new URLSearchParams(window.location.hash.replace(/^#/, ""))
          : null;

        const hashError = hashParams?.get("error_description")
          || hashParams?.get("error");
        if (hashError) {
          throw new Error(`Authentication error: ${hashError}`);
        }

        let user: User | null = null;

        if (code) {
          // Check if this is a PKCE flow (OAuth) or magic link flow
          const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

          const { data: sessionData, error: exchangeError } = await supabase
            .auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          if (codeVerifier) {
            // Clear the verifier once it has been used successfully
            sessionStorage.removeItem("pkce_code_verifier");
          }

          user = sessionData?.user ?? null;
        }

        if (!user && hashParams) {
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) {
              throw sessionError;
            }

            user = sessionData.user ?? null;
          }
        }

        if (typeof window !== "undefined" && window.location.hash) {
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search,
          );
        }

        if (user) {
          setUserEmail(user.email || null);

          // Check if this is an enterprise user
          if (user.email) {
            const enterprise = detectEnterpriseDomain(user.email);
            setIsEnterprise(!!enterprise);
          }

          setStatus("success");
          setMessage("Authentication successful!");

          try {
            await import("../../../lib/analytics").then((m) =>
              m.track({ name: "auth_success" })
            );
          } catch {}

          // Log successful authentication (optional, fail silently if API doesn't exist)
          try {
            await fetch("/api/action_log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                tenantId: user.id,
                actorType: "user",
                actorId: user.id,
                action: "auth_success",
                objType: "user",
                objId: user.id,
                payloadHash: "auth_success",
              }),
            });
          } catch (logError) {
            // Silently handle logging errors - don't break authentication flow
            console.warn("Authentication logging unavailable:", logError);
          }

          setTimeout(() => {
            router.replace("/dashboard");
          }, 2000);
        } else {
          throw new Error("No authentication credentials provided");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setMessage(err.message || "Authentication failed");

        // Log failed authentication (optional, fail silently if API doesn't exist)
        try {
          await fetch("/api/action_log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenantId: "anonymous",
              actorType: "system",
              actorId: "auth_callback",
              action: "auth_failed",
              objType: "user",
              objId: "unknown",
              payloadHash: "auth_failed",
            }),
          });
        } catch (logError) {
          // Silently handle logging errors - don't break error handling flow
          console.warn("Authentication error logging unavailable:", logError);
        }

        setTimeout(() => {
          router.replace("/auth/signin");
        }, 3000);
      }
    }

    exchangeCodeForSession();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            )}
            {status === "success" && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {status === "error" && (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "Welcome to ProofOfFit!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">{message}</p>

          {userEmail && (
            <div className="text-center">
              <p className="text-sm text-gray-500">Signed in as:</p>
              <p className="font-medium">{userEmail}</p>
            </div>
          )}

          {isEnterprise && userEmail && (
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
              <Badge variant="secondary" className="text-blue-800">
                Enterprise Account
              </Badge>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Please wait while we verify your credentials...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                You will be redirected to the sign-in page shortly.
              </p>
              {message.includes("cancelled") && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Tip:</strong>{" "}
                  You can use email authentication instead of OAuth providers.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Component with Suspense wrapper
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <CardTitle className="text-xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Initializing authentication...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthCallbackPageContent />
    </Suspense>
  );
}

// Build fix: Ensure latest commit is used (f78eb5f)
