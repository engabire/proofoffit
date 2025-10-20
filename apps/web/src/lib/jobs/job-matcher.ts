import { FitScore, Job, UserProfile } from "@/types";

export interface JobMatch {
    job: Job;
    fitScore: number;
    confidence: number;
    reasons: string[];
    improvements: string[];
    salaryMatch: boolean;
    locationMatch: boolean;
    skillMatch: number;
    experienceMatch: number;
}

export interface MatchingCriteria {
    skills: string[];
    experience: number;
    education: string[];
    location: string;
    salaryRange: [number, number];
    jobTypes: string[];
    industries: string[];
    remote: boolean;
}

export class JobMatcher {
    private jobs: Job[] = [];
    private userProfile: UserProfile | null = null;

    constructor(jobs: Job[], userProfile: UserProfile) {
        this.jobs = jobs;
        this.userProfile = userProfile;
    }

    /**
     * Find the best job matches for a user
     */
    findMatches(criteria: MatchingCriteria, limit = 10): JobMatch[] {
        const matches = this.jobs.map((job) =>
            this.calculateMatch(job, criteria)
        );

        // Sort by fit score (descending) and confidence (descending)
        matches.sort((a, b) => {
            if (b.fitScore !== a.fitScore) {
                return b.fitScore - a.fitScore;
            }
            return b.confidence - a.confidence;
        });

        return matches.slice(0, limit);
    }

    /**
     * Calculate match score for a specific job
     */
    private calculateMatch(job: Job, criteria: MatchingCriteria): JobMatch {
        const skillMatch = this.calculateSkillMatch(job, criteria.skills);
        const experienceMatch = this.calculateExperienceMatch(
            job,
            criteria.experience,
        );
        const locationMatch = this.calculateLocationMatch(
            job,
            criteria.location,
            criteria.remote,
        );
        const salaryMatch = this.calculateSalaryMatch(
            job,
            criteria.salaryRange,
        );
        const educationMatch = this.calculateEducationMatch(
            job,
            criteria.education,
        );
        const industryMatch = this.calculateIndustryMatch(
            job,
            criteria.industries,
        );

        // Calculate overall fit score (weighted average)
        const fitScore = skillMatch * 0.3 +
            experienceMatch * 0.25 +
            locationMatch * 0.15 +
            salaryMatch * 0.15 +
            educationMatch * 0.1 +
            industryMatch * 0.05;

        // Calculate confidence based on data completeness
        const confidence = this.calculateConfidence(job, criteria);

        // Generate reasons and improvements
        const reasons = this.generateReasons(job, {
            skillMatch,
            experienceMatch,
            locationMatch,
            salaryMatch,
            educationMatch,
            industryMatch,
        });

        const improvements = this.generateImprovements(job, {
            skillMatch,
            experienceMatch,
            locationMatch,
            salaryMatch,
            educationMatch,
            industryMatch,
        });

        return {
            job,
            fitScore: Math.round(fitScore * 100) / 100,
            confidence: Math.round(confidence * 100) / 100,
            reasons,
            improvements,
            salaryMatch: salaryMatch > 0.7,
            locationMatch: locationMatch > 0.7,
            skillMatch: Math.round(skillMatch * 100) / 100,
            experienceMatch: Math.round(experienceMatch * 100) / 100,
        };
    }

    /**
     * Calculate skill match percentage
     */
    private calculateSkillMatch(job: Job, userSkills: string[]): number {
        if (!job.requiredSkills || job.requiredSkills.length === 0) {
            return 0.5; // Neutral score if no skills specified
        }

        const jobSkills = job.requiredSkills.map((skill) =>
            skill.toLowerCase()
        );
        const userSkillsLower = userSkills.map((skill) => skill.toLowerCase());

        // Calculate exact matches
        const exactMatches =
            jobSkills.filter((skill) => userSkillsLower.includes(skill)).length;

        // Calculate fuzzy matches (similar skills)
        const fuzzyMatches =
            jobSkills.filter((jobSkill) =>
                userSkillsLower.some((userSkill) =>
                    this.calculateStringSimilarity(jobSkill, userSkill) > 0.7
                )
            ).length;

        const totalMatches = exactMatches + (fuzzyMatches - exactMatches) * 0.7;
        return Math.min(totalMatches / jobSkills.length, 1);
    }

    /**
     * Calculate experience match
     */
    private calculateExperienceMatch(job: Job, userExperience: number): number {
        if (!job.experienceRequired) {
            return 0.8; // Good match if no experience specified
        }

        const requiredExp = job.experienceRequired;
        const diff = Math.abs(userExperience - requiredExp);

        if (diff === 0) return 1.0;
        if (diff <= 1) return 0.9;
        if (diff <= 2) return 0.7;
        if (diff <= 3) return 0.5;
        if (diff <= 5) return 0.3;
        return 0.1;
    }

    /**
     * Calculate location match
     */
    private calculateLocationMatch(
        job: Job,
        userLocation: string,
        remoteOk: boolean,
    ): number {
        if (job.remote) {
            return remoteOk ? 1.0 : 0.6;
        }

        if (!job.location || !userLocation) {
            return 0.5;
        }

        const jobLocation = job.location.toLowerCase();
        const userLocationLower = userLocation.toLowerCase();

        // Exact match
        if (jobLocation === userLocationLower) {
            return 1.0;
        }

        // City match
        if (
            jobLocation.includes(userLocationLower) ||
            userLocationLower.includes(jobLocation)
        ) {
            return 0.8;
        }

        // State/Country match
        const jobState = this.extractState(jobLocation);
        const userState = this.extractState(userLocationLower);

        if (jobState && userState && jobState === userState) {
            return 0.6;
        }

        return 0.2;
    }

    /**
     * Calculate salary match
     */
    private calculateSalaryMatch(
        job: Job,
        salaryRange: [number, number],
    ): number {
        if (!job.salaryMin || !job.salaryMax) {
            return 0.5; // Neutral if no salary info
        }

        const [userMin, userMax] = salaryRange;
        const jobMin = job.salaryMin;
        const jobMax = job.salaryMax;

        // Perfect overlap
        if (userMin <= jobMax && userMax >= jobMin) {
            return 1.0;
        }

        // Close match (within 20%)
        const userMid = (userMin + userMax) / 2;
        const jobMid = (jobMin + jobMax) / 2;
        const diff = Math.abs(userMid - jobMid) / userMid;

        if (diff <= 0.2) return 0.8;
        if (diff <= 0.4) return 0.6;
        if (diff <= 0.6) return 0.4;
        return 0.2;
    }

    /**
     * Calculate education match
     */
    private calculateEducationMatch(job: Job, userEducation: string[]): number {
        if (!job.educationRequired || job.educationRequired.length === 0) {
            return 0.8; // Good match if no education specified
        }

        const jobEducation = job.educationRequired.map((edu) =>
            edu.toLowerCase()
        );
        const userEducationLower = userEducation.map((edu) =>
            edu.toLowerCase()
        );

        const matches =
            jobEducation.filter((jobEdu) =>
                userEducationLower.some((userEdu) =>
                    userEdu.includes(jobEdu) || jobEdu.includes(userEdu)
                )
            ).length;

        return matches / jobEducation.length;
    }

    /**
     * Calculate industry match
     */
    private calculateIndustryMatch(job: Job, userIndustries: string[]): number {
        if (!job.industry || userIndustries.length === 0) {
            return 0.5; // Neutral if no industry info
        }

        const jobIndustry = job.industry.toLowerCase();
        const userIndustriesLower = userIndustries.map((ind) =>
            ind.toLowerCase()
        );

        const match = userIndustriesLower.some((userIndustry) =>
            userIndustry.includes(jobIndustry) ||
            jobIndustry.includes(userIndustry)
        );

        return match ? 1.0 : 0.3;
    }

    /**
     * Calculate confidence based on data completeness
     */
    private calculateConfidence(job: Job, criteria: MatchingCriteria): number {
        let confidence = 0.5; // Base confidence
        let factors = 0;

        // Job data completeness
        if (job.requiredSkills && job.requiredSkills.length > 0) {
            confidence += 0.1;
            factors++;
        }
        if (job.experienceRequired !== undefined) {
            confidence += 0.1;
            factors++;
        }
        if (job.salaryMin && job.salaryMax) {
            confidence += 0.1;
            factors++;
        }
        if (job.location) {
            confidence += 0.05;
            factors++;
        }
        if (job.educationRequired && job.educationRequired.length > 0) {
            confidence += 0.05;
            factors++;
        }

        // User data completeness
        if (criteria.skills.length > 0) {
            confidence += 0.1;
            factors++;
        }
        if (criteria.experience > 0) {
            confidence += 0.05;
            factors++;
        }
        if (criteria.salaryRange[0] > 0 && criteria.salaryRange[1] > 0) {
            confidence += 0.05;
            factors++;
        }

        // Ensure confidence is between 0.3 and 0.9
        return Math.min(Math.max(confidence, 0.3), 0.9);
    }

    /**
     * Generate reasons for the match
     */
    private generateReasons(job: Job, scores: any): string[] {
        const reasons: string[] = [];

        if (scores.skillMatch > 0.8) {
            reasons.push("Strong skill alignment with required qualifications");
        } else if (scores.skillMatch > 0.6) {
            reasons.push("Good skill match with some gaps");
        }

        if (scores.experienceMatch > 0.8) {
            reasons.push("Experience level matches requirements perfectly");
        } else if (scores.experienceMatch > 0.6) {
            reasons.push("Experience level is close to requirements");
        }

        if (scores.locationMatch > 0.8) {
            reasons.push("Location preferences align well");
        }

        if (scores.salaryMatch > 0.8) {
            reasons.push("Salary expectations are well-aligned");
        }

        if (scores.educationMatch > 0.8) {
            reasons.push("Educational background meets requirements");
        }

        if (reasons.length === 0) {
            reasons.push("Potential match based on available criteria");
        }

        return reasons;
    }

    /**
     * Generate improvement suggestions
     */
    private generateImprovements(job: Job, scores: any): string[] {
        const improvements: string[] = [];

        if (scores.skillMatch < 0.6) {
            improvements.push(
                "Consider developing skills in: " +
                        job.requiredSkills?.slice(0, 3).join(", ") ||
                    "required areas",
            );
        }

        if (scores.experienceMatch < 0.6) {
            const diff = (job.experienceRequired || 0) -
                (this.userProfile?.experience || 0);
            if (diff > 0) {
                improvements.push(
                    `Gain ${diff} more years of experience in this field`,
                );
            }
        }

        if (scores.salaryMatch < 0.6) {
            improvements.push(
                "Consider adjusting salary expectations or negotiating",
            );
        }

        if (scores.educationMatch < 0.6) {
            improvements.push(
                "Consider additional education or certifications",
            );
        }

        if (scores.locationMatch < 0.6 && !job.remote) {
            improvements.push(
                "Consider relocating or looking for remote opportunities",
            );
        }

        return improvements;
    }

    /**
     * Calculate string similarity using Levenshtein distance
     */
    private calculateStringSimilarity(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null)
        );

        for (let i = 0; i <= str1.length; i++) {
            matrix[0][i] = i;
        }

        for (let j = 0; j <= str2.length; j++) {
            matrix[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + cost,
                );
            }
        }

        const distance = matrix[str2.length][str1.length];
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLength);
    }

    /**
     * Extract state from location string
     */
    private extractState(location: string): string | null {
        const parts = location.split(",").map((part) => part.trim());
        if (parts.length > 1) {
            return parts[parts.length - 1].toLowerCase();
        }
        return null;
    }
}
