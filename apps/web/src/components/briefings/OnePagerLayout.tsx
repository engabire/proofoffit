"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@proof-of-fit/ui";
import { Target, User, MapPin, Calendar } from "lucide-react";

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

interface OnePagerLayoutProps {
  target: Target;
  candidateName?: string;
  candidateTitle?: string;
  candidateLocation?: string;
}

export default function OnePagerLayout({ 
  target, 
  candidateName = "Your Name",
  candidateTitle = "Your Title",
  candidateLocation = "Your Location"
}: OnePagerLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{candidateName}</h1>
        <p className="text-xl text-muted-foreground mb-4">{candidateTitle}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {candidateLocation}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {target.role}
          </div>
        </div>
      </div>

      {/* Fit Score */}
      {target.fitScore !== null && target.fitScore !== undefined && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {target.fitScore.toFixed(0)}%
              </div>
              <p className="text-muted-foreground">Fit Score for {target.title}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Achievements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Key Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {target.weights.map((weight) => (
              <div key={weight.id} className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-lg">{weight.proof.title}</h3>
                <p className="text-muted-foreground mt-1">{weight.proof.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{weight.proof.kind}</Badge>
                  <Badge variant="secondary">{weight.weight}x weight</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t">
        <p>Generated on {new Date().toLocaleDateString()}</p>
        <p>Target: {target.title}</p>
      </div>
    </div>
  );
}