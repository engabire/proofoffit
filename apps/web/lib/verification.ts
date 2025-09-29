import { Octokit } from "@octokit/rest";

export interface VerificationStatus {
  isVerified: boolean;
  verificationType?: "github" | "doi" | "arxiv" | "scholar";
  verifiedAt?: Date;
  metadata?: Record<string, any>;
}

export async function verifyGitHubCommit(
  owner: string,
  repo: string,
  commitSha: string
): Promise<VerificationStatus> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: commit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha,
    });

    const isVerified = commit.verification?.verified === true;
    
    return {
      isVerified,
      verificationType: "github",
      verifiedAt: isVerified ? new Date() : undefined,
      metadata: {
        signature: commit.verification?.signature,
        reason: commit.verification?.reason,
        payload: commit.verification?.payload,
      },
    };
  } catch (error) {
    console.error("Error verifying GitHub commit:", error);
    return {
      isVerified: false,
      verificationType: "github",
    };
  }
}

export async function verifyDOI(doi: string): Promise<VerificationStatus> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${doi}`, {
      headers: {
        "User-Agent": "ProofOfFit/1.0 (https://proofoffit.com)",
      },
    });

    if (!response.ok) {
      return {
        isVerified: false,
        verificationType: "doi",
      };
    }

    const data = await response.json();
    const work = data.message;

    return {
      isVerified: true,
      verificationType: "doi",
      verifiedAt: new Date(),
      metadata: {
        title: work.title?.[0],
        authors: work.author?.map((a: any) => a.given + " " + a.family),
        published: work.published?.["date-parts"]?.[0],
        journal: work["container-title"]?.[0],
        doi: work.DOI,
      },
    };
  } catch (error) {
    console.error("Error verifying DOI:", error);
    return {
      isVerified: false,
      verificationType: "doi",
    };
  }
}

export async function verifyArXiv(arxivId: string): Promise<VerificationStatus> {
  try {
    const response = await fetch(`https://export.arxiv.org/api/query?id_list=${arxivId}`);
    
    if (!response.ok) {
      return {
        isVerified: false,
        verificationType: "arxiv",
      };
    }

    const xml = await response.text();
    const hasEntry = xml.includes("<entry>");
    
    if (!hasEntry) {
      return {
        isVerified: false,
        verificationType: "arxiv",
      };
    }

    // Parse basic metadata from XML
    const titleMatch = xml.match(/<title>(.*?)<\/title>/);
    const summaryMatch = xml.match(/<summary>(.*?)<\/summary>/);
    const publishedMatch = xml.match(/<published>(.*?)<\/published>/);

    return {
      isVerified: true,
      verificationType: "arxiv",
      verifiedAt: new Date(),
      metadata: {
        title: titleMatch?.[1],
        summary: summaryMatch?.[1],
        published: publishedMatch?.[1],
        arxivId,
      },
    };
  } catch (error) {
    console.error("Error verifying arXiv ID:", error);
    return {
      isVerified: false,
      verificationType: "arxiv",
    };
  }
}

export function extractGitHubInfo(url: string): { owner: string; repo: string; commitSha?: string } | null {
  const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/commit\/([a-f0-9]{40}))?/;
  const match = url.match(githubRegex);
  
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2],
    commitSha: match[3],
  };
}

export function extractDOI(url: string): string | null {
  const doiRegex = /(?:doi\.org\/|dx\.doi\.org\/)?(10\.\d+\/[^\s]+)/;
  const match = url.match(doiRegex);
  return match ? match[1] : null;
}

export function extractArXivId(url: string): string | null {
  const arxivRegex = /arxiv\.org\/(?:abs\/|pdf\/)?(\d+\.\d+(?:v\d+)?)/;
  const match = url.match(arxivRegex);
  return match ? match[1] : null;
}

export async function verifyProofUrl(url: string): Promise<VerificationStatus> {
  // Try GitHub first
  const githubInfo = extractGitHubInfo(url);
  if (githubInfo && githubInfo.commitSha) {
    return verifyGitHubCommit(githubInfo.owner, githubInfo.repo, githubInfo.commitSha);
  }

  // Try DOI
  const doi = extractDOI(url);
  if (doi) {
    return verifyDOI(doi);
  }

  // Try arXiv
  const arxivId = extractArXivId(url);
  if (arxivId) {
    return verifyArXiv(arxivId);
  }

  return {
    isVerified: false,
  };
}







