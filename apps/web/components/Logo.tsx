/**
 * ProofOfFit Logo Component (Next.js)
 * Hand-drawn circle with puzzle piece branding
 * 
 * Location: apps/web/components/Logo.tsx
 */

import Image from "next/image";
import logoImage from "@/public/images/logo-puzzle-piece.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

export function Logo({ size = "md", showText = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} data-testid="logo">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Hand-drawn circle SVG with overlapping end */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 8
               C 72 8, 92 28, 92 50
               C 92 72, 72 92, 50 92
               C 28 92, 8 72, 8 50
               C 8 28, 28 8, 50 8
               L 58 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary"
            style={{
              filter: 'url(#roughen)',
            }}
          />
          <defs>
            <filter id="roughen">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" seed="1" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        
        {/* Logo image fills the circle */}
        <Image
          src={logoImage}
          alt="ProofOfFit logo"
          className="relative w-[70%] h-[70%] object-contain z-10"
          width={size === "sm" ? 24 : size === "md" ? 36 : size === "lg" ? 48 : 60}
          height={size === "sm" ? 24 : size === "md" ? 36 : size === "lg" ? 48 : 60}
          data-testid="logo-image"
        />
      </div>
      {showText && (
        <span 
          className={`${textSizeClasses[size]} font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary to-chart-2 bg-clip-text text-transparent`}
          data-testid="logo-text"
        >
          ProofOfFit
        </span>
      )}
    </div>
  );
}
