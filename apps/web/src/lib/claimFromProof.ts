import { prisma } from "@/lib/db";
import crypto from "crypto";

export class CitationViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CitationViolationError";
  }
}

export interface ClaimGenerationOptions {
  targetId: string;
  userId: string;
  prompt?: string;
  allowedProofIds?: string[];
}

export interface GeneratedClaim {
  claim: string;
  outputHash: string;
  allowedProofIds: string[];
  createdAt: Date;
}

export async function generateClaimFromProof(
  options: ClaimGenerationOptions
): Promise<GeneratedClaim> {
  try {
    const { targetId, userId, prompt, allowedProofIds = [] } = options;

    // Get target with proofs
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId,
        isDeleted: false,
      },
      include: {
        weights: {
          include: {
            proof: true,
          },
        },
      },
    });

    if (!target) {
      throw new Error("Target not found");
    }

    // Filter proofs if allowedProofIds is specified
    let proofs = target.weights.map(w => w.proof);
    if (allowedProofIds.length > 0) {
      proofs = proofs.filter(proof => allowedProofIds.includes(proof.id));
    }

    if (proofs.length === 0) {
      throw new Error("No proofs available for claim generation");
    }

    // Generate claim using AI (simplified implementation)
    const claim = await generateAIClaim(proofs, prompt || target.role);
    
    // Create hash of the output
    const outputHash = crypto.createHash('sha256').update(claim).digest('hex');

    // Log the generation
    await prisma.claimGenerationLog.create({
      data: {
        userId,
        targetId,
        prompt: prompt || target.role,
        claim,
        outputHash,
        allowedProofIds: proofs.map(p => p.id),
      },
    });

    return {
      claim,
      outputHash,
      allowedProofIds: proofs.map(p => p.id),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error generating claim from proof:", error);
    throw error;
  }
}

async function generateAIClaim(proofs: any[], context: string): Promise<string> {
  // This is a simplified implementation
  // In production, you'd integrate with an AI service like OpenAI, Anthropic, etc.
  
  const proofSummaries = proofs.map(proof => 
    `${proof.title}: ${proof.summary}`
  ).join('\n');

  // Simple template-based generation for demo
  const claim = `Based on my experience as demonstrated through:
${proofSummaries}

I am well-positioned to excel in ${context} roles. My track record shows consistent delivery of results and the ability to adapt to new challenges.`;

  return claim;
}

export async function getClaimHistory(
  userId: string,
  targetId?: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const whereClause: any = { userId };
    if (targetId) {
      whereClause.targetId = targetId;
    }

    const claims = await prisma.claimGenerationLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return claims;
  } catch (error) {
    console.error("Error fetching claim history:", error);
    return [];
  }
}

export async function validateClaimIntegrity(
  claim: string,
  outputHash: string
): Promise<boolean> {
  try {
    const computedHash = crypto.createHash('sha256').update(claim).digest('hex');
    return computedHash === outputHash;
  } catch (error) {
    console.error("Error validating claim integrity:", error);
    return false;
  }
}