import { extractGitHubInfo, extractDOI, extractArXivId } from "@/lib/verification";

describe("URL Verification Extraction", () => {
  describe("GitHub URL extraction", () => {
    test("should extract GitHub info from commit URL", () => {
      const url = "https://github.com/user/repo/commit/abc123def456";
      const result = extractGitHubInfo(url);
      
      expect(result).toEqual({
        owner: "user",
        repo: "repo",
        commitSha: "abc123def456",
      });
    });

    test("should extract GitHub info from repo URL", () => {
      const url = "https://github.com/user/repo";
      const result = extractGitHubInfo(url);
      
      expect(result).toEqual({
        owner: "user",
        repo: "repo",
        commitSha: undefined,
      });
    });

    test("should return null for non-GitHub URLs", () => {
      const url = "https://gitlab.com/user/repo";
      const result = extractGitHubInfo(url);
      
      expect(result).toBeNull();
    });
  });

  describe("DOI extraction", () => {
    test("should extract DOI from doi.org URL", () => {
      const url = "https://doi.org/10.1000/182";
      const result = extractDOI(url);
      
      expect(result).toBe("10.1000/182");
    });

    test("should extract DOI from dx.doi.org URL", () => {
      const url = "https://dx.doi.org/10.1000/182";
      const result = extractDOI(url);
      
      expect(result).toBe("10.1000/182");
    });

    test("should extract DOI from plain DOI", () => {
      const doi = "10.1000/182";
      const result = extractDOI(doi);
      
      expect(result).toBe("10.1000/182");
    });

    test("should return null for non-DOI URLs", () => {
      const url = "https://example.com/paper";
      const result = extractDOI(url);
      
      expect(result).toBeNull();
    });
  });

  describe("arXiv ID extraction", () => {
    test("should extract arXiv ID from abs URL", () => {
      const url = "https://arxiv.org/abs/1234.5678";
      const result = extractArXivId(url);
      
      expect(result).toBe("1234.5678");
    });

    test("should extract arXiv ID from pdf URL", () => {
      const url = "https://arxiv.org/pdf/1234.5678.pdf";
      const result = extractArXivId(url);
      
      expect(result).toBe("1234.5678");
    });

    test("should extract arXiv ID with version", () => {
      const url = "https://arxiv.org/abs/1234.5678v1";
      const result = extractArXivId(url);
      
      expect(result).toBe("1234.5678v1");
    });

    test("should return null for non-arXiv URLs", () => {
      const url = "https://example.com/paper";
      const result = extractArXivId(url);
      
      expect(result).toBeNull();
    });
  });
});






