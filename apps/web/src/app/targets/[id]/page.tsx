import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Share, BarChart3, FileText, Eye } from "lucide-react";
import Link from "next/link";

interface TargetPageProps {
  params: {
    id: string;
  };
}

export default async function TargetPage({ params }: TargetPageProps) {
  const userId = await requireUserId();
  const { id } = params;

  const target = await prisma.target.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
    include: {
      weights: {
        where: { weight: { gt: 0 } },
        include: {
          proof: true,
        },
      },
      auditLinks: {
        where: {
          isRevoked: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!target) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Evidence Board Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              This evidence board doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link href="/targets">
                Back to Evidence Boards
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const proofs = target.weights.map(w => w.proof);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{target.title}</h1>
            <p className="text-gray-600 mt-2">
              {target.role} {target.companyHint && `at ${target.companyHint}`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {target.layout.toLowerCase()} layout
              </Badge>
              <Badge variant="secondary">
                {proofs.length} proofs
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/targets/${target.id}/proofs`}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Manage Proofs
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/targets/${target.id}/audit-links`}>
                <Share className="w-4 h-4 mr-2" />
                Create Audit Link
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for this evidence board
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href={`/targets/${target.id}/requirement-fit`}>
                    <div className="text-left">
                      <div className="font-medium">Check JD Fit</div>
                      <div className="text-sm text-gray-600">
                        Analyze job description against your evidence
                      </div>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href={`/targets/${target.id}/claim-generator`}>
                    <div className="text-left">
                      <div className="font-medium">Compose Claim</div>
                      <div className="text-sm text-gray-600">
                        Generate evidence-backed claims
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence Summary</CardTitle>
              <CardDescription>
                Proofs included in this evidence board
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proofs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No proofs added yet</p>
                  <Button asChild>
                    <Link href={`/targets/${target.id}/proofs`}>
                      Add Your First Proof
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {proofs.map((proof) => (
                    <div key={proof.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{proof.title}</h3>
                        {proof.summary && (
                          <p className="text-sm text-gray-600 mt-1">{proof.summary}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {proof.kind}
                          </Badge>
                          {proof.url && (
                      <a href={proof.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Evidence
                      </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Audit Links */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Links</CardTitle>
              <CardDescription>
                Share this evidence board securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              {target.auditLinks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-3">No audit links created</p>
                  <Button size="sm" asChild>
                    <Link href={`/targets/${target.id}/audit-links`}>
                      <Share className="w-4 h-4 mr-1" />
                      Create Link
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {target.auditLinks.slice(0, 3).map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">
                          {link.viewsCount} views
                        </div>
                        <div className="text-xs text-gray-600">
                          {link.expiresAt ? `Expires ${new Date(link.expiresAt).toLocaleDateString()}` : 'No expiry'}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/a/${link.token}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {target.auditLinks.length > 3 && (
                    <Button size="sm" variant="outline" asChild className="w-full">
                      <Link href={`/targets/${target.id}/audit-links`}>
                        View All ({target.auditLinks.length})
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          {target.lastJdJson && (
            <Card>
              <CardHeader>
                <CardTitle>Last Job Description</CardTitle>
                <CardDescription>
                  Most recent analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>Analyzed on {new Date((target.lastJdJson as any).analyzedAt).toLocaleDateString()}</p>
                  <p className="mt-1">
                    {(target.lastJdJson as any).requirements?.length || 0} requirements found
                  </p>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3" asChild>
                  <Link href={`/targets/${target.id}/requirement-fit`}>
                    <FileText className="w-4 h-4 mr-1" />
                    View Analysis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
