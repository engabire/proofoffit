import { NextRequest, NextResponse } from "next/server";
import { analyticsEngine } from "@/lib/analytics/analytics-engine";
import { ApplicationStatus, JobApplication, Job, UserProfile } from "@/types";

// Mock data for demonstration
const mockUsers: UserProfile[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    experience: 5,
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    education: ["Bachelor's Degree"],
    location: "San Francisco",
    preferences: {
      salaryRange: [80000, 120000],
      jobTypes: ["Full-time"],
      industries: ["Technology"],
      remote: true,
    },
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    experience: 3,
    skills: ["Python", "Machine Learning", "Data Science", "SQL"],
    education: ["Master's Degree"],
    location: "New York",
    preferences: {
      salaryRange: [90000, 130000],
      jobTypes: ["Full-time", "Contract"],
      industries: ["Technology", "Finance"],
      remote: true,
    },
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    experience: 8,
    skills: ["Java", "Spring", "AWS", "Docker"],
    education: ["Bachelor's Degree"],
    location: "Seattle",
    preferences: {
      salaryRange: [120000, 160000],
      jobTypes: ["Full-time"],
      industries: ["Technology"],
      remote: false,
    },
  },
];

const mockJobs: Job[] = [
  {
    id: "job-1",
    source: "direct",
    org: "TechCorp",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    workType: "Full-time",
    pay: { min: 120000, max: 180000 },
    description: "Senior software engineer position",
    requirements: {},
    constraints: {},
    tos: {},
    fetchedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    company: "TechCorp",
    remote: true,
    salaryMin: 120000,
    salaryMax: 180000,
    experienceRequired: 5,
    requiredSkills: ["JavaScript", "React", "Node.js", "TypeScript"],
    educationRequired: ["Bachelor's Degree"],
    industry: "Technology",
    jobType: "Full-time",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-2",
    source: "direct",
    org: "DataCorp",
    title: "Machine Learning Engineer",
    location: "New York, NY",
    workType: "Full-time",
    pay: { min: 130000, max: 200000 },
    description: "ML engineer position",
    requirements: {},
    constraints: {},
    tos: {},
    fetchedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    company: "DataCorp",
    remote: false,
    salaryMin: 130000,
    salaryMax: 200000,
    experienceRequired: 4,
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    educationRequired: ["Master's Degree"],
    industry: "Technology",
    jobType: "Full-time",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-3",
    source: "direct",
    org: "CloudCorp",
    title: "DevOps Engineer",
    location: "Seattle, WA",
    workType: "Full-time",
    pay: { min: 110000, max: 160000 },
    description: "DevOps engineer position",
    requirements: {},
    constraints: {},
    tos: {},
    fetchedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    company: "CloudCorp",
    remote: true,
    salaryMin: 110000,
    salaryMax: 160000,
    experienceRequired: 6,
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    educationRequired: ["Bachelor's Degree"],
    industry: "Technology",
    jobType: "Full-time",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const makeStatus = (
  status: ApplicationStatus["status"],
  days: number,
  updatedBy: ApplicationStatus["updatedBy"] = "system",
  notes?: string,
): ApplicationStatus => ({
  status,
  timestamp: daysAgo(days),
  updatedBy,
  notes,
});

const mockApplications: JobApplication[] = [
  {
    id: "app-1",
    userId: "user-1",
    job: mockJobs[0],
    status: makeStatus("submitted", 1, "user"),
    statusHistory: [
      makeStatus("draft", 2, "user"),
      makeStatus("submitted", 1, "user"),
    ],
    documents: [],
    notes: [],
    events: [],
    appliedAt: daysAgo(1),
    source: "direct",
    lastActivityAt: daysAgo(1),
    interviewCount: 0,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "app-2",
    userId: "user-2",
    job: mockJobs[1],
    status: makeStatus("interview-scheduled", 2, "system"),
    statusHistory: [
      makeStatus("submitted", 4, "user"),
      makeStatus("under-review", 3, "system"),
      makeStatus("interview-scheduled", 2, "system"),
    ],
    documents: [],
    notes: [],
    events: [],
    appliedAt: daysAgo(4),
    source: "recommendation",
    lastActivityAt: daysAgo(2),
    interviewCount: 1,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    id: "app-3",
    userId: "user-3",
    job: mockJobs[2],
    status: makeStatus("hired", 5, "employer"),
    statusHistory: [
      makeStatus("submitted", 8, "user"),
      makeStatus("interview-scheduled", 6, "system"),
      makeStatus("interview-completed", 5, "system"),
      makeStatus("hired", 5, "employer"),
    ],
    documents: [],
    notes: [],
    events: [],
    appliedAt: daysAgo(8),
    source: "auto-apply",
    lastActivityAt: daysAgo(5),
    interviewCount: 2,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(5),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    const metric = searchParams.get("metric");
    const format = searchParams.get("format") || "json";

    // Update analytics engine with mock data
    analyticsEngine.updateData({
      users: mockUsers,
      jobs: mockJobs,
      applications: mockApplications,
    });

    if (metric === "time-series") {
      const timeRangeParam = searchParams.get("timeRangeParam");
      if (!timeRangeParam) {
        return NextResponse.json(
          { error: "timeRangeParam is required for time-series data" },
          { status: 400 },
        );
      }

      const timeRangeObj = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        granularity: "day" as const,
      };

      const timeSeriesData = analyticsEngine.getTimeSeriesData(
        timeRangeParam,
        timeRangeObj,
      );

      return NextResponse.json({
        success: true,
        data: timeSeriesData,
      });
    }

    if (format === "export") {
      const exportFormat = searchParams.get("exportFormat") || "json";
      const exportData = analyticsEngine.exportData(
        exportFormat as "json" | "csv",
      );

      return new NextResponse(exportData, {
        headers: {
          "Content-Type": exportFormat === "json"
            ? "application/json"
            : "text/csv",
          "Content-Disposition":
            `attachment; filename="analytics-export.${exportFormat}"`,
        },
      });
    }

    // Get comprehensive analytics metrics
    const metrics = analyticsEngine.getMetrics();

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        timeRange,
        lastUpdated: new Date().toISOString(),
        summary: {
          totalUsers: metrics.user.totalUsers,
          totalJobs: metrics.jobs.totalJobs,
          totalApplications: metrics.applications.totalApplications,
          successRate: metrics.applications.successRate,
          averageMatchScore: metrics.performance.averageMatchScore,
        },
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "update-data":
        analyticsEngine.updateData(data);
        return NextResponse.json({
          success: true,
          message: "Analytics data updated successfully",
        });

      case "recalculate":
        // Force recalculation of metrics
        analyticsEngine.updateData({});
        return NextResponse.json({
          success: true,
          message: "Metrics recalculated successfully",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process analytics request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
