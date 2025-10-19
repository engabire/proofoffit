/**
 * Design tokens for ProofOfFit
 * Based on ProofOfFit-2 design guidelines with Material Design foundation
 */

// Color palette following ProofOfFit-2 specifications
export const colors = {
    // Primary brand colors
    primary: {
        50: "#f3f0ff",
        100: "#e9e5ff",
        200: "#d6ceff",
        300: "#b8a6ff",
        400: "#9575ff",
        500: "#7c3aed", // Main brand color
        600: "#6d28d9",
        700: "#5b21b6",
        800: "#4c1d95",
        900: "#3c1a78",
    },

    // Accent colors
    accent: {
        50: "#f0fdfa",
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6", // Main accent color
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
    },

    // Semantic colors
    success: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
    },

    warning: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
    },

    error: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
    },

    // Neutral colors
    gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
    },

    // Chart colors for data visualization
    chart: {
        1: "#3b82f6", // Blue
        2: "#10b981", // Green
        3: "#f59e0b", // Yellow
        4: "#ef4444", // Red
        5: "#8b5cf6", // Purple
        6: "#06b6d4", // Cyan
    },
} as const;

// Typography scale
export const typography = {
    fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
    },

    fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
    },

    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },

    lineHeight: {
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
    },

    letterSpacing: {
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
    },
} as const;

// Spacing scale
export const spacing = {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
} as const;

// Border radius
export const borderRadius = {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
} as const;

// Shadows
export const shadows = {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none",
} as const;

// Component-specific tokens
export const components = {
    // Card components
    card: {
        padding: spacing[6],
        borderRadius: borderRadius.lg,
        shadow: shadows.md,
        hoverShadow: shadows.lg,
    },

    // Button components
    button: {
        padding: {
            sm: `${spacing[2]} ${spacing[3]}`,
            md: `${spacing[2]} ${spacing[4]}`,
            lg: `${spacing[3]} ${spacing[6]}`,
        },
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },

    // Input components
    input: {
        padding: `${spacing[3]} ${spacing[4]}`,
        borderRadius: borderRadius.md,
        border: `1px solid ${colors.gray[300]}`,
        fontSize: typography.fontSize.base,
    },

    // Badge components
    badge: {
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: borderRadius.full,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },

    // Navigation
    nav: {
        height: "4rem", // 64px
        padding: spacing[4],
    },

    // Layout
    container: {
        maxWidth: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        padding: spacing[4],
    },
} as const;

// Animation tokens
export const animations = {
    duration: {
        fast: "100ms",
        normal: "200ms",
        slow: "300ms",
    },

    easing: {
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    },

    // Common transitions
    transitions: {
        default: "all 200ms ease",
        colors:
            "color 200ms ease, background-color 200ms ease, border-color 200ms ease",
        transform: "transform 200ms ease",
        opacity: "opacity 200ms ease",
    },
} as const;

// Z-index scale
export const zIndex = {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
} as const;

// Breakpoints
export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
} as const;

// Evidence/Proof type configurations
export const proofTypes = {
    link: {
        icon: "Link2",
        color: colors.chart[1], // Blue
        label: "Link",
        description: "External link to work or project",
    },
    file: {
        icon: "FileText",
        color: colors.primary[500], // Purple
        label: "File",
        description: "Document or file upload",
    },
    repo: {
        icon: "GitBranch",
        color: colors.chart[2], // Green
        label: "Repository",
        description: "Git repository or code project",
    },
    case: {
        icon: "Lightbulb",
        color: colors.chart[3], // Yellow
        label: "Case Study",
        description: "Detailed case study or analysis",
    },
} as const;

// Application status configurations
export const applicationStatuses = {
    draft: {
        color: colors.gray[500],
        label: "Draft",
        description: "Application is being prepared",
    },
    submitted: {
        color: colors.chart[1], // Blue
        label: "Submitted",
        description: "Application submitted successfully",
    },
    review: {
        color: colors.chart[3], // Yellow
        label: "Under Review",
        description: "Employer is reviewing your application",
    },
    interview: {
        color: colors.primary[500], // Purple
        label: "Interview",
        description: "Interview process in progress",
    },
    offer: {
        color: colors.chart[2], // Green
        label: "Offer",
        description: "Congratulations! You received an offer",
    },
    rejected: {
        color: colors.chart[4], // Red
        label: "Not Selected",
        description: "Application was not selected",
    },
} as const;

// Plan configurations
export const plans = {
    FREE: {
        color: colors.gray[500],
        label: "Free",
        features: ["Basic job search", "5 applications/month", "Basic profile"],
    },
    PRO: {
        color: colors.chart[1], // Blue
        label: "Pro",
        features: [
            "Unlimited applications",
            "Advanced matching",
            "Priority support",
        ],
    },
    PREMIUM: {
        color: colors.primary[500], // Purple
        label: "Premium",
        features: [
            "All Pro features",
            "AI-powered insights",
            "Custom integrations",
        ],
    },
} as const;

const designTokens = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    components,
    animations,
    zIndex,
    breakpoints,
    proofTypes,
    applicationStatuses,
    plans,
};

export default designTokens;
