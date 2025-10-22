import { Metadata } from "next";
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard";

export const metadata: Metadata = {
    title: "Monitoring - ProofOfFit",
    description:
        "Monitor system performance, business metrics, and alerts for your ProofOfFit application.",
};

export default function MonitoringPage() {
    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Monitor system performance, business metrics, and alerts in
                    real-time.
                </p>
            </div>
            <MonitoringDashboard />
        </div>
    );
}
