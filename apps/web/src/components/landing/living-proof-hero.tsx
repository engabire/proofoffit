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
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-200/60 via-indigo-200/30 to-purple-200/20 blur-[120px] dark:from-sky-500/25 dark:via-indigo-500/20 dark:to-purple-500/15" />
      <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-emerald-200/45 via-sky-200/25 to-indigo-200/15 blur-[140px] dark:from-emerald-500/25 dark:via-sky-500/20 dark:to-indigo-500/15" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g opacity="0.05" className="text-slate-500">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v-${i}`} x1={(i + 1) * 9} y1="0" x2={(i + 1) * 9} y2="100" stroke="currentColor" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={(i + 1) * 14} x2="100" y2={(i + 1) * 14} stroke="currentColor" />
          ))}
        </g>
        <g className="text-sky-600/70 dark:text-sky-300/70">
          <circle cx="22" cy="30" r="1.6" />
          <circle cx="26" cy="36" r="1.0" />
          <circle cx="30" cy="26" r="1.2" />
          <line x1="22" y1="30" x2="26" y2="36" stroke="currentColor" opacity=".45" />
          <line x1="26" y1="36" x2="30" y2="26" stroke="currentColor" opacity=".45" />
        </g>
        <g className="text-indigo-600/70 dark:text-indigo-300/70">
          <circle cx="70" cy="18" r="1.4" />
          <circle cx="75" cy="24" r="1.0" />
          <circle cx="64" cy="24" r="1.0" />
          <line x1="70" y1="18" x2="75" y2="24" stroke="currentColor" opacity=".45" />
          <line x1="70" y1="18" x2="64" y2="24" stroke="currentColor" opacity=".45" />
        </g>
        <g className="text-emerald-600/70 dark:text-emerald-300/70">
          <circle cx="56" cy="72" r="1.6" />
          <circle cx="63" cy="67" r="1.0" />
          <circle cx="48" cy="64" r="1.1" />
          <line x1="56" y1="72" x2="63" y2="67" stroke="currentColor" opacity=".45" />
          <line x1="56" y1="72" x2="48" y2="64" stroke="currentColor" opacity=".45" />
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
