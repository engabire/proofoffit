import { Job, UserProfile } from "@/types";
import { JobMatch, JobMatcher, MatchingCriteria } from "./job-matcher";

export interface RecommendationConfig {
    maxRecommendations: number;
    minFitScore: number;
    minConfidence: number;
    diversityWeight: number;
    recencyWeight: number;
    salaryWeight: number;
    locationWeight: number;
}

export interface JobRecommendation {
    job: Job;
    fitScore: number;
    confidence: number;
    reasons: string[];
    improvements: string[];
    recommendationType: "perfect_match" | "good_match" | "explore" | "stretch";
    priority: number;
    tags: string[];
    estimatedResponseRate: number;
    timeToApply: string;
}

export interface RecommendationInsights {
    totalJobs: number;
    perfectMatches: number;
    goodMatches: number;
    exploreOpportunities: number;
    stretchGoals: number;
    averageFitScore: number;
    topSkills: string[];
    topIndustries: string[];
    salaryInsights: {
        average: number;
        range: [number, number];
        percentile: number;
    };
    locationInsights: {
        remotePercentage: number;
        topLocations: string[];
    };
}

export class JobRecommendationEngine {
    private jobMatcher: JobMatcher;
    private config: RecommendationConfig;

    constructor(
        jobs: Job[],
        userProfile: UserProfile,
        config: Partial<RecommendationConfig> = {},
    ) {
        this.jobMatcher = new JobMatcher(jobs, userProfile);
        this.config = {
            maxRecommendations: 20,
            minFitScore: 0.3,
            minConfidence: 0.4,
            diversityWeight: 0.2,
            recencyWeight: 0.1,
            salaryWeight: 0.15,
            locationWeight: 0.1,
            ...config,
        };
    }

    /**
     * Generate personalized job recommendations
     */
    generateRecommendations(criteria: MatchingCriteria): JobRecommendation[] {
        const matches = this.jobMatcher.findMatches(criteria, 50);

        // Filter by minimum thresholds
        const filteredMatches = matches.filter((match) =>
            match.fitScore >= this.config.minFitScore &&
            match.confidence >= this.config.minConfidence
        );

        // Convert to recommendations with additional metadata
        const recommendations = filteredMatches.map((match) =>
            this.createRecommendation(match, criteria)
        );

        // Apply diversity and ranking
        const rankedRecommendations = this.rankRecommendations(recommendations);

        return rankedRecommendations.slice(0, this.config.maxRecommendations);
    }

    /**
     * Create a job recommendation from a match
     */
    private createRecommendation(
        match: JobMatch,
        criteria: MatchingCriteria,
    ): JobRecommendation {
        const recommendationType = this.determineRecommendationType(match);
        const priority = this.calculatePriority(match, criteria);
        const tags = this.generateTags(match, criteria);
        const estimatedResponseRate = this.estimateResponseRate(match);
        const timeToApply = this.calculateTimeToApply(match.job);

        return {
            job: match.job,
            fitScore: match.fitScore,
            confidence: match.confidence,
            reasons: match.reasons,
            improvements: match.improvements,
            recommendationType,
            priority,
            tags,
            estimatedResponseRate,
            timeToApply,
        };
    }

    /**
     * Determine the type of recommendation
     */
    private determineRecommendationType(
        match: JobMatch,
    ): JobRecommendation["recommendationType"] {
        if (match.fitScore >= 0.9 && match.confidence >= 0.8) {
            return "perfect_match";
        } else if (match.fitScore >= 0.7 && match.confidence >= 0.6) {
            return "good_match";
        } else if (match.fitScore >= 0.5 && match.confidence >= 0.5) {
            return "explore";
        } else {
            return "stretch";
        }
    }

    /**
     * Calculate recommendation priority
     */
    private calculatePriority(
        match: JobMatch,
        criteria: MatchingCriteria,
    ): number {
        let priority = match.fitScore * 0.4 + match.confidence * 0.3;

        // Boost for salary match
        if (match.salaryMatch) {
            priority += this.config.salaryWeight;
        }

        // Boost for location match
        if (match.locationMatch) {
            priority += this.config.locationWeight;
        }

        // Boost for recent job postings
        if (match.job.postedAt) {
            const daysSincePosted =
                (Date.now() - new Date(match.job.postedAt).getTime()) /
                (1000 * 60 * 60 * 24);
            if (daysSincePosted <= 7) {
                priority += this.config.recencyWeight;
            }
        }

        // Boost for diversity (different companies, industries)
        priority += this.config.diversityWeight * 0.1;

        return Math.min(priority, 1.0);
    }

    /**
     * Generate relevant tags for the recommendation
     */
    private generateTags(
        match: JobMatch,
        criteria: MatchingCriteria,
    ): string[] {
        const tags: string[] = [];

        if (match.fitScore >= 0.9) tags.push("High Match");
        if (match.confidence >= 0.8) tags.push("High Confidence");
        if (match.salaryMatch) tags.push("Salary Match");
        if (match.locationMatch) tags.push("Location Match");
        if (match.job.remote) tags.push("Remote");
        if (match.job.postedAt) {
            const daysSincePosted =
                (Date.now() - new Date(match.job.postedAt).getTime()) /
                (1000 * 60 * 60 * 24);
            if (daysSincePosted <= 3) tags.push("Just Posted");
            else if (daysSincePosted <= 7) tags.push("Recent");
        }
        if (match.job.industry) tags.push(match.job.industry);
        if (match.job.jobType) tags.push(match.job.jobType);

        return tags;
    }

    /**
     * Estimate response rate based on match quality
     */
    private estimateResponseRate(match: JobMatch): number {
        let baseRate = 0.1; // 10% base response rate

        // Increase based on fit score
        baseRate += match.fitScore * 0.3;

        // Increase based on confidence
        baseRate += match.confidence * 0.2;

        // Increase for perfect matches
        if (match.fitScore >= 0.9) {
            baseRate += 0.2;
        }

        // Increase for recent postings
        if (match.job.postedAt) {
            const daysSincePosted =
                (Date.now() - new Date(match.job.postedAt).getTime()) /
                (1000 * 60 * 60 * 24);
            if (daysSincePosted <= 3) {
                baseRate += 0.1;
            }
        }

        return Math.min(baseRate, 0.8); // Cap at 80%
    }

    /**
     * Calculate estimated time to apply
     */
    private calculateTimeToApply(job: Job): string {
        if (!job.postedAt) {
            return "Unknown";
        }

        const daysSincePosted =
            (Date.now() - new Date(job.postedAt).getTime()) /
            (1000 * 60 * 60 * 24);

        if (daysSincePosted <= 1) {
            return "Apply today";
        } else if (daysSincePosted <= 3) {
            return "Apply within 2 days";
        } else if (daysSincePosted <= 7) {
            return "Apply within a week";
        } else if (daysSincePosted <= 14) {
            return "Apply within 2 weeks";
        } else {
            return "Apply soon";
        }
    }

    /**
     * Rank recommendations by priority and diversity
     */
    private rankRecommendations(
        recommendations: JobRecommendation[],
    ): JobRecommendation[] {
        // Sort by priority (descending)
        recommendations.sort((a, b) => b.priority - a.priority);

        // Apply diversity boost (avoid too many from same company/industry)
        const seenCompanies = new Set<string>();
        const seenIndustries = new Set<string>();

        return recommendations.map((rec, index) => {
            let diversityBoost = 0;

            if (rec.job.company && !seenCompanies.has(rec.job.company)) {
                diversityBoost += 0.05;
                seenCompanies.add(rec.job.company);
            }

            if (rec.job.industry && !seenIndustries.has(rec.job.industry)) {
                diversityBoost += 0.03;
                seenIndustries.add(rec.job.industry);
            }

            return {
                ...rec,
                priority: Math.min(rec.priority + diversityBoost, 1.0),
            };
        }).sort((a, b) => b.priority - a.priority);
    }

    /**
     * Generate insights about the job market and recommendations
     */
    generateInsights(
        recommendations: JobRecommendation[],
    ): RecommendationInsights {
        const totalJobs = recommendations.length;
        const perfectMatches =
            recommendations.filter((r) =>
                r.recommendationType === "perfect_match"
            ).length;
        const goodMatches =
            recommendations.filter((r) => r.recommendationType === "good_match")
                .length;
        const exploreOpportunities =
            recommendations.filter((r) => r.recommendationType === "explore")
                .length;
        const stretchGoals =
            recommendations.filter((r) => r.recommendationType === "stretch")
                .length;

        const averageFitScore =
            recommendations.reduce((sum, r) => sum + r.fitScore, 0) / totalJobs;

        // Extract top skills
        const skillCounts = new Map<string, number>();
        recommendations.forEach((rec) => {
            rec.job.requiredSkills?.forEach((skill) => {
                skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
            });
        });
        const topSkills = Array.from(skillCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill]) => skill);

        // Extract top industries
        const industryCounts = new Map<string, number>();
        recommendations.forEach((rec) => {
            if (rec.job.industry) {
                industryCounts.set(
                    rec.job.industry,
                    (industryCounts.get(rec.job.industry) || 0) + 1,
                );
            }
        });
        const topIndustries = Array.from(industryCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([industry]) => industry);

        // Calculate salary insights
        const salaries = recommendations
            .filter((r) => r.job.salaryMin && r.job.salaryMax)
            .map((r) => (r.job.salaryMin! + r.job.salaryMax!) / 2);

        const averageSalary = salaries.length > 0
            ? salaries.reduce((sum, s) => sum + s, 0) / salaries.length
            : 0;
        const salaryRange: [number, number] = salaries.length > 0
            ? [Math.min(...salaries), Math.max(...salaries)]
            : [0, 0];

        // Calculate location insights
        const remoteJobs = recommendations.filter((r) => r.job.remote).length;
        const remotePercentage = totalJobs > 0
            ? (remoteJobs / totalJobs) * 100
            : 0;

        const locationCounts = new Map<string, number>();
        recommendations.forEach((rec) => {
            if (rec.job.location && !rec.job.remote) {
                const location = rec.job.location.split(",")[0].trim();
                locationCounts.set(
                    location,
                    (locationCounts.get(location) || 0) + 1,
                );
            }
        });
        const topLocations = Array.from(locationCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([location]) => location);

        return {
            totalJobs,
            perfectMatches,
            goodMatches,
            exploreOpportunities,
            stretchGoals,
            averageFitScore: Math.round(averageFitScore * 100) / 100,
            topSkills,
            topIndustries,
            salaryInsights: {
                average: Math.round(averageSalary),
                range: [Math.round(salaryRange[0]), Math.round(salaryRange[1])],
                percentile: 0, // Would need more data to calculate
            },
            locationInsights: {
                remotePercentage: Math.round(remotePercentage * 100) / 100,
                topLocations,
            },
        };
    }

    /**
     * Get personalized recommendations for different scenarios
     */
    getScenarioRecommendations(criteria: MatchingCriteria): {
        quickWins: JobRecommendation[];
        careerGrowth: JobRecommendation[];
        salaryBoost: JobRecommendation[];
        remoteWork: JobRecommendation[];
    } {
        const allRecommendations = this.generateRecommendations(criteria);

        return {
            quickWins: allRecommendations
                .filter((r) =>
                    r.recommendationType === "perfect_match" ||
                    r.recommendationType === "good_match"
                )
                .slice(0, 5),
            careerGrowth: allRecommendations
                .filter((r) =>
                    r.job.experienceRequired &&
                    r.job.experienceRequired > (criteria.experience || 0)
                )
                .slice(0, 5),
            salaryBoost: allRecommendations
                .filter((r) =>
                    r.job.salaryMin && r.job.salaryMin > criteria.salaryRange[1]
                )
                .slice(0, 5),
            remoteWork: allRecommendations
                .filter((r) => r.job.remote)
                .slice(0, 5),
        };
    }
}
