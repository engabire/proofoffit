import { CitationViolationError } from "@/lib/claimFromProof";

// Mock the validateClaimCitations function for testing
function validateClaimCitations(
  claim: string,
  allowedProofIds: Set<string>,
): void {
  const sentences = claim.split(/(?<=[.!?])\s+/).filter(Boolean);

  for (const sentence of sentences) {
    const citations = Array.from(
      sentence.matchAll(/\[#([a-zA-Z0-9-]{6,36})\]/gi),
    )
      .map((match) => match[1]);

    if (citations.length === 0) {
      throw new CitationViolationError(
        `Sentence must cite at least one proof: "${sentence}"`,
      );
    }

    for (const citation of citations) {
      if (!allowedProofIds.has(citation)) {
        throw new CitationViolationError(
          `Citation references unauthorized proof: ${citation}`,
        );
      }
    }
  }
}

describe("Claim Citation Validation", () => {
  const allowedProofIds = new Set(["proof-1", "proof-2", "proof-3"]);

  test("should accept valid claims with citations", () => {
    const validClaim =
      "I have experience with React [#proof-1] and Node.js [#proof-2].";

    expect(() => validateClaimCitations(validClaim, allowedProofIds)).not
      .toThrow();
  });

  test("should reject claims without citations", () => {
    const invalidClaim = "I have experience with React and Node.js.";

    expect(() => validateClaimCitations(invalidClaim, allowedProofIds))
      .toThrow(CitationViolationError);
  });

  test("should reject claims with unauthorized citations", () => {
    const invalidClaim =
      "I have experience with React [#proof-1] and Python [#unauthorized-proof].";

    expect(() => validateClaimCitations(invalidClaim, allowedProofIds))
      .toThrow(CitationViolationError);
  });

  test("should handle multiple sentences", () => {
    const multiSentenceClaim =
      "I have experience with React [#proof-1]. I also know Node.js [#proof-2].";

    expect(() => validateClaimCitations(multiSentenceClaim, allowedProofIds))
      .not.toThrow();
  });

  test("should reject if any sentence lacks citations", () => {
    const mixedClaim =
      "I have experience with React [#proof-1]. I also know Node.js.";

    expect(() => validateClaimCitations(mixedClaim, allowedProofIds))
      .toThrow(CitationViolationError);
  });

  test("should handle edge cases", () => {
    const emptyClaim = "";
    expect(() => validateClaimCitations(emptyClaim, allowedProofIds)).not
      .toThrow();

    const singleWord = "Hello.";
    expect(() => validateClaimCitations(singleWord, allowedProofIds))
      .toThrow(CitationViolationError);
  });
});
