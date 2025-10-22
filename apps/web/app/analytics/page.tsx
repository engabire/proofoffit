import { requireUserId } from "@/lib/auth";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default async function AnalyticsPage() {
  // Skip authentication for testing - in production, uncomment the line below
  // const userId = await requireUserId();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <AnalyticsDashboard />
    </div>
  );
}
