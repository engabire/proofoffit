import { cn } from "@/lib/utils";

interface LogoSymbolProps {
  className?: string;
  label?: string;
  variant?: "default" | "gradient" | "minimal" | "white" | "dark";
}

export function LogoSymbol({
  className,
  label = "ProofOfFit logo",
  variant = "default",
}: LogoSymbolProps) {
  const baseClasses = "inline-flex items-center justify-center";

  const variantClasses = {
    default:
      "rounded-xl bg-gradient-to-br from-proof-blue to-proof-purple text-white shadow-lg",
    gradient:
      "rounded-xl bg-gradient-to-br from-proof-blue via-proof-green to-proof-purple text-white shadow-lg",
    minimal: "rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20",
    white:
      "rounded-xl bg-white text-proof-blue shadow-lg border border-gray-200",
    dark: "rounded-xl bg-gray-900 text-white shadow-lg",
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-[70%] w-[70%]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Modern shield design with gradient */}
        <defs>
          <linearGradient
            id="shieldGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Shield shape with modern styling */}
        <path
          d="M32 4 54 12v14c0 12-7.5 22.5-19.5 26.5a6 6 0 0 1-5 0C17.5 48.5 10 38 10 26V12l22-8Z"
          fill="url(#shieldGradient)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />

        {/* Modern PF text with better typography */}
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontSize="18"
          fontFamily="'Inter', 'SF Pro Display', 'Helvetica Neue', sans-serif"
          fontWeight="800"
          fill="url(#textGradient)"
          className="drop-shadow-sm"
        >
          PF
        </text>

        {/* Subtle accent dot */}
        <circle
          cx="32"
          cy="28"
          r="2"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    </span>
  );
}
