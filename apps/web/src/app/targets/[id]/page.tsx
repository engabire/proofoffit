"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@proof-of-fit/ui";
import { Textarea } from "@proof-of-fit/ui";
import { 
  Target, 
  Link as LinkIcon, 
  BarChart3, 
  Plus, 
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";

interface Target {
  id: string;
  title: string;
  role: string;
  companyHint?: string;
  layout: string;
  rubricJson: any;
  jdSnapshot?: string;
  fitScore?: number;
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
  weights: Array<{
    id: string;
    weight: number;
    proof: {
      id: string;
      title: string;
      summary: string;
      kind: string;
    };
  }>;
  auditLinks: Array<{
    id: string;
    token: string;
    expiresAt?: string;
    maxViews?: number;
    viewsCount: number;
    createdAt: string;
  }>;
}

export default function TargetDetailPage() {
  const params = useParams();
  const targetId = params.id as string;
  
  const [target, setTarget] = useState<Target | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const fetchTarget = useCallback(async () => {
    try {
      const response = await fetch(`/api/targets/${targetId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch target");
      }
      const data = await response.json();
      setTarget(data);
      setJdText(data.jdSnapshot || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    if (targetId) {
      fetchTarget();
    }
  }, [targetId, fetchTarget]);

  const analyzeFit = async () => {
    if (!jdText.trim()) {
      setError("Please enter a job description");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("/api/requirement-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
          jdText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze fit");
      }

      const data = await response.json();
      setTarget(prev => prev ? { ...prev, fitScore: data.fitScore } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze fit");
    } finally {
      setAnalyzing(false);
    }
  };

  const createAuditLink = async () => {
    try {
      const response = await fetch("/api/audit-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create audit link");
      }

      const data = await response.json();
      await fetchTarget(); // Refresh to show new link
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create audit link");
    }
  };

  const copyAuditLink = (token: string) => {
    const url = `${window.location.origin}/a/${token}`;
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading target...</div>
        </div>
      </div>
    );
  }

  if (error || !target) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground">{error || "Target not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{target.title}</h1>
              <p className="text-xl text-muted-foreground mt-1">{target.role}</p>
              {target.companyHint && (
                <p className="text-muted-foreground mt-1">{target.companyHint}</p>
              )}
            </div>
            <Badge variant="outline">{target.layout}</Badge>
          </div>

          {target.fitScore !== null && target.fitScore !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              <span className="text-lg font-semibold">Fit Score:</span>
              <Badge variant={target.fitScore >= 80 ? "default" : "secondary"} className="text-lg">
                {target.fitScore.toFixed(0)}%
              </Badge>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Description Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description Analysis</CardTitle>
              <CardDescription>
                Paste a job description to analyze your fit score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={8}
              />
              <Button 
                onClick={analyzeFit} 
                disabled={analyzing || !jdText.trim()}
                className="w-full"
              >
                {analyzing ? "Analyzing..." : "Analyze Fit"}
              </Button>
            </CardContent>
          </Card>

          {/* Proofs */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Proofs</CardTitle>
              <CardDescription>
                Evidence linked to this target
              </CardDescription>
            </CardHeader>
            <CardContent>
              {target.weights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No proofs linked yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {target.weights.map((weight) => (
                    <div key={weight.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{weight.proof.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {weight.proof.summary}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {weight.proof.kind}
                          </Badge>
                        </div>
                        <Badge variant="secondary">
                          {weight.weight}x
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Audit Links */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Audit Links</CardTitle>
                <CardDescription>
                  Share this target with employers
                </CardDescription>
              </div>
              <Button onClick={createAuditLink}>
                <Plus className="w-4 h-4 mr-2" />
                Create Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {target.auditLinks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No audit links created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {target.auditLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {link.token.substring(0, 8)}...
                          </code>
                          <Badge variant="outline">
                            {link.viewsCount} views
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Created: {new Date(link.createdAt).toLocaleDateString()}
                          {link.expiresAt && (
                            <span className="ml-4">
                              Expires: {new Date(link.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyAuditLink(link.token)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={`/a/${link.token}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}