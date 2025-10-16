'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";

/**
 * Resume Form — Beauty Mode (Exact Structure, Elevated UI)
 * --------------------------------------------------------
 * Tailwind-only, single-file React component. Keeps the exact locked
 * columns/rows/sections while adding a refined design system that outclasses
 * popular templates (think Awesome‑CV/Deedy/AltaCV aesthetics) without breaking ATS.
 *
 * Upgrades
 * - Theme system (accent palette, radius, density) via CSS variables
 * - Typographic polish: tracking, optical hierarchy, tabular numerals
 * - Section spine accent + subtle zebra tables + high-contrast print
 * - Toolbar: Layout (ATS/Hybrid/CaseStudy), Module, Paper size (A4/Letter),
 *   Color mode (Brand/Ink‑Saver), Accent color, Density (Compact/Standard/Roomy)
 * - Print‑first: clean page breaks, ink‑aware colors, system fonts
 */

// -----------------------------------------------
// Module content (plug‑and‑play vocabulary)
// -----------------------------------------------
const MODULES = {
  Accounting: {
    summary:
      "MBA‑trained accounting professional specializing in month‑end close, accruals/reclasses, and bank/GL reconciliations. Builds clean workpapers and checklists; partners cross‑functionally for timely variance resolution.",
    competencies: [
      "Month‑End Close",
      "JEs (Accruals/Reclasses)",
      "Bank/GL/Clearing Recons",
      "Workpapers/PBC Binder",
      "Variance Analysis (Power Query/Pivots)",
      "Cost Center Hygiene",
      "SOPs/Checklists",
      "Cross‑Functional Partnering",
    ],
    bullets: [
      "Prepared month‑end accruals/reclasses; shortened close by __ days.",
      "Reconciled bank/GL/clearing; reduced open items by __%.",
      "Built variance workbook; prep time −__%.",
    ],
  },
  "FP&A": {
    summary:
      "Finance analyst blending forecasting, budget oversight, and cashflow modeling. Builds driver‑based budgets and dashboards for better decisions and margin stability.",
    competencies: [
      "Forecasting",
      "Budget vs. Actuals",
      "Driver‑Based Models",
      "Cash Flow & Scenarios",
      "Unit Economics",
      "Variance Narratives",
      "Executive Dashboards",
      "Cost Controls",
      "Vendor/Contract Terms",
      "Risk & Compliance",
    ],
    bullets: [
      "Built route/fuel cost model; forecast accuracy +__%.",
      "Cashflow & vendor terms dashboard; on‑time payments ↑.",
      "Reco checklist feeding variance packs; review time −__%.",
    ],
  },
  "Public Health": {
    summary:
      "Program finance/ops lead aligning budgets, contracts, and compliance with data‑driven routines. Launches dashboards and evidence folders to raise transparency and audit readiness.",
    competencies: [
      "Program Budgeting",
      "Grant Financials",
      "Evidence Folders",
      "Contracts & Procurement",
      "Compliance (OMB/HIPAA, local)",
      "Operational Dashboards",
      "Preparedness Logistics",
      "Cross‑Department Coordination",
      "Stakeholder Engagement",
    ],
    bullets: [
      "Tracked grant‑eligible costs; no findings.",
      "Operational dashboards; on‑time reporting +__%.",
      "Preparedness planning via data routines.",
    ],
  },
  Transport: {
    summary:
      "Ops & compliance lead for Medicaid‑aligned logistics. Built route‑cost models, standardized regulatory reporting, and stabilized on‑time performance with margin control.",
    competencies: [
      "Route/Fuel Modeling",
      "Medicaid/Contract Compliance",
      "KPI Dashboards",
      "Audit Readiness",
      "Vendor & Driver Terms",
      "Risk Playbooks",
      "SOPs/Checklists",
      "Margin Stabilization",
      "On‑Time Performance",
    ],
    bullets: [
      "Directed finance & compliance; stabilized margins & OTP.",
      "Standardized regulatory reporting; audit readiness ↑.",
      "Bank→GL checklist; errors −__%.",
    ],
  },
  Insurance: {
    summary:
      "Needs‑based insurance specialist combining discovery, suitability documentation, and compliance. Grows pipeline while maintaining strong controls and CRM hygiene.",
    competencies: [
      "Prospecting",
      "Client Discovery",
      "Suitability & Compliance",
      "CRM Hygiene",
      "Cross‑Sell/Upsell",
      "Policy Administration",
      "Reporting",
    ],
    bullets: [
      "Delivered needs‑based products; stronger suitability docs.",
      "Expanded customer base; pipeline +__%.",
      "Standardized onboarding; cycle time −__ days.",
    ],
  },
  "Data/BI": {
    summary:
      "Data‑forward analyst using Excel/Power Query, SQL, and BI to automate reporting and clarify variance drivers. Turns messy program data into repeatable dashboards.",
    competencies: [
      "Power Query",
      "PivotTables",
      "SQL Extracts",
      "Data Cleaning",
      "KPI Definition",
      "Variance Drivers",
      "Dashboard Automation",
      "Documentation/Runbooks",
    ],
    bullets: [
      "Power Query variance workbook; prep time −__%.",
      "SQL extracts to reconcile card/vendor vs GL; cleared timing items.",
      "Authored SOPs/runbooks; reproducibility ↑.",
    ],
  },
} as const;

// -----------------------------------------------
// Small UI primitives
// -----------------------------------------------
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow-sm rounded-[var(--radius)] p-[var(--pad)] border border-[color:var(--card-border)] break-inside-avoid">
    {/* Accent bar INSIDE the card (not on the outer edge) */}
    <div className="grid grid-cols-[8px_1fr] gap-[var(--gap)] items-stretch">
      <div className="h-full w-full rounded-full bg-[color:var(--accent)]" />
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)] mb-3">{title}</div>
        {children}
      </div>
    </div>
  </div>
);

const GridRow = ({ cols = 3, children }: { cols?: 1 | 2 | 3 | 4; children: React.ReactNode }) => {
  const cls = cols === 1 ? "sm:grid-cols-1" : cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3";
  return <div className={`grid gap-[var(--gap)] ${cls} grid-cols-1`}>{children}</div>;
};

const Cell = ({ label, value }: { label: string; value?: string }) => (
  <div className="border border-[color:var(--table-border)] rounded-xl p-3 bg-[color:var(--cell-bg)]">
    <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">{label}</div>
    <div className="min-h-[20px] text-gray-900 [font-variant-numeric:tabular-nums_lining-nums]">{value || ""}</div>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs text-gray-800 bg-[color:var(--chip-bg)] border-[color:var(--chip-border)]">
    {children}
  </span>
);

const Table = ({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) => (
  <div className="overflow-hidden border border-[color:var(--table-border)] rounded-[var(--radius)]">
    <table className="w-full text-[15px]">
      <thead className="bg-[color:var(--table-head-bg)]">
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="text-left font-medium text-gray-700 px-3 py-2 border-b border-[color:var(--table-border)] uppercase text-[11px] tracking-[0.14em]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="odd:bg-white even:bg-[color:var(--zebra)]">
            {r.map((c, j) => (
              <td key={j} className="px-3 py-2 align-top border-t border-[color:var(--table-row-border)] text-[15px] text-gray-900 [font-variant-numeric:tabular-nums_lining-nums]">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// -----------------------------------------------
// Main component
// -----------------------------------------------
export default function ResumeFormBeauty() {
  const [layout, setLayout] = useState<"ATS" | "Hybrid" | "CaseStudy">(() => {
    if (typeof window === "undefined") return "ATS";
    const stored = localStorage.getItem("resume_layout");
    return stored === "Hybrid" || stored === "CaseStudy" || stored === "ATS" ? stored : "ATS";
  });
  const [module, setModule] = useState<keyof typeof MODULES>(() => {
    if (typeof window === "undefined") return "Accounting";
    const stored = localStorage.getItem("resume_module");
    return stored && stored in MODULES ? (stored as keyof typeof MODULES) : "Accounting";
  });
  const [paper, setPaper] = useState<"A4" | "Letter">(() => {
    if (typeof window === "undefined") return "A4";
    const stored = localStorage.getItem("resume_paper");
    return stored === "Letter" ? "Letter" : "A4";
  });
  const [mode, setMode] = useState<"brand" | "ink">(() => {
    if (typeof window === "undefined") return "brand";
    const stored = localStorage.getItem("resume_mode");
    return stored === "ink" ? "ink" : "brand";
  });
  const [accent, setAccent] = useState<string>(() => {
    if (typeof window === "undefined") return "#0ea5e9";
    return localStorage.getItem("resume_accent") || "#0ea5e9";
  });
  const [density, setDensity] = useState<"compact" | "standard" | "roomy">(() => {
    if (typeof window === "undefined") return "standard";
    const stored = localStorage.getItem("resume_density");
    return stored === "compact" || stored === "roomy" ? stored : "standard";
  });
  const [radius, setRadius] = useState<number>(() => {
    if (typeof window === "undefined") return 16;
    const stored = localStorage.getItem("resume_radius");
    return stored ? Number(stored) || 16 : 16;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_layout", layout);
    }
  }, [layout]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_module", module);
    }
  }, [module]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_paper", paper);
    }
  }, [paper]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_mode", mode);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_accent", accent);
    }
  }, [accent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_density", density);
    }
  }, [density]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resume_radius", String(radius));
    }
  }, [radius]);

  const selectedModule = MODULES[module];

  // Dynamic CSS variables
  const densityMap = {
    compact: { pad: "14px", gap: "10px" },
    standard: { pad: "18px", gap: "12px" },
    roomy: { pad: "22px", gap: "16px" },
  } as const;

  const vars: React.CSSProperties = {
    // theme
    ["--accent" as any]: mode === "ink" ? "#111" : accent,
    ["--muted" as any]: mode === "ink" ? "#444" : "#667085",
    ["--chip-bg" as any]: mode === "ink" ? "#f6f6f6" : "#f8fafc",
    ["--chip-border" as any]: mode === "ink" ? "#d1d5db" : "#e5e7eb",
    ["--card-border" as any]: mode === "ink" ? "#e5e7eb" : "#e6eaf2",
    ["--table-border" as any]: mode === "ink" ? "#e5e7eb" : "#e6eaf2",
    ["--table-row-border" as any]: mode === "ink" ? "#ededed" : "#eef1f6",
    ["--table-head-bg" as any]: mode === "ink" ? "#f5f5f5" : "#f6f8fb",
    ["--zebra" as any]: mode === "ink" ? "#fafafa" : "#fbfcfe",
    ["--cell-bg" as any]: "#fff",
    ["--radius" as any]: `${radius}px`,
    ["--pad" as any]: densityMap[density].pad,
    ["--gap" as any]: densityMap[density].gap,
  };

  // Sections (structure unchanged)
  const HeaderSection = (
    <SectionCard title="Header (3×2 Grid)">
      <GridRow cols={3}>
        <Cell label="Full Name" value="Your Name" />
        <Cell label="City, ST" value="City, ST" />
        <Cell label="Phone" value="(xxx) xxx-xxxx" />
      </GridRow>
      <div className="h-3" />
      <GridRow cols={3}>
        <Cell label="Email" value="you@email.com" />
        <Cell label="LinkedIn / Portfolio" value="linkedin.com/in/you" />
        <Cell label="Work Authorization" value="U.S. Permanent Resident" />
      </GridRow>
      <div className="h-3" />
      <GridRow cols={3}>
        <Cell label="Languages (with proficiency)" value="English (Fluent), French (Proficient)" />
        <div />
        <div />
      </GridRow>
    </SectionCard>
  );

  const TargetingSection = (
    <SectionCard title="Targeting Controls (Checkbox Matrix)">
      <div className="flex flex-wrap gap-2 mb-3">
        {["Healthcare", "Transport", "Higher Ed", "Corporate Finance", "Insurance", "Analytics/BI", "Ops & Compliance", "Strategy"].map(
          (t) => (
            <Chip key={t}>{t}</Chip>
          )
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {["Analyst", "Senior Analyst", "Specialist", "Coordinator", "Manager", "Director"].map((x) => (
          <Chip key={x}>{x}</Chip>
        ))}
      </div>
    </SectionCard>
  );

  const SummarySection = (
    <SectionCard title="Branding Summary (Module‑Driven)">
      <Table
        headers={["Field", "Content"]}
        rows={[
          ["Degrees / Credentials (highlights)", "MBA; MPH; BA"],
          ["Years of Relevant Experience", "15+ years"],
          ["3–4 Strengths (verb + noun)", "standardize reconciliations • launch dashboards • build cashflow models • audit readiness"],
          ["Outcomes You Deliver (metrics)", "close time −3 days • open recon items −70% • forecast accuracy +12%"],
          ["3–4 Line Summary", selectedModule.summary],
        ]}
      />
    </SectionCard>
  );

  const CompetenciesSection = (
    <SectionCard title="Core Competencies (3‑Column Grid)">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-[var(--gap)]">
        {selectedModule.competencies.map((c, i) => (
          <div key={i} className="border border-[color:var(--table-border)] rounded-lg px-3 py-2 text-sm bg-white">
            {c}
          </div>
        ))}
      </div>
    </SectionCard>
  );

  const TechStackSection = (
    <SectionCard title="Technical Stack (2‑Column Matrix)">
      <Table
        headers={["Category", "Tools / Detail"]}
        rows={[
          ["Spreadsheets / BI", "Excel (XLOOKUP, Pivots, Power Query), Power BI/Tableau"],
          ["Data / Stats", "SQL, R, Python, SPSS/Stata"],
          ["Systems", "ERP/GL, AP/AR, Card Systems, CRM, M365/Google Workspace"],
          ["Methods", "SOPs, Tie‑outs, Checklists, Evidence Folders, Recon Checklists"],
        ]}
      />
    </SectionCard>
  );

  const ExperienceSection = (
    <SectionCard title="Experience Block (Repeat per Role)">
      <Table
        headers={["Field", "Content"]}
        rows={[["Title", "Analyst / Specialist"], ["Organization", "Organization Name"], ["Sector / Business Model", "Corporate / Nonprofit"], ["Location", "City, ST"], ["Dates (MM/YYYY–MM/YYYY)", "01/2023 – 09/2025"], ["Scope (1 line)", "Owned month‑end accruals & reconciliations; standardized reporting across 3 programs."]]}
      />
      <div className="h-4" />
      <div className="text-sm font-medium mb-2">Achievements (STAR Mini‑Bullets)</div>
      <Table
        headers={["#", "Situation/Task", "Action (Tool/Method)", "Result (Metric)"]}
        rows={[["1", "Backlog of reconciling items", "Checklist + tie‑outs", "open items −70%"], ["2", "Slow close cycle", "Standardized JEs & schedule", "close time −3 days"], ["3", "Inconsistent variance notes", "Power Query variance pack", "review time −40%"]]}
      />
    </SectionCard>
  );

  const ProjectsSection = (
    <SectionCard title="Projects (Optional)">
      <Table headers={["Name", "Role", "Tools", "Outcome / Impact"]} rows={[["Variance Dashboard", "Analyst", "Power Query, Pivots", "standardized MBR reporting"]]} />
    </SectionCard>
  );

  const EducationSection = (
    <SectionCard title="Education, Licenses & Training">
      <Table headers={["Degree / Cert", "Institution & City", "Focus", "Notes"]} rows={[["MBA", "Augsburg University — Minneapolis", "Finance", ""], ["MPH", "National University of Rwanda", "Public Health & Epidemiology", ""], ["BA", "National University of Rwanda", "African Literature & Linguistics", ""]]} />
    </SectionCard>
  );

  const CivicSection = (
    <SectionCard title="Civic / Board (Optional)">
      <Table headers={["Org / Committee", "Role", "Dates", "Impact"]} rows={[["Wright County Public Health Task Force", "Member", "Oct 2023–Present", "Input on community health planning & equity"], ["Casa Guadalupana", "Board Director", "2023–Present", "Governance, fundraising, compliance oversight"]]} />
    </SectionCard>
  );

  const BulletBank = (
    <SectionCard title="Bullet Bank (Locked Rows)">
      <Table
        headers={["Track", "Starter"]}
        rows={[["Accounting/GL", "Prepared accrual & reclass JEs; shortened close by __ days."], ["Accounting/GL", "Reconciled bank→GL & clearing; open items −__%."], ["FP&A/Models", "Driver‑based budget & cashflow; forecast accuracy +__%."], ["FP&A/Models", "Variance packs; review time −__%."], ["Public Sector/Grants", "Evidence folders & schedules; on‑time reviews."], ["Operations/Compliance", "Standardized regulatory reporting; audit readiness ↑."], ["Analytics/Automation", "Power Query automation; prep time −__%."]]}
      />
    </SectionCard>
  );

  const ModuleBullets = (
    <SectionCard title="Module Bullet Starters">
      <ul className="list-disc pl-6 text-[15px] text-gray-900 space-y-1">
        {selectedModule.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </SectionCard>
  );


  const LayoutViewport = useMemo(() => { // eslint-disable-line react-hooks/exhaustive-deps
    const ATSLayout = (
      <div className="space-y-[var(--gap)]">
        {HeaderSection}
        {SummarySection}
        {CompetenciesSection}
        {ExperienceSection}
        {EducationSection}
        {TechStackSection}
        {CivicSection}
        {BulletBank}
        {ModuleBullets}
      </div>
    );

    const HybridLayout = (
      <div className="grid grid-cols-12 gap-[var(--gap)]">
        <div className="col-span-12">{HeaderSection}</div>
        <div className="col-span-12 lg:col-span-8 space-y-[var(--gap)]">
          {SummarySection}
          {ExperienceSection}
          {ProjectsSection}
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-[var(--gap)]">
          {CompetenciesSection}
          {TechStackSection}
          {EducationSection}
          {CivicSection}
          {ModuleBullets}
        </div>
      </div>
    );

    const CaseStudyLayout = (
      <div className="space-y-8">
        <div>
          <div className="text-xs text-[color:var(--muted)] mb-2">Page 1</div>
          <div className="space-y-[var(--gap)]">
            {HeaderSection}
            {SummarySection}
            {CompetenciesSection}
            {ExperienceSection}
            {EducationSection}
          </div>
        </div>
        <div className="border-t pt-6 page-break-before">
          <div className="text-xs text-[color:var(--muted)] mb-2">Page 2 — Case Studies</div>
          <SectionCard title="Case Studies (Problem → Approach → Result)">
            <Table headers={["#", "Problem", "Approach", "Result"]} rows={[["1", "Variance narratives inconsistent", "Built standardized variance pack", "review time −40%"], ["2", "Reconciling items backlog", "Checklist + tie‑outs + ownership", "open items −70%"], ["3", "Cashflow visibility low", "Driver‑based model & dashboard", "forecast accuracy +12%"]]} />
          </SectionCard>
          {ModuleBullets}
        </div>
      </div>
    );

    if (layout === "Hybrid") return HybridLayout;
    if (layout === "CaseStudy") return CaseStudyLayout;
    return ATSLayout;
  }, [layout, HeaderSection, SummarySection, CompetenciesSection, ExperienceSection, EducationSection, TechStackSection, CivicSection, BulletBank, ModuleBullets, ProjectsSection]);

  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-gray-50 to-white py-8" style={vars}>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: ${paper}; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break-before { break-before: page; }
          .break-inside-avoid { break-inside: avoid; }
          .bg-white { background: #fff !important; }
          .shadow-sm { box-shadow: none !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4">
        {/* Controls */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Resume Form — Beauty Mode</h1>
            <p className="text-sm text-gray-600">Exact structure, upgraded visuals. Tune theme below, then print/export.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["ATS", "Hybrid", "CaseStudy"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  layout === l ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"
                }`}
                title="Switch layout"
              >
                {l}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-1" />
            {Object.keys(MODULES).map((k) => (
              <button
                key={k}
                onClick={() => setModule(k as keyof typeof MODULES)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  module === k ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]" : "bg-white text-gray-700 border-gray-300"
                }`}
                title="Swap sector/position module"
              >
                {k}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-full border text-sm bg-white text-gray-700 border-gray-300"
              title="Export to PDF via Print"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Theme controls */}
        <div className="no-print grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Paper</div>
            <div className="flex gap-2">
              {["A4", "Letter"].map((p) => (
                <button key={p} onClick={() => setPaper(p as any)} className={`px-2.5 py-1.5 rounded-md border text-sm ${paper === p ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Mode</div>
            <div className="flex gap-2">
              {[{k:"brand",label:"Brand"},{k:"ink",label:"Ink‑Saver"}].map(({k,label}) => (
                <button key={k} onClick={() => setMode(k as any)} className={`px-2.5 py-1.5 rounded-md border text-sm ${mode === k ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]" : "bg-white text-gray-700 border-gray-300"}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Accent</div>
            <div className="flex gap-2 flex-wrap">
              {[
                "#0ea5e9", // sky
                "#22c55e", // green
                "#f59e0b", // amber
                "#ef4444", // red
                "#8b5cf6", // violet
                "#06b6d4", // cyan
              ].map((hex) => (
                <button
                  key={hex}
                  onClick={() => setAccent(hex)}
                  className={`w-8 h-8 rounded-full border ${accent === hex ? "ring-2 ring-offset-2 ring-[color:var(--accent)]" : ""}`}
                  style={{ background: hex, borderColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
          <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Density & Radius</div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {[{k:"compact",l:"Compact"},{k:"standard",l:"Standard"},{k:"roomy",l:"Roomy"}].map(({k,l}) => (
                <button key={k} onClick={() => setDensity(k as any)} className={`px-2.5 py-1.5 rounded-md border text-sm ${density === k ? "bg-white text-gray-900 border-[color:var(--accent)]" : "bg-white text-gray-700 border-gray-300"}`}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={8} max={24} value={radius} onChange={(e)=>setRadius(parseInt(e.target.value))} className="w-full" />
              <span className="text-xs text-gray-600 w-10 text-right">{radius}px</span>
            </div>
          </div>
        </div>

        {/* Targeting */}
        <div className="mb-4">{TargetingSection}</div>

        {/* Layout viewport */}
        {LayoutViewport}

        <div className="no-print mt-8 text-xs text-gray-500">
          Tip: keep the section order to maximize ATS parsing. Replace text values only; avoid reflowing the grid.
        </div>
      </div>
    </div>
  );
}
