import { requireUserId } from "@/lib/auth";
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

export default async function PerformancePage() {
    // Skip authentication for testing - in production, uncomment the line below
    // const userId = await requireUserId();

    return (
        <div className="max-w-7xl mx-auto p-8">
            <PerformanceDashboard />
        </div>
    );
}
