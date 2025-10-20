/**
 * FitScore Intelligence Engine
 *
 * Implements calibrated, explainable, bias-checked matching with reliability metrics.
 * Uses weighted breakdown with logistic calibration and provides detailed explanations.
 */

import type {
    BiasCheckResult,
    CandidateProfile,
    ExplainabilityReport,
    FitScore,
    JobRequirements,
    ReliabilityMetrics,
} from "../domain/jobs";

export interface FitScoreWeights {
    skills: number;
    experience: number;
    education: number;
    location: number;
    salary: number;
    culture?: number;
    reliability?: number;
}

export interface FitScoreConfig {
    weights: FitScoreWeights;
    calibration: {
        enabled: boolean;
        method: "logistic" | "sigmoid" | "linear";
        parameters: Record<string, number>;
    };
    biasChecking: {
        enabled: boolean;
        strictMode: boolean;
    };
    reliability: {
        enabled: boolean;
        minDataPoints: number;
    };
}

export class FitScoreEngine {
    private readonly config: FitScoreConfig;

    constructor(config?: Partial<FitScoreConfig>) {
        this.config = {
            weights: {
                skills: 0.3,
                experience: 0.25,
                reliability: 0.1,
                education: 0.15,
                location: 0.15,
                salary: 0.1,
                culture: 0.05,
            },
            calibration: {
                enabled: true,
                method: "logistic",
                parameters: {
                    slope: 1.0,
                    intercept: 0.0,
                    maxScore: 100,
                },
            },
            biasChecking: {
                enabled: true,
                strictMode: false,
            },
            reliability: {
                enabled: true,
                minDataPoints: 3,
            },
            ...config,
        };
    }

    /**
     * Calculate comprehensive FitScore with breakdown and explanations
     */
    async calculateFitScore(
        candidate: CandidateProfile,
        job: JobRequirements,
        reliabilityMetrics?: ReliabilityMetrics,
    ): Promise<FitScore> {
        // Calculate individual component scores
        const skillsScore = this.calculateSkillsScore(candidate, job);
        const experienceScore = this.calculateExperienceScore(candidate, job);
        const educationScore = this.calculateEducationScore(candidate, job);
        const locationScore = this.calculateLocationScore(candidate, job);
        const salaryScore = this.calculateSalaryScore(candidate, job);
        const cultureScore = this.calculateCultureScore(candidate, job);

        // Calculate weighted raw score
        const rawScore = skillsScore * this.config.weights.skills +
            experienceScore * this.config.weights.experience +
            educationScore * this.config.weights.education +
            locationScore * this.config.weights.location +
            salaryScore * this.config.weights.salary +
            (cultureScore * (this.config.weights.culture || 0));

        // Apply calibration
        const calibratedScore = this.calibrateScore(rawScore);

        // Perform bias checking
        const biasCheck = await this.performBiasCheck(candidate, job, {
            skills: skillsScore,
            experience: experienceScore,
            education: educationScore,
            location: locationScore,
            salary: salaryScore,
            culture: cultureScore,
        });

        // Calculate reliability score
        const reliability = this.calculateReliabilityScore(
            candidate,
            job,
            reliabilityMetrics,
        );

        // Generate explanation
        const explanation = this.generateExplanation(
            {
                skills: skillsScore,
                experience: experienceScore,
                education: educationScore,
                location: locationScore,
                salary: salaryScore,
                culture: cultureScore,
            },
            candidate,
            job,
        );

        // Calculate confidence based on data completeness
        const confidence = this.calculateConfidence(candidate, job);

        return {
            overall: Math.round(calibratedScore),
            breakdown: {
                skills: Math.round(skillsScore),
                experience: Math.round(experienceScore),
                education: Math.round(educationScore),
                location: Math.round(locationScore),
                salary: Math.round(salaryScore),
                culture: Math.round(cultureScore),
            },
            explanation,
            confidence,
            biasCheck,
            reliability,
        };
    }

    private calculateSkillsScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const candidateSkills = new Set(
            candidate.skills.map((s) => s.toLowerCase()),
        );
        const requiredSkills = new Set(
            job.requirements.mustHave.map((s) => s.toLowerCase()),
        );
        const niceToHaveSkills = new Set(
            job.requirements.niceToHave.map((s) => s.toLowerCase()),
        );

        // Calculate required skills match
        const requiredMatches =
            [...requiredSkills].filter((skill) => candidateSkills.has(skill))
                .length;
        const requiredScore = requiredMatches / requiredSkills.size;

        // Calculate nice-to-have skills match
        const niceToHaveMatches =
            [...niceToHaveSkills].filter((skill) => candidateSkills.has(skill))
                .length;
        const niceToHaveScore = niceToHaveMatches /
            Math.max(niceToHaveSkills.size, 1);

        // Weighted combination (required skills are more important)
        return (requiredScore * 0.8 + niceToHaveScore * 0.2) * 100;
    }

    private calculateExperienceScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const candidateYears = candidate.experience.years;
        const requiredYears = job.requirements.experience.years;
        const candidateLevel = candidate.experience.level;
        const requiredLevel = job.requirements.experience.level;

        // Level matching (with some flexibility)
        const levelScore = this.calculateLevelScore(
            candidateLevel,
            requiredLevel,
        );

        // Years of experience scoring
        let yearsScore: number;
        if (candidateYears >= requiredYears) {
            yearsScore = 100; // Perfect match or exceeds
        } else if (candidateYears >= requiredYears * 0.8) {
            yearsScore = 80; // Close match
        } else if (candidateYears >= requiredYears * 0.6) {
            yearsScore = 60; // Partial match
        } else {
            yearsScore = Math.max(20, (candidateYears / requiredYears) * 50);
        }

        // Industry relevance
        const industryScore = this.calculateIndustryScore(candidate, job);

        return (levelScore * 0.4 + yearsScore * 0.4 + industryScore * 0.2);
    }

    private calculateLevelScore(
        candidateLevel: string,
        requiredLevel: string,
    ): number {
        const levels = ["entry", "mid", "senior", "lead"];
        const candidateIndex = levels.indexOf(candidateLevel);
        const requiredIndex = levels.indexOf(requiredLevel);

        if (candidateIndex === requiredIndex) return 100;
        if (candidateIndex > requiredIndex) return 90; // Overqualified is still good
        if (candidateIndex === requiredIndex - 1) return 70; // One level below
        return 40; // More than one level below
    }

    private calculateIndustryScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const candidateIndustries = new Set(
            candidate.experience.industries.map((i) => i.toLowerCase()),
        );
        const jobIndustry = job.company.industry?.toLowerCase();

        if (!jobIndustry) return 50; // Neutral if no industry specified

        return candidateIndustries.has(jobIndustry) ? 100 : 30;
    }

    private calculateEducationScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        if (!job.requirements.education) return 50; // Neutral if no education requirement

        const candidateDegree = candidate.education.degree.toLowerCase();
        const requiredEducation = job.requirements.education.toLowerCase();

        // Simple keyword matching for education levels
        if (
            requiredEducation.includes("phd") && candidateDegree.includes("phd")
        ) return 100;
        if (
            requiredEducation.includes("master") &&
            candidateDegree.includes("master")
        ) return 100;
        if (
            requiredEducation.includes("bachelor") &&
            candidateDegree.includes("bachelor")
        ) return 100;
        if (
            requiredEducation.includes("associate") &&
            candidateDegree.includes("associate")
        ) return 100;

        // Partial matches
        if (
            requiredEducation.includes("degree") &&
            candidateDegree.includes("degree")
        ) return 80;
        if (
            requiredEducation.includes("certificate") &&
            candidateDegree.includes("certificate")
        ) return 70;

        return 30; // Low score for no match
    }

    private calculateLocationScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const candidateLocations = new Set(
            candidate.preferences.locations.map((l) => l.toLowerCase()),
        );
        const jobLocation = job.preferences.locations[0]?.toLowerCase();

        // Remote work preference
        if (job.preferences.remote && candidate.preferences.remote) return 100;
        if (job.preferences.remote && !candidate.preferences.remote) return 70;
        if (!job.preferences.remote && candidate.preferences.remote) return 40;

        // Location matching
        if (!jobLocation) return 50;

        // Exact match
        if (candidateLocations.has(jobLocation)) return 100;

        // City/state matching
        const jobCity = jobLocation.split(",")[0]?.trim();
        const jobState = jobLocation.split(",")[1]?.trim();

        for (const candidateLocation of candidateLocations) {
            if (
                candidateLocation.includes(jobCity) ||
                candidateLocation.includes(jobState)
            ) {
                return 80;
            }
        }

        return 20; // Low score for no location match
    }

    private calculateSalaryScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const candidateMin = candidate.preferences.salaryMin;
        const candidateMax = candidate.preferences.salaryMax;
        const jobMin = job.preferences.salaryMin;
        const jobMax = job.preferences.salaryMax;

        if (!candidateMin || !jobMin) return 50; // Neutral if no salary data

        // Perfect overlap
        if (candidateMin <= jobMax && candidateMax >= jobMin) return 100;

        // Candidate expects more than job offers
        if (candidateMin > jobMax) {
            const gap = candidateMin - jobMax;
            const percentage = gap / candidateMin;
            return Math.max(0, 100 - percentage * 200);
        }

        // Job offers more than candidate expects
        if (candidateMax < jobMin) {
            return 80; // Still good, candidate gets more than expected
        }

        return 50;
    }

    private calculateCultureScore(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        // This is a simplified culture matching - in reality, this would be more sophisticated
        const jobCulture = job.company.culture || [];

        if (jobCulture.length === 0) return 50; // Neutral if no culture data

        // For now, return a neutral score
        // In a real implementation, this would match candidate preferences with company culture
        return 60;
    }

    private calibrateScore(rawScore: number): number {
        if (!this.config.calibration.enabled) {
            return Math.min(100, Math.max(0, rawScore));
        }

        const { method, parameters } = this.config.calibration;

        switch (method) {
            case "logistic":
                return this.logisticCalibration(rawScore, parameters);
            case "sigmoid":
                return this.sigmoidCalibration(rawScore, parameters);
            case "linear":
                return this.linearCalibration(rawScore, parameters);
            default:
                return rawScore;
        }
    }

    private logisticCalibration(
        score: number,
        params: Record<string, number>,
    ): number {
        const { slope = 1.0, intercept = 0.0, maxScore = 100 } = params;
        const x = (score - 50) / 50; // Normalize to [-1, 1]
        const logistic = 1 / (1 + Math.exp(-slope * (x - intercept)));
        return logistic * maxScore;
    }

    private sigmoidCalibration(
        score: number,
        params: Record<string, number>,
    ): number {
        const { slope = 1.0, maxScore = 100 } = params;
        const x = (score - 50) / 50; // Normalize to [-1, 1]
        const sigmoid = Math.tanh(slope * x);
        return ((sigmoid + 1) / 2) * maxScore;
    }

    private linearCalibration(
        score: number,
        params: Record<string, number>,
    ): number {
        const { slope = 1.0, intercept = 0.0, maxScore = 100 } = params;
        return Math.min(maxScore, Math.max(0, slope * score + intercept));
    }

    private async performBiasCheck(
        candidate: CandidateProfile,
        job: JobRequirements,
        scores: Record<string, number>,
    ): Promise<BiasCheckResult> {
        if (!this.config.biasChecking.enabled) {
            return {
                passed: true,
                score: 100,
                warnings: [],
                recommendations: [],
                checkedAreas: {
                    gender: false,
                    age: false,
                    ethnicity: false,
                    disability: false,
                    location: false,
                    education: false,
                },
            };
        }

        const warnings: string[] = [];
        const recommendations: string[] = [];

        // Check for potential bias in scoring
        const checkedAreas = {
            gender: false,
            age: false,
            ethnicity: false,
            disability: false,
            location: true,
            education: true,
        };

        // Location bias check
        if (scores.location < 30) {
            warnings.push("Low location score may indicate geographic bias");
            recommendations.push(
                "Consider remote work options or location flexibility",
            );
        }

        // Education bias check
        if (scores.education < 30 && job.requirements.education) {
            warnings.push("Strict education requirements may create bias");
            recommendations.push(
                "Consider alternative qualifications or experience-based evaluation",
            );
        }

        // Skills bias check
        if (scores.skills < 40) {
            warnings.push("Skills matching may be too restrictive");
            recommendations.push(
                "Consider transferable skills and learning potential",
            );
        }

        const biasScore = warnings.length === 0
            ? 100
            : Math.max(0, 100 - warnings.length * 20);
        const passed = this.config.biasChecking.strictMode
            ? warnings.length === 0
            : biasScore >= 60;

        return {
            passed,
            score: biasScore,
            warnings,
            recommendations,
            checkedAreas,
        };
    }

    private calculateReliabilityScore(
        candidate: CandidateProfile,
        job: JobRequirements,
        reliabilityMetrics?: ReliabilityMetrics,
    ): { score: number; factors: string[] } {
        if (!this.config.reliability.enabled) {
            return { score: 100, factors: ["Reliability checking disabled"] };
        }

        const factors: string[] = [];
        let score = 100;

        // Data completeness check
        const dataPoints = this.countDataPoints(candidate, job);
        if (dataPoints < this.config.reliability.minDataPoints) {
            score -= 20;
            factors.push(
                `Insufficient data points (${dataPoints}/${this.config.reliability.minDataPoints})`,
            );
        }

        // Skills data quality
        if (candidate.skills.length < 3) {
            score -= 15;
            factors.push("Limited skills data");
        }

        // Experience data quality
        if (!candidate.experience.years || candidate.experience.years === 0) {
            score -= 10;
            factors.push("Missing experience data");
        }

        // Job requirements completeness
        if (!job.requirements.mustHave.length) {
            score -= 15;
            factors.push("Incomplete job requirements");
        }

        // External reliability metrics
        if (reliabilityMetrics) {
            if (reliabilityMetrics.metrics.dataQuality < 0.8) {
                score -= 10;
                factors.push("Low data quality from provider");
            }
            if (reliabilityMetrics.metrics.consistency < 0.7) {
                score -= 5;
                factors.push("Inconsistent provider data");
            }
        }

        if (factors.length === 0) {
            factors.push("All reliability checks passed");
        }

        return {
            score: Math.max(0, score),
            factors,
        };
    }

    private countDataPoints(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        let points = 0;

        if (candidate.skills.length > 0) points++;
        if (candidate.experience.years > 0) points++;
        if (candidate.education.degree) points++;
        if (candidate.preferences.locations.length > 0) points++;
        if (candidate.preferences.salaryMin) points++;
        if (job.requirements.mustHave.length > 0) points++;
        if (job.requirements.experience.years > 0) points++;
        if (job.preferences.locations.length > 0) points++;
        if (job.preferences.salaryMin) points++;

        return points;
    }

    private generateExplanation(
        scores: Record<string, number>,
        candidate: CandidateProfile,
        job: JobRequirements,
    ): string {
        const explanations: string[] = [];

        // Skills explanation
        if (scores.skills >= 80) {
            explanations.push("Strong skills match with required technologies");
        } else if (scores.skills >= 60) {
            explanations.push("Good skills alignment with some gaps");
        } else {
            explanations.push(
                "Skills gap identified - additional training may be needed",
            );
        }

        // Experience explanation
        if (scores.experience >= 80) {
            explanations.push("Experience level matches job requirements well");
        } else if (scores.experience >= 60) {
            explanations.push("Experience is close to requirements");
        } else {
            explanations.push("Experience level below job requirements");
        }

        // Location explanation
        if (scores.location >= 80) {
            explanations.push("Location preferences align well");
        } else if (scores.location >= 60) {
            explanations.push("Location match is acceptable");
        } else {
            explanations.push("Location mismatch - consider remote options");
        }

        // Salary explanation
        if (scores.salary >= 80) {
            explanations.push("Salary expectations are well-aligned");
        } else if (scores.salary >= 60) {
            explanations.push("Salary expectations are reasonable");
        } else {
            explanations.push("Salary expectations may need adjustment");
        }

        return explanations.join(". ") + ".";
    }

    private calculateConfidence(
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        const dataCompleteness = this.countDataPoints(candidate, job) / 9; // Max 9 data points
        const skillsCompleteness = Math.min(1, candidate.skills.length / 5); // Assume 5 skills is complete
        const jobCompleteness = Math.min(
            1,
            job.requirements.mustHave.length / 3,
        ); // Assume 3 requirements is complete

        return (dataCompleteness * 0.5 + skillsCompleteness * 0.3 +
            jobCompleteness * 0.2);
    }

    /**
     * Generate detailed explainability report
     */
    generateExplainabilityReport(
        fitScore: FitScore,
        candidate: CandidateProfile,
        job: JobRequirements,
    ): ExplainabilityReport {
        const breakdown: ExplainabilityReport["breakdown"] = {};

        Object.entries(fitScore.breakdown).forEach(([key, score]) => {
            breakdown[key] = {
                score,
                weight: this.config.weights[key as keyof FitScoreWeights] || 0,
                explanation: this.getComponentExplanation(
                    key,
                    score,
                    candidate,
                    job,
                ),
                confidence: this.calculateComponentConfidence(
                    key,
                    candidate,
                    job,
                ),
            };
        });

        return {
            overallScore: fitScore.overall,
            breakdown,
            factors: {
                positive: this.identifyPositiveFactors(fitScore.breakdown),
                negative: this.identifyNegativeFactors(fitScore.breakdown),
                neutral: this.identifyNeutralFactors(fitScore.breakdown),
            },
            recommendations: this.generateRecommendations(
                fitScore,
                candidate,
                job,
            ),
            transparency: {
                algorithm:
                    "ProofOfFit Weighted Scoring with Logistic Calibration",
                version: "1.0.0",
                lastUpdated: new Date(),
                dataSources: [
                    "candidate_profile",
                    "job_requirements",
                    "reliability_metrics",
                ],
            },
        };
    }

    private getComponentExplanation(
        component: string,
        score: number,
        candidate: CandidateProfile,
        job: JobRequirements,
    ): string {
        // This would contain detailed explanations for each component
        return `Component ${component} scored ${score} based on candidate and job data analysis`;
    }

    private calculateComponentConfidence(
        component: string,
        candidate: CandidateProfile,
        job: JobRequirements,
    ): number {
        // This would calculate confidence for each component based on data quality
        return 0.8; // Placeholder
    }

    private identifyPositiveFactors(
        breakdown: FitScore["breakdown"],
    ): string[] {
        return Object.entries(breakdown)
            .filter(([_, score]) => score >= 80)
            .map(([key, _]) => `Strong ${key} match`);
    }

    private identifyNegativeFactors(
        breakdown: FitScore["breakdown"],
    ): string[] {
        return Object.entries(breakdown)
            .filter(([_, score]) => score < 50)
            .map(([key, _]) => `Weak ${key} match`);
    }

    private identifyNeutralFactors(breakdown: FitScore["breakdown"]): string[] {
        return Object.entries(breakdown)
            .filter(([_, score]) => score >= 50 && score < 80)
            .map(([key, _]) => `Moderate ${key} match`);
    }

    private generateRecommendations(
        fitScore: FitScore,
        candidate: CandidateProfile,
        job: JobRequirements,
    ): string[] {
        const recommendations: string[] = [];

        if (fitScore.breakdown.skills < 60) {
            recommendations.push(
                "Consider additional training in required technologies",
            );
        }

        if (fitScore.breakdown.experience < 60) {
            recommendations.push(
                "Gain more experience in relevant areas or consider junior roles",
            );
        }

        if (fitScore.breakdown.location < 60) {
            recommendations.push(
                "Discuss remote work options or relocation possibilities",
            );
        }

        if (fitScore.breakdown.salary < 60) {
            recommendations.push("Review salary expectations and market rates");
        }

        if (fitScore.biasCheck.warnings.length > 0) {
            recommendations.push(...fitScore.biasCheck.recommendations);
        }

        return recommendations;
    }
}
