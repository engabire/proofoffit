'use client'

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, KeyRound, ExternalLink, Building2, Info, Users, Briefcase } from "lucide-react";
import { Button } from "@proof-of-fit/ui";
import { Card, CardContent } from "@proof-of-fit/ui";
import { Input } from "@proof-of-fit/ui";
import { Label } from "@proof-of-fit/ui";
import { Separator } from "@proof-of-fit/ui";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isSupabaseConfigured } from '@/lib/env';
import { detectEnterpriseDomain } from '@/lib/enterprise-domains';
import { toast } from 'sonner';

/**
 * Enhanced EnterpriseLogin (ProofOfFit-branded)
 * ------------------------------------------------------
 * Two audiences with tailored auth flows:
 * - Hiring Team (enterprise: SSO/Magic/Passkey + domain routing)
 * - Job Seeker (candidate: Email-first + Magic/Passkey, no enterprise SSO noise)
 *
 * Brand: dark navy #0B1220, violet→cyan gradient accents.
 *
 * Wiring tips:
 * - onContinue(email): begin email-first flow (both modes)
 * - onMagicLink(email?): passwordless
 * - onSso(providerKey, email?): IdP redirect (hirer only)
 * - onPasskey(): WebAuthn
 */

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type EmailForm = z.infer<typeof emailSchema>;

type Provider = { key: string; label: string; hint?: string };

const DEFAULT_PROVIDERS: Provider[] = [
  { key: "sso", label: "Sign in with Company SSO" },
  { key: "google", label: "Continue with Google Workspace" },
  { key: "microsoft", label: "Continue with Microsoft Entra ID" },
];

// Example domain → provider suggestions (customize for tenants)
const DOMAIN_ROUTING: Record<string, Provider> = {
  "company.com": { key: "sso", label: "Sign in with Company SSO", hint: "Okta" },
  "acme.io": { key: "google", label: "Continue with Google Workspace" },
  "contoso.com": { key: "microsoft", label: "Continue with Microsoft Entra ID" },
};

interface EnhancedEnterpriseLoginV2Props {
  className?: string;
  onSuccess?: () => void;
  redirectTo?: string;
  mode?: 'signin' | 'signup';
  legalLinks?: { terms: string; privacy: string; eeoc?: string };
  defaultAudience?: Audience; // optional preselect
}

type Audience = "hirer" | "seeker";

function BrandMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <defs>
        <linearGradient id="pf" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#F6F9FF" />
      <path d="M9 22V10h7.5a4.5 4.5 0 0 1 0 9H14v3H9zm5-7h2.5a1.5 1.5 0 0 0 0-3H14v3z" fill="url(#pf)" />
    </svg>
  );
}

export default function EnhancedEnterpriseLoginV2({
  className,
  onSuccess,
  redirectTo = '/dashboard',
  mode = 'signin',
  legalLinks = { terms: "/legal/terms", privacy: "/legal/privacy", eeoc: "/legal/eeoc" },
  defaultAudience = "hirer",
}: EnhancedEnterpriseLoginV2Props) {
  // Audience toggle (hirer vs seeker)
  const [audience, setAudience] = React.useState<Audience>(defaultAudience);

  // Local state and hooks
  const [suggested, setSuggested] = React.useState<Provider | null>(null);
  const [status, setStatus] = React.useState<"idle" | "working">("idle");
  const [error, setError] = React.useState<string>("");

  const router = useRouter();
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<EmailForm>({ 
    resolver: zodResolver(emailSchema) 
  });

  // Watch email to suggest SSO automatically (hirer only)
  const emailValue = watch("email");
  React.useEffect(() => {
    if (audience !== "hirer") { setSuggested(null); return; }
    const domain = emailValue?.split("@")[1]?.toLowerCase();
    if (!domain) return setSuggested(null);
    const provider = DOMAIN_ROUTING[domain] ?? null;
    setSuggested(provider);
  }, [emailValue, audience]);

  const submit = async (data: EmailForm) => {
    try { 
      setStatus("working");
      setError("");
      await onContinue?.(data.email, audience); 
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally { 
      setStatus("idle"); 
    }
  };

  const handleSso = async (providerKey: string) => {
    try { 
      setStatus("working");
      setError("");
      await onSso?.(providerKey, emailValue); 
    } catch (err: any) {
      setError(err.message || 'SSO authentication failed');
    } finally { 
      setStatus("idle"); 
    }
  };

  const handleMagic = async () => {
    try { 
      setStatus("working");
      setError("");
      await onMagicLink?.(emailValue, audience); 
    } catch (err: any) {
      setError(err.message || 'Magic link failed');
    } finally { 
      setStatus("idle"); 
    }
  };

  const handlePasskey = async () => {
    try { 
      setStatus("working");
      setError("");
      await onPasskey?.(); 
    } catch (err: any) {
      setError(err.message || 'Passkey authentication failed');
    } finally { 
      setStatus("idle"); 
    }
  };

  // Authentication handlers
  const onContinue = async (email: string, audience?: Audience) => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }

    // For now, we'll use magic link as the primary flow
    // In a full implementation, this would route to different flows based on audience
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) throw error;

    toast.success('Check your email for a sign-in link!');
    onSuccess?.();
  };

  const onMagicLink = async (email?: string, audience?: Audience) => {
    if (!email) {
      throw new Error('Email is required for magic link');
    }

    if (!supabase) {
      throw new Error('Authentication service not available');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) throw error;

    toast.success('Magic link sent to your email!');
  };

  const onSso = async (providerKey: string, email?: string) => {
    if (!supabase) {
      throw new Error('Authentication service not available');
    }

    // Map provider keys to actual Supabase providers
    const providerMap: Record<string, string> = {
      'google': 'google',
      'microsoft': 'azure',
      'sso': 'azure', // Default SSO to Azure for now
    };

    const provider = providerMap[providerKey];
    if (!provider) {
      throw new Error('Unsupported SSO provider');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        queryParams: email ? { login_hint: email } : undefined,
      },
    });

    if (error) throw error;
  };

  const onPasskey = async () => {
    // WebAuthn implementation would go here
    // For now, we'll show a message that this feature is coming soon
    toast.info('Passkey authentication is coming soon!');
  };

  const isHirer = audience === "hirer";

  return (
    <div className={cn("w-full min-h-screen grid md:grid-cols-2 bg-white", className)}>
      {/* Left: Brand/Value */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex flex-col justify-between bg-[#F6F9FF] text-[#0B1220] p-10 relative overflow-hidden"
      >
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <h1 className="text-5xl font-extrabold tracking-tight">ProofOfFit</h1>
          </div>
          <div className="h-1 w-28 bg-gradient-to-r from-blue-600 to-indigo-500 my-4 rounded" />
          <p className="max-w-sm text-slate-600">
            Hire with confidence. Streamline reviews, collaborate with your team, and prove compliance — fast and secure.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2"><ShieldCheck className="h-5 w-5 mt-0.5" /> SSO, MFA, Passkeys.</li>
          <li className="flex items-start gap-2"><Building2 className="h-5 w-5 mt-0.5" /> Role-based access: Admin, Recruiter, Reviewer.</li>
          <li className="flex items-start gap-2"><Info className="h-5 w-5 mt-0.5" /> SOC 2 + GDPR aligned.</li>
          <li className="opacity-70 text-xs">© {new Date().getFullYear()} ProofOfFit</li>
        </ul>
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-blue-600 to-indigo-500" />
        </div>
      </motion.aside>

      {/* Right: Actions */}
      <main className="flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-xl shadow-xl border-slate-200">
          <CardContent className="p-8">
            {/* Audience switcher */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-semibold">Sign in to ProofOfFit</h2>
              <div className="inline-flex rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAudience("hirer")}
                  className={cn("px-3 py-1.5 text-sm flex items-center gap-1",
                    isHirer ? "bg-neutral-900 text-white" : "bg-white text-neutral-700")}
                  aria-pressed={isHirer}
                >
                  <Briefcase className="h-4 w-4" /> Hiring team
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("seeker")}
                  className={cn("px-3 py-1.5 text-sm flex items-center gap-1",
                    !isHirer ? "bg-neutral-900 text-white" : "bg-white text-neutral-700")}
                  aria-pressed={!isHirer}
                >
                  <Users className="h-4 w-4" /> Job seeker
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              {isHirer
                ? "Use your work email. If your company has SSO enabled, we'll route you automatically."
                : "Use your email to access your applications and profile. We'll email you a secure sign-in link."}
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={isHirer ? "name@yourco.com" : "you@example.com"}
                    aria-invalid={!!errors.email}
                    className="pl-9"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

                {isHirer && suggested && (
                  <p className="text-xs text-neutral-600">
                    Detected <span className="font-medium">{suggested.hint ?? suggested.label}</span> from your domain — you can continue or use the suggested SSO below.
                  </p>
                )}
              </div>

              {/* Primary CTA differs by audience */}
              <Button type="submit" className="w-full" disabled={status === "working"}>
                {status === "working" ? "Working…" : isHirer ? "Continue" : "Continue with email"}
              </Button>

              {/* Divider */}
              <div className="relative text-center"><Separator className="my-6" /><span className="sr-only">or</span></div>

              {/* Audience-specific secondaries */}
              {isHirer ? (
                <div className="grid gap-3">
                  {suggested ? (
                    <Button type="button" variant="outline" className="w-full justify-center" onClick={() => handleSso(suggested.key)} disabled={status === "working"}>
                      <ExternalLink className="mr-2 h-4 w-4" /> {suggested.label}
                    </Button>
                  ) : null}
                  {DEFAULT_PROVIDERS.filter(p => p.key !== suggested?.key).map(p => (
                    <Button key={p.key} type="button" variant="outline" className="w-full justify-center" onClick={() => handleSso(p.key)} disabled={status === "working"}>
                      <ExternalLink className="mr-2 h-4 w-4" /> {p.label}
                    </Button>
                  ))}
                  <Button type="button" variant="secondary" onClick={handleMagic} disabled={status === "working"}>Email me a magic link</Button>
                  <Button type="button" variant="ghost" onClick={handlePasskey} disabled={status === "working"}><KeyRound className="mr-2 h-4 w-4" /> Sign in with a Passkey</Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Button type="button" variant="secondary" onClick={handleMagic} disabled={status === "working"}>Email me a magic link</Button>
                  <Button type="button" variant="ghost" onClick={handlePasskey} disabled={status === "working"}><KeyRound className="mr-2 h-4 w-4" /> Use a Passkey</Button>
                </div>
              )}
            </form>

            {/* Help + RBAC microcopy */}
            <div className="mt-6 space-y-2 text-xs text-neutral-600">
              {isHirer ? (
                <>
                  <p>Don&apos;t have access? Ask your admin to invite you as <span className="font-medium">Recruiter</span>, <span className="font-medium">Reviewer</span>, or <span className="font-medium">Admin</span>.</p>
                  <p>Need help signing in? <Link href="/help/sign-in" className="underline">Get support</Link>.</p>
                </>
              ) : (
                <>
                  <p>No account yet? We&apos;ll create one as you sign in and connect your applications automatically.</p>
                  <p>Having trouble? <Link href="/help/candidates" className="underline">Candidate help</Link>.</p>
                </>
              )}
            </div>

            <Separator className="my-6" />

            <div className="text-[11px] leading-relaxed text-neutral-500">
              By continuing, you agree to ProofOfFit&apos;s <a className="underline" href={legalLinks.terms}>Terms</a> and <a className="underline" href={legalLinks.privacy}>Privacy Policy</a>
              {legalLinks.eeoc ? (<> and our <a className="underline" href={legalLinks.eeoc}>EEOC commitment</a>.</>) : "."}
              We only send essential account and security emails.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Optional headless utility if you want to reuse domain routing elsewhere
export function getSuggestedProvider(email?: string): Provider | null {
  const domain = email?.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return DOMAIN_ROUTING[domain] ?? null;
}

// ------------------------------------------------------
// Lightweight dev-time tests (run only in the browser during development)
// Ensures domain → provider mapping behaves as expected.
// ------------------------------------------------------
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (function runDevTests() {
    const domainCases: Array<{ email: string; expect: Provider["key"] | null }> = [
      { email: "user@company.com", expect: "sso" },
      { email: "hire@acme.io", expect: "google" },
      { email: "it@contoso.com", expect: "microsoft" },
      { email: "someone@unknown.tld", expect: null },
    ];

    for (const t of domainCases) {
      const res = getSuggestedProvider(t.email)?.key ?? null;
      if (res !== t.expect) {
        // eslint-disable-next-line no-console
        console.error("getSuggestedProvider test failed:", { test: t, got: res });
      }
    }
  })();
}
