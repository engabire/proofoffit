"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Info,
  KeyRound,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCSRFHeaders } from "@/components/security/csrf-provider";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500",
        props.className,
      )}
    />
  );
}

function Button(
  { variant = "solid", className, ...props }:
    & React.ButtonHTMLAttributes<HTMLButtonElement>
    & { variant?: "solid" | "outline" | "ghost" | "secondary" },
) {
  const base = "rounded-xl px-4 py-2 text-sm font-medium transition shadow-sm";
  const map: Record<string, string> = {
    solid: "bg-blue-600 hover:bg-blue-700 text-white",
    outline:
      "border border-slate-300 text-slate-800 bg-white hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
  };
  return <button {...props} className={cn(base, map[variant], className)} />;
}

function Label(
  { htmlFor, children }: { htmlFor?: string; children: React.ReactNode },
) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">
      {children}
    </label>
  );
}

function Separator() {
  return <div className="my-6 h-px w-full bg-slate-200" />;
}

type Audience = "hirer" | "seeker";

type MarketingImage = { src: string; alt: string };
export const MARKETING_IMAGES: MarketingImage[] = [
  {
    src:
      "https://images.unsplash.com/photo-1573497019418-b400bb3abdb1?q=80&w=1200&auto=format&fit=crop",
    alt: "Diverse team of professionals collaborating in an office",
  },
  {
    src:
      "https://images.unsplash.com/photo-1600880292089-90e6a9d2d7f3?q=80&w=1200&auto=format&fit=crop",
    alt: "Engineer at a construction site wearing a hard hat",
  },
  {
    src:
      "https://images.unsplash.com/photo-1600880292146-52c8ac4bb8e1?q=80&w=1200&auto=format&fit=crop",
    alt: "Teacher engaging with students in a classroom",
  },
  {
    src:
      "https://images.unsplash.com/photo-1611078489935-1e08e2b3d35c?q=80&w=1200&auto=format&fit=crop",
    alt: "Delivery worker preparing packages for dispatch",
  },
];

function MarketingImages(
  { images = MARKETING_IMAGES }: { images?: MarketingImage[] },
) {
  return (
    <div
      className="mt-6 grid grid-cols-2 gap-4"
      aria-label="Diverse professional images"
    >
      {images.slice(0, 4).map((img, i) => (
        <img
          key={`${i}-${img.src}`}
          src={img.src}
          alt={img.alt}
          className="h-40 w-full object-cover rounded-2xl shadow-sm"
          loading="lazy"
        />
      ))}
    </div>
  );
}

export default function EnterpriseLogin() {
  const { signIn, sendMagicLink, loading: authLoading, error: authError } =
    useAuth();
  const csrfHeaders = useCSRFHeaders();
  const [audience, setAudience] = React.useState<Audience>("hirer");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "working">("idle");
  const [error, setError] = React.useState("");
  const isHirer = audience === "hirer";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "working") return;

    setStatus("working");
    setError("");

    try {
      const result = await sendMagicLink(email);

      if (!result.success) {
        setError(
          result.error || "Failed to send magic link. Please try again.",
        );
        return;
      }

      setError("Magic link sent! Please check your email.");
    } catch (error) {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setStatus("working");
    setError("");

    try {
      const result = await sendMagicLink(email);

      if (!result.success) {
        setError(
          result.error || "Failed to send magic link. Please try again.",
        );
        return;
      }

      setError("Magic link sent! Please check your email.");
    } catch (error) {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const handlePasskey = async () => {
    setStatus("working");
    setError("");

    try {
      // Simulate passkey authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setError("Passkey authentication is coming soon!");
    } catch (error) {
      setError("Passkey authentication failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  const isLoading = status === "working" || authLoading;
  const displayError = error || authError;

  return (
    <div className="w-full min-h-screen grid md:grid-cols-2 bg-white relative overflow-hidden">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex flex-col justify-between bg-slate-50 text-[#0B1220] p-10 relative z-10"
      >
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight">ProofOfFit</h1>
          <div className="h-1 w-28 bg-gradient-to-r from-blue-600 to-indigo-500 my-4 rounded" />
          <p className="max-w-sm text-slate-600">
            ProofOfFit celebrates the diversity of work — educators, engineers,
            creators, and essential workers — people who make progress possible.
          </p>
          <MarketingImages />
        </div>

        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 mt-0.5" /> Secure, inclusive access.
          </li>
          <li className="flex items-start gap-2">
            <Building2 className="h-5 w-5 mt-0.5" />{" "}
            Built for every profession, everywhere.
          </li>
          <li className="flex items-start gap-2">
            <Info className="h-5 w-5 mt-0.5" />{" "}
            Privacy-first and ethical by default.
          </li>
          <li className="opacity-70 text-xs">
            © {new Date().getFullYear()} ProofOfFit
          </li>
        </ul>
      </motion.aside>

      <div className="flex items-center justify-center p-8 md:p-12 relative z-10">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-lg p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Sign in to ProofOfFit
            </h2>
            <div className="inline-flex rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setAudience("hirer")}
                className={cn(
                  "px-3 py-1.5 text-sm flex items-center gap-1",
                  isHirer
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700",
                )}
                disabled={isLoading}
              >
                <Briefcase className="h-4 w-4" /> Hiring team
              </button>
              <button
                type="button"
                onClick={() => setAudience("seeker")}
                className={cn(
                  "px-3 py-1.5 text-sm flex items-center gap-1",
                  !isHirer
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700",
                )}
                disabled={isLoading}
              >
                <Users className="h-4 w-4" /> Job seeker
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {isHirer
              ? "Use your work email. If your company has SSO, we'll route you automatically."
              : "Use your email to access your applications and profile. We'll email you a secure link."}
          </p>

          {displayError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={isHirer ? "name@yourco.com" : "you@example.com"}
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? "Working…"
                : (isHirer ? "Continue" : "Continue with email")}
            </Button>

            <Separator />

            <div className="grid gap-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleMagicLink}
                disabled={isLoading}
              >
                Email me a magic link
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handlePasskey}
                disabled={isLoading}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Use a Passkey
              </Button>
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-600">
              {isHirer
                ? (
                  <>
                    <p>
                      Don't have access? Ask your admin to invite you as{" "}
                      <span className="font-medium">Recruiter</span>,{" "}
                      <span className="font-medium">Reviewer</span>, or{" "}
                      <span className="font-medium">Admin</span>.
                    </p>
                    <p>
                      Need help signing in?{" "}
                      <a
                        href="/help/sign-in"
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        Get support
                      </a>.
                    </p>
                  </>
                )
                : (
                  <>
                    <p>
                      No account yet? We'll create one as you sign in and
                      connect your applications automatically.
                    </p>
                    <p>
                      Having trouble?{" "}
                      <a
                        href="/help/candidates"
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        Candidate help
                      </a>.
                    </p>
                  </>
                )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const tests = [
    () => Array.isArray(MARKETING_IMAGES),
    () => MARKETING_IMAGES.length >= 3,
    () =>
      MARKETING_IMAGES.every((m) =>
        typeof m.src === "string" && m.src.length > 0 &&
        typeof m.alt === "string" && m.alt.length > 0
      ),
  ];
  for (const t of tests) {
    try {
      if (!t()) console.error("Marketing image test failed");
    } catch {
      console.error("Marketing image test threw");
    }
  }
}
