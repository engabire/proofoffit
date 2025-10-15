'use client'

import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import {
  FileSearch,
  Scale,
  FileText,
  ShieldCheck,
  UploadCloud,
  Info,
  Lock,
} from "lucide-react";

/**
 * Version B — Outcome-first hero + feature trio + SAFE Upload modal
 * Tailored for ProofOfFit: brand tokens, safer logos, legal/PII guardrails.
 * Drop-in for Next.js/React with Tailwind.
 */

export default function ProofOfFitHeroVb() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ackRights, setAckRights] = useState(false);
  const [ackNoPII, setAckNoPII] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dialogId = useId();

  const track = (event: string, payload?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // @ts-ignore — wire this to Segment/GA4/etc.
      window?.analytics?.track?.(event, payload);
    }
  };

  const canContinue = ackRights && ackNoPII;

  return (
    <section
      data-ab-variant="hero-version-b"
      // Brand tokens (tweak to your exact palette in one place)
      style={{
        // Core ink & accents
        // @ts-ignore – CSS vars for Tailwind arbitrary color tokens
        "--pof-ink": "#0B1026",
        "--pof-primary": "#6366F1", // indigo-500 baseline
        "--pof-accent": "#A78BFA", // violet-400 baseline
        "--pof-teal": "#22D3EE",
        "--pof-amber": "#FBBF24",
      } as React.CSSProperties}
      className="relative overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(99,102,241,0.20),transparent_60%),radial-gradient(900px_400px_at_80%_120%,rgba(167,139,250,0.18),transparent_60%)]"
      aria-labelledby="hero-heading"
    >
      {/* Background grid + soft glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* subtle grid */}
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(2,6,23,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
        {/* glows */}
        <div className="absolute -top-24 left-1/2 h-72 w-[64rem] -translate-x-1/2 rounded-full blur-3xl opacity-50 bg-gradient-to-r from-[var(--pof-accent)] via-[var(--pof-teal)] to-[var(--pof-primary)]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-[76rem] -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-[var(--pof-amber)] via-[var(--pof-accent)] to-[var(--pof-primary)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <div className="mx-auto grid max-w-3xl gap-6 py-20 text-center sm:py-28">
          <motion.h1
            id="hero-heading"
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-[var(--pof-primary)] via-[var(--pof-accent)] to-[var(--pof-teal)] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Confident hires. Defensible decisions.
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-lg text-slate-700 sm:text-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Shortlist faster, explain every match, and keep an audit trail from req to offer.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <a
              href="#demo"
              onClick={() => track("cta_clicked", { cta: "Get a live walkthrough" })}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-medium shadow-sm ring-1 ring-slate-900/5 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              Get a live walkthrough
            </a>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls={dialogId}
              onClick={() => {
                setUploadOpen(true);
                track("cta_clicked", { cta: "Upload a sample JD" });
              }}
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-medium shadow-sm ring-1 ring-slate-900/10 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
            >
              Upload a sample JD
            </button>
          </motion.div>

          {/* Proof point slot */}
          <motion.div
            className="mt-3 text-sm text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          >
            <span className="rounded-full bg-white/70 px-3 py-1 ring-1 ring-slate-900/10 backdrop-blur">
              Cut time‑to‑shortlist by <strong>37%</strong> in pilot teams
            </span>
          </motion.div>
        </div>

        {/* Logos row (safe placeholders) */}
        <div className="mx-auto mb-6 mt-0 max-w-6xl">
          <div className="grid grid-cols-3 items-center gap-x-8 gap-y-6 opacity-80 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`placeholder-logo-${i}`}
                className="flex items-center justify-center"
                aria-label="Customer logo placeholder"
              >
                <svg
                  width="96"
                  height="28"
                  viewBox="0 0 96 28"
                  role="img"
                  aria-label="YourLogo placeholder"
                  className="opacity-60"
                >
                  <rect x="0" y="4" width="96" height="20" rx="6" className="fill-slate-200" />
                </svg>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            Placeholders shown — no endorsements implied. Replace with authorized customer marks only.
          </p>
        </div>

        {/* FEATURE TRIO */}
        <div className="mx-auto grid max-w-6xl gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<FileSearch className="h-6 w-6" aria-hidden />}
            title="Explainable Matching"
            blurb="Line‑by‑line rationale with sources and weights—so every score has a why."
            footnote="No mystery filters."
          />

          <FeatureCard
            icon={<Scale className="h-6 w-6" aria-hidden />}
            title="Bias‑Reducing Automation"
            blurb="Structured workflows and transparent logic that reduce noise and support fair calls."
            footnote="Calibrated, consistent, reviewable."
          />

          <FeatureCard
            icon={<FileText className="h-6 w-6" aria-hidden />}
            title="Audit Trail by Design"
            blurb="Searchable, time‑stamped records for reviews, audits, and leadership visibility."
            footnote="Decisions, inputs, changes—logged."
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadSampleJDModal
        id={dialogId}
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onFile={(file) => setSelectedFile(file)}
        canContinue={canContinue}
        ackRights={ackRights}
        setAckRights={setAckRights}
        ackNoPII={ackNoPII}
        setAckNoPII={setAckNoPII}
        onContinue={() => {
          track("sample_jd_submitted", {
            hasFile: Boolean(selectedFile),
            fileName: selectedFile?.name,
          });
          setUploadOpen(false);
        }}
      />

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ProofOfFit",
            applicationCategory: "BusinessApplication",
            description:
              "Explainable matching, bias-aware automation, and audit-ready transparency for hiring.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  blurb,
  footnote,
}: {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  footnote?: string;
}) {
  return (
    <motion.article
      className="group relative rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 ring-1 ring-slate-200 group-hover:ring-slate-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-1 text-slate-600">{blurb}</p>
      {footnote && (
        <p className="mt-3 text-sm text-slate-500">
          <ShieldCheck className="mr-1 inline-block h-4 w-4 align-[-2px]" />
          {footnote}
        </p>
      )}
      {/* Glow edge */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--pof-accent)] to-transparent opacity-60" />
    </motion.article>
  );
}

function UploadSampleJDModal({
  id,
  open,
  onClose,
  onFile,
  canContinue,
  ackRights,
  setAckRights,
  ackNoPII,
  setAckNoPII,
  onContinue,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  onFile: (file: File | null) => void;
  canContinue: boolean;
  ackRights: boolean;
  setAckRights: (v: boolean) => void;
  ackNoPII: boolean;
  setAckNoPII: (v: boolean) => void;
  onContinue: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />

      {/* dialog */}
      <motion.div
        role="dialog"
        aria-modal="true"
        id={id}
        aria-labelledby={`${id}-title`}
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <UploadCloud className="h-5 w-5" aria-hidden />
          </div>
          <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
            Upload a sample JD
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Try ProofOfFit on a safe sample. Bring your own JD file, paste text, or use our demo JD. We show a
          line‑by‑line match rationale against anonymized candidates. No PII required.
        </p>

        {/* Uploader */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center hover:border-slate-400">
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.txt,.md,.rtf"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <UploadCloud className="mb-2 h-6 w-6" aria-hidden />
            <span className="text-sm font-medium">Choose a JD file</span>
            <span className="mt-1 text-xs text-slate-500">PDF, DOCX, TXT (max 5MB)</span>
          </label>

          <button
            type="button"
            onClick={() => onFile(null)}
            className="rounded-xl border border-slate-200 bg-white/70 p-6 text-left hover:border-slate-300"
          >
            <div className="mb-1 text-sm font-medium">Use demo JD</div>
            <p className="text-xs text-slate-500">
              Load a pre‑vetted, non‑confidential JD so you can explore explainable matching instantly.
            </p>
          </button>
        </div>

        {/* Legal + privacy guardrails */}
        <div className="mt-5 space-y-2 rounded-xl bg-slate-50/60 p-4 ring-1 ring-slate-200">
          <div className="flex items-start gap-2">
            <Lock className="mt-[2px] h-4 w-4" aria-hidden />
            <p className="text-xs text-slate-600">
              Files are processed for demo purposes only. Do not upload confidential information or PII.
            </p>
          </div>
          <label className="flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="mt-[2px] h-4 w-4 rounded border-slate-300"
              checked={ackRights}
              onChange={(e) => setAckRights(e.target.checked)}
            />
            I have the right to upload this content and it does not include confidential information.
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="mt-[2px] h-4 w-4 rounded border-slate-300"
              checked={ackNoPII}
              onChange={(e) => setAckNoPII(e.target.checked)}
            />
            I will not include PII/PHI or any data restricted by policy or contract.
          </label>
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <Info className="mt-[2px] h-4 w-4" aria-hidden />
            <p>
              For production, gate uploads behind Terms/Privacy consent and DLP scanning. Provide a sample report if unsure.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-slate-900/10 bg-white hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
