/**
 * Core Domain Interfaces for ProofOfFit
 *
 * Defines the fundamental data structures and contracts for job matching,
 * provider integration, and fit scoring within the ProofOfFit ecosystem.
 */

export type Job = {
    id: string;
    company: string;
    title: string;
    description?: string;
    location?: string;
    remote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    postedAt: Date;
    applyUrl?: string;
    source: "seed" | "manual" | "google" | "greenhouse";
    raw?: unknown;
    flags?: Record<string, unknown>;
};

export type JobQuery = {
    q?: string;
    location?: string;
    remote?: boolean;
    minSalary?: number;
    limit?: number;
    page?: number;
    sort?: "relevance" | "recent" | "pay";
};

export interface JobProvider {
    searchJobs(q: JobQuery): Promise<{ jobs: Job[]; nextPage?: number }>;
    getJob(id: string): Promise<Job | null>;
}

export interface JobSearchResult {
    jobs: Job[];
    totalFound?: number;
    nextPage?: number;
    hasMore?: boolean;
    searchId?: string;
    metadata?: {
        provider: string;
        searchTime: number;
        cacheHit?: boolean;
    };
}

export interface FitScore {
    overall: number; // 0-100
    breakdown: {
        skills: number;
        experience: number;
        education: number;
        location: number;
        salary: number;
        culture?: number;
    };
    explanation: string;
    confidence: number; // 0-1
    biasCheck: {
        passed: boolean;
        warnings: string[];
    };
    reliability: {
        score: number; // 0-100
        factors: string[];
    };
}

export interface CandidateProfile {
    id: string;
    userId: string;
    skills: string[];
    experience: {
        years: number;
        level: "entry" | "mid" | "senior" | "lead";
        industries: string[];
    };
    education: {
        degree: string;
        field: string;
        institution: string;
    };
    preferences: {
        jobTypes: string[];
        locations: string[];
        remote: boolean;
        salaryMin?: number;
        salaryMax?: number;
    };
    resume: {
        content: string;
        sections: {
            summary?: string;
            experience?: string;
            education?: string;
            skills?: string;
        };
    };
}

export interface JobRequirements {
    id: string;
    title: string;
    description: string;
    requirements: {
        mustHave: string[];
        niceToHave: string[];
        experience: {
            years: number;
            level: "entry" | "mid" | "senior" | "lead";
        };
        education?: string;
        skills: string[];
    };
    preferences: {
        jobTypes: string[];
        locations: string[];
        remote: boolean;
        salaryMin?: number;
        salaryMax?: number;
    };
    company: {
        name: string;
        size?: string;
        industry?: string;
        culture?: string[];
    };
}

export interface ConsentEvent {
    id: string;
    userId: string;
    eventType:
        | "policy_accept"
        | "data_export"
        | "data_delete"
        | "marketing_opt_in"
        | "marketing_opt_out";
    policyVersion: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}

export interface WorkEvent {
    id: string;
    source: string;
    signature: string;
    prevHash: string;
    timestamp: Date;
    eventType: string;
    data: Record<string, unknown>;
    verified: boolean;
}

export interface PolicyRegistry {
    id: string;
    policyType: "privacy" | "terms" | "cookie" | "data_processing";
    version: string;
    effectiveDate: Date;
    content: string;
    checksum: string;
    isActive: boolean;
}

export interface JobSearchEvent {
    id: string;
    userId?: string;
    sessionId: string;
    consentId: string;
    query: JobQuery;
    results: {
        totalFound: number;
        jobsReturned: number;
        searchTime: number;
    };
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}

export interface ReliabilityMetrics {
    providerId: string;
    timestamp: Date;
    metrics: {
        uptime: number; // 0-1
        responseTime: number; // ms
        errorRate: number; // 0-1
        dataQuality: number; // 0-1
        consistency: number; // 0-1
    };
    events: {
        successful: number;
        failed: number;
        timeout: number;
        rateLimited: number;
    };
}

export interface SalaryRange {
    min: number;
    max: number;
    currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
    unit: "hourly" | "monthly" | "annually";
    confidence: number; // 0-1
    source: "explicit" | "inferred" | "estimated";
}

export interface BiasCheckResult {
    passed: boolean;
    score: number; // 0-100
    warnings: string[];
    recommendations: string[];
    checkedAreas: {
        gender: boolean;
        age: boolean;
        ethnicity: boolean;
        disability: boolean;
        location: boolean;
        education: boolean;
    };
}

export interface ExplainabilityReport {
    overallScore: number;
    breakdown: {
        [key: string]: {
            score: number;
            weight: number;
            explanation: string;
            confidence: number;
        };
    };
    factors: {
        positive: string[];
        negative: string[];
        neutral: string[];
    };
    recommendations: string[];
    transparency: {
        algorithm: string;
        version: string;
        lastUpdated: Date;
        dataSources: string[];
    };
}

// Provider-specific interfaces
export interface ProviderConfig {
    name: string;
    type: "seed" | "google" | "greenhouse" | "manual";
    enabled: boolean;
    rateLimit: {
        requestsPerMinute: number;
        requestsPerHour: number;
    };
    circuitBreaker: {
        failureThreshold: number;
        recoveryTimeout: number;
    };
    retry: {
        maxAttempts: number;
        backoffMs: number;
    };
}

export interface ProviderHealth {
    providerId: string;
    status: "healthy" | "degraded" | "unhealthy";
    lastCheck: Date;
    metrics: {
        uptime: number;
        responseTime: number;
        errorRate: number;
        throughput: number;
    };
    issues: string[];
}

// Error types
export class ProviderError extends Error {
    constructor(
        message: string,
        public provider: string,
        public code: string,
        public retryable: boolean = false,
    ) {
        super(message);
        this.name = "ProviderError";
    }
}

export class FitScoreError extends Error {
    constructor(
        message: string,
        public candidateId: string,
        public jobId: string,
        public reason: string,
    ) {
        super(message);
        this.name = "FitScoreError";
    }
}

export class ConsentError extends Error {
    constructor(
        message: string,
        public userId: string,
        public requiredConsent: string,
    ) {
        super(message);
        this.name = "ConsentError";
    }
}

// Utility types
export type JobSource = Job["source"];
export type ExperienceLevel = CandidateProfile["experience"]["level"];
export type JobSortOrder = JobQuery["sort"];
export type ConsentEventType = ConsentEvent["eventType"];
export type PolicyType = PolicyRegistry["policyType"];
