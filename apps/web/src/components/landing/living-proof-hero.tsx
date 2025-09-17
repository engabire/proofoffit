import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card, CardContent, ReusableButton } from "@proof-of-fit/ui"
import { ArrowUpRight } from "lucide-react"
import { isEnabled } from "@/lib/flags"

type HeroMetric = {
  label: string
  value: string
  caption: string
  icon?: React.ReactNode
}

type HeroProps = {
  highlights?: readonly HeroMetric[]
  trusted?: readonly string[]
}

const useParallax = (strength = 10) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 80, damping: 20 })
  const springY = useSpring(y, { stiffness: 80, damping: 20 })
  const rotateX = useTransform(springY, [-60, 60], [strength, -strength])
  const rotateY = useTransform(springX, [-60, 60], [-strength, strength])
  return { x, y, rotateX, rotateY }
}

function LivingProofCanvas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Ambient gradients - positioned to avoid content areas */}
      <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/40 via-indigo-200/20 to-purple-200/10 blur-[100px] dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-purple-500/10" />
      <div className="absolute -bottom-32 -right-40 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-200/35 via-sky-200/20 to-indigo-200/10 blur-[120px] dark:from-emerald-500/20 dark:via-sky-500/15 dark:to-indigo-500/10" />
      
      {/* Data network visualization - symmetrically arranged */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Candidate Network Cluster - Left Side */}
        <g className="text-sky-500/50 dark:text-sky-400/40" opacity="0.7">
          <circle cx="20" cy="30" r="1.2" fill="currentColor" />
          <circle cx="25" cy="25" r="0.9" fill="currentColor" />
          <circle cx="25" cy="35" r="1.0" fill="currentColor" />
          <circle cx="15" cy="35" r="0.8" fill="currentColor" />
          <circle cx="30" cy="30" r="0.8" fill="currentColor" />
          
          {/* Thin connections showing candidate relationships */}
          <line x1="20" y1="30" x2="25" y2="25" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="20" y1="30" x2="25" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="20" y1="30" x2="15" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
          <line x1="25" y1="25" x2="30" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
          <line x1="25" y1="35" x2="30" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
        </g>

        {/* Job Requirements Network - Right Side (mirrored) */}
        <g className="text-indigo-500/50 dark:text-indigo-400/40" opacity="0.7">
          <circle cx="80" cy="30" r="1.2" fill="currentColor" />
          <circle cx="75" cy="25" r="0.9" fill="currentColor" />
          <circle cx="75" cy="35" r="1.0" fill="currentColor" />
          <circle cx="85" cy="35" r="0.8" fill="currentColor" />
          <circle cx="70" cy="30" r="0.8" fill="currentColor" />
          
          {/* Mirrored job requirement connections */}
          <line x1="80" y1="30" x2="75" y2="25" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="80" y1="30" x2="75" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="80" y1="30" x2="85" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
          <line x1="75" y1="25" x2="70" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
          <line x1="75" y1="35" x2="70" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
        </g>

        {/* Matching Network - Bottom Center */}
        <g className="text-emerald-500/50 dark:text-emerald-400/40" opacity="0.7">
          <circle cx="50" cy="70" r="1.4" fill="currentColor" />
          <circle cx="45" cy="65" r="1.0" fill="currentColor" />
          <circle cx="55" cy="65" r="1.0" fill="currentColor" />
          <circle cx="45" cy="75" r="0.9" fill="currentColor" />
          <circle cx="55" cy="75" r="0.9" fill="currentColor" />
          
          {/* Symmetrical matching hub connections */}
          <line x1="50" y1="70" x2="45" y2="65" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <line x1="50" y1="70" x2="55" y2="65" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <line x1="50" y1="70" x2="45" y2="75" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
          <line x1="50" y1="70" x2="55" y2="75" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
        </g>

        {/* Symmetrical cross-network connections */}
        <g className="text-slate-400/30 dark:text-slate-500/25" opacity="0.5">
          {/* Left to center connections */}
          <line x1="25" y1="35" x2="45" y2="65" stroke="currentColor" strokeWidth="0.2" opacity="0.3" strokeDasharray="1,2" />
          <line x1="30" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="0.2" opacity="0.3" strokeDasharray="1,2" />
          
          {/* Right to center connections (symmetrical) */}
          <line x1="75" y1="35" x2="55" y2="65" stroke="currentColor" strokeWidth="0.2" opacity="0.3" strokeDasharray="1,2" />
          <line x1="70" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="0.2" opacity="0.3" strokeDasharray="1,2" />
        </g>

        {/* Minimal symmetrical grid structure */}
        <g opacity="0.02" className="text-slate-500">
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" />
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

function FitReportCard() {
  const { x, y, rotateX, rotateY } = useParallax(8)
  const [copied, setCopied] = React.useState(false)

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
      className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/40 bg-gradient-to-br from-white/95 via-white/90 to-sky-50/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-transform dark:border-white/10 dark:from-slate-950/70 dark:via-slate-950/60 dark:to-slate-900/60"
    >
      <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span className="inline-flex items-center gap-2">
          Fit Report
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] text-sky-600 dark:bg-sky-900/40 dark:text-sky-200">Live</span>
        </span>
        <a href="#audit" className="inline-flex items-center gap-1 text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300 dark:hover:text-slate-100">
          Audit trail
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Score</div>
          <div className="mt-1 text-4xl font-semibold text-slate-900 dark:text-slate-100">78</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">DevOps · SOC2 ready</p>
        </div>
        <div className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          <span className="block font-semibold text-slate-600 dark:text-slate-100">Proof signals</span>
          <span>Portfolio • Audit logs • Peer refs</span>
        </div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500" />
      </div>

      <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-sky-400" />Signals verified via GitHub + SOC2 logs</li>
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-indigo-400" />Stretch surfaced: Terraform (coachable)</li>
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" />Bias guardrails: experience-first, no alma mater</li>
      </ul>

      <div className="flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r from-slate-50 to-white/90 p-2 text-xs text-slate-500 shadow-inner dark:from-slate-900 dark:to-slate-950">
        <span className="truncate">https://proofoffit.co/audit/9C2X‑A7Q</span>
        <ReusableButton
          label={copied ? "Copied!" : "Copy"}
          onClick={handleCopy}
          variant="secondary"
          id="copy-audit-url"
        />
      </div>

      <div aria-hidden className="absolute -left-3 top-16 h-6 w-6 rounded-full border border-white/70 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900" />
      <div aria-hidden className="absolute -right-3 bottom-16 h-6 w-6 rounded-full border border-white/70 bg-white shadow-md shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900" />
    </motion.div>
  )
}

export default function LivingProofHero({ highlights = [], trusted = [] }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <LivingProofCanvas />
      <AnnouncementBand />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-12">
        <div className="relative z-10 space-y-8 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-700 shadow-sm shadow-sky-200/60 dark:bg-sky-900/40 dark:text-sky-200">Beauty • Utility • Proof</div>
          <div className="space-y-4">
            <h1 className="font-serif text-4xl tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Hire with receipts. Grow with design-caliber AI.
            </h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
              ProofOfFit blends human-centered craft with enterprise rigor—delivering Fit Reports, slates, and automations that feel as elegant as they are accountable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ReusableButton id="cta-start" label="Get started free" href="/get-started" />
            <ReusableButton id="cta-demo" label="Watch guided tour" href="/demo" variant="secondary" />
            <span className="text-sm text-slate-500 dark:text-slate-400">No card • 2 minutes to first Fit Report</span>
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
          <FitReportCard />
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
