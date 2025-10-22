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
    source:
        | "seed"
        | "manual"
        | "google"
        | "greenhouse"
        | "lever"
        | "ashby"
        | "recruitee"
        | "workable"
        | "smartrecruiters"
        | "adzuna"
        | "usajobs";
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
