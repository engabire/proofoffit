"use client";

import { useEffect } from "react";
import { setupCtaBridge } from "@/lib/analytics";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CSRFProvider } from "@/components/security/csrf-provider";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupCtaBridge();
  }, []);

  return (
    <AccessibilityProvider>
      <CSRFProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </CSRFProvider>
    </AccessibilityProvider>
  );
}
