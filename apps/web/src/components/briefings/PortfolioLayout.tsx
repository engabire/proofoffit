"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@proof-of-fit/ui";
import { Target, User, MapPin, ExternalLink } from "lucide-react";

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

interface PortfolioLayoutProps {
  target: Target;
  candidateName?: string;
  candidateTitle?: string;
  candidateLocation?: string;
}

export default function PortfolioLayout({ 
  target, 
  candidateName = "Your Name",
  candidateTitle = "Your Title",
  candidateLocation = "Your Location"
}: PortfolioLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{candidateName}</h1>
        <p className="text-2xl text-muted-foreground mb-6">{candidateTitle}</p>
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {candidateLocation}
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {target.role}
          </div>
        </div>
      </div>

      {/* Fit Score Banner */}
      {target.fitScore !== null && target.fitScore !== undefined && (
        <Card className="mb-12 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4 text-primary">
                {target.fitScore.toFixed(0)}%
              </div>
              <p className="text-xl text-muted-foreground">
                Fit Score for {target.title}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {target.weights.map((weight) => (
          <Card key={weight.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{weight.proof.title}</CardTitle>
                <Badge variant="secondary">{weight.weight}x</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{weight.proof.summary}</p>
              
              <div className="space-y-2">
                <Badge variant="outline">{weight.proof.kind}</Badge>
                
                {weight.proof.artifacts && weight.proof.artifacts.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Artifacts:</p>
                    <div className="space-y-1">
                      {weight.proof.artifacts.map((artifact: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          <a 
                            href={artifact.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {artifact.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t">
        <p>Portfolio generated on {new Date().toLocaleDateString()}</p>
        <p>Target: {target.title}</p>
      </div>
    </div>
  );
}