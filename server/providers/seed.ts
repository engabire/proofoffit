/**
 * Enhanced SeedProvider with Latency Jitter and Pagination
 *
 * Provides deterministic, realistic job data for development and testing
 * with configurable latency, pagination, and "closed" flag simulation.
 */

import type { Job, JobProvider, JobQuery } from "../../domain/jobs";

interface SeedJob extends Job {
    closed?: boolean;
    priority?: number;
}

export class SeedProvider implements JobProvider {
    private readonly jobs: SeedJob[] = [];
    private readonly rng: () => number;
    private readonly baseLatencyMs: number;
    private readonly jitterMs: number;

    constructor() {
        // Deterministic RNG for consistent results
        this.rng = this.createSeededRNG(42);
        this.baseLatencyMs = Number(
            process.env.SEED_PROVIDER_LATENCY_MS ?? 100,
        );
        this.jitterMs = Number(process.env.SEED_PROVIDER_JITTER_MS ?? 50);

        this.initializeSeedData();
    }

    private createSeededRNG(seed: number): () => number {
        let state = seed;
        return () => {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        };
    }

    private initializeSeedData(): void {
        const companies = [
            "TechCorp",
            "InnovateLabs",
            "DataFlow",
            "CloudScale",
            "AI Solutions",
            "DevOps Inc",
            "SecurityFirst",
            "MobileTech",
            "WebCraft",
            "StartupXYZ",
        ];

        const titles = [
            "Software Engineer",
            "Senior Developer",
            "Full Stack Engineer",
            "DevOps Engineer",
            "Data Scientist",
            "Product Manager",
            "UX Designer",
            "Backend Developer",
            "Frontend Developer",
            "Mobile Developer",
            "Cloud Architect",
            "Security Engineer",
        ];

        const locations = [
            "San Francisco, CA",
            "New York, NY",
            "Seattle, WA",
            "Austin, TX",
            "Boston, MA",
            "Remote",
            "London, UK",
            "Berlin, Germany",
            "Toronto, Canada",
        ];

        const skills = [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Python",
            "Java",
            "Go",
            "AWS",
            "Docker",
            "Kubernetes",
            "PostgreSQL",
            "MongoDB",
            "Redis",
        ];

        // Generate 100 seed jobs
        for (let i = 0; i < 100; i++) {
            const company =
                companies[Math.floor(this.rng() * companies.length)];
            const title = titles[Math.floor(this.rng() * titles.length)];
            const location =
                locations[Math.floor(this.rng() * locations.length)];
            const isRemote = location === "Remote" || this.rng() > 0.7;

            // Generate salary range
            const baseSalary = 60000 + Math.floor(this.rng() * 120000);
            const salaryRange = Math.floor(this.rng() * 20000);

            // Randomly close some jobs (10% chance)
            const closed = this.rng() < 0.1;

            // Priority for sorting (higher = more relevant)
            const priority = Math.floor(this.rng() * 100);

            const job: SeedJob = {
                id: `seed-${i + 1}`,
                company,
                title,
                description: this.generateJobDescription(
                    title,
                    company,
                    skills,
                ),
                location: isRemote ? "Remote" : location,
                remote: isRemote,
                salaryMin: baseSalary,
                salaryMax: baseSalary + salaryRange,
                currency: "USD",
                postedAt: new Date(
                    Date.now() -
                        Math.floor(this.rng() * 30 * 24 * 60 * 60 * 1000),
                ), // Last 30 days
                applyUrl: `https://example.com/apply/${i + 1}`,
                source: "seed",
                closed,
                priority,
                flags: {
                    generated: true,
                    seedId: i + 1,
                },
            };

            this.jobs.push(job);
        }

        // Sort by priority (highest first)
        this.jobs.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    private generateJobDescription(
        title: string,
        company: string,
        skills: string[],
    ): string {
        const selectedSkills = skills
            .sort(() => this.rng() - 0.5)
            .slice(0, 3 + Math.floor(this.rng() * 3));

        return `
We are ${company}, a leading technology company looking for a ${title} to join our team.

**Key Responsibilities:**
- Develop and maintain high-quality software solutions
- Collaborate with cross-functional teams
- Participate in code reviews and technical discussions
- Contribute to architectural decisions

**Required Skills:**
${selectedSkills.map((skill) => `- ${skill}`).join("\n")}

**What We Offer:**
- Competitive salary and benefits
- Flexible work arrangements
- Professional development opportunities
- Collaborative and inclusive environment

Join us in building the future of technology!
    `.trim();
    }

    private async simulateLatency(): Promise<void> {
        const latency = this.baseLatencyMs +
            Math.floor(this.rng() * this.jitterMs);
        await new Promise((resolve) => setTimeout(resolve, latency));
    }

    async searchJobs(
        query: JobQuery,
    ): Promise<{ jobs: Job[]; nextPage?: number }> {
        await this.simulateLatency();

        let filteredJobs = [...this.jobs];

        // Filter by query
        if (query.q) {
            const searchTerm = query.q.toLowerCase();
            filteredJobs = filteredJobs.filter((job) =>
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description?.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by location
        if (query.location) {
            const location = query.location.toLowerCase();
            filteredJobs = filteredJobs.filter((job) =>
                job.location?.toLowerCase().includes(location) ||
                (query.remote && job.remote)
            );
        }

        // Filter by remote preference
        if (query.remote !== undefined) {
            filteredJobs = filteredJobs.filter((job) =>
                job.remote === query.remote
            );
        }

        // Filter by minimum salary
        if (query.minSalary) {
            filteredJobs = filteredJobs.filter((job) =>
                job.salaryMin && job.salaryMin >= query.minSalary!
            );
        }

        // Filter out closed jobs (unless specifically requested)
        if (!query.flags?.includeClosed) {
            filteredJobs = filteredJobs.filter((job) => !job.closed);
        }

        // Sort results
        switch (query.sort) {
            case "recent":
                filteredJobs.sort((a, b) =>
                    b.postedAt.getTime() - a.postedAt.getTime()
                );
                break;
            case "pay":
                filteredJobs.sort((a, b) =>
                    (b.salaryMax || 0) - (a.salaryMax || 0)
                );
                break;
            case "relevance":
            default:
                // Already sorted by priority
                break;
        }

        // Pagination
        const limit = query.limit || 20;
        const page = query.page || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
        const hasMore = endIndex < filteredJobs.length;
        const nextPage = hasMore ? page + 1 : undefined;

        return {
            jobs: paginatedJobs,
            nextPage,
        };
    }

    async getJob(id: string): Promise<Job | null> {
        await this.simulateLatency();

        const job = this.jobs.find((j) => j.id === id);
        return job || null;
    }

    // Utility methods for testing and debugging
    getJobCount(): number {
        return this.jobs.length;
    }

    getClosedJobCount(): number {
        return this.jobs.filter((job) => job.closed).length;
    }

    getOpenJobCount(): number {
        return this.jobs.filter((job) => !job.closed).length;
    }

    // Simulate job closure (for testing)
    closeJob(id: string): boolean {
        const job = this.jobs.find((j) => j.id === id);
        if (job) {
            job.closed = true;
            return true;
        }
        return false;
    }

    // Simulate new job posting (for testing)
    addJob(job: Omit<Job, "id" | "source">): Job {
        const newJob: SeedJob = {
            ...job,
            id: `seed-${this.jobs.length + 1}`,
            source: "seed",
            priority: Math.floor(this.rng() * 100),
            flags: {
                generated: true,
                seedId: this.jobs.length + 1,
            },
        };

        this.jobs.push(newJob);
        return newJob;
    }
}
