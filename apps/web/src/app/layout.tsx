import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { DegradedBanner } from "@/components/system/degraded-banner";
import { ReportIssue } from "@/components/system/report-issue";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "@/lib/suppress-warnings";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "ProofOfFit - Compliance-First Hiring OS",
  description:
    "A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.",
  keywords: ["hiring", "recruitment", "compliance", "AI", "candidate matching"],
  authors: [{ name: "ProofOfFit Team" }],
  openGraph: {
    title: "ProofOfFit - Compliance-First Hiring OS",
    description:
      "A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofOfFit - Compliance-First Hiring OS",
    description:
      "A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ProofOfFit",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Vercel analytics warnings
              if (typeof window !== 'undefined') {
                const originalWarn = console.warn;
                const originalError = console.error;
                
                console.warn = function(...args) {
                  const message = args[0]?.toString() || '';
                  if (
                    message.includes('Deprecated API for given entry type') ||
                    message.includes('was preloaded using link preload but not used') ||
                    message.includes('instrumentations.iv.flushErrorBuffer')
                  ) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                console.error = function(...args) {
                  const message = args[0]?.toString() || '';
                  if (
                    message.includes('Deprecated API for given entry type') ||
                    message.includes('instrumentations.iv.flushErrorBuffer')
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-lg focus:bg-sky-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <DegradedBanner />
          <div id="main">{children}</div>
          <ReportIssue />
          <Toaster />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
