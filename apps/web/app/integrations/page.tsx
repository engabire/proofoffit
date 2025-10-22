import { requireUserId } from "@/lib/auth";
import { IntegrationsDashboard } from "@/components/integrations/integrations-dashboard";

export default async function IntegrationsPage() {
    // Skip authentication for testing - in production, uncomment the line below
    // const userId = await requireUserId();

    return (
        <div className="max-w-7xl mx-auto p-8">
            <IntegrationsDashboard />
        </div>
    );
}
