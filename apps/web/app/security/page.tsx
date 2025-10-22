import { Metadata } from "next";
import { SecurityDashboard } from "@/components/security/security-dashboard";
import { SecureAuthGuard } from "@/components/auth/secure-auth-guard";

export const metadata: Metadata = {
  title: "Security - ProofOfFit",
  description:
    "Monitor and manage security events and threats for your ProofOfFit application.",
};

export default function SecurityPage() {
  return (
    <SecureAuthGuard requireAuth={true} requireRole="admin">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor security events, manage threats, and maintain the security
            of your application.
          </p>
        </div>
        <SecurityDashboard />
      </div>
    </SecureAuthGuard>
  );
}
