import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReusableButton } from "@proof-of-fit/ui";

/**
 * Proofoffit — Living Proof Hero (art + utility)
 *
 * A drop-in hero that blends AWS-like clarity (announcement band, trust rails)
 * with Proofoffit originality: the Living Proof Canvas. The canvas is a
 * subtle, responsive SVG network of "evidence nodes" that gently animate
 * and react to cursor movement. On the right, a Fit Report card shows
 * verifiable elements (score, signals, stretch, audit URL) with crisp
 * micro-interactions.
 *
 * Tech: React + Tailwind + Framer Motion (no other deps). Export default.
 * A11y: keyboard-focusable buttons, visible focus rings, reduced-motion aware.
 */

// —— Small helpers ——
const useParallax = (strength = 12) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [ -50, 50 ], [ strength, -strength ]);
  const rotateY = useTransform(springX, [ -50, 50 ], [ -strength, strength ]);
  return { x, y, rotateX, rotateY };
};

// —— Decorative / generative art ——
function LivingProofCanvas() {
  // Responsive grid of nodes; lines connect clusters. Pure SVG.
  // Motion reduced for users who prefer it.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-indigo-300 via-sky-200 to-cyan-200 dark:from-indigo-600/40 dark:via-sky-500/30 dark:to-cyan-500/30" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-fuchsia-200 via-rose-200 to-amber-200 dark:from-fuchsia-500/30 dark:via-rose-500/30 dark:to-amber-400/30" />

      {/* Evidence node field */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* light grid */}
        <g opacity="0.08">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v-${i}`} x1={(i+1)*9} y1="0" x2={(i+1)*9} y2="100" stroke="currentColor" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={(i+1)*14} x2="100" y2={(i+1)*14} stroke="currentColor" />
          ))}
        </g>
        {/* clusters */}
        <g className="text-sky-700 dark:text-sky-300">
          <circle cx="20" cy="30" r="1.6" fill="url(#node)" />
          <circle cx="24" cy="35" r="0.9" fill="url(#node)" />
          <circle cx="28" cy="28" r="1.1" fill="url(#node)" />
          <line x1="20" y1="30" x2="24" y2="35" stroke="currentColor" opacity=".35" />
          <line x1="24" y1="35" x2="28" y2="28" stroke="currentColor" opacity=".35" />
        </g>
        <g className="text-indigo-700 dark:text-indigo-300">
          <circle cx="70" cy="20" r="1.4" fill="url(#node)" />
          <circle cx="75" cy="24" r="1.0" fill="url(#node)" />
          <circle cx="66" cy="26" r="1.0" fill="url(#node)" />
          <line x1="70" y1="20" x2="75" y2="24" stroke="currentColor" opacity=".35" />
          <line x1="70" y1="20" x2="66" y2="26" stroke="currentColor" opacity=".35" />
        </g>
        <g className="text-cyan-700 dark:text-cyan-300">
          <circle cx="56" cy="72" r="1.6" fill="url(#node)" />
          <circle cx="62" cy="68" r="0.9" fill="url(#node)" />
          <circle cx="50" cy="64" r="1.1" fill="url(#node)" />
          <line x1="56" y1="72" x2="62" y2="68" stroke="currentColor" opacity=".35" />
          <line x1="56" y1="72" x2="50" y2="64" stroke="currentColor" opacity=".35" />
        </g>
      </svg>
    </div>
  );
}

function AnnouncementBand() {
  return (
    <div className="mx-auto mb-6 max-w-6xl px-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/70 p-2 text-sm shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/40">
        <a className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-900" href="#demo">
          <span className="font-medium">Interactive Demo</span>
          <span aria-hidden>→</span>
        </a>
        <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-800 sm:inline-block" />
        <a className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-900" href="#webinar">
          <span>Webinar: From Prompt to Proof</span>
        </a>
        <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-800 sm:inline-block" />
        <a className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-slate-900" href="#case">
          <span>Case Study: 37% faster interviews</span>
        </a>
      </div>
    </div>
  );
}

function FitReportCard() {
  const { x, y, rotateX, rotateY } = useParallax(6);
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = (e.currentTarget).getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width/2;
    const my = e.clientY - rect.top - rect.height/2;
    x.set(mx / (rect.width/2) * 50);
    y.set(my / (rect.height/2) * 50);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY }}
      className="group relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/60"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">Fit Report <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">v1.0</span></span>
        <a href="#audit" className="underline decoration-dotted underline-offset-4 hover:text-slate-700 dark:hover:text-slate-200">Audit URL</a>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">Fit Score</div>
          <div className="text-2xl font-semibold">78/100</div>
        </div>
        <div className="text-right text-sm text-slate-600">
          <div className="">Job: DevOps | SOC2</div>
          <div className="text-slate-500">Match: Python · Terraform · Orchestration</div>
        </div>
      </div>

      <div aria-label="score bar" className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-[78%] bg-gradient-to-r from-sky-400 to-indigo-500" />
      </div>

      <ul className="mb-4 space-y-2 text-sm">
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-sky-500" /><span>✓ Signals: 2 portfolio proofs (GitHub, blog)</span></li>
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-indigo-500" /><span>✓ Stretch: Terraform</span></li>
        <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-fuchsia-500" /><span>✓ Bias‑reducing, explainable rationale</span></li>
      </ul>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 text-xs dark:bg-slate-900">
        <span className="truncate text-slate-500">https://proofoffit.co/audit/9C2X‑A7Q</span>
        <ReusableButton 
          label="Copy" 
          onClick={() => navigator.clipboard?.writeText('https://proofoffit.co/audit/9C2X‑A7Q')}
          variant="secondary"
          id="copy-audit-url"
        />
      </div>

      {/* receipt edge */}
      <div aria-hidden className="absolute -left-3 top-12 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950" />
      <div aria-hidden className="absolute -right-3 bottom-12 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950" />
    </motion.div>
  );
}

export default function LivingProofHero() {
  return (
    <section className="relative isolate overflow-hidden py-10 sm:py-14">
      <LivingProofCanvas />
      <AnnouncementBand />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:grid-cols-2">
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Agents that <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">prove</span> their answers.
          </h1>
          <p className="mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Proofoffit crafts role‑tuned agents with citations, governance, and evaluations—so every hiring decision comes with receipts, not vibes.
          </p>

          <ul className="mt-6 grid max-w-md grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-sky-500" />No credit card • ~2 minutes to first Fit Report</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-indigo-500" />Bias‑reducing, explainable rationale</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-fuchsia-500" />Gift codes welcomed • Community Pass available</li>
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ReusableButton 
              label="Start Free" 
              href="#start" 
              variant="primary" 
            />
            <ReusableButton 
              label="See 5‑minute demo" 
              href="#demo" 
              variant="secondary" 
            />
          </div>
        </div>

        <div className="relative z-10">
          <FitReportCard />
        </div>
      </div>

      {/* trust strip */}
      <div className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-4">
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-sky-500" />GDPR‑friendly</div>
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-indigo-500" />Audit Trails</div>
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-fuchsia-500" />PPP Pricing</div>
          <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" />Multilingual</div>
        </div>
      </div>
    </section>
  );
}
