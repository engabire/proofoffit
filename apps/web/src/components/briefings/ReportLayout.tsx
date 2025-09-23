"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@proof-of-fit/ui";
import { Target, User, MapPin, Calendar, BarChart3 } from "lucide-react";

interface Target {
  id: string;
  title: string;
  role: string;
  companyHint?: string;
  layout: string;
  fitScore?: number;
  lastAnalyzedAt?: string;
  createdAt: string;
  weights: Array<{
    id: string;
    weight: number;
    proof: {
      id: string;
      title: string;
      summary: string;
      kind: string;
      artifacts: any[];
    };
  }>;
}

interface ReportLayoutProps {
  target: Target;
  candidateName?: string;
  candidateTitle?: string;
  candidateLocation?: string;
}

export default function ReportLayout({ 
  target, 
  candidateName = "Your Name",
  candidateTitle = "Your Title",
  candidateLocation = "Your Location"
}: ReportLayoutProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Candidate Fit Report</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {candidateName}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {candidateLocation}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Target Position</h3>
              <p className="text-muted-foreground">{target.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{target.role}</p>
              {target.companyHint && (
                <p className="text-sm text-muted-foreground">{target.companyHint}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Candidate</h3>
              <p className="text-muted-foreground">{candidateName}</p>
              <p className="text-sm text-muted-foreground mt-1">{candidateTitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fit Score */}
      {target.fitScore !== null && target.fitScore !== undefined && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Fit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-4 ${getScoreColor(target.fitScore)}`}>
                {target.fitScore.toFixed(0)}%
              </div>
              <Progress value={target.fitScore} className="mb-4" />
              <Badge variant={getScoreVariant(target.fitScore)} className="text-lg">
                {target.fitScore >= 80 ? "Excellent Fit" : 
                 target.fitScore >= 60 ? "Good Fit" : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Evidence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {target.weights.map((weight, index) => (
              <div key={weight.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{weight.proof.title}</h3>
                    <p className="text-muted-foreground mt-1">{weight.proof.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{weight.proof.kind}</Badge>
                    <Badge variant="secondary">{weight.weight}x weight</Badge>
                  </div>
                </div>
                
                {weight.proof.artifacts && weight.proof.artifacts.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Supporting Artifacts:</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {weight.proof.artifacts.map((artifact: any, artifactIndex: number) => (
                        <div key={artifactIndex} className="text-sm">
                          <span className="font-medium">{artifact.title}</span>
                          <span className="text-muted-foreground ml-2">({artifact.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {target.fitScore !== null && target.fitScore !== undefined && (
              <>
                {target.fitScore >= 80 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Strong Candidate</h4>
                    <p className="text-green-700">
                      This candidate demonstrates excellent alignment with the role requirements. 
                      Consider moving to the next stage of the interview process.
                    </p>
                  </div>
                )}
                {target.fitScore >= 60 && target.fitScore < 80 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Good Potential</h4>
                    <p className="text-yellow-700">
                      This candidate shows good potential with some areas for development. 
                      Consider additional screening or targeted questions.
                    </p>
                  </div>
                )}
                {target.fitScore < 60 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Needs Development</h4>
                    <p className="text-red-700">
                      This candidate may not be the best fit for this role. 
                      Consider if there are other positions that might be more suitable.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t">
        <p>Report generated on {new Date().toLocaleDateString()}</p>
        <p>Target: {target.title}</p>
      </div>
    </div>
  );
}