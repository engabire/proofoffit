import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card, CardContent, ReusableButton } from "@proof-of-fit/ui"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { isEnabled } from "@/lib/flags"

type HeroMetric = {
  label: string
  value: string
  caption: string
  icon?: React.ReactNode
}

type Lane = "seeker" | "employer"

type HeroProps = {
  highlights?: readonly HeroMetric[]
  trusted?: readonly string[]
  lane?: Lane
}

// ---------- Differentiated Theme System ----------
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
} as const

const useParallax = (strength = 10) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 80, damping: 20 })
  const springY = useSpring(y, { stiffness: 80, damping: 20 })
  const rotateX = useTransform(springY, [-60, 60], [strength, -strength])
  const rotateY = useTransform(springX, [-60, 60], [-strength, strength])
  return { x, y, rotateX, rotateY }
}

function LivingProofCanvas({ lane = "seeker" }: { lane?: Lane }) {
  const theme = laneThemes[lane]
  
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Ambient gradients - lane-specific positioning and colors */}
      <div className={`absolute -top-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br ${theme.background[0]} blur-[100px]`} />
      <div className={`absolute -bottom-32 -right-40 h-72 w-72 rounded-full bg-gradient-to-tr ${theme.background[1]} blur-[120px]`} />
      
      {/* Data network visualization - repositioned to avoid text interference */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Candidate Network Cluster - Top Left (avoiding main content area) */}
        <g className={lane === "seeker" ? "text-sky-500/30 dark:text-sky-400/25" : "text-emerald-500/30 dark:text-emerald-400/25"} opacity="0.6">
          <circle cx="15" cy="20" r="0.8" fill="currentColor" />
          <circle cx="20" cy="15" r="0.6" fill="currentColor" />
          <circle cx="20" cy="25" r="0.7" fill="currentColor" />
          <circle cx="10" cy="25" r="0.5" fill="currentColor" />
          <circle cx="25" cy="20" r="0.5" fill="currentColor" />
          
          {/* Ultra-thin connections showing candidate relationships */}
          <line x1="15" y1="20" x2="20" y2="15" stroke="currentColor" strokeWidth="0.15" opacity="0.4" />
          <line x1="15" y1="20" x2="20" y2="25" stroke="currentColor" strokeWidth="0.15" opacity="0.4" />
          <line x1="15" y1="20" x2="10" y2="25" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
          <line x1="20" y1="15" x2="25" y2="20" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
          <line x1="20" y1="25" x2="25" y2="20" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
        </g>

        {/* Job Requirements Network - Top Right (mirrored, avoiding content) */}
        <g className={lane === "seeker" ? "text-indigo-500/30 dark:text-indigo-400/25" : "text-teal-500/30 dark:text-teal-400/25"} opacity="0.6">
          <circle cx="85" cy="20" r="0.8" fill="currentColor" />
          <circle cx="80" cy="15" r="0.6" fill="currentColor" />
          <circle cx="80" cy="25" r="0.7" fill="currentColor" />
          <circle cx="90" cy="25" r="0.5" fill="currentColor" />
          <circle cx="75" cy="20" r="0.5" fill="currentColor" />
          
          {/* Mirrored job requirement connections - ultra-thin */}
          <line x1="85" y1="20" x2="80" y2="15" stroke="currentColor" strokeWidth="0.15" opacity="0.4" />
          <line x1="85" y1="20" x2="80" y2="25" stroke="currentColor" strokeWidth="0.15" opacity="0.4" />
          <line x1="85" y1="20" x2="90" y2="25" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
          <line x1="80" y1="15" x2="75" y2="20" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
          <line x1="80" y1="25" x2="75" y2="20" stroke="currentColor" strokeWidth="0.15" opacity="0.3" />
        </g>

        {/* Matching Network - Bottom Right (avoiding main content) */}
        <g className={lane === "seeker" ? "text-purple-500/30 dark:text-purple-400/25" : "text-cyan-500/30 dark:text-cyan-400/25"} opacity="0.6">
          <circle cx="75" cy="80" r="1.0" fill="currentColor" />
          <circle cx="70" cy="75" r="0.7" fill="currentColor" />
          <circle cx="80" cy="75" r="0.7" fill="currentColor" />
          <circle cx="70" cy="85" r="0.6" fill="currentColor" />
          <circle cx="80" cy="85" r="0.6" fill="currentColor" />
          
          {/* Symmetrical matching hub connections - ultra-thin */}
          <line x1="75" y1="80" x2="70" y2="75" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
          <line x1="75" y1="80" x2="80" y2="75" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
          <line x1="75" y1="80" x2="70" y2="85" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
          <line x1="75" y1="80" x2="80" y2="85" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
        </g>

        {/* Minimal cross-network connections - very subtle */}
        <g className="text-slate-400/20 dark:text-slate-500/15" opacity="0.3">
          {/* Top to bottom connections - avoiding center content */}
          <line x1="20" y1="25" x2="70" y2="75" stroke="currentColor" strokeWidth="0.1" opacity="0.2" strokeDasharray="2,3" />
          <line x1="80" y1="25" x2="80" y2="75" stroke="currentColor" strokeWidth="0.1" opacity="0.2" strokeDasharray="2,3" />
        </g>

        {/* Minimal grid structure - very subtle */}
        <g opacity="0.01" className="text-slate-500">
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.2" />
        </g>
      </svg>
    </div>
  )
}

function AnnouncementBand() {
  return (
    <div className="mx-auto mb-10 max-w-7xl px-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-white/80 p-2 text-sm shadow-lg shadow-slate-200/30 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-slate-950/50">
        <a className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-200 dark:hover:bg-slate-900" href="#demo">
          <span className="font-medium">Interactive demo</span>
          <span aria-hidden>→</span>
        </a>
        <span className="hidden h-4 w-px bg-slate-200/70 dark:bg-slate-800/60 sm:inline-block" />
        <a className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-200 dark:hover:bg-slate-900" href="#webinar">
          Webinar: Proof vs. prompt—governance for talent AI
        </a>
        <span className="hidden h-4 w-px bg-slate-200/70 dark:bg-slate-800/60 sm:inline-block" />
        <a className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-200 dark:hover:bg-slate-900" href="#case">
          Case study: 37% faster interviews
        </a>
      </div>
    </div>
  )
}

function FitReportCard({ lane = "seeker" }: { lane?: Lane }) {
  const { x, y, rotateX, rotateY } = useParallax(8)
  const [copied, setCopied] = React.useState(false)
  const theme = laneThemes[lane]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('https://proofoffit.co/audit/9C2X‑A7Q')
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const offsetX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const offsetY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        x.set(offsetX * 60)
        y.set(offsetY * 60)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ rotateX, rotateY }}
      className={`relative w-full max-w-md overflow-hidden ${theme.buttonStyle === "rounded-2xl" ? "rounded-[1.75rem]" : "rounded-[1.5rem]"} border ${theme.cardBorder} ${theme.cardBg} p-6 ${theme.shadowStyle} backdrop-blur-xl transition-transform`}
    >
      <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span className="inline-flex items-center gap-2">
          Fit Report
          <span className={`rounded-full ${theme.accentLight} px-2 py-0.5 text-[10px] ${theme.secondaryText} dark:${theme.accentDark}/40`}>Live</span>
        </span>
        <a href="#audit" className="inline-flex items-center gap-1 text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300 dark:hover:text-slate-100">
          Audit trail
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Score</div>
          <div className={`mt-1 text-4xl font-semibold ${theme.primaryText}`}>78</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">DevOps · SOC2 ready</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          <span className="block font-semibold text-slate-600 dark:text-slate-100">Proof signals</span>
          <span>Portfolio • Audit logs • Peer refs</span>
        </div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
        <div className={`h-full w-[78%] rounded-full bg-gradient-to-r ${theme.primary}`} />
      </div>

      <ul className={`mb-6 space-y-2 text-sm ${theme.mutedText}`}>
        <li className="flex items-center gap-2"><span className={`size-1.5 rounded-full bg-${theme.accent}`} />Signals verified via source-control activity + compliance logs</li>
        <li className="flex items-center gap-2"><span className={`size-1.5 rounded-full bg-${lane === "seeker" ? "indigo-400" : "teal-400"}`} />Stretch surfaced: infrastructure-as-code (coachable)</li>
        <li className="flex items-center gap-2"><span className={`size-1.5 rounded-full bg-${lane === "seeker" ? "purple-400" : "cyan-400"}`} />Bias guardrails: experience-first, no alma mater</li>
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-50 to-white/90 p-3 text-xs text-slate-500 shadow-inner dark:from-slate-900 dark:to-slate-950">
        <span className="truncate flex-1">https://proofoffit.co/audit/9C2X‑A7Q</span>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${theme.accent} focus-visible:ring-offset-2 ${
            copied 
              ? `bg-${theme.accent} text-white border-${theme.accent}` 
              : `bg-white/80 text-slate-700 border-slate-200 hover:bg-${theme.accentLight} hover:border-${theme.accent} hover:text-${theme.accent} dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-${theme.accentDark}/20 dark:hover:border-${theme.accent} dark:hover:text-${theme.accent}`
          } shadow-sm hover:shadow-md`}
          aria-label={copied ? "URL copied to clipboard" : "Copy audit URL to clipboard"}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <div aria-hidden className="absolute -left-3 top-16 h-6 w-6 rounded-full border border-white/70 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900" />
      <div aria-hidden className="absolute -right-3 bottom-16 h-6 w-6 rounded-full border border-white/70 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900" />
    </motion.div>
  )
}

export default function LivingProofHero({ highlights = [], trusted = [], lane = "seeker" }: HeroProps) {
  const theme = laneThemes[lane]
  
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <LivingProofCanvas lane={lane} />
      <AnnouncementBand />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-12">
        <div className="relative z-10 space-y-8 lg:col-span-6">
          <div className={`inline-flex items-center gap-2 rounded-full ${theme.accentLight}/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] ${theme.secondaryText} shadow-sm ${theme.shadowStyle} dark:${theme.accentDark}/40`}>Beauty • Utility • Proof</div>
          <div className="space-y-4">
            <h1 className={`font-serif text-4xl tracking-tight ${theme.primaryText} sm:text-5xl`}>
              {lane === "seeker" ? "Land interviews with proof. Grow with confidence." : "Hire with receipts. Scale with precision."}
            </h1>
            <p className={`max-w-xl text-lg ${theme.mutedText}`}>
              {lane === "seeker" 
                ? "Our evidence engine reviews each role, tailors your application, and explains exactly why you match—so you apply with confidence, not hope."
                : "ProofOfFit delivers ranked slates with transparent rationales and audit trails—faster hiring, fewer debates, better compliance."
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={lane === "seeker" ? "/app/fit" : "/app/slate"}
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${theme.accent} focus-visible:ring-offset-2 bg-gradient-to-r ${lane === "seeker" ? "from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700" : "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"}`}
              aria-label={`Get started with ProofOfFit - ${lane === 'seeker' ? 'Create your fit report' : 'Generate candidate slates'}`}
            >
              {lane === "seeker" ? "Get my Fit Report" : "Generate a slate"}
            </a>
            <a
              href="/demo"
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${theme.accent} focus-visible:ring-offset-2 ${
                lane === "seeker" 
                  ? "border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:hover:border-sky-700"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-700"
              }`}
              aria-label="Try interactive demo"
            >
              {lane === "seeker" ? "Try interactive demo" : "See how it works"}
            </a>
            <span className={`text-sm ${theme.mutedText} ml-2`}>
              {lane === "seeker" ? "No card • 2 minutes to first Fit Report" : "No setup • 5 minutes to first slate"}
            </span>
          </div>

          {!!highlights.length && (
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.label} className="border border-white/60 bg-white/85 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
                  <CardContent className="space-y-1.5 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.caption}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 lg:col-span-6">
          <FitReportCard lane={lane} />
        </div>
      </div>

      {isEnabled('trust-strip') && !!trusted.length && (
        <div className="mx-auto mt-16 max-w-6xl px-6">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/50">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-400">Stewarded with teams from</p>
            <div className="mt-5 grid gap-4 text-center text-sm font-medium text-slate-500 sm:grid-cols-5">
              {trusted.map((label) => (
                <span key={label} className="rounded-xl border border-white/60 bg-slate-50/80 px-3 py-2 shadow-sm shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
