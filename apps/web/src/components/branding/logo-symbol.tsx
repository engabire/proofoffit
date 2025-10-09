import { cn } from "@/lib/utils"

interface LogoSymbolProps {
  className?: string
  label?: string
}

export function LogoSymbol({ className, label = "ProofOfFit shield" }: LogoSymbolProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20",
        className
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
        <path
          d="M32 6.5 52 13v12.5c0 11.2-6.7 20.9-17.5 24.8a5 5 0 0 1-3.1 0C20.7 46.4 14 36.7 14 25.5V13l18-6.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontSize="20"
          fontFamily="'Inter', 'Helvetica', 'Arial', sans-serif"
          fontWeight="700"
          fill="currentColor"
        >
          PF
        </text>
      </svg>
    </span>
  )
}
