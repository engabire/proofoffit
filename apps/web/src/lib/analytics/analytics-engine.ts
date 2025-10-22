import { Job, JobApplication, UserProfile } from "@/types";

export interface AnalyticsMetrics {
    user: UserMetrics;
    jobs: JobMetrics;
    applications: JobApplicationMetrics;
    performance: PerformanceMetrics;
    market: MarketMetrics;
}

export interface UserMetrics {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    profileCompleteness: {
        average: number;
        distribution: Record<string, number>;
    };
    skillDistribution: Record<string, number>;
    experienceDistribution: Record<string, number>;
    locationDistribution: Record<string, number>;
    industryPreferences: Record<string, number>;
}

export interface JobMetrics {
    totalJobs: number;
    activeJobs: number;
    newJobs: number;
    jobGrowth: number;
    averageSalary: number;
    salaryDistribution: Record<string, number>;
    industryDistribution: Record<string, number>;
    locationDistribution: Record<string, number>;
    remoteJobs: number;
    remotePercentage: number;
    skillDemand: Record<string, number>;
    experienceRequirements: Record<string, number>;
}

export interface JobApplicationMetrics {
    totalApplications: number;
    successfulApplications: number;
    successRate: number;
    averageTimeToApply: number;
    applicationSources: Record<string, number>;
    statusDistribution: Record<string, number>;
    conversionFunnel: {
        views: number;
        applications: number;
        interviews: number;
        offers: number;
        hires: number;
    };
}

export interface PerformanceMetrics {
    averageMatchScore: number;
    matchScoreDistribution: Record<string, number>;
    averageConfidence: number;
    recommendationAccuracy: number;
    userSatisfaction: number;
    systemUptime: number;
    responseTime: number;
    errorRate: number;
}

export interface MarketMetrics {
    trendingSkills: Array<{ skill: string; growth: number; demand: number }>;
    salaryTrends: Array<{ period: string; average: number; change: number }>;
    industryGrowth: Array<
        { industry: string; growth: number; jobCount: number }
    >;
    locationTrends: Array<
        { location: string; growth: number; averageSalary: number }
    >;
    marketInsights: {
        hotSkills: string[];
        decliningSkills: string[];
        emergingRoles: string[];
        salaryInflation: number;
    };
}

export interface AnalyticsTimeRange {
    start: Date;
    end: Date;
    granularity: "hour" | "day" | "week" | "month" | "year";
}

export interface AnalyticsFilters {
    dateRange?: AnalyticsTimeRange;
    industries?: string[];
    locations?: string[];
    skills?: string[];
    experienceLevels?: string[];
    salaryRanges?: { min: number; max: number }[];
}

export class AnalyticsEngine {
    private data: {
        users: UserProfile[];
        jobs: Job[];
        applications: JobApplication[];
        metrics: AnalyticsMetrics;
    };

    constructor() {
        this.data = {
            users: [],
            jobs: [],
            applications: [],
            metrics: this.getDefaultMetrics(),
        };
    }

    /**
     * Get default metrics structure
     */
    private getDefaultMetrics(): AnalyticsMetrics {
        return {
            user: {
                totalUsers: 0,
                activeUsers: 0,
                newUsers: 0,
                userGrowth: 0,
                profileCompleteness: {
                    average: 0,
                    distribution: {},
                },
                skillDistribution: {},
                experienceDistribution: {},
                locationDistribution: {},
                industryPreferences: {},
            },
            jobs: {
                totalJobs: 0,
                activeJobs: 0,
                newJobs: 0,
                jobGrowth: 0,
                averageSalary: 0,
                salaryDistribution: {},
                industryDistribution: {},
                locationDistribution: {},
                remoteJobs: 0,
                remotePercentage: 0,
                skillDemand: {},
                experienceRequirements: {},
            },
            applications: {
                totalApplications: 0,
                successfulApplications: 0,
                successRate: 0,
                averageTimeToApply: 0,
                applicationSources: {},
                statusDistribution: {},
                conversionFunnel: {
                    views: 0,
                    applications: 0,
                    interviews: 0,
                    offers: 0,
                    hires: 0,
                },
            },
            performance: {
                averageMatchScore: 0,
                matchScoreDistribution: {},
                averageConfidence: 0,
                recommendationAccuracy: 0,
                userSatisfaction: 0,
                systemUptime: 99.9,
                responseTime: 0,
                errorRate: 0,
            },
            market: {
                trendingSkills: [],
                salaryTrends: [],
                industryGrowth: [],
                locationTrends: [],
                marketInsights: {
                    hotSkills: [],
                    decliningSkills: [],
                    emergingRoles: [],
                    salaryInflation: 0,
                },
            },
        };
    }

    /**
     * Update data and recalculate metrics
     */
    public updateData(data: {
        users?: UserProfile[];
        jobs?: Job[];
        applications?: JobApplication[];
    }): void {
        if (data.users) this.data.users = data.users;
        if (data.jobs) this.data.jobs = data.jobs;
        if (data.applications) this.data.applications = data.applications;

        this.recalculateMetrics();
    }

    /**
     * Recalculate all metrics
     */
    private recalculateMetrics(): void {
        this.data.metrics = {
            user: this.calculateUserMetrics(),
            jobs: this.calculateJobMetrics(),
            applications: this.calculateJobApplicationMetrics(),
            performance: this.calculatePerformanceMetrics(),
            market: this.calculateMarketMetrics(),
        };
    }

    /**
     * Calculate user metrics
     */
    private calculateUserMetrics(): UserMetrics {
        const users = this.data.users;
        const totalUsers = users.length;
        const activeUsers = users.filter((u) => this.isActiveUser(u)).length;
        const newUsers = users.filter((u) => this.isNewUser(u)).length;

        const profileCompleteness = this.calculateProfileCompleteness(users);
        const skillDistribution = this.calculateSkillDistribution(users);
        const experienceDistribution = this.calculateExperienceDistribution(
            users,
        );
        const locationDistribution = this.calculateUserLocationDistribution(
            users,
        );
        const industryPreferences = this.calculateIndustryPreferences(users);

        return {
            totalUsers,
            activeUsers,
            newUsers,
            userGrowth: this.calculateGrowthRate(users, "user"),
            profileCompleteness,
            skillDistribution,
            experienceDistribution,
            locationDistribution,
            industryPreferences,
        };
    }

    /**
     * Calculate job metrics
     */
    private calculateJobMetrics(): JobMetrics {
        const jobs = this.data.jobs;
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter((j) => this.isActiveJob(j)).length;
        const newJobs = jobs.filter((j) => this.isNewJob(j)).length;

        const averageSalary = this.calculateAverageSalary(jobs);
        const salaryDistribution = this.calculateSalaryDistribution(jobs);
        const industryDistribution = this.calculateJobIndustryDistribution(
            jobs,
        );
        const locationDistribution = this.calculateJobLocationDistribution(
            jobs,
        );
        const remoteJobs = jobs.filter((j) => j.remote).length;
        const skillDemand = this.calculateSkillDemand(jobs);
        const experienceRequirements = this.calculateExperienceRequirements(
            jobs,
        );

        return {
            totalJobs,
            activeJobs,
            newJobs,
            jobGrowth: this.calculateGrowthRate(jobs, "job"),
            averageSalary,
            salaryDistribution,
            industryDistribution,
            locationDistribution,
            remoteJobs,
            remotePercentage: totalJobs > 0
                ? (remoteJobs / totalJobs) * 100
                : 0,
            skillDemand,
            experienceRequirements,
        };
    }

    /**
     * Calculate application metrics
     */
    private calculateJobApplicationMetrics(): JobApplicationMetrics {
        const applications = this.data.applications;
        const totalApplications = applications.length;
        const successfulApplications =
            applications.filter((application) =>
                application.status.status === "hired"
            ).length;

        const successRate = totalApplications > 0
            ? (successfulApplications / totalApplications) * 100
            : 0;
        const averageTimeToApply = this.calculateAverageTimeToApply(
            applications,
        );
        const applicationSources = this.calculateApplicationSources(
            applications,
        );
        const statusDistribution = this.calculateStatusDistribution(
            applications,
        );
        const conversionFunnel = this.calculateConversionFunnel(applications);

        return {
            totalApplications,
            successfulApplications,
            successRate,
            averageTimeToApply,
            applicationSources,
            statusDistribution,
            conversionFunnel,
        };
    }

    /**
     * Calculate performance metrics
     */
    private calculatePerformanceMetrics(): PerformanceMetrics {
        // These would typically come from system monitoring and user feedback
        return {
            averageMatchScore: 0.85,
            matchScoreDistribution: {
                "0-20%": 5,
                "21-40%": 10,
                "41-60%": 20,
                "61-80%": 35,
                "81-100%": 30,
            },
            averageConfidence: 0.78,
            recommendationAccuracy: 0.82,
            userSatisfaction: 4.2,
            systemUptime: 99.9,
            responseTime: 250,
            errorRate: 0.1,
        };
    }

    /**
     * Calculate market metrics
     */
    private calculateMarketMetrics(): MarketMetrics {
        const trendingSkills = this.calculateTrendingSkills();
        const salaryTrends = this.calculateSalaryTrends();
        const industryGrowth = this.calculateIndustryGrowth();
        const locationTrends = this.calculateLocationTrends();
        const marketInsights = this.calculateMarketInsights();

        return {
            trendingSkills,
            salaryTrends,
            industryGrowth,
            locationTrends,
            marketInsights,
        };
    }

    /**
     * Helper methods for calculations
     */
    private isActiveUser(user: UserProfile): boolean {
        // Consider user active if they've logged in within the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return true; // Assume all users are new for demo purposes
    }

    private isNewUser(user: UserProfile): boolean {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return true; // Assume all users are new for demo purposes
    }

    private isActiveJob(job: Job): boolean {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(job.postedAt || 0) > thirtyDaysAgo;
    }

    private isNewJob(job: Job): boolean {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(job.postedAt || 0) > sevenDaysAgo;
    }

    private calculateProfileCompleteness(
        users: UserProfile[],
    ): { average: number; distribution: Record<string, number> } {
        if (users.length === 0) return { average: 0, distribution: {} };

        const completenessScores = users.map((user) => {
            let score = 0;
            let total = 0;

            if (user.name) score += 1;
            total += 1;
            if (user.email) score += 1;
            total += 1;
            if (user.skills && user.skills.length > 0) score += 1;
            total += 1;
            if (user.experience) score += 1;
            total += 1;
            if (user.education && user.education.length > 0) score += 1;
            total += 1;
            if (user.location) {
                score += 1;
            }
            total += 1;

            return total > 0 ? score / total : 0;
        });

        const average =
            completenessScores.reduce((sum, score) => sum + score, 0) /
            completenessScores.length;

        const distribution = {
            "0-20%": 0,
            "21-40%": 0,
            "41-60%": 0,
            "61-80%": 0,
            "81-100%": 0,
        };

        completenessScores.forEach((score) => {
            const percentage = Math.round(score * 100);
            if (percentage <= 20) distribution["0-20%"]++;
            else if (percentage <= 40) distribution["21-40%"]++;
            else if (percentage <= 60) distribution["41-60%"]++;
            else if (percentage <= 80) distribution["61-80%"]++;
            else distribution["81-100%"]++;
        });

        return { average, distribution };
    }

    private calculateSkillDistribution(
        users: UserProfile[],
    ): Record<string, number> {
        const skillCounts: Record<string, number> = {};

        users.forEach((user) => {
            user.skills?.forEach((skill) => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });

        return skillCounts;
    }

    private calculateExperienceDistribution(
        users: UserProfile[],
    ): Record<string, number> {
        const experienceCounts: Record<string, number> = {};

        users.forEach((user) => {
            const experience = user.experience || 0;
            let range: string;

            if (experience === 0) range = "0 years";
            else if (experience <= 2) range = "1-2 years";
            else if (experience <= 5) range = "3-5 years";
            else if (experience <= 10) range = "6-10 years";
            else range = "10+ years";

            experienceCounts[range] = (experienceCounts[range] || 0) + 1;
        });

        return experienceCounts;
    }

    private calculateUserLocationDistribution(
        users: UserProfile[],
    ): Record<string, number> {
        const locationCounts: Record<string, number> = {};

        users.forEach((user) => {
            if (user.location) {
                locationCounts[user.location] = (locationCounts[user.location] || 0) + 1;
            }
        });

        return locationCounts;
    }

    private calculateIndustryPreferences(
        users: UserProfile[],
    ): Record<string, number> {
        const industryCounts: Record<string, number> = {};

        users.forEach((user) => {
            user.preferences.industries?.forEach((industry) => {
                industryCounts[industry] = (industryCounts[industry] || 0) + 1;
            });
        });

        return industryCounts;
    }

    private calculateAverageSalary(jobs: Job[]): number {
        const jobsWithSalary = jobs.filter((job) =>
            job.salaryMin && job.salaryMax
        );
        if (jobsWithSalary.length === 0) return 0;

        const totalSalary = jobsWithSalary.reduce((sum, job) => {
            return sum + ((job.salaryMin! + job.salaryMax!) / 2);
        }, 0);

        return totalSalary / jobsWithSalary.length;
    }

    private calculateSalaryDistribution(jobs: Job[]): Record<string, number> {
        const distribution: Record<string, number> = {
            "0-50k": 0,
            "50k-75k": 0,
            "75k-100k": 0,
            "100k-125k": 0,
            "125k-150k": 0,
            "150k+": 0,
        };

        jobs.forEach((job) => {
            if (job.salaryMin && job.salaryMax) {
                const average = (job.salaryMin + job.salaryMax) / 2;

                if (average < 50000) distribution["0-50k"]++;
                else if (average < 75000) distribution["50k-75k"]++;
                else if (average < 100000) distribution["75k-100k"]++;
                else if (average < 125000) distribution["100k-125k"]++;
                else if (average < 150000) distribution["125k-150k"]++;
                else distribution["150k+"]++;
            }
        });

        return distribution;
    }

    private calculateJobIndustryDistribution(
        jobs: Job[],
    ): Record<string, number> {
        const industryCounts: Record<string, number> = {};

        jobs.forEach((job) => {
            const industry = job.industry || "Unknown";
            industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });

        return industryCounts;
    }

    private calculateJobLocationDistribution(
        jobs: Job[],
    ): Record<string, number> {
        const locationCounts: Record<string, number> = {};

        jobs.forEach((job) => {
            const location = job.location || "Unknown";
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        return locationCounts;
    }

    private calculateSkillDemand(jobs: Job[]): Record<string, number> {
        const skillCounts: Record<string, number> = {};

        jobs.forEach((job) => {
            job.requiredSkills?.forEach((skill) => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });

        return skillCounts;
    }

    private calculateExperienceRequirements(
        jobs: Job[],
    ): Record<string, number> {
        const experienceCounts: Record<string, number> = {};

        jobs.forEach((job) => {
            const experience = job.experienceRequired || 0;
            let range: string;

            if (experience === 0) range = "Entry Level";
            else if (experience <= 2) range = "1-2 years";
            else if (experience <= 5) range = "3-5 years";
            else if (experience <= 10) range = "6-10 years";
            else range = "10+ years";

            experienceCounts[range] = (experienceCounts[range] || 0) + 1;
        });

        return experienceCounts;
    }

    private calculateAverageTimeToApply(
        applications: JobApplication[],
    ): number {
        // This would calculate the average time between job posting and application
        // For now, return a mock value
        return 2.5; // days
    }

    private calculateApplicationSources(
        applications: JobApplication[],
    ): Record<string, number> {
        const sourceCounts: Record<string, number> = {};

        applications.forEach((app) => {
            const source = app.source || "Unknown";
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        return sourceCounts;
    }

    private calculateStatusDistribution(
        applications: JobApplication[],
    ): Record<string, number> {
        const statusCounts: Record<string, number> = {};

        applications.forEach((app) => {
            const statusKey = (app.status?.status ?? "Unknown") as string;
            statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
        });

        return statusCounts;
    }

    private calculateConversionFunnel(applications: JobApplication[]): {
        views: number;
        applications: number;
        interviews: number;
        offers: number;
        hires: number;
    } {
        // Mock conversion funnel data
        const totalApplicationsCount = applications.length;

        return {
            views: totalApplicationsCount * 10, // Assume 10 views per application
            applications: totalApplicationsCount,
            interviews: Math.floor(totalApplicationsCount * 0.3),
            offers: Math.floor(totalApplicationsCount * 0.1),
            hires: Math.floor(totalApplicationsCount * 0.05),
        };
    }

    private calculateGrowthRate(items: any[], type: "user" | "job"): number {
        // Calculate growth rate compared to previous period
        // For now, return a mock value
        return type === "user" ? 15.2 : 8.7;
    }

    private calculateTrendingSkills(): Array<
        { skill: string; growth: number; demand: number }
    > {
        // Mock trending skills data
        return [
            { skill: "AI/ML", growth: 45.2, demand: 89 },
            { skill: "Cloud Computing", growth: 32.1, demand: 76 },
            { skill: "DevOps", growth: 28.7, demand: 71 },
            { skill: "TypeScript", growth: 25.3, demand: 68 },
            { skill: "React", growth: 22.8, demand: 65 },
        ];
    }

    private calculateSalaryTrends(): Array<
        { period: string; average: number; change: number }
    > {
        // Mock salary trends data
        return [
            { period: "Q1 2024", average: 95000, change: 2.1 },
            { period: "Q2 2024", average: 97000, change: 2.1 },
            { period: "Q3 2024", average: 99000, change: 2.1 },
            { period: "Q4 2024", average: 101000, change: 2.0 },
        ];
    }

    private calculateIndustryGrowth(): Array<
        { industry: string; growth: number; jobCount: number }
    > {
        // Mock industry growth data
        return [
            { industry: "Technology", growth: 12.5, jobCount: 1250 },
            { industry: "Healthcare", growth: 8.3, jobCount: 890 },
            { industry: "Finance", growth: 6.7, jobCount: 650 },
            { industry: "Education", growth: 4.2, jobCount: 420 },
        ];
    }

    private calculateLocationTrends(): Array<
        { location: string; growth: number; averageSalary: number }
    > {
        // Mock location trends data
        return [
            { location: "San Francisco", growth: 15.2, averageSalary: 145000 },
            { location: "New York", growth: 12.8, averageSalary: 135000 },
            { location: "Seattle", growth: 10.5, averageSalary: 125000 },
            { location: "Remote", growth: 25.3, averageSalary: 115000 },
        ];
    }

    private calculateMarketInsights(): {
        hotSkills: string[];
        decliningSkills: string[];
        emergingRoles: string[];
        salaryInflation: number;
    } {
        return {
            hotSkills: [
                "AI/ML",
                "Cloud Computing",
                "DevOps",
                "TypeScript",
                "React",
            ],
            decliningSkills: ["jQuery", "PHP", "Flash", "Silverlight"],
            emergingRoles: [
                "AI Engineer",
                "DevOps Engineer",
                "Cloud Architect",
                "Data Scientist",
            ],
            salaryInflation: 3.2,
        };
    }

    /**
     * Get metrics with optional filters
     */
    public getMetrics(filters?: AnalyticsFilters): AnalyticsMetrics {
        // Apply filters if provided
        if (filters) {
            return this.applyFilters(this.data.metrics, filters);
        }

        return this.data.metrics;
    }

    /**
     * Apply filters to metrics
     */
    private applyFilters(
        metrics: AnalyticsMetrics,
        filters: AnalyticsFilters,
    ): AnalyticsMetrics {
        // This would filter the data based on the provided filters
        // For now, return the metrics as-is
        return metrics;
    }

    /**
     * Get time-series data for charts
     */
    public getTimeSeriesData(
        metric: string,
        timeRange: AnalyticsTimeRange,
    ): Array<{ date: string; value: number }> {
        // Mock time-series data
        const data: Array<{ date: string; value: number }> = [];
        const start = new Date(timeRange.start);
        const end = new Date(timeRange.end);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            data.push({
                date: d.toISOString().split("T")[0],
                value: Math.random() * 100,
            });
        }

        return data;
    }

    /**
     * Export analytics data
     */
    public exportData(format: "json" | "csv"): string {
        if (format === "json") {
            return JSON.stringify(this.data.metrics, null, 2);
        }

        // CSV export would be implemented here
        return "CSV export not implemented";
    }
}

// Export singleton instance
export const analyticsEngine = new AnalyticsEngine();
