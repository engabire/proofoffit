import { FitScore, Job, UserProfile } from "@/types";

export interface AdvancedMatchResult {
    jobId: string;
    fitScore: number;
    confidence: number;
    reasoning: string[];
    improvements: string[];
    skillGaps: string[];
    strengths: string[];
    marketInsights: {
        demand: number;
        competition: number;
        salaryTrend: "rising" | "stable" | "declining";
    };
    personalizedRecommendations: {
        skillDevelopment: string[];
        networking: string[];
        applicationStrategy: string[];
    };
}

export interface MLFeatures {
    skillSimilarity: number;
    experienceMatch: number;
    locationPreference: number;
    salaryAlignment: number;
    industryFit: number;
    educationMatch: number;
    companyCulture: number;
    growthPotential: number;
    workLifeBalance: number;
    remoteCompatibility: number;
}

export class AdvancedJobMatcher {
    private skillWeights: Record<string, number> = {
        "JavaScript": 0.9,
        "TypeScript": 0.95,
        "React": 0.9,
        "Node.js": 0.85,
        "Python": 0.8,
        "Machine Learning": 0.9,
        "AI": 0.95,
        "Data Science": 0.85,
        "Cloud": 0.8,
        "DevOps": 0.75,
    };

    private industryDemand: Record<string, number> = {
        "Technology": 0.95,
        "Finance": 0.85,
        "Healthcare": 0.8,
        "Education": 0.7,
        "Manufacturing": 0.6,
        "Retail": 0.5,
    };

    private locationMultipliers: Record<string, number> = {
        "San Francisco": 1.2,
        "New York": 1.15,
        "Seattle": 1.1,
        "Austin": 1.05,
        "Remote": 1.0,
        "Other": 0.9,
    };

    /**
     * Calculate advanced ML-based features for job matching
     */
    private calculateMLFeatures(
        job: Job,
        userProfile: UserProfile,
    ): MLFeatures {
        const skillSimilarity = this.calculateSkillSimilarity(
            job.requiredSkills || [],
            userProfile.skills || [],
        );
        const experienceMatch = this.calculateExperienceMatch(
            job.experienceRequired || 0,
            userProfile.experience || 0,
        );
        const locationPreference = this.calculateLocationPreference(
            job.location,
            [userProfile.location],
        );
        const salaryAlignment = this.calculateSalaryAlignment(
            job.salaryMin,
            job.salaryMax,
            userProfile.preferences.salaryRange[1], // Use max salary from range
        );
        const industryFit = this.calculateIndustryFit(
            job.industry || "",
            userProfile.preferences.industries || [],
        );
        const educationMatch = this.calculateEducationMatch(
            job.educationRequired || [],
            userProfile.education || [],
        );
        const companyCulture = this.calculateCompanyCulture(
            job.company || "",
            [], // No culture preferences in UserProfile
        );
        const growthPotential = this.calculateGrowthPotential(
            job,
            [], // No career goals in UserProfile
        );
        const workLifeBalance = this.calculateWorkLifeBalance(
            job,
            "balanced", // Default value
        );
        const remoteCompatibility = this.calculateRemoteCompatibility(
            job.remote || false,
            userProfile.preferences.remote ? "preferred" : "not_preferred",
        );

        return {
            skillSimilarity,
            experienceMatch,
            locationPreference,
            salaryAlignment,
            industryFit,
            educationMatch,
            companyCulture,
            growthPotential,
            workLifeBalance,
            remoteCompatibility,
        };
    }

    /**
     * Calculate skill similarity using weighted Jaccard similarity
     */
    private calculateSkillSimilarity(
        jobSkills: string[],
        userSkills: string[],
    ): number {
        if (jobSkills.length === 0) return 0.5;

        const jobSkillSet = new Set(jobSkills.map((s) => s.toLowerCase()));
        const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase()));

        let weightedIntersection = 0;
        let weightedUnion = 0;

        // Calculate weighted intersection
        for (const skill of jobSkillSet) {
            const weight = this.skillWeights[skill] || 0.5;
            if (userSkillSet.has(skill)) {
                weightedIntersection += weight;
            }
            weightedUnion += weight;
        }

        // Add user skills not in job requirements
        for (const skill of userSkillSet) {
            if (!jobSkillSet.has(skill)) {
                const weight = this.skillWeights[skill] || 0.5;
                weightedUnion += weight * 0.3; // Lower weight for non-required skills
            }
        }

        return weightedUnion > 0 ? weightedIntersection / weightedUnion : 0;
    }

    /**
     * Calculate experience match with flexibility
     */
    private calculateExperienceMatch(required: number, user: number): number {
        if (required === 0) return 1.0;

        const ratio = user / required;
        if (ratio >= 1.0) return 1.0;
        if (ratio >= 0.8) return 0.9;
        if (ratio >= 0.6) return 0.7;
        if (ratio >= 0.4) return 0.5;
        return 0.3;
    }

    /**
     * Calculate location preference match
     */
    private calculateLocationPreference(
        jobLocation: string,
        preferredLocations: string[],
    ): number {
        if (preferredLocations.length === 0) return 0.8;

        const jobLoc = jobLocation.toLowerCase();
        if (
            preferredLocations.some((loc) => loc.toLowerCase().includes(jobLoc))
        ) {
            return 1.0;
        }

        return this.locationMultipliers[jobLocation] || 0.7;
    }

    /**
     * Calculate salary alignment
     */
    private calculateSalaryAlignment(
        jobMin?: number,
        jobMax?: number,
        userExpectation?: number,
    ): number {
        if (!jobMin || !jobMax || !userExpectation) return 0.7;

        const jobMid = (jobMin + jobMax) / 2;
        const ratio = userExpectation / jobMid;

        if (ratio >= 0.9 && ratio <= 1.1) return 1.0;
        if (ratio >= 0.8 && ratio <= 1.2) return 0.9;
        if (ratio >= 0.7 && ratio <= 1.3) return 0.8;
        return 0.6;
    }

    /**
     * Calculate industry fit
     */
    private calculateIndustryFit(
        jobIndustry: string,
        preferredIndustries: string[],
    ): number {
        if (preferredIndustries.length === 0) return 0.8;

        const jobInd = jobIndustry.toLowerCase();
        if (
            preferredIndustries.some((ind) =>
                ind.toLowerCase().includes(jobInd)
            )
        ) {
            return 1.0;
        }

        return this.industryDemand[jobIndustry] || 0.6;
    }

    /**
     * Calculate education match
     */
    private calculateEducationMatch(
        required: string[],
        user: string[],
    ): number {
        if (required.length === 0) return 1.0;

        const requiredSet = new Set(required.map((e) => e.toLowerCase()));
        const userSet = new Set(user.map((e) => e.toLowerCase()));

        let matches = 0;
        for (const req of requiredSet) {
            if (userSet.has(req)) {
                matches++;
            }
        }

        return matches / required.length;
    }

    /**
     * Calculate company culture fit
     */
    private calculateCompanyCulture(
        company: string,
        preferences: string[],
    ): number {
        // This would typically integrate with company culture data
        // For now, return a base score
        return 0.8;
    }

    /**
     * Calculate growth potential
     */
    private calculateGrowthPotential(job: Job, careerGoals: string[]): number {
        // Analyze job description for growth indicators
        const growthKeywords = [
            "growth",
            "advancement",
            "leadership",
            "mentor",
            "senior",
            "principal",
        ];
        const jobText = `${job.title} ${job.description}`.toLowerCase();

        const growthScore = growthKeywords.reduce((score, keyword) => {
            return jobText.includes(keyword) ? score + 0.1 : score;
        }, 0);

        return Math.min(growthScore, 1.0);
    }

    /**
     * Calculate work-life balance
     */
    private calculateWorkLifeBalance(job: Job, preference: string): number {
        const jobText = `${job.title} ${job.description}`.toLowerCase();

        if (preference === "flexible") return 0.9;
        if (preference === "balanced") return 0.8;
        if (preference === "intensive") return 0.7;

        // Check for work-life balance indicators
        const balanceKeywords = ["flexible", "remote", "work-life", "balance"];
        const hasBalance = balanceKeywords.some((keyword) =>
            jobText.includes(keyword)
        );

        return hasBalance ? 0.9 : 0.7;
    }

    /**
     * Calculate remote compatibility
     */
    private calculateRemoteCompatibility(
        jobRemote: boolean,
        userPreference: string,
    ): number {
        if (userPreference === "remote" && jobRemote) return 1.0;
        if (userPreference === "office" && !jobRemote) return 1.0;
        if (userPreference === "flexible") return 0.9;

        return 0.6;
    }

    /**
     * Generate advanced match result with ML insights
     */
    public generateAdvancedMatch(
        job: Job,
        userProfile: UserProfile,
    ): AdvancedMatchResult {
        const features = this.calculateMLFeatures(job, userProfile);

        // Calculate weighted fit score
        const weights = {
            skillSimilarity: 0.25,
            experienceMatch: 0.20,
            locationPreference: 0.15,
            salaryAlignment: 0.15,
            industryFit: 0.10,
            educationMatch: 0.05,
            companyCulture: 0.05,
            growthPotential: 0.03,
            workLifeBalance: 0.01,
            remoteCompatibility: 0.01,
        };

        const fitScore = Object.entries(features).reduce(
            (score, [key, value]) => {
                return score +
                    (value * (weights[key as keyof typeof weights] || 0));
            },
            0,
        );

        // Calculate confidence based on data completeness
        const confidence = this.calculateConfidence(job, userProfile, features);

        // Generate insights
        const reasoning = this.generateReasoning(features, job, userProfile);
        const improvements = this.generateImprovements(
            features,
            job,
            userProfile,
        );
        const skillGaps = this.identifySkillGaps(
            job.requiredSkills || [],
            userProfile.skills || [],
        );
        const strengths = this.identifyStrengths(
            job.requiredSkills || [],
            userProfile.skills || [],
        );

        // Market insights
        const marketInsights = this.generateMarketInsights(job, userProfile);

        // Personalized recommendations
        const personalizedRecommendations = this
            .generatePersonalizedRecommendations(
                features,
                job,
                userProfile,
                skillGaps,
                strengths,
            );

        return {
            jobId: job.id,
            fitScore: Math.round(fitScore * 100) / 100,
            confidence: Math.round(confidence * 100) / 100,
            reasoning,
            improvements,
            skillGaps,
            strengths,
            marketInsights,
            personalizedRecommendations,
        };
    }

    /**
     * Calculate confidence based on data completeness and consistency
     */
    private calculateConfidence(
        job: Job,
        userProfile: UserProfile,
        features: MLFeatures,
    ): number {
        let confidence = 0.5;

        // Increase confidence based on data completeness
        if (job.requiredSkills && job.requiredSkills.length > 0) {
            confidence += 0.1;
        }
        if (userProfile.skills && userProfile.skills.length > 0) {
            confidence += 0.1;
        }
        if (job.salaryMin && job.salaryMax) confidence += 0.1;
        if (userProfile.preferences.salaryRange) confidence += 0.1;
        if (job.experienceRequired) confidence += 0.05;
        if (userProfile.experience) confidence += 0.05;

        // Increase confidence based on feature consistency
        const featureVariance = this.calculateFeatureVariance(features);
        confidence += (1 - featureVariance) * 0.1;

        return Math.min(confidence, 0.95);
    }

    /**
     * Calculate variance in features to assess consistency
     */
    private calculateFeatureVariance(features: MLFeatures): number {
        const values = Object.values(features);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance =
            values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
            values.length;
        return Math.sqrt(variance);
    }

    /**
     * Generate reasoning for the match
     */
    private generateReasoning(
        features: MLFeatures,
        job: Job,
        userProfile: UserProfile,
    ): string[] {
        const reasoning: string[] = [];

        if (features.skillSimilarity > 0.8) {
            reasoning.push("Excellent skill alignment with job requirements");
        } else if (features.skillSimilarity > 0.6) {
            reasoning.push("Good skill match with some areas for development");
        }

        if (features.experienceMatch > 0.8) {
            reasoning.push("Experience level matches job requirements well");
        }

        if (features.locationPreference > 0.9) {
            reasoning.push("Location aligns with your preferences");
        }

        if (features.salaryAlignment > 0.9) {
            reasoning.push("Salary expectations align well with job offer");
        }

        if (features.industryFit > 0.8) {
            reasoning.push("Strong fit with your preferred industry");
        }

        return reasoning;
    }

    /**
     * Generate improvement suggestions
     */
    private generateImprovements(
        features: MLFeatures,
        job: Job,
        userProfile: UserProfile,
    ): string[] {
        const improvements: string[] = [];

        if (features.skillSimilarity < 0.7) {
            improvements.push(
                "Consider developing skills in: " +
                    (job.requiredSkills || []).slice(0, 3).join(", "),
            );
        }

        if (features.experienceMatch < 0.7) {
            improvements.push(
                "Gain more experience in relevant technologies or take on leadership roles",
            );
        }

        if (features.salaryAlignment < 0.8) {
            improvements.push(
                "Consider negotiating salary or looking for roles with higher compensation",
            );
        }

        return improvements;
    }

    /**
     * Identify skill gaps
     */
    private identifySkillGaps(
        requiredSkills: string[],
        userSkills: string[],
    ): string[] {
        const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase()));
        return requiredSkills.filter((skill) =>
            !userSkillSet.has(skill.toLowerCase())
        );
    }

    /**
     * Identify strengths
     */
    private identifyStrengths(
        requiredSkills: string[],
        userSkills: string[],
    ): string[] {
        const requiredSkillSet = new Set(
            requiredSkills.map((s) => s.toLowerCase()),
        );
        return userSkills.filter((skill) =>
            requiredSkillSet.has(skill.toLowerCase())
        );
    }

    /**
     * Generate market insights
     */
    private generateMarketInsights(
        job: Job,
        userProfile: UserProfile,
    ): AdvancedMatchResult["marketInsights"] {
        const industry = job.industry || "Technology";
        const demand = this.industryDemand[industry] || 0.7;

        // Simulate competition based on job location and industry
        const competition = this.locationMultipliers[job.location] || 0.8;

        // Simulate salary trend
        const salaryTrend: "rising" | "stable" | "declining" = demand > 0.8
            ? "rising"
            : demand > 0.6
            ? "stable"
            : "declining";

        return {
            demand: Math.round(demand * 100) / 100,
            competition: Math.round(competition * 100) / 100,
            salaryTrend,
        };
    }

    /**
     * Generate personalized recommendations
     */
    private generatePersonalizedRecommendations(
        features: MLFeatures,
        job: Job,
        userProfile: UserProfile,
        skillGaps: string[],
        strengths: string[],
    ): AdvancedMatchResult["personalizedRecommendations"] {
        const skillDevelopment: string[] = [];
        const networking: string[] = [];
        const applicationStrategy: string[] = [];

        // Skill development recommendations
        if (skillGaps.length > 0) {
            skillDevelopment.push(
                `Focus on developing: ${skillGaps.slice(0, 2).join(", ")}`,
            );
        }

        if (features.experienceMatch < 0.8) {
            skillDevelopment.push(
                "Consider taking on side projects or freelance work to gain experience",
            );
        }

        // Networking recommendations
        const companyName = job.company || job.org || "target companies";
        networking.push(`Connect with professionals at ${companyName}`);
        networking.push("Join industry-specific groups and communities");

        if (job.industry) {
            networking.push(`Attend ${job.industry} conferences and meetups`);
        }

        // Application strategy
        const overallScore = (features.skillSimilarity + features.experienceMatch + features.locationPreference + features.salaryAlignment + features.industryFit + features.educationMatch + features.companyCulture + features.growthPotential + features.workLifeBalance + features.remoteCompatibility) / 10;
        if (overallScore > 0.8) {
            applicationStrategy.push(
                "This is a strong match - apply with confidence",
            );
            applicationStrategy.push(
                "Highlight your relevant experience and achievements",
            );
        } else {
            applicationStrategy.push("Consider this a growth opportunity");
            applicationStrategy.push(
                "Emphasize your learning ability and transferable skills",
            );
        }

        return {
            skillDevelopment,
            networking,
            applicationStrategy,
        };
    }
}
