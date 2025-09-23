// Commented out - depends on Target and Proof models that don't exist in current schema
/*
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

  // Extract allowed proofs
  const allowedProofs = target.weights.map(w => w.proof);
  const allowedProofIds = allowedProofs.map(p => p.id);

  if (allowedProofs.length === 0) {
    throw new Error("No proofs available for this target");
  }

  // Generate claim using AI (placeholder implementation)
  const claim = await generateClaimWithAI(prompt, allowedProofs);

  // Validate citations
  validateCitations(claim, allowedProofIds);

  // Generate log entry
  const logId = crypto.randomUUID();
  const outputHash = hash(claim);

  // Store generation log
  await prisma.claimGenerationLog.create({
    data: {
      id: logId,
      userId,
      targetId,
      prompt,
      claim,
      outputHash,
      allowedProofIds,
      createdAt: new Date(),
    },
  });

  return {
    claim,
    logId,
    allowedProofIds,
    outputHash,
  };
}

async function generateClaimWithAI(prompt: string, proofs: any[]): Promise<string> {
  // Placeholder AI implementation
  // In a real implementation, this would call an AI service
  const proofSummaries = proofs.map(p => `${p.title}: ${p.summary}`).join('\n');
  
  return `Based on the provided evidence:\n\n${proofSummaries}\n\n${prompt}`;
}

function validateCitations(claim: string, allowedProofIds: string[]): void {
  // Simple validation - check if claim contains any proof IDs
  const hasValidCitations = allowedProofIds.some(id => claim.includes(id));
  
  if (!hasValidCitations) {
    throw new CitationViolationError("Claim must reference at least one allowed proof");
  }
}
*/

// Temporary placeholder
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
  throw new Error("Claim generation feature is not available - target model missing");
}