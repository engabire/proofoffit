"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Resume Form — Beauty Mode + Fillable Template
 * --------------------------------------------
 * Tailwind-only, single-file React component tailored for ProofOfFit.
 *
 * What's new in this version:
 * - **Fillable template**: toggle Edit Mode to directly edit cells.
 * - **Upload/import** resume data from JSON or TXT; basic **PDF text extraction** via pdfjs-dist (optional) with a mapping wizard.
 * - **Proof links (optional)**: add URLs to achievements, projects, education, and civic items; they render as inline link icons without changing table columns.
 * - **Export JSON** of current resume data.
 * - Preserves the exact locked sections/rows/columns and the inner accent spine.
 * - Integrated with ProofOfFit's job matching and proof-of-fit system.
 */

// ------------------------
// Types & Default Content
// ------------------------

type Achievement = {
    st: string; // situation/task
    action: string;
    result: string;
    proof?: string; // URL
};

type ExperienceBlock = {
    title: string;
    organization: string;
    sector: string;
    location: string;
    dates: string;
    scope: string;
    achievements: Achievement[];
};

type Project = {
    name: string;
    role: string;
    tools: string;
    outcome: string;
    proof?: string;
};

type Education = {
    degree: string;
    institution: string;
    focus: string;
    notes?: string;
    proof?: string;
};

type Civic = {
    org: string;
    role: string;
    dates: string;
    impact: string;
    proof?: string;
};

type TechRow = { category: string; detail: string };

const MODULES = {
    "Software Engineering": {
        summary:
            "Full-stack software engineer specializing in modern web applications, API development, and scalable system architecture. Builds robust, maintainable code with focus on performance and user experience.",
        competencies: [
            "Full-Stack Development",
            "API Design & Development",
            "Database Design & Optimization",
            "Cloud Architecture (AWS/Azure)",
            "DevOps & CI/CD",
            "Testing & Quality Assurance",
            "Performance Optimization",
            "Security Best Practices",
        ],
        bullets: [
            "Developed scalable web application; improved performance by __%.",
            "Built RESTful APIs; reduced response time by __ms.",
            "Implemented CI/CD pipeline; deployment time −__%.",
        ],
    },
    "Data Science": {
        summary:
            "Data scientist combining statistical analysis, machine learning, and business intelligence to drive data-driven decisions. Builds predictive models and automated reporting systems for actionable insights.",
        competencies: [
            "Statistical Analysis",
            "Machine Learning",
            "Data Visualization",
            "Python/R Programming",
            "SQL & Database Management",
            "A/B Testing",
            "Predictive Modeling",
            "Business Intelligence",
        ],
        bullets: [
            "Built predictive model; accuracy improved by __%.",
            "Automated reporting pipeline; analysis time −__%.",
            "Implemented A/B testing framework; conversion rate +__%.",
        ],
    },
    "Product Management": {
        summary:
            "Product manager with technical background, focusing on user-centered design and data-driven product decisions. Leads cross-functional teams to deliver products that solve real user problems.",
        competencies: [
            "Product Strategy",
            "User Research",
            "Agile/Scrum Methodologies",
            "Data Analysis",
            "Cross-functional Leadership",
            "Roadmap Planning",
            "Stakeholder Management",
            "Market Research",
        ],
        bullets: [
            "Launched new feature; user engagement +__%.",
            "Optimized user flow; conversion rate +__%.",
            "Led cross-functional team; delivery time −__%.",
        ],
    },
    "UX/UI Design": {
        summary:
            "User experience designer creating intuitive, accessible interfaces that solve complex user problems. Combines user research, prototyping, and design systems to deliver exceptional user experiences.",
        competencies: [
            "User Research",
            "Wireframing & Prototyping",
            "Design Systems",
            "Accessibility (WCAG)",
            "Usability Testing",
            "Figma/Sketch",
            "Information Architecture",
            "Visual Design",
        ],
        bullets: [
            "Redesigned user interface; task completion rate +__%.",
            "Conducted user research; identified __ key pain points.",
            "Built design system; design consistency +__%.",
        ],
    },
    "DevOps": {
        summary:
            "DevOps engineer specializing in infrastructure automation, monitoring, and deployment pipelines. Builds scalable, reliable systems with focus on security and performance optimization.",
        competencies: [
            "Infrastructure as Code",
            "Container Orchestration",
            "CI/CD Pipelines",
            "Monitoring & Alerting",
            "Cloud Platforms (AWS/Azure/GCP)",
            "Security & Compliance",
            "Performance Optimization",
            "Disaster Recovery",
        ],
        bullets: [
            "Automated deployment pipeline; deployment time −__%.",
            "Implemented monitoring system; incident response time −__%.",
            "Optimized infrastructure costs; savings of __%.",
        ],
    },
    "Marketing": {
        summary:
            "Digital marketing specialist combining data analytics, content strategy, and growth hacking to drive user acquisition and engagement. Builds measurable campaigns with focus on ROI and conversion optimization.",
        competencies: [
            "Digital Marketing Strategy",
            "Content Marketing",
            "SEO/SEM",
            "Social Media Marketing",
            "Email Marketing",
            "Analytics & Reporting",
            "A/B Testing",
            "Growth Hacking",
        ],
        bullets: [
            "Launched marketing campaign; lead generation +__%.",
            "Optimized conversion funnel; conversion rate +__%.",
            "Implemented analytics tracking; data accuracy +__%.",
        ],
    },
} as const;

export type ResumeData = {
    header: {
        name: string;
        city: string;
        phone: string;
        email: string;
        linkedin: string;
        workAuth: string;
        languages: string; // comma-separated for simplicity
    };
    targeting: { sectors: string[]; levels: string[]; keywords: string[] };
    summary: {
        degrees: string;
        years: string;
        strengths: string[];
        outcomes: string;
        blurb: string;
    };
    competencies: string[];
    tech: TechRow[];
    experience: ExperienceBlock[];
    projects: Project[];
    education: Education[];
    civic: Civic[];
};

const DEFAULT_DATA: ResumeData = {
    header: {
        name: "Your Name",
        city: "City, ST",
        phone: "(xxx) xxx-xxxx",
        email: "you@email.com",
        linkedin: "linkedin.com/in/you",
        workAuth: "U.S. Permanent Resident",
        languages: "English (Fluent), Spanish (Proficient)",
    },
    targeting: {
        sectors: ["Technology", "Software Development"],
        levels: ["Senior"],
        keywords: ["React", "TypeScript", "Node.js", "AWS"],
    },
    summary: {
        degrees: "BS Computer Science; MS Software Engineering",
        years: "8+ years",
        strengths: [
            "build scalable applications",
            "optimize performance",
            "lead technical teams",
            "implement best practices",
        ],
        outcomes:
            "app performance +40% • deployment time −60% • team productivity +25%",
        blurb: MODULES["Software Engineering"].summary,
    },
    competencies: [...MODULES["Software Engineering"].competencies],
    tech: [
        {
            category: "Frontend",
            detail: "React, TypeScript, Next.js, Tailwind CSS, HTML5/CSS3",
        },
        {
            category: "Backend",
            detail: "Node.js, Python, Express, FastAPI, RESTful APIs",
        },
        {
            category: "Database",
            detail: "PostgreSQL, MongoDB, Redis, SQL, NoSQL",
        },
        {
            category: "Cloud & DevOps",
            detail: "AWS, Docker, Kubernetes, CI/CD, Git, Linux",
        },
    ],
    experience: [
        {
            title: "Senior Software Engineer",
            organization: "Tech Company",
            sector: "Technology",
            location: "San Francisco, CA",
            dates: "01/2022 – Present",
            scope:
                "Lead development of scalable web applications and mentor junior developers.",
            achievements: [
                {
                    st: "Slow application performance",
                    action: "Optimized React components & API calls",
                    result: "load time −50%",
                    proof: "",
                },
                {
                    st: "Manual deployment process",
                    action: "Built CI/CD pipeline with GitHub Actions",
                    result: "deployment time −80%",
                    proof: "",
                },
                {
                    st: "Code quality issues",
                    action: "Implemented code review process & testing",
                    result: "bug rate −60%",
                    proof: "",
                },
            ],
        },
    ],
    projects: [
        {
            name: "E-commerce Platform",
            role: "Lead Developer",
            tools: "React, Node.js, PostgreSQL",
            outcome: "increased sales by 30%",
            proof: "",
        },
    ],
    education: [
        {
            degree: "MS",
            institution: "Stanford University",
            focus: "Software Engineering",
        },
        { degree: "BS", institution: "UC Berkeley", focus: "Computer Science" },
    ],
    civic: [
        {
            org: "Code for America",
            role: "Volunteer Developer",
            dates: "2022–Present",
            impact: "Built tools for local government transparency",
        },
    ],
};

// ------------------------
// Helpers
// ------------------------
const isURL = (s?: string) => !!s && /^(https?:\/\/|www\.)/i.test(s);

function downloadJSON(filename: string, data: any) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function extractPdfText(file: File): Promise<string> {
    try {
        // PDF extraction is disabled for now due to build issues
        // TODO: Re-enable when pdfjs-dist is properly configured
        console.warn("PDF extraction is temporarily disabled");
        return "";
    } catch (e) {
        console.warn("PDF extraction failed:", e);
        return "";
    }
}

function autoMapFromText(text: string, existing: ResumeData): ResumeData {
    if (!text) return existing;
    const next = {
        ...existing,
        header: { ...existing.header },
        summary: { ...existing.summary },
    };
    const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
    const phone = text.match(/\+?\d[\d\s().-]{7,}\d/)?.[0];
    const linkedin = text.match(
        /(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9_\-/]+/i,
    )?.[0];
    if (email) next.header.email = email;
    if (phone) next.header.phone = phone;
    if (linkedin) next.header.linkedin = linkedin.replace(/^https?:\/\//, "");
    const langLine = text.split(/\n/).find((l) => /language/i.test(l));
    if (langLine) next.header.languages = langLine.replace(/.*?:\s*/i, "");
    return next;
}

function setByPath(obj: any, path: string, value: any) {
    // normalize a[0].b -> a.0.b without regex (avoids escaping issues)
    const normalized = path.replace(/\[/g, ".").replace(/\]/g, "");
    const segs = normalized.split(".");
    let cur = obj;
    for (let i = 0; i < segs.length - 1; i++) {
        const s = segs[i];
        if (!s) continue;
        if (!(s in cur)) cur[s] = {};
        cur = cur[s];
    }
    cur[segs[segs.length - 1]] = value;
}

function getByPath(obj: any, path: string) {
    const normalized = path.replace(/\[/g, ".").replace(/\]/g, "");
    const segs = normalized.split(".");
    let cur = obj;
    for (const s of segs) {
        if (!s) continue;
        if (cur == null) return undefined;
        cur = cur[s];
    }
    return cur;
}

// -----------------------------------------------
// Small UI primitives
// -----------------------------------------------
const SectionCard = (
    { title, children }: { title: string; children: React.ReactNode },
) => (
    <div className="bg-white shadow-sm rounded-[var(--radius)] p-[var(--pad)] border border-[color:var(--card-border)] break-inside-avoid">
        {/* Accent bar INSIDE the card (not on the outer edge) */}
        <div className="grid grid-cols-[8px_1fr] gap-[var(--gap)] items-stretch">
            <div className="h-full w-full rounded-full bg-[color:var(--accent)]" />
            <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)] mb-3">
                    {title}
                </div>
                {children}
            </div>
        </div>
    </div>
);

const GridRow = (
    { cols = 3, children }: { cols?: 1 | 2 | 3 | 4; children: React.ReactNode },
) => {
    const cls = cols === 1
        ? "sm:grid-cols-1"
        : cols === 2
        ? "sm:grid-cols-2"
        : cols === 4
        ? "sm:grid-cols-4"
        : "sm:grid-cols-3";
    return (
        <div className={`grid gap-[var(--gap)] ${cls} grid-cols-1`}>
            {children}
        </div>
    );
};

const LinkIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        className="inline-block align-text-bottom ml-1"
    >
        <path
            fill="currentColor"
            d="M10.59 13.41a1.98 1.98 0 0 0 2.82 0l3.88-3.88a2 2 0 1 0-2.83-2.83l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a4 4 0 0 1 5.66 5.65l-3.88 3.89a4 4 0 0 1-5.66-5.66l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a2 2 0 0 0 0 2.83z"
        />
    </svg>
);

const Cell = ({ label, value }: { label: string; value: string }) => (
    <div className="border border-[color:var(--table-border)] rounded-xl p-3 bg-[color:var(--cell-bg)]">
        <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">
            {label}
        </div>
        <div className="text-[15px] text-gray-900">{value}</div>
    </div>
);

function EditableCell(
    { label, path, data, setData, multiline = false }: {
        label: string;
        path: string;
        data: ResumeData;
        setData: (d: ResumeData) => void;
        multiline?: boolean;
    },
) {
    const edit = getByPath(data, path) ?? "";
    return (
        <div className="border border-[color:var(--table-border)] rounded-xl p-3 bg-[color:var(--cell-bg)]">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">
                {label}
            </div>
            {multiline
                ? (
                    <textarea
                        className="w-full outline-none resize-y min-h-[48px] text-[15px]"
                        value={edit}
                        onChange={(e) => {
                            const next = structuredClone(data);
                            setByPath(next, path, e.target.value);
                            setData(next);
                        }}
                    />
                )
                : (
                    <input
                        className="w-full outline-none text-[15px]"
                        value={edit}
                        onChange={(e) => {
                            const next = structuredClone(data);
                            setByPath(next, path, e.target.value);
                            setData(next);
                        }}
                    />
                )}
        </div>
    );
}

const TableShell = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden border border-[color:var(--table-border)] rounded-[var(--radius)]">
        {children}
    </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="text-left font-medium text-gray-700 px-3 py-2 border-b border-[color:var(--table-border)] uppercase text-[11px] tracking-[0.14em] bg-[color:var(--table-head-bg)]">
        {children}
    </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-2 align-top border-t border-[color:var(--table-row-border)] text-[15px] text-gray-900 [font-variant-numeric:tabular-nums_lining-nums]">
        {children}
    </td>
);

// -----------------------------------------------
// Main component
// -----------------------------------------------
export default function ResumeFormEnhanced() {
    // Theme & layout
    const [layout, setLayout] = useState<"ATS" | "Hybrid" | "CaseStudy">("ATS");
    const [module, setModule] = useState<keyof typeof MODULES>(
        "Software Engineering",
    );
    const [paper, setPaper] = useState<"A4" | "Letter">("A4");
    const [mode, setMode] = useState<"brand" | "ink">("brand");
    const [accent, setAccent] = useState<string>("#0ea5e9");
    const [density, setDensity] = useState<"compact" | "standard" | "roomy">(
        "standard",
    );
    const [radius, setRadius] = useState<number>(16);
    const [edit, setEdit] = useState<boolean>(false);

    // Data
    const [data, setData] = useState<ResumeData>(DEFAULT_DATA);

    // Initialize from localStorage on client side
    useEffect(() => {
        if (typeof window !== "undefined") {
            setLayout((localStorage.getItem("resume_layout") as any) || "ATS");
            setModule(
                (localStorage.getItem("resume_module") as any) ||
                    "Software Engineering",
            );
            setPaper((localStorage.getItem("resume_paper") as any) || "A4");
            setMode((localStorage.getItem("resume_mode") as any) || "brand");
            setAccent(localStorage.getItem("resume_accent") || "#0ea5e9");
            setDensity(
                (localStorage.getItem("resume_density") as any) || "standard",
            );
            setRadius(Number(localStorage.getItem("resume_radius")) || 16);

            const raw = localStorage.getItem("resume_data");
            if (raw) {
                try {
                    setData(JSON.parse(raw) as ResumeData);
                } catch (e) {
                    console.warn(
                        "Failed to parse resume data from localStorage:",
                        e,
                    );
                }
            }
        }
    }, []);

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
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("resume_data", JSON.stringify(data));
        }
    }, [data]);

    const m = MODULES[module];

    // Dynamic CSS variables
    const densityMap = {
        compact: { pad: "14px", gap: "10px" },
        standard: { pad: "18px", gap: "12px" },
        roomy: { pad: "22px", gap: "16px" },
    } as const;
    const vars: React.CSSProperties = {
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

    // ------------------------
    // Sections (Header, Controls, Summary, etc.)
    // ------------------------
    const HeaderSection = (
        <SectionCard title="Header (3×2 Grid)">
            {edit
                ? (
                    <>
                        <GridRow cols={3}>
                            <EditableCell
                                label="Full Name"
                                path="header.name"
                                data={data}
                                setData={setData}
                            />
                            <EditableCell
                                label="City, ST"
                                path="header.city"
                                data={data}
                                setData={setData}
                            />
                            <EditableCell
                                label="Phone"
                                path="header.phone"
                                data={data}
                                setData={setData}
                            />
                        </GridRow>
                        <div className="h-3" />
                        <GridRow cols={3}>
                            <EditableCell
                                label="Email"
                                path="header.email"
                                data={data}
                                setData={setData}
                            />
                            <EditableCell
                                label="LinkedIn / Portfolio"
                                path="header.linkedin"
                                data={data}
                                setData={setData}
                            />
                            <EditableCell
                                label="Work Authorization"
                                path="header.workAuth"
                                data={data}
                                setData={setData}
                            />
                        </GridRow>
                        <div className="h-3" />
                        <GridRow cols={3}>
                            <EditableCell
                                label="Languages (with proficiency)"
                                path="header.languages"
                                data={data}
                                setData={setData}
                                multiline
                            />
                            <div />
                            <div />
                        </GridRow>
                    </>
                )
                : (
                    <>
                        <GridRow cols={3}>
                            <Cell label="Full Name" value={data.header.name} />
                            <Cell label="City, ST" value={data.header.city} />
                            <Cell label="Phone" value={data.header.phone} />
                        </GridRow>
                        <div className="h-3" />
                        <GridRow cols={3}>
                            <Cell label="Email" value={data.header.email} />
                            <Cell
                                label="LinkedIn / Portfolio"
                                value={data.header.linkedin}
                            />
                            <Cell
                                label="Work Authorization"
                                value={data.header.workAuth}
                            />
                        </GridRow>
                        <div className="h-3" />
                        <GridRow cols={3}>
                            <Cell
                                label="Languages (with proficiency)"
                                value={data.header.languages}
                            />
                            <div />
                            <div />
                        </GridRow>
                    </>
                )}
        </SectionCard>
    );

    const TargetingSection = (
        <SectionCard title="Targeting Controls (Checkbox Matrix)">
            <div className="flex flex-wrap gap-2 mb-2">
                {data.targeting.sectors.map((t, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs text-gray-800 bg-[color:var(--chip-bg)] border-[color:var(--chip-border)]"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
                {data.targeting.levels.map((t, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs text-gray-800 bg-[color:var(--chip-bg)] border-[color:var(--chip-border)]"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {data.targeting.keywords.map((k, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs text-gray-800 bg-[color:var(--chip-bg)] border-[color:var(--chip-border)]"
                    >
                        {k}
                    </span>
                ))}
            </div>
            {edit && (
                <div className="mt-3 grid sm:grid-cols-3 gap-2">
                    <input
                        className="border rounded-md px-2 py-1"
                        placeholder="Add sector"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                setData({
                                    ...data,
                                    targeting: {
                                        ...data.targeting,
                                        sectors: [
                                            ...data.targeting.sectors,
                                            e.currentTarget.value,
                                        ],
                                    },
                                });
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                    <input
                        className="border rounded-md px-2 py-1"
                        placeholder="Add level"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                setData({
                                    ...data,
                                    targeting: {
                                        ...data.targeting,
                                        levels: [
                                            ...data.targeting.levels,
                                            e.currentTarget.value,
                                        ],
                                    },
                                });
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                    <input
                        className="border rounded-md px-2 py-1"
                        placeholder="Add keyword"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                setData({
                                    ...data,
                                    targeting: {
                                        ...data.targeting,
                                        keywords: [
                                            ...data.targeting.keywords,
                                            e.currentTarget.value,
                                        ],
                                    },
                                });
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                </div>
            )}
        </SectionCard>
    );

    const SummarySection = (
        <SectionCard title="Branding Summary (Module‑Driven)">
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Field</Th>
                            <Th>Content</Th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                            <Td>Degrees / Credentials (highlights)</Td>
                            <Td>
                                {edit
                                    ? (
                                        <EditableCell
                                            label=""
                                            path="summary.degrees"
                                            data={data}
                                            setData={setData}
                                        />
                                    )
                                    : data.summary.degrees}
                            </Td>
                        </tr>
                        <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                            <Td>Years of Relevant Experience</Td>
                            <Td>
                                {edit
                                    ? (
                                        <EditableCell
                                            label=""
                                            path="summary.years"
                                            data={data}
                                            setData={setData}
                                        />
                                    )
                                    : data.summary.years}
                            </Td>
                        </tr>
                        <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                            <Td>3–4 Strengths (verb + noun)</Td>
                            <Td>
                                {edit
                                    ? (
                                        <EditableCell
                                            label=""
                                            path="summary.strengths"
                                            data={{
                                                ...data,
                                                summary: {
                                                    ...data.summary,
                                                    strengths: data.summary
                                                        .strengths.join(" • "),
                                                },
                                            } as any}
                                            setData={(d: any) =>
                                                setData({
                                                    ...data,
                                                    summary: {
                                                        ...data.summary,
                                                        strengths: String(
                                                            d.summary.strengths,
                                                        ).split(/\s*•\s*/),
                                                    },
                                                })}
                                        />
                                    )
                                    : data.summary.strengths.join(" • ")}
                            </Td>
                        </tr>
                        <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                            <Td>Outcomes You Deliver (metrics)</Td>
                            <Td>
                                {edit
                                    ? (
                                        <EditableCell
                                            label=""
                                            path="summary.outcomes"
                                            data={data}
                                            setData={setData}
                                        />
                                    )
                                    : data.summary.outcomes}
                            </Td>
                        </tr>
                        <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                            <Td>3–4 Line Summary</Td>
                            <Td>
                                {edit
                                    ? (
                                        <EditableCell
                                            label=""
                                            path="summary.blurb"
                                            data={data}
                                            setData={setData}
                                            multiline
                                        />
                                    )
                                    : data.summary.blurb}
                            </Td>
                        </tr>
                    </tbody>
                </table>
            </TableShell>
        </SectionCard>
    );

    const CompetenciesSection = (
        <SectionCard title="Core Competencies (3‑Column Grid)">
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-[var(--gap)]">
                {data.competencies.map((c, i) => (
                    <div
                        key={i}
                        className="border border-[color:var(--table-border)] rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        {c}
                    </div>
                ))}
            </div>
            {edit && (
                <div className="mt-3">
                    <input
                        className="border rounded-md px-2 py-1 w-full"
                        placeholder="Add competency and press Enter"
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                                setData({
                                    ...data,
                                    competencies: [
                                        ...data.competencies,
                                        e.currentTarget.value,
                                    ],
                                });
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                </div>
            )}
        </SectionCard>
    );

    const TechStackSection = (
        <SectionCard title="Technical Stack (2‑Column Matrix)">
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Category</Th>
                            <Th>Tools / Detail</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.tech.map((row, i) => (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-[color:var(--zebra)]"
                            >
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={row.category}
                                                onChange={(e) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.tech[i].category =
                                                        e.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : row.category}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={row.detail}
                                                onChange={(e) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.tech[i].detail =
                                                        e.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : row.detail}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>
            {edit && (
                <button
                    className="mt-2 text-xs px-2 py-1 border rounded"
                    onClick={() => {
                        const next = structuredClone(data);
                        next.tech.push({ category: "", detail: "" });
                        setData(next);
                    }}
                >
                    + Add Row
                </button>
            )}
        </SectionCard>
    );

    const ExperienceSections = (
        <>
            {data.experience.map((exp, idx) => (
                <SectionCard
                    key={idx}
                    title={`Experience Block ${
                        data.experience.length > 1
                            ? `#${idx + 1}`
                            : "(Repeat per Role)"
                    }`}
                >
                    <TableShell>
                        <table className="w-full text-[15px]">
                            <thead>
                                <tr>
                                    <Th>Field</Th>
                                    <Th>Content</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["Title", "title"],
                                    ["Organization", "organization"],
                                    ["Sector / Business Model", "sector"],
                                    ["Location", "location"],
                                    ["Dates (MM/YYYY–MM/YYYY)", "dates"],
                                ].map(([label, key]) => (
                                    <tr
                                        key={String(key)}
                                        className="odd:bg-white even:bg-[color:var(--zebra)]"
                                    >
                                        <Td>{label}</Td>
                                        <Td>
                                            {edit
                                                ? (
                                                    <input
                                                        className="w-full outline-none"
                                                        value={(exp as any)[
                                                            key
                                                        ]}
                                                        onChange={(e) => {
                                                            const next =
                                                                structuredClone(
                                                                    data,
                                                                );
                                                            (next
                                                                .experience[
                                                                    idx
                                                                ] as any)[key] =
                                                                    e.target
                                                                        .value;
                                                            setData(next);
                                                        }}
                                                    />
                                                )
                                                : (exp as any)[key]}
                                        </Td>
                                    </tr>
                                ))}
                                <tr className="odd:bg-white even:bg-[color:var(--zebra)]">
                                    <Td>Scope (1 line)</Td>
                                    <Td>
                                        {edit
                                            ? (
                                                <textarea
                                                    className="w-full outline-none resize-y"
                                                    value={exp.scope}
                                                    onChange={(e) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.experience[idx]
                                                            .scope =
                                                                e.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                            )
                                            : exp.scope}
                                    </Td>
                                </tr>
                            </tbody>
                        </table>
                    </TableShell>

                    <div className="h-4" />
                    <div className="text-sm font-medium mb-2">
                        Achievements (STAR Mini‑Bullets)
                    </div>
                    <TableShell>
                        <table className="w-full text-[15px]">
                            <thead>
                                <tr>
                                    <Th>#</Th>
                                    <Th>Situation/Task</Th>
                                    <Th>Action (Tool/Method)</Th>
                                    <Th>Result (Metric)</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {exp.achievements.map((a, j) => (
                                    <tr
                                        key={j}
                                        className="odd:bg-white even:bg-[color:var(--zebra)]"
                                    >
                                        <Td>{j + 1}</Td>
                                        <Td>
                                            {edit
                                                ? (
                                                    <input
                                                        className="w-full outline-none"
                                                        value={a.st}
                                                        onChange={(e) => {
                                                            const next =
                                                                structuredClone(
                                                                    data,
                                                                );
                                                            next.experience[idx]
                                                                .achievements[j]
                                                                .st =
                                                                    e.target
                                                                        .value;
                                                            setData(next);
                                                        }}
                                                    />
                                                )
                                                : a.st}
                                        </Td>
                                        <Td>
                                            {edit
                                                ? (
                                                    <input
                                                        className="w-full outline-none"
                                                        value={a.action}
                                                        onChange={(e) => {
                                                            const next =
                                                                structuredClone(
                                                                    data,
                                                                );
                                                            next.experience[idx]
                                                                .achievements[j]
                                                                .action =
                                                                    e.target
                                                                        .value;
                                                            setData(next);
                                                        }}
                                                    />
                                                )
                                                : a.action}
                                        </Td>
                                        <Td>
                                            {edit
                                                ? (
                                                    <div className="flex flex-col gap-1">
                                                        <input
                                                            className="w-full outline-none"
                                                            value={a.result}
                                                            onChange={(e) => {
                                                                const next =
                                                                    structuredClone(
                                                                        data,
                                                                    );
                                                                next.experience[
                                                                    idx
                                                                ].achievements[
                                                                    j
                                                                ].result =
                                                                    e.target
                                                                        .value;
                                                                setData(next);
                                                            }}
                                                        />
                                                        <input
                                                            className="w-full outline-none text-xs"
                                                            placeholder="Proof URL (optional)"
                                                            value={a.proof ||
                                                                ""}
                                                            onChange={(e) => {
                                                                const next =
                                                                    structuredClone(
                                                                        data,
                                                                    );
                                                                next.experience[
                                                                    idx
                                                                ].achievements[
                                                                    j
                                                                ].proof =
                                                                    e.target
                                                                        .value;
                                                                setData(next);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                                : (
                                                    <span>
                                                        {a.result}
                                                        {isURL(a.proof) && (
                                                            <a
                                                                className="text-[color:var(--accent)]"
                                                                href={a.proof}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="Open proof"
                                                            >
                                                                <LinkIcon />
                                                            </a>
                                                        )}
                                                    </span>
                                                )}
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableShell>
                    {edit && (
                        <div className="mt-2 flex gap-2">
                            <button
                                className="text-xs px-2 py-1 border rounded"
                                onClick={() => {
                                    const next = structuredClone(data);
                                    next.experience[idx].achievements.push({
                                        st: "",
                                        action: "",
                                        result: "",
                                        proof: "",
                                    });
                                    setData(next);
                                }}
                            >
                                + Add Achievement
                            </button>
                            <button
                                className="text-xs px-2 py-1 border rounded"
                                onClick={() => {
                                    const next = structuredClone(data);
                                    next.experience.splice(idx, 1);
                                    setData(next);
                                }}
                            >
                                Remove Block
                            </button>
                        </div>
                    )}
                </SectionCard>
            ))}
            {edit && (
                <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => {
                        const next = structuredClone(data);
                        next.experience.push({
                            title: "",
                            organization: "",
                            sector: "",
                            location: "",
                            dates: "",
                            scope: "",
                            achievements: [],
                        });
                        setData(next);
                    }}
                >
                    + Add Experience Block
                </button>
            )}
        </>
    );

    const ProjectsSection = (
        <SectionCard title="Projects (Optional)">
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Name</Th>
                            <Th>Role</Th>
                            <Th>Tools</Th>
                            <Th>Outcome / Impact</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.projects.map((p, i) => (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-[color:var(--zebra)]"
                            >
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={p.name}
                                                onChange={(e) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.projects[i].name =
                                                        e.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : p.name}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={p.role}
                                                onChange={(e) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.projects[i].role =
                                                        e.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : p.role}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={p.tools}
                                                onChange={(e) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.projects[i].tools =
                                                        e.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : p.tools}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    className="w-full outline-none"
                                                    value={p.outcome}
                                                    onChange={(e) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.projects[i]
                                                            .outcome =
                                                                e.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                                <input
                                                    className="w-full outline-none text-xs"
                                                    placeholder="Proof URL (optional)"
                                                    value={p.proof || ""}
                                                    onChange={(e) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.projects[i].proof =
                                                            e.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                            </div>
                                        )
                                        : (
                                            <span>
                                                {p.outcome}
                                                {isURL(p.proof) && (
                                                    <a
                                                        className="text-[color:var(--accent)]"
                                                        href={p.proof}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Open proof"
                                                    >
                                                        <LinkIcon />
                                                    </a>
                                                )}
                                            </span>
                                        )}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>
            {edit && (
                <button
                    className="mt-2 text-xs px-2 py-1 border rounded"
                    onClick={() => {
                        const next = structuredClone(data);
                        next.projects.push({
                            name: "",
                            role: "",
                            tools: "",
                            outcome: "",
                            proof: "",
                        });
                        setData(next);
                    }}
                >
                    + Add Project
                </button>
            )}
        </SectionCard>
    );

    const EducationSection = (
        <SectionCard title="Education, Licenses & Training">
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Degree / Cert</Th>
                            <Th>Institution & City</Th>
                            <Th>Focus</Th>
                            <Th>Notes</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.education.map((e, i) => (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-[color:var(--zebra)]"
                            >
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={e.degree}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.education[i].degree =
                                                        ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : e.degree}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={e.institution}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.education[i]
                                                        .institution =
                                                            ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : e.institution}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={e.focus}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.education[i].focus =
                                                        ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : e.focus}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    className="w-full outline-none"
                                                    value={e.notes || ""}
                                                    onChange={(ev) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.education[i]
                                                            .notes =
                                                                ev.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                                <input
                                                    className="w-full outline-none text-xs"
                                                    placeholder="Proof URL (optional)"
                                                    value={e.proof || ""}
                                                    onChange={(ev) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.education[i]
                                                            .proof =
                                                                ev.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                            </div>
                                        )
                                        : (
                                            <span>
                                                {e.notes}
                                                {isURL(e.proof) && (
                                                    <a
                                                        className="text-[color:var(--accent)]"
                                                        href={e.proof}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Open proof"
                                                    >
                                                        <LinkIcon />
                                                    </a>
                                                )}
                                            </span>
                                        )}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>
            {edit && (
                <button
                    className="mt-2 text-xs px-2 py-1 border rounded"
                    onClick={() => {
                        const next = structuredClone(data);
                        next.education.push({
                            degree: "",
                            institution: "",
                            focus: "",
                            notes: "",
                            proof: "",
                        });
                        setData(next);
                    }}
                >
                    + Add Education
                </button>
            )}
        </SectionCard>
    );

    const CivicSection = (
        <SectionCard title="Civic / Board (Optional)">
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Org / Committee</Th>
                            <Th>Role</Th>
                            <Th>Dates</Th>
                            <Th>Impact</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.civic.map((c, i) => (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-[color:var(--zebra)]"
                            >
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={c.org}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.civic[i].org =
                                                        ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : c.org}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={c.role}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.civic[i].role =
                                                        ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : c.role}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <input
                                                className="w-full outline-none"
                                                value={c.dates}
                                                onChange={(ev) => {
                                                    const next =
                                                        structuredClone(data);
                                                    next.civic[i].dates =
                                                        ev.target.value;
                                                    setData(next);
                                                }}
                                            />
                                        )
                                        : c.dates}
                                </Td>
                                <Td>
                                    {edit
                                        ? (
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    className="w-full outline-none"
                                                    value={c.impact}
                                                    onChange={(ev) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.civic[i].impact =
                                                            ev.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                                <input
                                                    className="w-full outline-none text-xs"
                                                    placeholder="Proof URL (optional)"
                                                    value={c.proof || ""}
                                                    onChange={(ev) => {
                                                        const next =
                                                            structuredClone(
                                                                data,
                                                            );
                                                        next.civic[i].proof =
                                                            ev.target.value;
                                                        setData(next);
                                                    }}
                                                />
                                            </div>
                                        )
                                        : (
                                            <span>
                                                {c.impact}
                                                {isURL(c.proof) && (
                                                    <a
                                                        className="text-[color:var(--accent)]"
                                                        href={c.proof}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Open proof"
                                                    >
                                                        <LinkIcon />
                                                    </a>
                                                )}
                                            </span>
                                        )}
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>
            {edit && (
                <button
                    className="mt-2 text-xs px-2 py-1 border rounded"
                    onClick={() => {
                        const next = structuredClone(data);
                        next.civic.push({
                            org: "",
                            role: "",
                            dates: "",
                            impact: "",
                            proof: "",
                        });
                        setData(next);
                    }}
                >
                    + Add Civic
                </button>
            )}
        </SectionCard>
    );

    const BulletBank = (
        <SectionCard title="Module Bullet Starters + Bank">
            <div className="mb-2 text-[15px]">{m.bullets.join(" • ")}</div>
            <TableShell>
                <table className="w-full text-[15px]">
                    <thead>
                        <tr>
                            <Th>Track</Th>
                            <Th>Starter</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            [
                                "Software Engineering",
                                "Developed scalable application; performance improved by __%.",
                            ],
                            [
                                "Software Engineering",
                                "Built RESTful API; response time reduced by __ms.",
                            ],
                            [
                                "Software Engineering",
                                "Implemented CI/CD pipeline; deployment time −__%.",
                            ],
                            [
                                "Data Science",
                                "Built predictive model; accuracy improved by __%.",
                            ],
                            [
                                "Data Science",
                                "Automated reporting pipeline; analysis time −__%.",
                            ],
                            [
                                "Product Management",
                                "Launched new feature; user engagement +__%.",
                            ],
                            [
                                "UX/UI Design",
                                "Redesigned interface; task completion rate +__%.",
                            ],
                        ].map((row, i) => (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-[color:var(--zebra)]"
                            >
                                <Td>{row[0]}</Td>
                                <Td>{row[1]}</Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>
        </SectionCard>
    );

    // ------------------------
    // Layout renderers
    // ------------------------
    const ATSLayout = (
        <div className="space-y-[var(--gap)]">
            {HeaderSection}
            {TargetingSection}
            {SummarySection}
            {CompetenciesSection}
            {ExperienceSections}
            {EducationSection}
            {TechStackSection}
            {CivicSection}
            {BulletBank}
        </div>
    );

    const HybridLayout = (
        <div className="grid grid-cols-12 gap-[var(--gap)]">
            <div className="col-span-12">{HeaderSection}</div>
            <div className="col-span-12 lg:col-span-8 space-y-[var(--gap)]">
                {SummarySection}
                {ExperienceSections}
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-[var(--gap)]">
                {TargetingSection}
                {CompetenciesSection}
                {TechStackSection}
                {EducationSection}
                {CivicSection}
            </div>
            <div className="col-span-12">{BulletBank}</div>
        </div>
    );

    const CaseStudyLayout = (
        <div className="space-y-8">
            <div>
                <div className="text-xs text-[color:var(--muted)] mb-2">
                    Page 1
                </div>
                <div className="space-y-[var(--gap)]">
                    {HeaderSection}
                    {SummarySection}
                    {CompetenciesSection}
                    {ExperienceSections}
                    {EducationSection}
                </div>
            </div>
            <div className="border-t pt-6 page-break-before">
                <div className="text-xs text-[color:var(--muted)] mb-2">
                    Page 2 — Case Studies / Extras
                </div>
                {BulletBank}
            </div>
        </div>
    );

    const LayoutViewport = useMemo(() => {
        if (layout === "Hybrid") return HybridLayout;
        if (layout === "CaseStudy") return CaseStudyLayout;
        return ATSLayout;
    }, [layout, module, data, density, radius, mode, accent]);

    // ------------------------
    // Import/Export controls
    // ------------------------
    const [importText, setImportText] = useState("");

    async function handleFileUpload(file: File) {
        if (!file) return;
        if (file.type === "application/json") {
            const txt = await file.text();
            try {
                setData(JSON.parse(txt));
            } catch {}
            return;
        }
        if (file.type === "text/plain") {
            const txt = await file.text();
            setImportText(txt);
            setData((d) => autoMapFromText(txt, d));
            return;
        }
        if (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        ) {
            const txt = await extractPdfText(file);
            setImportText(txt);
            setData((d) => autoMapFromText(txt, d));
            return;
        }
    }

    return (
        <div
            className="min-h-[100vh] bg-gradient-to-b from-gray-50 to-white py-8"
            style={vars}
        >
            {/* Print styles */}
            <style>
                {`
        @media print {
          @page { size: ${paper}; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break-before { break-before: page; }
          .break-inside-avoid { break-inside: avoid; }
          .bg-white { background: #fff !important; }
          .shadow-sm { box-shadow: none !important; }
        }
      `}
            </style>

            <div className="max-w-6xl mx-auto px-4">
                {/* Toolbar */}
                <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            ProofOfFit Resume Builder
                        </h1>
                        <p className="text-sm text-gray-600">
                            Create evidence-based resumes with proof links. Edit
                            directly, or import JSON/TXT/PDF. Export JSON
                            anytime.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {(["ATS", "Hybrid", "CaseStudy"] as const).map((l) => (
                            <button
                                key={l}
                                onClick={() => setLayout(l)}
                                className={`px-3 py-1.5 rounded-full border text-sm ${
                                    layout === l
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-700 border-gray-300"
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
                                onClick={() => {
                                    setModule(k as any);
                                    setData({
                                        ...data,
                                        competencies: [
                                            ...MODULES[
                                                k as keyof typeof MODULES
                                            ].competencies,
                                        ],
                                        summary: {
                                            ...data.summary,
                                            blurb:
                                                MODULES[
                                                    k as keyof typeof MODULES
                                                ].summary,
                                        },
                                    });
                                }}
                                className={`px-3 py-1.5 rounded-full border text-sm ${
                                    module === k
                                        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                                title="Swap sector/position module"
                            >
                                {k}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-gray-200 mx-1" />
                        <button
                            onClick={() => setEdit((e) => !e)}
                            className={`px-3 py-1.5 rounded-full border text-sm ${
                                edit
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                            title="Toggle edit mode"
                        >
                            {edit ? "Editing" : "Edit Mode"}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-full border text-sm bg-white text-gray-700 border-gray-300"
                            title="Export to PDF via Print"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Theme & Data controls */}
                <div className="no-print grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">
                            Paper
                        </div>
                        <div className="flex gap-2">
                            {["A4", "Letter"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPaper(p as any)}
                                    className={`px-2.5 py-1.5 rounded-md border text-sm ${
                                        paper === p
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-300"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">
                            Mode
                        </div>
                        <div className="flex gap-2">
                            {[{ k: "brand", label: "Brand" }, {
                                k: "ink",
                                label: "Ink‑Saver",
                            }].map(({ k, label }) => (
                                <button
                                    key={k}
                                    onClick={() => setMode(k as any)}
                                    className={`px-2.5 py-1.5 rounded-md border text-sm ${
                                        mode === k
                                            ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                                            : "bg-white text-gray-700 border-gray-300"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">
                            Accent
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                "#0ea5e9",
                                "#22c55e",
                                "#f59e0b",
                                "#ef4444",
                                "#8b5cf6",
                                "#06b6d4",
                            ].map((hex) => (
                                <button
                                    key={hex}
                                    onClick={() => setAccent(hex)}
                                    className={`w-8 h-8 rounded-full border ${
                                        accent === hex
                                            ? "ring-2 ring-offset-2 ring-[color:var(--accent)]"
                                            : ""
                                    }`}
                                    style={{
                                        background: hex,
                                        borderColor: hex,
                                    }}
                                    title={hex}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="border border-[color:var(--card-border)] rounded-[var(--radius)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">
                            Density & Radius
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            {[{ k: "compact", l: "Compact" }, {
                                k: "standard",
                                l: "Standard",
                            }, { k: "roomy", l: "Roomy" }].map(({ k, l }) => (
                                <button
                                    key={k}
                                    onClick={() => setDensity(k as any)}
                                    className={`px-2.5 py-1.5 rounded-md border text-sm ${
                                        density === k
                                            ? "bg-white text-gray-900 border-[color:var(--accent)]"
                                            : "bg-white text-gray-700 border-gray-300"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={8}
                                max={24}
                                value={radius}
                                onChange={(e) =>
                                    setRadius(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <span className="text-xs text-gray-600 w-10 text-right">
                                {radius}px
                            </span>
                        </div>
                    </div>
                </div>

                {/* Import/Export Box */}
                <div className="no-print border border-[color:var(--card-border)] rounded-[var(--radius)] p-4 mb-4">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">
                        Import / Export
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <label className="px-3 py-1.5 rounded-full border text-sm bg-white text-gray-700 border-gray-300 cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept="application/json,application/pdf,text/plain"
                                onChange={(e) =>
                                    e.target.files &&
                                    handleFileUpload(e.target.files[0])}
                            />
                            Upload JSON / PDF / TXT
                        </label>
                        <button
                            className="px-3 py-1.5 rounded-full border text-sm bg-white text-gray-700 border-gray-300"
                            onClick={() => downloadJSON("resume.json", data)}
                        >
                            Export JSON
                        </button>
                    </div>
                    {importText && (
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-700">
                                Show imported text preview
                            </summary>
                            <textarea
                                className="w-full mt-2 border rounded-md p-2 text-xs h-32"
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                            />
                        </details>
                    )}
                </div>

                {/* Layout viewport */}
                {LayoutViewport}

                <div className="no-print mt-8 text-xs text-gray-500">
                    Privacy tip: remove sensitive data before exporting/sharing
                    JSON. Proof links should point to safe,
                    permission‑controlled artifacts.
                </div>
            </div>
        </div>
    );
}
