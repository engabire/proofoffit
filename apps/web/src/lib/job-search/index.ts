import { logger } from "@/lib/utils/logger";

const JOB_FEED_TIMEOUT_MS = Number.parseInt(
  process.env.JOB_FEED_TIMEOUT_MS || "5000",
  10,
);
const JOB_FEED_FAILURE_THRESHOLD = Number.parseInt(
  process.env.JOB_FEED_FAILURE_THRESHOLD || "3",
  10,
);
const JOB_FEED_COOLDOWN_MS = Number.parseInt(
  process.env.JOB_FEED_COOLDOWN_MS || "60000",
  10,
);

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = JOB_FEED_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Enhanced Job Search Service for ProofOfFit
// Integrates with multiple job boards with proper error handling and rate limiting

export interface JobSearchParams {
  query: string;
  location: string;
  remote: boolean;
  limit: number;
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  salaryMin?: number;
  salaryMax?: number;
  jobType?: "full-time" | "part-time" | "contract" | "internship";
  datePosted?: "today" | "week" | "month";
}

export interface JobBoardJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  url: string;
  applyUrl?: string;
  source: JobBoardProvider;
  postedDate: Date;
  isRemote: boolean;
  employmentType: string;
  experienceLevel?: string;
  skills?: string[];
  benefits?: string[];
  companySize?: string;
  industry?: string;
}

export type JobBoardProvider =
  | "remoteok"
  | "governmentjobs"
  | "linkedin"
  | "indeed"
  | "glassdoor";

export interface JobBoardResponse {
  success: boolean;
  jobs: JobBoardJob[];
  totalFound?: number;
  nextPageToken?: string;
  error?: string;
  source: JobBoardProvider;
}

export interface JobBoardConfig {
  name: JobBoardProvider;
  apiUrl: string;
  rateLimitPerMinute: number;
  requiresAuth: boolean;
  priority: number;
}

interface CircuitState {
  failures: number;
  openedAt: number | null;
}

// Job board configurations - focusing on working implementations
const JOB_BOARD_CONFIGS: Record<JobBoardProvider, JobBoardConfig> = {
  remoteok: {
    name: "remoteok",
    apiUrl: "https://remoteok.io/api",
    rateLimitPerMinute: 60,
    requiresAuth: false,
    priority: 10,
  },
  governmentjobs: {
    name: "governmentjobs",
    apiUrl: "https://www.governmentjobs.com/careers/metrocouncil",
    rateLimitPerMinute: 30,
    requiresAuth: false,
    priority: 8,
  },
  linkedin: {
    name: "linkedin",
    apiUrl: "https://jsearch.p.rapidapi.com/search",
    rateLimitPerMinute: 500,
    requiresAuth: true,
    priority: 7,
  },
  indeed: {
    name: "indeed",
    apiUrl: "https://jsearch.p.rapidapi.com/search",
    rateLimitPerMinute: 1000,
    requiresAuth: true,
    priority: 6,
  },
  glassdoor: {
    name: "glassdoor",
    apiUrl: "https://jsearch.p.rapidapi.com/search",
    rateLimitPerMinute: 1000,
    requiresAuth: true,
    priority: 5,
  },
};

export class JobSearchService {
  private lastRequestTime: Map<JobBoardProvider, number> = new Map();
  private circuitState: Map<JobBoardProvider, CircuitState> = new Map();

  async searchJobs(params: JobSearchParams): Promise<JobBoardJob[]> {
    const allJobs: JobBoardJob[] = [];
    const errors: string[] = [];

    // Get enabled job boards sorted by priority
    const enabledBoards = this.getEnabledJobBoards();

    // Search job boards in parallel with proper error handling
    const searchPromises = enabledBoards.map(async (board) => {
      try {
        const response = await this.searchJobBoard(board, params);
        if (response.success && response.jobs) {
          return response.jobs;
        } else {
          errors.push(`${board}: ${response.error || "Unknown error"}`);
          return [];
        }
      } catch (error) {
        errors.push(
          `${board}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
        return [];
      }
    });

    // Wait for all searches to complete
    const results = await Promise.allSettled(searchPromises);

    // Collect successful results
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allJobs.push(...result.value);
      } else {
        errors.push(`${enabledBoards[index]}: ${result.reason}`);
      }
    });

    // Log errors for monitoring
    if (errors.length > 0) {
      logger.warn("Job search errors:", errors);
    }

    // Deduplicate, sort by relevance, and limit results
    const deduplicatedJobs = this.deduplicateJobs(allJobs);
    const sortedJobs = this.sortJobsByRelevance(deduplicatedJobs, params.query);

    return sortedJobs.slice(0, params.limit);
  }

  private async searchJobBoard(
    board: JobBoardProvider,
    params: JobSearchParams,
  ): Promise<JobBoardResponse> {
    if (this.isCircuitOpen(board)) {
      logger.warn(`Circuit open for ${board}, skipping request`);
      return {
        success: false,
        jobs: [],
        error: "Circuit open - skipping request during cooldown",
        source: board,
      };
    }

    // Add delay between requests to prevent rate limiting
    await this.addDelay(board);

    try {
      switch (board) {
        case "remoteok":
          return await this.wrapWithCircuitBreaker(board, () =>
            this.searchRemoteOk(params)
          );
        case "indeed":
          return await this.wrapWithCircuitBreaker(board, () =>
            this.searchIndeed(params)
          );
        case "governmentjobs":
          return await this.wrapWithCircuitBreaker(board, () =>
            this.searchGovernmentJobs(params)
          );
        default:
          // Fallback for other boards - return empty results for now
          return {
            success: false,
            jobs: [],
            error: `${board} integration not implemented yet`,
            source: board,
          };
      }
    } catch (error) {
      this.recordFailure(board);
      logger.error(`Error searching ${board}:`, error);
      return {
        success: false,
        jobs: [],
        error: error instanceof Error ? error.message : "Unknown error",
        source: board,
      };
    }
  }

  private async wrapWithCircuitBreaker(
    board: JobBoardProvider,
    fn: () => Promise<JobBoardResponse>,
  ): Promise<JobBoardResponse> {
    try {
      const response = await fn();
      if (response.success) {
        this.recordSuccess(board);
      } else {
        this.recordFailure(board);
      }
      return response;
    } catch (error) {
      this.recordFailure(board);
      throw error;
    }
  }

  private recordFailure(board: JobBoardProvider) {
    const current = this.circuitState.get(board) || {
      failures: 0,
      openedAt: null,
    };

    const failures = current.failures + 1;
    const shouldOpen = failures >= JOB_FEED_FAILURE_THRESHOLD;

    this.circuitState.set(board, {
      failures,
      openedAt: shouldOpen ? Date.now() : current.openedAt,
    });

    if (shouldOpen && current.openedAt === null) {
      logger.warn(
        `Opening circuit breaker for ${board} after ${failures} failures`,
      );
    }
  }

  private recordSuccess(board: JobBoardProvider) {
    this.circuitState.set(board, { failures: 0, openedAt: null });
  }

  private isCircuitOpen(board: JobBoardProvider): boolean {
    const state = this.circuitState.get(board);
    if (!state?.openedAt) {
      return false;
    }

    const elapsed = Date.now() - state.openedAt;
    if (elapsed > JOB_FEED_COOLDOWN_MS) {
      this.circuitState.set(board, { failures: 0, openedAt: null });
      return false;
    }

    return true;
  }

  // RemoteOK API integration (free, no auth required)
  private async searchRemoteOk(
    params: JobSearchParams,
  ): Promise<JobBoardResponse> {
    try {
      const response = await fetchWithTimeout("https://remoteok.io/api", {
        headers: {
          "User-Agent": "ProofOfFit/1.0",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`RemoteOK API error: ${response.status}`);
      }

      const data = await response.json();

      // Filter and map jobs based on search criteria
      const filteredJobs = data
        .filter((job: any) => {
          if (!job || !job.position || !job.company) return false;
          const searchTerm = params.query.toLowerCase();
          return (
            job.position.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            (job.tags &&
              job.tags.some((tag: string) =>
                tag.toLowerCase().includes(searchTerm)
              ))
          );
        })
        .slice(0, params.limit)
        .map((job: any) => ({
          id: `remoteok-${job.id}`,
          title: job.position,
          company: job.company,
          location: job.location || "Remote",
          salary: this.formatSalary(job.salary_min, job.salary_max),
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          description: job.description || "No description available",
          url: job.url || `https://remoteok.io/remote-jobs/${job.id}`,
          applyUrl: job.apply_url || job.url,
          source: "remoteok" as JobBoardProvider,
          postedDate: new Date(job.date * 1000),
          isRemote: true,
          employmentType: "full-time",
          skills: job.tags || [],
          benefits: [],
          companySize: job.company_size,
          industry: "Technology",
        }));

      return {
        success: true,
        jobs: filteredJobs,
        totalFound: filteredJobs.length,
        source: "remoteok",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (error instanceof Error && error.name === "AbortError") {
        logger.warn("RemoteOK search request timed out");
      } else {
        logger.error("RemoteOK search error:", error);
      }
      return {
        success: false,
        jobs: [],
        error: `RemoteOK API error: ${message}`,
        source: "remoteok",
      };
    }
  }

  // Indeed API integration using RapidAPI (requires API key)
  private async searchIndeed(
    params: JobSearchParams,
  ): Promise<JobBoardResponse> {
    try {
      const rapidApiKey = process.env.RAPIDAPI_KEY;
      if (!rapidApiKey) {
        return {
          success: false,
          jobs: [],
          error: "RapidAPI key not configured",
          source: "indeed",
        };
      }

      const response = await fetchWithTimeout("https://jsearch.p.rapidapi.com/search", {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        // Note: This would need proper query parameters for Indeed
      });

      if (!response.ok) {
        throw new Error(`Indeed API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform Indeed data to our format
      const transformedJobs = (data.data || []).map((job: any) => ({
        id: `indeed-${job.job_id}`,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city + ", " + job.job_state,
        salary: job.job_salary,
        description: job.job_description,
        url: job.job_apply_link,
        applyUrl: job.job_apply_link,
        source: "indeed" as JobBoardProvider,
        postedDate: new Date(job.job_posted_at_datetime_utc),
        isRemote: job.job_is_remote,
        employmentType: job.job_employment_type,
        skills: job.job_required_skills || [],
        benefits: [],
        companySize: job.employer_company_size,
        industry: job.job_industry,
      }));

      return {
        success: true,
        jobs: transformedJobs,
        totalFound: transformedJobs.length,
        source: "indeed",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (error instanceof Error && error.name === "AbortError") {
        logger.warn("Indeed search request timed out");
      } else {
        logger.error("Indeed search error:", error);
      }
      return {
        success: false,
        jobs: [],
        error: `Indeed API error: ${message}`,
        source: "indeed",
      };
    }
  }

  // Government Jobs search - simplified version for now
  private async searchGovernmentJobs(
    params: JobSearchParams,
  ): Promise<JobBoardResponse> {
    try {
      // For now, return mock government jobs that match the search
      const mockGovJobs: JobBoardJob[] = [
        {
          id: "gov-transit-1",
          title: "Transit Operations Coordinator",
          company: "Metro Transit",
          location: "Minneapolis, MN",
          salary: "$45,000 - $65,000",
          salaryMin: 45000,
          salaryMax: 65000,
          description:
            "Coordinate daily transit operations and ensure service quality.",
          url: "https://www.governmentjobs.com/careers/metrocouncil/jobs/12345",
          applyUrl:
            "https://www.governmentjobs.com/careers/metrocouncil/jobs/12345",
          source: "governmentjobs",
          postedDate: new Date("2024-01-15"),
          isRemote: false,
          employmentType: "full-time",
          experienceLevel: "mid",
          skills: ["Transportation", "Customer Service", "Operations"],
          benefits: ["Health Insurance", "Pension", "Paid Time Off"],
          companySize: "Large (1000+ employees)",
          industry: "Government/Public Transportation",
        },
        {
          id: "gov-analyst-1",
          title: "Transportation Data Analyst",
          company: "Metropolitan Council",
          location: "St. Paul, MN",
          salary: "$55,000 - $75,000",
          salaryMin: 55000,
          salaryMax: 75000,
          description:
            "Analyze transportation data to support regional planning decisions.",
          url: "https://www.governmentjobs.com/careers/metrocouncil/jobs/12346",
          applyUrl:
            "https://www.governmentjobs.com/careers/metrocouncil/jobs/12346",
          source: "governmentjobs",
          postedDate: new Date("2024-01-20"),
          isRemote: false,
          employmentType: "full-time",
          experienceLevel: "mid",
          skills: ["Data Analysis", "SQL", "Excel", "Transportation Planning"],
          benefits: ["Health Insurance", "Pension", "Professional Development"],
          companySize: "Large (1000+ employees)",
          industry: "Government/Regional Planning",
        },
      ];

      // Filter based on query
      const filteredJobs = mockGovJobs.filter((job) => {
        if (!params.query) return true;
        const searchTerm = params.query.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.skills?.some((skill) => skill.toLowerCase().includes(searchTerm))
        );
      });

      return {
        success: true,
        jobs: filteredJobs,
        totalFound: filteredJobs.length,
        source: "governmentjobs",
      };
    } catch (error: any) {
      return {
        success: false,
        jobs: [],
        error: `Government jobs search error: ${error.message}`,
        source: "governmentjobs",
      };
    }
  }

  // Utility methods
  private formatSalary(min?: number, max?: number): string | undefined {
    if (!min && !max) return undefined;
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return undefined;
  }

  private async addDelay(board: JobBoardProvider) {
    const lastRequest = this.lastRequestTime.get(board) || 0;
    const minDelayMs = 1000; // 1 second between requests
    const elapsed = Date.now() - lastRequest;

    if (elapsed < minDelayMs) {
      await new Promise((resolve) => setTimeout(resolve, minDelayMs - elapsed));
    }

    this.lastRequestTime.set(board, Date.now());
  }

  private getEnabledJobBoards(): JobBoardProvider[] {
    return Object.values(JOB_BOARD_CONFIGS)
      .filter((config) => {
        if (config.requiresAuth) {
          // For now, only enable non-auth required boards
          return false;
        }
        return true;
      })
      .sort((a, b) => b.priority - a.priority)
      .map((config) => config.name);
  }

  private deduplicateJobs(jobs: JobBoardJob[]): JobBoardJob[] {
    const seen = new Set<string>();
    return jobs.filter((job) => {
      const key =
        `${job.title.toLowerCase()}-${job.company.toLowerCase()}-${job.location.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private sortJobsByRelevance(
    jobs: JobBoardJob[],
    query: string,
  ): JobBoardJob[] {
    const queryLower = query.toLowerCase();

    return jobs.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Title match (highest weight)
      if (a.title.toLowerCase().includes(queryLower)) scoreA += 10;
      if (b.title.toLowerCase().includes(queryLower)) scoreB += 10;

      // Company match
      if (a.company.toLowerCase().includes(queryLower)) scoreA += 5;
      if (b.company.toLowerCase().includes(queryLower)) scoreB += 5;

      // Skills match
      if (a.skills?.some((skill) => skill.toLowerCase().includes(queryLower))) {
        scoreA += 3;
      }
      if (b.skills?.some((skill) => skill.toLowerCase().includes(queryLower))) {
        scoreB += 3;
      }

      // Job board priority
      const configA = JOB_BOARD_CONFIGS[a.source];
      const configB = JOB_BOARD_CONFIGS[b.source];
      scoreA += configA.priority / 10;
      scoreB += configB.priority / 10;

      return scoreB - scoreA;
    });
  }
}

export const jobSearchService = new JobSearchService();
