import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentUsage } from "@/lib/guards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Link as LinkIcon, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function TargetsPage() {
  const userId = await requireUserId();
  
  const [targets, usage] = await Promise.all([
    prisma.target.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            auditLinks: true,
            weights: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    getCurrentUsage(userId),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evidence Boards</h1>
            <p className="text-gray-600 mt-2">
              Create role-specific evidence boards to showcase your qualifications
            </p>
          </div>
          <Button asChild>
            <Link href="/targets/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Board
            </Link>
          </Button>
        </div>
      </header>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Evidence Boards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.usage.targets} / {usage.limits.maxTargets}
            </div>
            <div className="text-xs text-gray-500">
              {usage.plan} plan
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Proofs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.usage.proofs} / {usage.limits.maxProofs}
            </div>
            <div className="text-xs text-gray-500">
              Total evidence
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.usage.activeLinks} / {usage.limits.maxActiveLinks}
            </div>
            <div className="text-xs text-gray-500">
              Audit links
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Targets Grid */}
      {targets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No evidence boards yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first evidence board to start showcasing your qualifications
            </p>
            <Button asChild>
              <Link href="/targets/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Board
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => (
            <Card key={target.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{target.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {target.role} {target.companyHint && `at ${target.companyHint}`}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {target.layout.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Proofs</span>
                    <span>{target._count.weights}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Audit Links</span>
                    <span>{target._count.auditLinks}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/targets/${target.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/targets/${target.id}/proofs`}>
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade Prompt */}
      {!usage.isWithinLimits.targets && (
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">
                  Upgrade to create more evidence boards
                </h3>
                <p className="text-sm text-blue-800 mt-1">
                  You've reached your limit of {usage.limits.maxTargets} boards on the {usage.plan} plan.
                </p>
              </div>
              <Button variant="default" asChild>
                <Link href="/pricing">
                  Upgrade Plan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
