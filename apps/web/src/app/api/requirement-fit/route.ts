import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface RequirementFitResult {
  coveragePct: number;
  results: Array<{
    requirement: string;
    proofMatches: Array<{
      proofId: string;
      score: number;
      rationale: string;
    }>;
  }>;
}

function extractRequirements(jdText: string): string[] {
  // Simple requirement extraction - look for bullet points, numbered lists, etc.
  const lines = jdText.split('\n').map(line => line.trim()).filter(Boolean);
  const requirements: string[] = [];
  
  for (const line of lines) {
    // Look for bullet points, numbered items, or lines that seem like requirements
    if (line.match(/^[-•*]\s+/) || 
        line.match(/^\d+\.\s+/) || 
        line.match(/^[A-Z][^.!?]*[.!?]$/) ||
        line.toLowerCase().includes('required') ||
        line.toLowerCase().includes('must have') ||
        line.toLowerCase().includes('should have')) {
      requirements.push(line.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, ''));
    }
  }
  
  return requirements.slice(0, 20); // Limit to 20 requirements
}

function calculateKeywordOverlap(requirement: string, proofText: string): number {
  const reqWords = new Set(
    requirement.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
  );
  
  const proofWords = new Set(
    proofText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
  );
  
  const intersection = new Set([...reqWords].filter(word => proofWords.has(word)));
  const union = new Set([...reqWords, ...proofWords]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function scoreRequirementFit(requirement: string, proofs: any[]): RequirementFitResult['results'][0] {
  const proofMatches = proofs.map(proof => {
    const proofText = `${proof.title} ${proof.summary || ''}`.toLowerCase();
    const score = calculateKeywordOverlap(requirement, proofText);
    
    const rationale = score > 0.1 
      ? `Keyword overlap: ${Math.round(score * 100)}% match with "${proof.title}"`
      : `No significant keyword overlap with "${proof.title}"`;
    
    return {
      proofId: proof.id,
      score,
      rationale,
    };
  }).filter(match => match.score > 0.05); // Only include matches with >5% overlap
  
  return {
    requirement,
    proofMatches: proofMatches.sort((a, b) => b.score - a.score),
  };
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { targetId, jdText } = await req.json();

    // Get target with proofs
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
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
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Target not found or access denied" },
        { status: 404 }
      );
    }

    // Extract requirements from JD
    const requirements = extractRequirements(jdText);
    
    if (requirements.length === 0) {
      return NextResponse.json({
        coveragePct: 0,
        results: [],
        message: "No clear requirements found in job description",
      });
    }

    // Get proofs with weights
    const proofs = target.weights.map(w => w.proof);
    
    // Score each requirement against proofs
    const results = requirements.map(req => scoreRequirementFit(req, proofs));
    
    // Calculate overall coverage
    const totalRequirements = requirements.length;
    const coveredRequirements = results.filter(r => r.proofMatches.length > 0).length;
    const coveragePct = totalRequirements > 0 ? (coveredRequirements / totalRequirements) * 100 : 0;

    // Save JD snapshot to target
    await prisma.target.update({
      where: { id: targetId },
      data: {
        lastJdJson: {
          jdText,
          requirements,
          analyzedAt: new Date().toISOString(),
        },
      },
    });

    const response: RequirementFitResult = {
      coveragePct: Math.round(coveragePct * 100) / 100,
      results,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error analyzing requirement fit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
