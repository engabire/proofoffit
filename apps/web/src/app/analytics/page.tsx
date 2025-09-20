import { requireUserId } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const userId = await requireUserId();
  
  // TODO: Implement analytics when database models are available
  
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track your activity and performance metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
            <CardDescription>All-time analytics events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Coming soon - analytics tracking is being implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Targets</CardTitle>
            <CardDescription>Your created targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No targets created yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Links</CardTitle>
            <CardDescription>Active audit links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No audit links created yet
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent events and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">
              Analytics tracking will be available once the feature is fully implemented
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}