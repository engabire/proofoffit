import { Metadata } from "next";
import { SecurityAudit } from "@/components/security/security-audit";

export const metadata: Metadata = {
    title: "Security Audit - ProofOfFit",
    description:
        "Run comprehensive security audits and checks for your ProofOfFit application.",
};

export default function SecurityAuditPage() {
    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Security Audit</h1>
                <p className="text-gray-600 mt-2">
                    Run comprehensive security checks and audits to ensure your
                    application is secure.
                </p>
            </div>
            <SecurityAudit />
        </div>
    );
}
