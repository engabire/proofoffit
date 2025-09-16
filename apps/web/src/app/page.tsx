"use client"

import React, { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ExternalLink,
  Copy,
  Lock,
  Star,
  Sparkles,
  ShieldCheck,
  Timer,
  FileText,
  Menu,
  Sun,
  Moon,
  Globe2,
  ChevronDown,
  Twitter,
  Github,
  Linkedin,
  HelpCircle,
  BookOpen,
  DollarSign,
  Gift,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from "@proof-of-fit/ui";
import LivingProofHero from "@/components/landing/living-proof-hero";

/**
 * ProofOfFit Landing
 * - Two-lane hero toggle (Job Seeker / Employer) without page reload
 * - Receipt-style proof cards + micro-interactions
 * - Why Choose (universal), How It Works (lane-specific), Pricing (JTBD-mapped)
 * - DM-style testimonials, Footer trust bar
 * - A11y-first, analytics-friendly (data-*) hooks, minimal and clean Tailwind
 */

// ---------- Shared theme helpers ----------
const laneAccent = {
  seeker: "from-sky-600 via-indigo-600 to-violet-600",
  employer: "from-emerald-600 via-teal-600 to-cyan-600",
};

const warmBody = "text-stone-900 dark:text-stone-100";
const subtle = "text-stone-600 dark:text-stone-400";
const receiptMono = "font-mono text-sm";

// Subtle hero gradient blobs (lane-aware)
const blobGradients = {
  seeker: [
    "from-sky-400/30 via-indigo-400/20 to-violet-400/10",
    "from-indigo-400/20 via-violet-400/20 to-fuchsia-400/10",
  ],
  employer: [
    "from-emerald-400/30 via-teal-400/20 to-cyan-400/10",
    "from-teal-400/20 via-cyan-400/20 to-sky-400/10",
  ],
  neutral: [
    "from-sky-300/20 via-indigo-300/15 to-violet-300/10",
    "from-emerald-300/20 via-teal-300/15 to-cyan-300/10",
  ],
} as const;

type BackgroundVariant = "seeker" | "employer" | "neutral";

function SiteBackground({ variant = "neutral" }: { variant?: BackgroundVariant }) {
  const reduce = useReducedMotion();
  const grads = blobGradients[variant];
  return (
    <>
      <div className={`absolute inset-0 z-0 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900`} />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -top-32 -left-24 z-0 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-60 bg-gradient-to-tr ${grads[0]} dark:opacity-50`}
        animate={reduce ? undefined : { y: [-8, 0, -8], scale: [1, 1.04, 1] }}
        transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute -bottom-24 -right-16 z-0 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-60 bg-gradient-to-tr ${grads[1]} dark:opacity-50`}
        animate={reduce ? undefined : { y: [6, 0, 6], scale: [1.02, 1, 1.02] }}
        transition={reduce ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ---------- Copy deck ----------
const laneCopy = {
  seeker: {
    id: "seeker",
    label: "I'm a Job Seeker",
    headline: "Land interviews with a Fit Report that proves your case.",
    subhead:
      "We analyze each job, tailor your resume and cover letter, and explain exactly why you match—so you apply with confidence, not hope.",
    primaryCta: { label: "Get My Fit Report", href: "/app/fit" },
    secondaryCta: { label: "Try Interactive Demo", href: "/demo" },
    ribbons: [
      { text: "Tailored in under 90 seconds" },
      { text: "No ATS games, just evidence" },
      { text: "Bias‑reducing and explainable" },
      { text: "Gift cards welcome" },
    ] as { text: string }[],
  },
  employer: {
    id: "employer",
    label: "I'm Hiring",
    headline: "Shortlist faster—with explainable slates and audit-ready trails.",
    subhead:
      "Ranked candidates with transparent rationales and cryptographic audit links. Faster hiring, fewer debates, better compliance.",
    primaryCta: { label: "Generate a Candidate Slate", href: "/app/slate" },
    secondaryCta: { label: "See How It Works", href: "#how" },
    ribbons: [
      { text: "Consensus faster by fewer meetings" },
      { text: "Audit link for every slate" },
      { text: "Reduce time‑to‑shortlist" },
    ] as { text: string }[],
  },
} as const;

const universalWhy = [
  {
    title: "Explainable Matching",
    body: "See why you're a match, line by line. No mystery filters.",
    icon: <FileText className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Bias‑Reducing Algorithms",
    body: "Structured signals and transparent logic to support fairer calls.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Immutable Audit Trails",
    body: "Every decision has a verifiable URL—great for stakeholders and compliance.",
    icon: <Lock className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Smart Automation",
    body: "Tailored resumes and cover letters that echo the evidence, not fluff.",
    icon: <Sparkles className="h-5 w-5" aria-hidden />,
  },
] as const;

const howSeeker = [
  { step: 1, title: "Build your proof", body: "Import resume/LinkedIn, add projects, link evidence." },
  { step: 2, title: "Pick a role", body: "We parse the JD and map it to your proof." },
  { step: 3, title: "Get your Fit Report", body: "A 1‑pager you can attach, plus tailored resume/cover." },
  { step: 4, title: "Apply with confidence", body: "Know your story before the recruiter call." },
] as { step: number; title: string; body: string }[];

const howEmployer = [
  { step: 1, title: "Drop in a JD", body: "Define must‑haves vs nice‑to‑haves." },
  { step: 2, title: "Receive a ranked slate", body: "Each candidate comes with a Fit Report and audit URL." },
  { step: 3, title: "Decide faster", body: "Shareable evidence reduces meeting thrash." },
  { step: 4, title: "Stay audit‑ready", body: "Immutable logs for fairness reviews." },
] as { step: number; title: string; body: string }[];

const testimonials = {
  seeker: [
    { quote: "I stopped guessing. Two weeks in, I had interviews that referenced my Fit Report directly.", name: "Amara B.", role: "Data Analyst" },
    { quote: "The tailored bullets were spooky‑good. It became my pre‑screen script.", name: "Luis R.", role: "Product Manager" },
  ],
  employer: [
    { quote: "We cut shortlist time dramatically. Debates turned into receipts we could compare.", name: "Priya N.", role: "Head of Talent" },
    { quote: "Legal loved the audit links. Hiring panels moved faster with less drama.", name: "Jordan K.", role: "HRBP" },
  ],
} as const;

// Pricing (map to JTBD). Replace prices with your actuals.
const pricing = {
  seeker: [
    {
      name: "Free",
      price: "$0",
      blurb: "Fit Report Lite for up to 10 applications / month.",
      features: ["10 applications / month", "1 tailored resume/cover per week", "Fit Report Lite"],
      cta: "Get My Fit Report",
    },
    {
      name: "Pro",
      price: "$12",
      blurb: "Affordable monthly access. Cancel anytime.",
      features: [
        "Unlimited tailoring",
        "Advanced Fit explanations",
        "Portfolio parsing",
        "Priority support",
        "Weekly Warm Matches email",
        "Giftable membership",
      ],
      cta: "Upgrade to Pro",
      highlight: true,
    },
    {
      name: "Community Pass",
      price: "$0",
      blurb: "Redeem a gift code for 1–3 months of Pro (no card required).",
      features: ["All Pro features during sponsored period", "Funded by community sponsors", "Fair‑use protections"],
      cta: "Redeem Gift Code",
    },
  ],
  employer: [
    {
      name: "Per‑req",
      price: "$X",
      blurb: "Pay per slate for occasional hiring.",
      features: ["Ranked candidate slate", "Explainable rationales", "Audit link per slate"],
      cta: "Generate a Slate",
    },
    {
      name: "Team",
      price: "$99",
      blurb: "5 seats, ATS integrations, priority support.",
      features: ["5 seats included", "Slate generation", "Audit links", "ATS integrations", "Priority support"],
      cta: "Start Team",
      highlight: true,
      footnote: "Cut time‑to‑shortlist by ~40% on average (verify before publishing)",
    },
  ],
};

// ---------- UI ----------
function Header({ lane, setLane }: { lane: Lane; setLane: (l: Lane) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const toggleTheme = () => {
    const d = document.documentElement;
    const dark = d.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  };
  const lanePrimary = lane === "seeker" ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400";

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-black text-white px-3 py-2 rounded">Skip to content</a>
      <header className={`sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${scrolled ? "shadow-md ring-1 ring-black/5 dark:ring-white/10" : ""}`}>
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold tracking-tight">ProofOfFit</a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:underline inline-flex items-center gap-1">
              <FileText className={`h-4 w-4 ${lanePrimary}`} /> Features
            </a>
            <a href="#how" className="hover:underline inline-flex items-center gap-1">
              <Sparkles className={`h-4 w-4 ${lanePrimary}`} /> How It Works
            </a>
            <a href="#pricing" className="hover:underline inline-flex items-center gap-1">
              <DollarSign className={`h-4 w-4 ${lanePrimary}`} /> Pricing
            </a>
            <a href="/gift" className="hover:underline inline-flex items-center gap-1">
              <Gift className={`h-4 w-4 ${lanePrimary}`} /> Sponsor
            </a>
            <a href="/fairness" className="hover:underline inline-flex items-center gap-1">
              <ShieldCheck className={`h-4 w-4 ${lanePrimary}`} /> Fairness
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center gap-2">
                  <Globe2 className={`h-4 w-4 ${lanePrimary}`} /> EN
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
                <DropdownMenuItem>Kinyarwanda</DropdownMenuItem>
                <DropdownMenuItem>Kiswahili</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center gap-2">
                  <HelpCircle className={`h-4 w-4 ${lanePrimary}`} /> Help
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4"/> Docs</DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2"><ExternalLink className="h-4 w-4"/> Support</DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4"/> Changelog</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lane toggle */}
            <LaneToggle lane={lane} setLane={setLane} />

            {/* Theme */}
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              <Sun className={`h-4 w-4 hidden dark:block ${lanePrimary}`} />
              <Moon className={`h-4 w-4 block dark:hidden ${lanePrimary}`} />
            </Button>

            {/* Auth */}
            <Button variant="outline" asChild>
              <a 
                href="/auth/signin"
                aria-label="Sign in to your ProofOfFit account"
                rel="noopener"
              >
                Sign in
              </a>
            </Button>
            <Button asChild className={`bg-gradient-to-r text-white shadow-md ${lane === "seeker" ? "from-sky-600 to-indigo-600" : "from-emerald-600 to-teal-600"}`}>
              <a 
                href={lane === "seeker" ? "/app/fit" : "/app/slate"}
                aria-label={`Get started with ProofOfFit - ${lane === 'seeker' ? 'Create your fit report' : 'Generate candidate slates'}`}
                rel="noopener"
              >
                Get Started
              </a>
            </Button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              <Sun className={`h-5 w-5 hidden dark:block ${lanePrimary}`} />
              <Moon className={`h-5 w-5 block dark:hidden ${lanePrimary}`} />
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Main menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <LaneToggle lane={lane} setLane={setLane} />
                  <a href="#why" onClick={() => setOpen(false)} className="py-1 inline-flex items-center gap-2"><FileText className={`h-4 w-4 ${lanePrimary}`} /> Features</a>
                  <a href="#how" onClick={() => setOpen(false)} className="py-1 inline-flex items-center gap-2"><Sparkles className={`h-4 w-4 ${lanePrimary}`} /> How It Works</a>
                  <a href="#pricing" onClick={() => setOpen(false)} className="py-1 inline-flex items-center gap-2"><DollarSign className={`h-4 w-4 ${lanePrimary}`} /> Pricing</a>
                  <a href="/gift" onClick={() => setOpen(false)} className="py-1 inline-flex items-center gap-2"><Gift className={`h-4 w-4 ${lanePrimary}`} /> Sponsor</a>
                  <a href="/fairness" onClick={() => setOpen(false)} className="py-1 inline-flex items-center gap-2"><ShieldCheck className={`h-4 w-4 ${lanePrimary}`} /> Fairness</a>

                  {/* Language */}
                  <div className="pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full inline-flex items-center justify-between">
                          <span className="inline-flex items-center gap-2"><Globe2 className={`h-4 w-4 ${lanePrimary}`} /> Language</span>
                          <ChevronDown className="h-3 w-3"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOpen(false)}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(false)}>Français</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(false)}>Kinyarwanda</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(false)}>Kiswahili</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Help */}
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full inline-flex items-center justify-between">
                          <span className="inline-flex items-center gap-2"><HelpCircle className={`h-4 w-4 ${lanePrimary}`} /> Help</span>
                          <ChevronDown className="h-3 w-3"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOpen(false)} className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4"/> Docs</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(false)} className="inline-flex items-center gap-2"><ExternalLink className="h-4 w-4"/> Support</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(false)} className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4"/> Changelog</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" asChild className="w-1/2">
                      <a 
                        href="/auth/signin" 
                        onClick={() => setOpen(false)}
                        aria-label="Sign in to your account"
                        rel="noopener"
                      >
                        Sign in
                      </a>
                    </Button>
                    <Button asChild className="w-1/2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
                      <a 
                        href={lane === "seeker" ? "/app/fit" : "/app/slate"} 
                        onClick={() => setOpen(false)}
                        aria-label={`Get started - ${lane === 'seeker' ? 'Create fit report' : 'Generate candidate slate'}`}
                        rel="noopener"
                      >
                        Get Started
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

function LaneToggle({ lane, setLane }: { lane: Lane; setLane: (l: Lane) => void }) {
  return (
    <div className="inline-flex rounded-2xl border bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-sm" role="tablist" aria-label="Audience">
      {(["seeker", "employer"] as Lane[]).map((l) => (
        <button
          key={l}
          role="tab"
          aria-selected={lane === l}
          aria-controls={`panel-${l}`}
          className={`px-4 py-2 text-sm font-medium rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            lane === l
              ? "bg-gradient-to-r text-white shadow-md " + laneAccent[l]
              : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          onClick={() => setLane(l)}
          data-evt="toggle_lane"
          data-lane={l}
        >
          {laneCopy[l].label}
        </button>
      ))}
    </div>
  );
}

function Ribbons({ items }: { items: { text: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Outcome ribbons">
      {items.map((r, i) => (
        <Badge key={i} variant="secondary" className="rounded-full">
          <Timer className="h-3.5 w-3.5 mr-1" /> {r.text}
        </Badge>
      ))}
    </div>
  );
}

function ReceiptCard() {
  const [copied, setCopied] = useState(false);
  const auditUrl = "https://proofoffit.com/a/abc123"; // replace with real link
  return (
    <Card className="w-full max-w-xl border-0 shadow-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl ring-1 ring-white/50 dark:ring-white/10">
      <CardHeader className="pb-1">
        <CardTitle className="text-base flex items-center gap-2">
          Fit Report <Badge variant="outline" className="ml-1">v1.0</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4 ${receiptMono}`}>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-semibold">Fit Score</span>
            <span className="inline-flex items-center gap-2">
              78/100
              <span className="text-xs text-zinc-500">(hover for breakdown)</span>
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5"/> Matched: Python, orchestration, SOC2</li>
            <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5"/> Signals: 2 portfolio proofs (GitHub, blog)</li>
            <li className="flex items-start gap-2"><Star className="h-4 w-4 mt-0.5"/> Stretch gap: Terraform</li>
            <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5"/> Bias‑reducing, explainable rationale</li>
          </ul>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4"/> Audit URL</span>
            <button
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              onClick={() => {
                navigator.clipboard.writeText(auditUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              aria-label="Copy Audit URL"
              data-evt="copy_audit_url"
            >
              <span className="truncate max-w-[12rem]" title={auditUrl}>{auditUrl}</span>
              <Copy className="h-4 w-4"/>
            </button>
          </div>
          {copied && <div className="mt-2 text-xs text-emerald-600">Copied ✓ Verifiable link</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function WhyChoose() {
  return (
    <section id="why" className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Why choose ProofOfFit?</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {universalWhy.map((w, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-2"><div className="flex items-center gap-2">{w.icon}<CardTitle className="text-base">{w.title}</CardTitle></div></CardHeader>
              <CardContent className={subtle}>{w.body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ items, lane }: { items: { step: number; title: string; body: string }[]; lane: Lane }) {
  return (
    <section id="how" className="py-12 sm:py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">How it works</h2>
        <ol className="grid md:grid-cols-4 gap-4">
          {items.map((s) => (
            <li key={s.step} className="relative">
              <Card className="h-full">
                <CardHeader className="pb-1"><CardTitle className="text-base">{s.step}. {s.title}</CardTitle></CardHeader>
                <CardContent className={subtle}>{s.body}</CardContent>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          {lane === "seeker" ? (
            <Button size="lg" asChild data-evt="cta_how">
              <a 
                href="/app/fit"
                aria-label="Get your personalized fit report - start your application process"
                rel="noopener"
              >
                Get My Fit Report
              </a>
            </Button>
          ) : (
            <Button size="lg" asChild data-evt="cta_how">
              <a 
                href="/app/slate"
                aria-label="Generate a candidate slate - start your hiring process"
                rel="noopener"
              >
                Generate a Candidate Slate
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function Pricing({ lane }: { lane: Lane }) {
  const plans = lane === "seeker" ? pricing.seeker : pricing.employer;
  return (
    <section id="pricing" className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Pricing</h2>
          <p className={`text-sm ${subtle}`}>Cancel anytime. Upgrade or downgrade as needs change.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((p, i) => (
            <Card key={i} className={`relative transition shadow-md hover:shadow-xl hover:-translate-y-0.5 ${
              (p as any).highlight ? "ring-1 ring-sky-300/60" : ""
            }`}>
              {(p as any).highlight && (
                <Badge className="absolute -top-2 right-3" variant="default">Popular</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <div className="text-2xl font-bold">{p.price} <span className="text-base font-normal text-zinc-500">/ mo</span></div>
                <div className={subtle}>{p.blurb}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5"/> {f}</li>
                  ))}
                </ul>
                {(p as any).footnote && <p className={`mt-3 text-xs ${subtle}`}>{(p as any).footnote}</p>}
                <div className="mt-4">
                  <Button 
                    size="lg" 
                    className="w-full" 
                    data-evt="cta_pricing" 
                    data-plan={p.name}
                    asChild
                  >
                    <a 
                      href={lane === 'seeker' ? `/auth/signup?plan=${p.name.toLowerCase()}` : `/auth/signup?plan=${p.name.toLowerCase().replace(' ', '_')}`}
                      aria-label={`${p.cta} - ${p.name} plan for ${p.price} per month`}
                      rel="noopener"
                    >
                      {p.cta}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {lane === "seeker" && (
          <div className="mt-6">
            <GiftSponsorPanel />
          </div>
        )}
      </div>
    </section>
  );
}

function DMTestimonials({ lane }: { lane: Lane }) {
  const items = testimonials[lane];
  return (
    <section className="py-12 sm:py-20 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">What people say</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((t, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="rounded-2xl bg-white dark:bg-zinc-950 border p-4">
                  <p className="text-base">“{t.quote}”</p>
                  <p className={`mt-3 text-sm ${subtle}`}>— {t.name}, {t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftSponsorPanel() {
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setRedeeming(true);
    setRedeemStatus('idle');
    setRedeemMessage(null);

    try {
      const response = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const payload = await response.json().catch(() => ({ error: 'Unexpected response' }));

      if (!response.ok) {
        setRedeemStatus('error');
        setRedeemMessage(payload?.error || 'Unable to redeem gift code');
        return;
      }

      const until = payload?.currentPeriodEnd ? new Date(payload.currentPeriodEnd) : null;
      setRedeemStatus('success');
      setRedeemMessage(until
        ? `Gift applied! Your sponsored access runs through ${until.toLocaleDateString()}.`
        : 'Gift applied! Enjoy your sponsored months.');
      setCode('');
    } catch (error) {
      console.error('Gift redeem failed', error);
      setRedeemStatus('error');
      setRedeemMessage('Something went wrong while redeeming. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };
  return (
    <Card className="mt-2 max-w-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Gift & Sponsor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-3 items-center">
          <div className="md:col-span-2">
            <label htmlFor="gift-code" className={`block text-sm mb-1 ${subtle}`}>Redeem a gift code</label>
            <div className="flex gap-2">
              <Input
                id="gift-code"
                placeholder="e.g. PF-9X2M-ABCD"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                aria-label="Gift code"
              />
              <Button data-evt="redeem_gift" onClick={handleRedeem} disabled={redeeming || !code.trim()}>
                {redeeming ? 'Redeeming…' : 'Redeem'}
              </Button>
            </div>
            <p className={`mt-2 text-xs ${subtle}`}>Codes typically cover 1–3 months of Pro. No card required.</p>
            {redeemMessage ? (
              <p className={`mt-2 text-sm ${redeemStatus === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {redeemMessage}
              </p>
            ) : null}
          </div>
          <div className="md:col-span-1">
            <label className={`block text-sm mb-1 ${subtle}`}>Sponsor a candidate</label>
            <Button className="w-full" asChild data-evt="sponsor_click">
              <a 
                href="/gift"
                aria-label="Sponsor a candidate - Give a month of Pro access for $12"
                rel="noopener"
              >
                Give a month ($12)
              </a>
            </Button>
            <p className={`mt-2 text-xs ${subtle}`}>You’ll receive a shareable code. Tax treatment may vary.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FooterTrustBar() {
  return (
    <footer className="mt-12 border-t bg-white/60 dark:bg-zinc-950/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="text-lg font-semibold">ProofOfFit</a>
            <p className={`mt-3 text-sm ${subtle}`}>Receipts, not black boxes. Bias‑reducing and explainable matching for fairer, faster hiring.</p>
            <div className="mt-4 flex gap-3">
              <a aria-label="Twitter" href="https://x.com/proofoffit" className="p-2 rounded-lg border hover:bg-white/60 dark:hover:bg-zinc-900/60"><Twitter className="h-4 w-4"/></a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/proofoffit" className="p-2 rounded-lg border hover:bg-white/60 dark:hover:bg-zinc-900/60"><Linkedin className="h-4 w-4"/></a>
              <a aria-label="GitHub" href="https://github.com/proofoffit" className="p-2 rounded-lg border hover:bg-white/60 dark:hover:bg-zinc-900/60"><Github className="h-4 w-4"/></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Product</h3>
            <ul className={`space-y-2 text-sm ${subtle}`}>
              <li><a href="#why">Features</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="/audit-sample">Sample Audit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className={`space-y-2 text-sm ${subtle}`}>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Trust & Legal</h3>
            <ul className={`space-y-2 text-sm ${subtle}`}>
              <li><a href="/fairness">Fairness & Explainability</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/status">Status</a></li>
            </ul>
            <form className="mt-4">
              <label htmlFor="newsletter" className={`text-sm ${subtle}`}>Newsletter</label>
              <div className="mt-2 flex gap-2">
                <Input id="newsletter" placeholder="you@email.com" />
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className={`text-sm ${subtle}`}>© {new Date().getFullYear()} ProofOfFit, Inc.</div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/security">Security</a>
            <a href="/status">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Page ----------

type Lane = "seeker" | "employer";

export default function ProofOfFitLanding() {
  const [lane, setLane] = useState<Lane>("seeker");
  const c = useMemo(() => laneCopy[lane], [lane]);

  return (
    <div className={warmBody}>
      <Header lane={lane} setLane={setLane} />
      {/* HERO */}
      <LivingProofHero />

      <WhyChoose />
      <HowItWorks items={lane === "seeker" ? howSeeker : howEmployer} lane={lane} />
      <Pricing lane={lane} />
      <DMTestimonials lane={lane} />
      <FooterTrustBar />
    </div>
  );
}
