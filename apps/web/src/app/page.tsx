"use client"

import React, { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
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
  BarChart3,
  BrainCircuit,
  Layers,
  Compass,
  Palette,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Label,
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
import { SecureHeader } from "@/components/navigation/secure-header";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * ProofOfFit Landing
 * - Two-lane hero toggle (Job Seeker / Employer) without page reload
 * - Receipt-style proof cards + micro-interactions
 * - Why Choose (universal), How It Works (lane-specific), Pricing (JTBD-mapped)
 * - DM-style testimonials, Footer trust bar
 * - A11y-first, analytics-friendly (data-*) hooks, minimal and clean Tailwind
 */

// ---------- Differentiated Theme System ----------
// Job Seeker: Warm, aspirational, growth-focused (sky/indigo/purple)
// Employer: Professional, authoritative, efficiency-focused (emerald/teal/blue)

const laneThemes = {
  seeker: {
    // Primary gradients - warm and aspirational
    primary: "from-sky-500 via-indigo-500 to-purple-600",
    primaryHover: "from-sky-600 via-indigo-600 to-purple-700",
    secondary: "from-indigo-400 via-purple-500 to-pink-500",
    
    // Accent colors
    accent: "sky-500",
    accentHover: "sky-600",
    accentLight: "sky-100",
    accentDark: "sky-900",
    
    // Background gradients - dreamy and inspiring
    background: [
      "from-sky-200/40 via-indigo-200/30 to-purple-200/20",
      "from-indigo-300/25 via-purple-300/20 to-pink-300/15",
    ],
    
    // Text colors
    primaryText: "text-sky-900 dark:text-sky-100",
    secondaryText: "text-indigo-700 dark:text-indigo-300",
    mutedText: "text-sky-600 dark:text-sky-400",
    
    // UI elements
    cardBg: "bg-white/80 dark:bg-slate-900/60",
    cardBorder: "border-sky-200 dark:border-sky-800",
    buttonStyle: "rounded-2xl", // More rounded, friendly
    shadowStyle: "shadow-lg shadow-sky-500/10",
  },
  employer: {
    // Primary gradients - professional and authoritative
    primary: "from-emerald-500 via-teal-500 to-cyan-600",
    primaryHover: "from-emerald-600 via-teal-600 to-cyan-700",
    secondary: "from-teal-400 via-cyan-500 to-blue-500",
    
    // Accent colors
    accent: "emerald-500",
    accentHover: "emerald-600",
    accentLight: "emerald-100",
    accentDark: "emerald-900",
    
    // Background gradients - clean and structured
    background: [
      "from-emerald-200/35 via-teal-200/25 to-cyan-200/15",
      "from-teal-300/20 via-cyan-300/15 to-blue-300/10",
    ],
    
    // Text colors
    primaryText: "text-emerald-900 dark:text-emerald-100",
    secondaryText: "text-teal-700 dark:text-teal-300",
    mutedText: "text-emerald-600 dark:text-emerald-400",
    
    // UI elements
    cardBg: "bg-white/90 dark:bg-slate-900/70",
    cardBorder: "border-emerald-200 dark:border-emerald-800",
    buttonStyle: "rounded-xl", // More structured, professional
    shadowStyle: "shadow-lg shadow-emerald-500/10",
  },
} as const;

// Legacy compatibility
const laneAccent = {
  seeker: laneThemes.seeker.primary,
  employer: laneThemes.employer.primary,
};

const warmBody = "text-slate-900 dark:text-slate-100";
const subtle = "text-slate-600 dark:text-slate-400";
const receiptMono = "font-mono text-sm";

// Updated blob gradients using new theme system
const blobGradients = {
  seeker: laneThemes.seeker.background,
  employer: laneThemes.employer.background,
  neutral: [
    "from-sky-200/45 via-indigo-200/30 to-purple-200/20",
    "from-teal-200/35 via-cyan-200/25 to-blue-200/20",
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
    headline: "Land interviews with proof. Grow with confidence.",
    subhead:
      "Our evidence engine reviews each role, tailors your application, and explains exactly why you match—so you apply with confidence, not hope.",
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

const heroHighlights = [
  {
    label: 'Average interview lift',
    value: '3.2×',
    caption: 'After 30 days on ProofOfFit',
    icon: <BarChart3 className="h-4 w-4" aria-hidden />,
  },
  {
    label: 'Time to tailored resume',
    value: '90s',
    caption: 'Expert-guided, human controlled',
    icon: <Timer className="h-4 w-4" aria-hidden />,
  },
  {
    label: 'Audit-ready trails',
    value: '100%',
    caption: 'Cryptographically chained decisions',
    icon: <Layers className="h-4 w-4" aria-hidden />,
  },
] as const;

const trustedPartners = ['Government Analysts', 'Consulting Fellows', 'UN Talent Programme', 'Inclusive Hiring Network', 'GovTech Catalysts'];

const aiHighlights = [
  {
    title: 'Explainable Fit Reports',
    description: 'Our narrative engine translates criteria into evidence you can share with recruiters or compliance teams.',
    icon: <BrainCircuit className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Adaptive Autopilot',
    description: 'Guided automations prepare resumes, outreach, and interview briefs while keeping you one approval tap away.',
    icon: <Compass className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Bias-aware Scoring',
    description: 'We surface blind spots and suggest alternate signals so your slate tells a fair, transparent story.',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Design-grade outputs',
    description: 'From dashboards to Fit Reports, every screen is crafted to feel as considered as the decisions behind it.',
    icon: <Palette className="h-5 w-5" aria-hidden />,
  },
];

const inspirationBrands = [
  { name: 'Clean Design', note: 'Clarity and calming whitespace' },
  { name: 'Enterprise Security', note: 'Robust guardrails and compliance' },
  { name: 'Professional Warmth', note: 'Human-centered interactions' },
  { name: 'Intuitive AI', note: 'Approachable and helpful guidance' },
  { name: 'Product Storytelling', note: 'Clear and compelling narratives' },
];

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
  { step: 1, title: "Build your proof", body: "Import resume, add projects, link evidence." },
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
  const theme = laneThemes[lane];
  const lanePrimary = theme.secondaryText;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-black text-white px-3 py-2 rounded">Skip to content</a>
      <header className={`sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85 border-b border-slate-200/50 dark:border-slate-800/50 ${scrolled ? "shadow-xl ring-1 ring-black/5 dark:ring-white/10" : "shadow-sm"}`}>
        <div className="mx-auto max-w-7xl px-6 h-18 flex items-center justify-between">
          {/* Logo Section */}
          <a href="/" className="group flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-all duration-200">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm"></div>
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              ProofOfFit
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="#why" className="group relative px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <FileText className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Features</span>
            </a>
            <a href="#how" className="group relative px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>How It Works</span>
            </a>
            <a href="#pricing" className="group relative px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <DollarSign className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Pricing</span>
            </a>
            <a href="/gift" className="group relative px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <Gift className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Sponsor</span>
            </a>
            <a href="/fairness" className="group relative px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Fairness</span>
            </a>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <Globe2 className="h-4 w-4" /> 
                  <span className="hidden sm:inline">EN</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4"/> English
                </DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4"/> Français
                </DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4"/> Kinyarwanda
                </DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4"/> Kiswahili
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                  <HelpCircle className="h-4 w-4" /> 
                  <span className="hidden sm:inline">Help</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4"/> Documentation
                </DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <ExternalLink className="h-4 w-4"/> Support
                </DropdownMenuItem>
                <DropdownMenuItem className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4"/> Changelog
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lane toggle */}
            <LaneToggle lane={lane} setLane={setLane} />

            {/* Theme */}
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Toggle theme" 
              onClick={toggleTheme} 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </Button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
              >
                <a 
                  href="/auth/signin"
                  aria-label="Sign in to your ProofOfFit account"
                  rel="noopener"
                >
                  Sign in
                </a>
              </Button>
              <Button 
                asChild 
                size="sm" 
                className={`bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6 ${lane === "seeker" ? "from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700" : "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"}`}
              >
                <a 
                  href={lane === "seeker" ? "/app/fit" : "/app/slate"}
                  aria-label={`Get started with ProofOfFit - ${lane === 'seeker' ? 'Create your fit report' : 'Generate candidate slates'}`}
                  rel="noopener"
                >
                  Get Started
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Toggle theme" 
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  aria-label="Open menu"
                  className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
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
    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-1" role="tablist" aria-label="Audience">
      {(["seeker", "employer"] as Lane[]).map((l) => {
        const theme = laneThemes[l];
        const isActive = lane === l;
        return (
          <button
            key={l}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${l}`}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 ${
              isActive
                ? `bg-gradient-to-r text-white shadow-md ${theme.primary} ${theme.shadowStyle} transform scale-[1.02]`
                : `text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white hover:scale-105`
            }`}
             onClick={() => { 
               setLane(l); 
               try { 
                 const { track } = require('@/lib/analytics')
                 track({ name: 'lane_select', properties: { lane: l } })
               } catch {} 
             }}
            data-evt="toggle_lane"
            data-lane={l}
          >
            <span className="relative z-10">{laneCopy[l].label}</span>
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 rounded-lg blur-sm"></div>
            )}
          </button>
        );
      })}
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

function TrustedStrip() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Inspired by the teams who set the bar</p>
              <h2 className="mt-2 font-serif text-2xl text-slate-900 dark:text-white">Beauty, utility, and approachability in one operating system.</h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-300">We blend calm authority, robust trust scaffolding, professional warmth, and intuitive approachability into every interaction.</p>
          </div>
          <div className="mt-6 grid gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 sm:grid-cols-5">
            {inspirationBrands.map((brand) => (
              <div key={brand.name} className="rounded-xl border border-white/70 bg-slate-50/70 px-4 py-3 text-center shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/60">
                <div className="text-base font-semibold text-slate-700 dark:text-slate-100">{brand.name}</div>
                <p className="mt-1 text-xs font-normal text-slate-500 dark:text-slate-400">{brand.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AIShowcase() {
  return (
    <section className="py-16" id="design">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Crafted AI workflows</p>
            <h2 className="font-serif text-3xl text-slate-900 dark:text-white">AI that feels like a senior designer, not a noisy assistant.</h2>
            <p className="text-slate-600 dark:text-slate-300">We pair approachability with governance—mirroring the calm clarity of the products you love, while proving every recommendation.</p>
          </div>
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {aiHighlights.map((item) => (
              <Card key={item.title} className="group h-full border border-white/70 bg-white/85 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/60 dark:hover:shadow-none">
                <CardContent className="space-y-3 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
                    {item.icon}
                    Signal
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyChoose() {
  return (
    <section id="why" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Why ProofOfFit</p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">Because hiring deserves evidence—and delightful software.</h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">Evidence-first matching, bias-aware automation, and audit-ready transparency, wrapped in a product experience that teams love to live in.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {universalWhy.map((w, i) => (
            <Card key={i} className="h-full border border-white/70 bg-white/85 shadow-sm shadow-slate-200/30 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/60">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">{w.icon}<CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">{w.title}</CardTitle></div>
              </CardHeader>
              <CardContent className="pt-3 text-sm text-slate-600 dark:text-slate-300">{w.body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ items, lane }: { items: { step: number; title: string; body: string }[]; lane: Lane }) {
  return (
    <section id="how" className="relative overflow-hidden py-16">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 max-w-4xl rounded-full bg-gradient-to-r from-sky-200/40 via-indigo-200/30 to-emerald-200/30 blur-3xl dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-emerald-500/20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Workflow</p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">A guided autopilot that keeps you in control.</h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">Every lane follows the same calming rhythm: gather proof, map to criteria, generate the Fit Report, and share with confidence.</p>
        </div>
        <ol className="grid gap-4 md:grid-cols-4">
          {items.map((s) => (
            <li key={s.step}>
              <Card className="h-full border border-white/70 bg-white/85 shadow-sm shadow-slate-200/30 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/60">
                <CardHeader className="pb-0">
                  <CardTitle className="font-semibold text-slate-900 dark:text-slate-100">
                    <span className="mr-2 inline-flex size-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-600 dark:bg-sky-900/40 dark:text-sky-200">{s.step}</span>
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-sm text-slate-600 dark:text-slate-300">{s.body}</CardContent>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {lane === "seeker" ? (
            <Button size="lg" asChild data-evt="cta_how">
              <a href="/app/fit" aria-label="Get your personalized fit report" rel="noopener">
                Get My Fit Report
              </a>
            </Button>
          ) : (
            <Button size="lg" asChild data-evt="cta_how">
              <a href="/app/slate" aria-label="Generate a candidate slate" rel="noopener">
                Generate a Candidate Slate
              </a>
            </Button>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">SOC2-ready • Accessible • Bias-aware by design</span>
        </div>
      </div>
    </section>
  )
}

function Pricing({ lane }: { lane: Lane }) {
  const plans = lane === "seeker" ? pricing.seeker : pricing.employer
  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Pricing</p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">Simple tiers for individuals and teams.</h2>
          </div>
          <p className={`max-w-md text-sm ${subtle}`}>Cancel anytime. Crafted with PPP affordability and sponsor pools so no candidate is left behind.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((p, i) => (
            <Card
              key={i}
              className={`relative h-full border border-white/70 bg-white/85 shadow-md shadow-slate-200/40 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/60 ${
                (p as any).highlight ? 'ring-1 ring-sky-300/70 dark:ring-sky-500/40' : ''
              }`}
            >
              {(p as any).highlight && (
                <Badge className="absolute -top-3 right-4 rounded-full bg-sky-500 text-xs text-white shadow" variant="default">Most loved</Badge>
              )}
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-slate-900 dark:text-white">{p.name}</CardTitle>
                <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{p.price} <span className="text-base font-normal text-slate-500">/ mo</span></div>
                <div className={`text-sm ${subtle}`}>{p.blurb}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-sky-500" />{f}</li>
                  ))}
                </ul>
                {(p as any).footnote && <p className={`mt-3 text-xs ${subtle}`}>{(p as any).footnote}</p>}
                <div className="mt-6">
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
          <div className="mt-8">
            <GiftSponsorPanel />
          </div>
        )}
      </div>
    </section>
  )
}

function DMTestimonials({ lane }: { lane: Lane }) {
  const items = testimonials[lane]
  return (
    <section className="relative overflow-hidden py-16" id="stories">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-gradient-to-r from-sky-200/35 via-indigo-200/25 to-emerald-200/25 blur-3xl dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-emerald-500/20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Testimonials</p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">Loved by candidates, trusted by hiring teams.</h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">ProofOfFit makes interviews calmer for candidates and gives stakeholders receipts they can stand behind.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t, index) => (
            <Card key={index} className="border border-white/70 bg-white/85 shadow-md shadow-slate-200/40 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/60">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
                  <Check className="h-4 w-4" /> Proof in practice
                </div>
                <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100">“{t.quote}”</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">— {t.name}, {t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function GiftSponsorPanel() {
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const handleRedeem = async () => {
    if (!code.trim()) return
    setRedeeming(true)
    setStatus('idle')
    setMessage(null)

    try {
      const response = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const payload = await response.json().catch(() => ({ error: 'Unexpected response' }))

      if (!response.ok) {
        setStatus('error')
        setMessage(payload?.error || 'Unable to redeem gift code')
        return
      }

      const until = payload?.currentPeriodEnd ? new Date(payload.currentPeriodEnd) : null
      setStatus('success')
      setMessage(until ? `Gift applied. Access runs through ${until.toLocaleDateString()}.` : 'Gift applied! Enjoy your sponsored months.')
      setCode('')
    } catch (error) {
      console.error('Gift redeem failed', error)
      setStatus('error')
      setMessage('Something went wrong redeeming this code. Please try again or contact support.')
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <Card className="border border-white/70 bg-gradient-to-br from-white/90 via-white/85 to-sky-50/80 shadow-md shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:from-slate-950/70 dark:via-slate-950/60 dark:to-slate-900/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100"><Gift className="h-4 w-4" /> Gift &amp; Sponsor</CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-300">Redeem a community pass or sponsor someone else’s search.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr),220px]">
        <div className="space-y-2">
          <Label htmlFor="gift-code" className="text-sm font-medium text-slate-700 dark:text-slate-200">Redeem code</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="gift-code"
              placeholder="PF-9X2M-ABCD"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              aria-label="Gift code"
            />
            <Button 
              size="sm" 
              data-evt="redeem_gift" 
              onClick={handleRedeem} 
              disabled={redeeming || !code.trim()}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              {redeeming ? 'Redeeming…' : 'Redeem'}
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Codes typically cover 1–3 months of ProofOfFit Pro. No card required.</p>
          {message && (
            <p className={`text-sm ${status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>
          )}
        </div>

        <div className="space-y-2 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Sponsor a candidate</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Gift-proof someone’s search for $12/month. We handle delivery and receipts.</p>
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium" 
            asChild 
            data-evt="sponsor_click"
          >
            <a href="/gift" aria-label="Sponsor a candidate - Give a month of Pro access" rel="noopener">
              Give a month ($12)
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FooterTrustBar() {
  return (
    <footer className="mt-16 border-t border-white/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr),repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <a href="/" className="text-lg font-semibold text-slate-900 dark:text-white">ProofOfFit</a>
            <p className={`text-sm ${subtle}`}>Receipts, not black boxes. We blend calming polish, robust guardrails, professional warmth, and intuitive AI to keep hiring both beautiful and accountable.</p>
            <div className="flex gap-3">
              <a aria-label="Twitter" href="https://x.com/proofoffit" className="rounded-xl border border-white/70 p-2 text-slate-500 transition hover:bg-white/60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900/60"><Twitter className="h-4 w-4" /></a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/proofoffit" className="rounded-xl border border-white/70 p-2 text-slate-500 transition hover:bg-white/60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900/60"><Linkedin className="h-4 w-4" /></a>
              <a aria-label="GitHub" href="https://github.com/proofoffit" className="rounded-xl border border-white/70 p-2 text-slate-500 transition hover:bg-white/60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900/60"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h3>
            <ul className={`mt-3 space-y-2 text-sm ${subtle}`}>
              <li><a href="#why">Features</a></li>
              <li><a href="#design">AI workflows</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="/audit-sample">Sample audit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
            <ul className={`mt-3 space-y-2 text-sm ${subtle}`}>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Trust & Legal</h3>
            <ul className={`mt-3 space-y-2 text-sm ${subtle}`}>
              <li><a href="/fairness">Fairness & explainability</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/status">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/60 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>© 2024 ProofOfFit, Inc. Crafted with transparency in the Midwest, with fairness and accountability at heart.</span>
          <div className="flex flex-wrap items-center gap-4">
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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle OAuth callback codes that might come to root instead of /auth/callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code || error) {
      // Redirect to the proper auth callback page with the query parameters
      const currentUrl = new URL(window.location.href);
      const callbackUrl = `/auth/callback${currentUrl.search}`;
      router.replace(callbackUrl);
    }
  }, [searchParams, router]);

  return (
    <div className={warmBody}>
      <SecureHeader />
      {/* HERO */}
      <LivingProofHero highlights={heroHighlights} trusted={trustedPartners} lane={lane} />

      {/* <AIShowcase />
      <WhyChoose />
      <HowItWorks items={lane === "seeker" ? howSeeker : howEmployer} lane={lane} />
      <Pricing lane={lane} />
      <DMTestimonials lane={lane} />
      <FooterTrustBar /> */}
    </div>
  );
}
