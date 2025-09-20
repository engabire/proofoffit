import { requireUserId } from "@/lib/auth";
import { getAnalyticsForUser } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AnalyticsPage() {
  const userId = await requireUserId();
  
  const analytics = await getAnalyticsForUser(userId, 30);
  
  const targets = await prisma.target.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          auditLinks: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Evidence Analytics</h1>
        <p className="text-gray-600 mt-2">
          Privacy-preserving insights into your evidence board performance
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Events (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Audit Links Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.eventsByType.audit_link_created || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Claims Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.eventsByType.claim_generated || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Activity by Type</CardTitle>
            <CardDescription>
              Events tracked over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {type.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Performance</CardTitle>
            <CardDescription>
              Activity by evidence board
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.eventsByTarget).map(([targetId, data]) => (
                <div key={targetId} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{data.title}</div>
                    <div className="text-xs text-gray-500">
                      {data.count} events
                    </div>
                  </div>
                  <Badge variant="outline">{data.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest events across all your evidence boards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium capitalize">
                    {event.eventType.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.createdAt).toLocaleString()}
                  </div>
                </div>
                {event.target && (
                  <Badge variant="outline" className="text-xs">
                    {event.target.title}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Privacy Notice</h3>
        <p className="text-sm text-blue-800">
          All analytics are privacy-preserving. We track events but never store personal data. 
          Viewer information is hashed and cannot be traced back to individuals.
        </p>
      </div>
    </div>
  );
}


