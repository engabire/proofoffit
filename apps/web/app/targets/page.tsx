"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@proof-of-fit/ui";
import { Plus, Target, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

interface Target {
  id: string;
  title: string;
  role: string;
  companyHint?: string;
  layout: string;
  fitScore?: number;
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    auditLinks: number;
  };
}

export default function TargetsPage() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await fetch("/api/targets");
      if (!response.ok) {
        throw new Error("Failed to fetch targets");
      }
      const data = await response.json();
      setTargets(data.targets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteTarget = async (targetId: string) => {
    if (!confirm("Are you sure you want to delete this target?")) {
      return;
    }

    try {
      const response = await fetch(`/api/targets/${targetId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete target");
      }
      setTargets(targets.filter(t => t.id !== targetId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete target");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading targets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Targets</h1>
          <p className="text-muted-foreground mt-2">
            Manage your job targets and track your fit scores
          </p>
        </div>
        <Button asChild>
          <Link href="/targets/new">
            <Plus className="w-4 h-4 mr-2" />
            New Target
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {targets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No targets yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first target to start tracking your job applications
            </p>
            <Button asChild>
              <Link href="/targets/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Target
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {targets.map((target) => (
            <Card key={target.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{target.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {target.role}
                      {target.companyHint && (
                        <span className="block text-sm text-muted-foreground">
                          {target.companyHint}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{target.layout}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {target.fitScore !== null && target.fitScore !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Fit Score</span>
                      <Badge variant={target.fitScore >= 80 ? "default" : "secondary"}>
                        {target.fitScore.toFixed(0)}%
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audit Links</span>
                    <span className="text-sm text-muted-foreground">
                      {target._count.auditLinks}
                    </span>
                  </div>

                  {target.lastAnalyzedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Analyzed</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(target.lastAnalyzedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/targets/${target.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTarget(target.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}