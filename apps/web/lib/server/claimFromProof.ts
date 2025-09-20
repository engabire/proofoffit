import { prisma } from "@/lib/db";
import { hash } from "@/lib/hash";
import crypto from "crypto";

export class CitationViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CitationViolationError";
  }
}

export interface ClaimGenerationRequest {
  targetId: string;
  prompt: string;
  maxLength?: number;
}

export interface ClaimGenerationResult {
  claim: string;
  logId: string;
  allowedProofIds: string[];
  outputHash: string;
}

export async function generateClaimFromProof(
  userId: string,
  request: ClaimGenerationRequest
): Promise<ClaimGenerationResult> {
  const { targetId, prompt, maxLength = 1000 } = request;

  // Limit prompt length
  if (prompt.length > maxLength) {
    throw new Error(`Prompt too long. Maximum ${maxLength} characters allowed.`);
  }

  // Get target with allowed proofs
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
    throw new Error("Target not found or access denied");
  }

  const allowedProofs = target.weights.map(w => w.proof);
  const allowedProofIds = new Set(allowedProofs.map(p => p.id));

  // Build context from allowed proofs
  const context = allowedProofs
    .map(proof => `[#${proof.id}] ${proof.title}: ${proof.summary || 'No summary available'}`)
    .join('\n\n');

  // Generate claim using a simple template-based approach
  // In a real implementation, this would call an AI service
  const claim = generateClaimFromContext(prompt, context, allowedProofs);

  // Validate the generated claim
  validateClaimCitations(claim, allowedProofIds);

  // Calculate output hash
  const outputHash = hash(claim);

  // Log the generation
  const log = await prisma.claimLog.create({
    data: {
      userId,
      targetId,
      prompt,
      allowedProofIds: Array.from(allowedProofIds),
      outputHash,
    },
  });

  return {
    claim,
    logId: log.id,
    allowedProofIds: Array.from(allowedProofIds),
    outputHash,
  };
}

function generateClaimFromContext(
  prompt: string,
  context: string,
  proofs: any[]
): string {
  // Simple template-based claim generation
  // In a real implementation, this would use an AI service like OpenAI
  
  const relevantProofs = proofs.slice(0, 3); // Use top 3 proofs
  
  let claim = `Based on the evidence provided, `;
  
  if (prompt.toLowerCase().includes('experience')) {
    claim += `I have demonstrated relevant experience in this area through `;
    claim += relevantProofs.map(p => `[#${p.id}] ${p.title}`).join(', ');
    claim += `.`;
  } else if (prompt.toLowerCase().includes('skill')) {
    claim += `I possess the required skills as evidenced by `;
    claim += relevantProofs.map(p => `[#${p.id}] ${p.title}`).join(', ');
    claim += `.`;
  } else if (prompt.toLowerCase().includes('project')) {
    claim += `I have successfully completed relevant projects including `;
    claim += relevantProofs.map(p => `[#${p.id}] ${p.title}`).join(', ');
    claim += `.`;
  } else {
    claim += `I meet the requirements through my work on `;
    claim += relevantProofs.map(p => `[#${p.id}] ${p.title}`).join(', ');
    claim += `.`;
  }

  return claim;
}

function validateClaimCitations(claim: string, allowedProofIds: Set<string>): void {
  const sentences = claim.split(/(?<=[.!?])\s+/).filter(Boolean);
  
  for (const sentence of sentences) {
    const citations = Array.from(sentence.matchAll(/\[#([0-9a-f-]{6,36})\]/gi))
      .map(match => match[1]);
    
    if (citations.length === 0) {
      throw new CitationViolationError(
        `Sentence must cite at least one proof: "${sentence}"`
      );
    }
    
    for (const citation of citations) {
      if (!allowedProofIds.has(citation)) {
        throw new CitationViolationError(
          `Citation references unauthorized proof: ${citation}`
        );
      }
    }
  }
}

export async function getClaimLogs(userId: string, targetId?: string) {
  const where = {
    userId,
    ...(targetId && { targetId }),
  };

  return prisma.claimLog.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}


