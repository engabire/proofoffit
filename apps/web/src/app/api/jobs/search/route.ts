import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import { jobSearchService } from "@/lib/job-search";
import { usajobsAPI, USAJobsSearchParams } from "@/lib/job-feeds/usajobs";
import { trackEvent } from "@/lib/analytics";
import { telemetrySink } from "@/lib/telemetry/telemetry-sink";
import { jobFeedConfig } from "@/lib/config/job-feeds";

export const dynamic = "force-dynamic";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Use configuration from job feed config
const externalFeedsEnabled = jobFeedConfig.enableExternalJobFeeds;
const supabaseSearchEnabled = jobFeedConfig.enableSupabaseJobSearch;

interface JobSearchFilters {
  query: string;
  location: string;
  remote: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  experience?: number | null;
  industry?: string | null;
  jobType?: string | null;
  workType?: string | null;
}

interface JobSearchPagination {
  page: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function buildJobSearchResponse(options: {
  jobs: any[];
  source: string;
  filters: JobSearchFilters;
  pagination: JobSearchPagination;
  status?: number;
  success?: boolean;
  reason?: string;
}) {
  const {
    jobs,
    source,
    filters,
    pagination,
    status = 200,
    success = true,
    reason,
  } = options;

  const payload = {
    success,
    data: {
      jobs,
      pagination,
      source,
      filters,
      reason,
    },
    jobs,
    total: pagination.totalJobs,
    hasMore: pagination.hasNextPage,
    source,
  };

  const headers = new Headers({
    "X-Job-Search-Source": source,
    "X-Job-Search-Success": success ? "true" : "false",
    "X-Job-Search-Results": pagination.totalJobs.toString(),
  });

  if (reason) {
    headers.set("X-Job-Search-Reason", reason);
  }

  return NextResponse.json(payload, { status, headers });
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // 30 requests per minute

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Remove potentially harmful characters and limit length
  return input
    .replace(/[<>\"'&]/g, "")
    .substring(0, 100)
    .trim();
}

export async function GET(req: NextRequest) {
  const requestStart = Date.now();

  // Define logTelemetry function that will be populated after variables are declared
  let logTelemetry: (metadata: {
    source: string;
    success: boolean;
    status: number;
    resultCount: number;
    queryLength: number;
    reason?: string;
  }) => Promise<void> = async () => {}; // Default no-op function

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const rawQuery = searchParams.get("q") ?? searchParams.get("query") ?? "";
    const query = sanitizeInput(rawQuery);
    const location = sanitizeInput(searchParams.get("location") || "");
    const workType = sanitizeInput(searchParams.get("workType") || "");
    const remoteParam = (searchParams.get("remote") || "").toLowerCase();
    const remote = remoteParam === "true" || remoteParam === "1" ||
      remoteParam === "yes";
    const salaryMinValue = Number.parseInt(
      searchParams.get("salaryMin") || "",
      10,
    );
    const salaryMin = Number.isNaN(salaryMinValue) ? null : salaryMinValue;
    const salaryMaxValue = Number.parseInt(
      searchParams.get("salaryMax") || "",
      10,
    );
    const salaryMax = Number.isNaN(salaryMaxValue) ? null : salaryMaxValue;
    const experienceValue = Number.parseInt(
      searchParams.get("experience") || "",
      10,
    );
    const experience = Number.isNaN(experienceValue) ? null : experienceValue;
    const industryInput = sanitizeInput(searchParams.get("industry") || "");
    const industry = industryInput || null;
    const jobTypeInput = sanitizeInput(searchParams.get("jobType") || "");
    const jobType = jobTypeInput || null;
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const limit = Math.max(
      1,
      Math.min(Number.isNaN(parsedLimit) ? 20 : parsedLimit, 50),
    );
    const rawPage = Number.parseInt(searchParams.get("page") || "", 10);
    const rawOffset = Number.parseInt(searchParams.get("offset") || "", 10);
    let page = Number.isNaN(rawPage) ? 1 : Math.max(rawPage, 1);
    let offset: number;

    if (!Number.isNaN(rawOffset)) {
      offset = Math.max(rawOffset, 0);
      if (Number.isNaN(rawPage)) {
        page = Math.floor(offset / limit) + 1;
      }
    } else {
      offset = (page - 1) * limit;
    }

    const filters: JobSearchFilters = {
      query,
      location,
      remote,
      salaryMin,
      salaryMax,
      experience,
      industry,
      jobType,
      workType: workType || null,
    };
    const normalizedJobType = jobType
      ? jobType.toLowerCase().replace(/\s+/g, "-") as
        | "full-time"
        | "part-time"
        | "contract"
        | "internship"
      : undefined;

    // Define logTelemetry function after variables are declared
    logTelemetry = async (metadata: {
      source: string;
      success: boolean;
      status: number;
      resultCount: number;
      queryLength: number;
      reason?: string;
    }) => {
      // Log to legacy analytics system
      void trackEvent({
        eventType: "job_search_performed",
        metadata: {
          ...metadata,
          durationMs: Date.now() - requestStart,
          externalFeedsEnabled,
          supabaseSearchEnabled,
        },
      });

      // Log to new telemetry sink for GTM tracking
      await telemetrySink.sendJobSearchEvent({
        userId: req.headers.get("x-user-id") || undefined,
        sessionId: req.headers.get("x-session-id") || undefined,
        searchQuery: query,
        filters: {
          location,
          remote,
          salaryMin,
          salaryMax,
          experience,
          industry,
          jobType,
          workType,
        },
        resultsCount: metadata.resultCount,
        responseTime: Date.now() - requestStart,
        isRealData: metadata.source !== "mock",
        source: metadata.source as "external" | "supabase" | "mock",
      });
    };

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      await logTelemetry({
        source: "rate_limit",
        success: false,
        status: 429,
        resultCount: 0,
        queryLength: query.length,
        reason: "rate_limit_exceeded",
      });
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 },
      );
    }

    // Try USAJOBS API first for government jobs
    if (externalFeedsEnabled && query.trim()) {
      try {
        // eslint-disable-next-line no-console
        console.log("Searching USAJOBS API...");
        const searchParams: USAJobsSearchParams = {
          keyword: query,
          location: location,
          page: 1,
          resultsPerPage: limit,
        };

        const usajobsResults = await usajobsAPI.searchJobs(searchParams);

        if (usajobsResults.length > 0) {
          // Transform USAJOBS data to our format
          const transformedJobs = usajobsResults.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.organization,
            location: job.location,
            type: "full-time",
            remote: false,
            salary: job.salaryMin && job.salaryMax
              ? {
                min: job.salaryMin,
                max: job.salaryMax,
                currency: "USD",
              }
              : undefined,
            description: job.description,
            requirements: job.requirements ? [job.requirements] : [],
            niceToHaves: [],
            benefits: [
              "Government benefits",
              "Retirement plan",
              "Health insurance",
            ],
            postedAt: new Date(job.postedDate),
            companyLogo: undefined,
            companySize: "1000+",
            industry: "Government",
            experienceLevel: "mid",
            source: "USAJOBS",
            constraints: {},
            tos: {
              allowed: true,
              captcha: false,
              notes: "Government position - auto-apply eligible",
            },
            url: job.url,
            applyUrl: job.url,
            department: job.department,
            agency: job.agency,
            workSchedule: job.workSchedule,
            positionType: job.positionType,
            closingDate: job.closingDate,
          }));

          await logTelemetry({
            source: "usajobs",
            success: true,
            status: 200,
            resultCount: transformedJobs.length,
            queryLength: query.length,
          });

          const pagination: JobSearchPagination = {
            page,
            limit,
            totalJobs: transformedJobs.length,
            totalPages: Math.max(1, Math.ceil(transformedJobs.length / limit)),
            hasNextPage: false,
            hasPrevPage: page > 1,
          };

          return buildJobSearchResponse({
            jobs: transformedJobs,
            source: "usajobs",
            filters,
            pagination,
          });
        }
        await logTelemetry({
          source: "usajobs",
          success: true,
          status: 200,
          resultCount: 0,
          queryLength: query.length,
          reason: "no_results",
        });
      } catch (usajobsError) {
        // eslint-disable-next-line no-console
        console.error(
          "USAJOBS API failed, trying enhanced search:",
          usajobsError,
        );
        await logTelemetry({
          source: "usajobs",
          success: false,
          status: 502,
          resultCount: 0,
          queryLength: query.length,
          reason: usajobsError instanceof Error
            ? usajobsError.message
            : "unknown_error",
        });
      }
    }

    // Try enhanced job search as fallback
    if (externalFeedsEnabled && query.trim()) {
      try {
        // eslint-disable-next-line no-console
        console.log("Using enhanced job search service...");
        const enhancedJobs = await jobSearchService.searchJobs({
          query,
          location,
          remote,
          limit,
          experienceLevel: "mid",
          jobType: normalizedJobType,
        });

        if (enhancedJobs.length > 0) {
          // Transform enhanced jobs to match expected format
          const transformedJobs = enhancedJobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.employmentType || "full-time",
            remote: job.isRemote,
            salary: job.salary
              ? {
                min: job.salaryMin || 0,
                max: job.salaryMax || 0,
                currency: "USD",
              }
              : undefined,
            description: job.description,
            requirements: job.skills || [],
            niceToHaves: [],
            benefits: job.benefits || [],
            postedAt: new Date(job.postedDate),
            companyLogo: undefined,
            companySize: job.companySize,
            industry: job.industry,
            experienceLevel: job.experienceLevel || "mid",
            source: job.source,
            constraints: {},
            tos: {
              allowed: job.source === "governmentjobs",
              captcha: false,
              notes: `${job.source} job posting`,
            },
            url: job.url,
            applyUrl: job.applyUrl,
          }));

          await logTelemetry({
            source: "enhanced",
            success: true,
            status: 200,
            resultCount: transformedJobs.length,
            queryLength: query.length,
          });

          const pagination: JobSearchPagination = {
            page,
            limit,
            totalJobs: transformedJobs.length,
            totalPages: Math.max(1, Math.ceil(transformedJobs.length / limit)),
            hasNextPage: false,
            hasPrevPage: page > 1,
          };

          return buildJobSearchResponse({
            jobs: transformedJobs,
            source: "enhanced",
            filters,
            pagination,
          });
        }
        await logTelemetry({
          source: "enhanced",
          success: true,
          status: 200,
          resultCount: 0,
          queryLength: query.length,
          reason: "no_results",
        });
      } catch (enhancedError) {
        // eslint-disable-next-line no-console
        console.error(
          "Enhanced job search failed, falling back:",
          enhancedError,
        );
        await logTelemetry({
          source: "enhanced",
          success: false,
          status: 502,
          resultCount: 0,
          queryLength: query.length,
          reason: enhancedError instanceof Error
            ? enhancedError.message
            : "unknown_error",
        });
      }
    }

    // Fallback to Supabase or mock data
    if (!supabaseSearchEnabled || !isSupabaseConfigured() || !supabaseAdmin) {
      const mockJobs = getMockJobs(query, location, workType, limit);
      await logTelemetry({
        source: "mock",
        success: true,
        status: 200,
        resultCount: mockJobs.length,
        queryLength: query.length,
        reason: "supabase_disabled_or_unavailable",
      });
      return NextResponse.json({
        jobs: mockJobs,
        total: mockJobs.length,
        hasMore: false,
        source: "mock",
      });
    }

    // Build Supabase query
    let supabaseQuery = supabaseAdmin
      .from("jobs")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add text search filters
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,org.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    // Location filter
    if (location.trim()) {
      supabaseQuery = supabaseQuery.ilike("location", `%${location}%`);
    }

    // Work type filter
    if (workType && workType !== "all") {
      supabaseQuery = supabaseQuery.eq("workType", workType);
    }

    // Execute query
    const { data: jobs, error } = await supabaseQuery;

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Supabase query error:", error);
      const mockJobs = getMockJobs(query, location, workType, limit);
      await logTelemetry({
        source: "mock",
        success: true,
        status: 200,
        resultCount: mockJobs.length,
        queryLength: query.length,
        reason: "supabase_query_error",
      });
      // Fallback to mock data
      return NextResponse.json({
        jobs: mockJobs,
        total: mockJobs.length,
        hasMore: false,
        source: "mock",
      });
    }

    // Transform to match the expected format
    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.org,
      location: job.location,
      type: job.workType === "remote" ? "full-time" : "full-time",
      remote: job.workType === "remote",
      salary: job.pay
        ? {
          min: job.pay.min || 0,
          max: job.pay.max || 0,
          currency: job.pay.currency || "USD",
        }
        : undefined,
      description: job.description,
      requirements: job.requirements?.must_have || [],
      niceToHaves: job.requirements?.preferred || [],
      benefits: [], // Could be added to schema later
      postedAt: new Date(job.fetchedAt || job.createdAt),
      companyLogo: undefined,
      companySize: undefined,
      industry: undefined,
      experienceLevel: "mid", // Could be determined from requirements
      source: job.source,
      constraints: job.constraints,
      tos: job.tos,
    }));

    await logTelemetry({
      source: "supabase",
      success: true,
      status: 200,
      resultCount: transformedJobs.length,
      queryLength: query.length,
    });

    return NextResponse.json({
      jobs: transformedJobs,
      total: transformedJobs.length,
      hasMore: transformedJobs.length === limit,
      source: "supabase",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error searching jobs:", error);
    // Fallback to mock data on any error
    const mockJobs = getMockJobs("", "", "", 20);
    await logTelemetry({
      source: "mock",
      success: false,
      status: 200,
      resultCount: mockJobs.length,
      queryLength: 0,
      reason: error instanceof Error ? error.message : "unknown_error",
    });
    return NextResponse.json({
      jobs: mockJobs,
      total: mockJobs.length,
      hasMore: false,
      source: "mock",
    });
  }
}

// POST endpoint to add jobs from external sources
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobs } = body;

    if (!Array.isArray(jobs)) {
      return NextResponse.json(
        { error: "Jobs must be an array" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Jobs would be created successfully",
      jobs: jobs,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating jobs:", error);
    return NextResponse.json(
      { error: "Failed to create jobs" },
      { status: 500 },
    );
  }
}

// Mock jobs data for fallback
function getMockJobs(
  query: string,
  location: string,
  workType: string,
  limit: number,
) {
  const mockJobs = [
    {
      id: "1",
      title: "Data Analyst",
      company: "Metropolitan Council",
      location: "Minneapolis, MN",
      type: "full-time",
      remote: false,
      salary: { min: 65000, max: 85000, currency: "USD" },
      description:
        "Analyze transportation data to support regional planning decisions. Work with large datasets and create visualizations for policy makers.",
      requirements: [
        "Bachelor's degree in Data Science or related field",
        "3+ years experience with SQL and Python",
        "Experience with data visualization tools",
      ],
      niceToHaves: [
        "Master's degree",
        "Experience with transportation planning",
        "Knowledge of GIS systems",
      ],
      benefits: ["Health insurance", "Retirement plan", "Flexible schedule"],
      postedAt: new Date("2024-01-15"),
      companyLogo: undefined,
      companySize: "1000-5000",
      industry: "Government",
      experienceLevel: "mid",
      source: "USAJOBS",
      constraints: {},
      tos: {
        allowed: true,
        captcha: false,
        notes: "Government position - auto-apply eligible",
      },
    },
    {
      id: "2",
      title: "Project Manager",
      company: "Metropolitan Council",
      location: "St. Paul, MN",
      type: "full-time",
      remote: false,
      salary: { min: 70000, max: 95000, currency: "USD" },
      description:
        "Lead infrastructure projects for regional development. Coordinate with multiple stakeholders and ensure project delivery on time and budget.",
      requirements: [
        "Bachelor's degree in Engineering or Project Management",
        "5+ years project management experience",
        "PMP certification preferred",
      ],
      niceToHaves: [
        "Experience with government contracts",
        "Knowledge of environmental regulations",
        "Strong communication skills",
      ],
      benefits: [
        "Health insurance",
        "Retirement plan",
        "Professional development",
      ],
      postedAt: new Date("2024-01-10"),
      companyLogo: undefined,
      companySize: "1000-5000",
      industry: "Government",
      experienceLevel: "senior",
      source: "USAJOBS",
      constraints: {},
      tos: {
        allowed: true,
        captcha: false,
        notes: "Government position - auto-apply eligible",
      },
    },
    {
      id: "3",
      title: "Software Engineer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "full-time",
      remote: true,
      salary: { min: 120000, max: 180000, currency: "USD" },
      description:
        "Build scalable web applications using modern technologies. Work with a talented team to deliver high-quality software solutions.",
      requirements: [
        "Bachelor's degree in Computer Science",
        "3+ years experience with React and Node.js",
        "Experience with cloud platforms",
      ],
      niceToHaves: [
        "TypeScript experience",
        "DevOps knowledge",
        "Open source contributions",
      ],
      benefits: [
        "Health insurance",
        "Stock options",
        "Remote work",
        "Learning budget",
      ],
      postedAt: new Date("2024-01-20"),
      companyLogo: undefined,
      companySize: "100-500",
      industry: "Technology",
      experienceLevel: "mid",
      source: "LinkedIn",
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: "Requires manual application",
      },
    },
    {
      id: "4",
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "New York, NY",
      type: "full-time",
      remote: false,
      salary: { min: 80000, max: 120000, currency: "USD" },
      description:
        "Develop and execute marketing strategies to drive business growth. Lead a team of marketing professionals and manage campaigns across multiple channels.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "5+ years marketing experience",
        "Experience with digital marketing tools",
      ],
      niceToHaves: [
        "MBA",
        "Experience with B2B marketing",
        "Analytics expertise",
      ],
      benefits: ["Health insurance", "401k", "Flexible PTO"],
      postedAt: new Date("2024-01-18"),
      companyLogo: undefined,
      companySize: "50-200",
      industry: "Marketing",
      experienceLevel: "senior",
      source: "Indeed",
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: "Requires manual application",
      },
    },
    {
      id: "5",
      title: "UX Designer",
      company: "DesignStudio",
      location: "Austin, TX",
      type: "full-time",
      remote: true,
      salary: { min: 75000, max: 110000, currency: "USD" },
      description:
        "Create intuitive user experiences for web and mobile applications. Conduct user research and collaborate with development teams.",
      requirements: [
        "Bachelor's degree in Design or related field",
        "3+ years UX design experience",
        "Proficiency in Figma and Adobe Creative Suite",
      ],
      niceToHaves: [
        "Experience with user research",
        "Knowledge of front-end development",
        "Portfolio of successful projects",
      ],
      benefits: ["Health insurance", "Remote work", "Design tools budget"],
      postedAt: new Date("2024-01-22"),
      companyLogo: undefined,
      companySize: "20-100",
      industry: "Design",
      experienceLevel: "mid",
      source: "LinkedIn",
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: "Requires manual application",
      },
    },
    {
      id: "6",
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Seattle, WA",
      type: "full-time",
      remote: true,
      salary: { min: 100000, max: 150000, currency: "USD" },
      description:
        "Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets and build predictive models.",
      requirements: [
        "Master's degree in Data Science or related field",
        "3+ years experience with Python and R",
        "Experience with machine learning frameworks",
      ],
      niceToHaves: [
        "PhD",
        "Experience with deep learning",
        "Knowledge of cloud platforms",
      ],
      benefits: ["Health insurance", "Stock options", "Conference budget"],
      postedAt: new Date("2024-01-25"),
      companyLogo: undefined,
      companySize: "100-500",
      industry: "Technology",
      experienceLevel: "senior",
      source: "Indeed",
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: "Requires manual application",
      },
    },
  ];

  // Filter jobs based on search criteria
  let filteredJobs = mockJobs;

  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchTerm))
    );
  }

  if (location.trim()) {
    const locationTerm = location.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      job.location.toLowerCase().includes(locationTerm)
    );
  }

  if (workType && workType !== "all") {
    filteredJobs = filteredJobs.filter((job) =>
      workType === "remote" ? job.remote : !job.remote
    );
  }

  return filteredJobs.slice(0, limit);
}
