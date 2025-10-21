import { UserProfile } from "@/types";

export interface ProfileSection {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completionPercentage: number;
    lastUpdated?: Date;
}

export interface SkillAssessment {
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number; // 0-100
    evidence: string[];
    verified: boolean;
    lastAssessed: Date;
}

export interface ExperienceEntry {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    skills: string[];
    achievements: string[];
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
}

export interface EducationEntry {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    gpa?: number;
    honors?: string[];
    description?: string;
}

export interface CertificationEntry {
    id: string;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    verificationUrl?: string;
    skills: string[];
}

export interface ProjectEntry {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: Date;
    endDate?: Date;
    url?: string;
    githubUrl?: string;
    achievements: string[];
    role: string;
}

export interface EnhancedUserProfile {
    // Basic Information
    id: string;
    name: string;
    email: string;
    yearsOfExperience: number;
    skills: string[];
    location: string;
    preferences: {
        salaryRange: [number, number];
        jobTypes: string[];
        industries: string[];
        remote: boolean;
    };
    
    // Personal Information
    firstName: string;
    lastName: string;
    phone?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    
    // Professional Information
    headline: string;
    summary: string;
    currentRole?: string;
    currentCompany?: string;
    
    // Skills and Assessments
    skillAssessments: SkillAssessment[];
    topSkills: string[];
    
    // Experience and Education
    experience: ExperienceEntry[];
    education: EducationEntry[];
    certifications: CertificationEntry[];
    projects: ProjectEntry[];
    
    // Preferences and Goals
    careerGoals: string[];
    preferredWorkEnvironments: string[];
    salaryExpectations: {
        min: number;
        max: number;
        currency: string;
    };
    availability: 'immediately' | '2weeks' | '1month' | '3months' | 'negotiable';
    
    // Profile Completeness
    profileCompleteness: number;
    sections: ProfileSection[];
    
    // Privacy and Visibility
    profileVisibility: 'public' | 'private' | 'recruiters-only';
    allowContact: boolean;
    allowJobRecommendations: boolean;
    
    // Metadata
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt: Date;
}

export class ProfileManager {
    private profile: EnhancedUserProfile;

    constructor(profile: EnhancedUserProfile) {
        this.profile = profile;
    }

    /**
     * Calculate overall profile completeness
     */
    calculateProfileCompleteness(): number {
        const sections = [
            { weight: 0.2, completed: this.hasBasicInfo() },
            { weight: 0.25, completed: this.hasProfessionalInfo() },
            { weight: 0.2, completed: this.hasSkills() },
            { weight: 0.15, completed: this.hasExperience() },
            { weight: 0.1, completed: this.hasEducation() },
            { weight: 0.05, completed: this.hasProjects() },
            { weight: 0.05, completed: this.hasPreferences() },
        ];

        const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
        const completedWeight = sections.reduce((sum, section) => 
            sum + (section.completed ? section.weight : 0), 0
        );

        return Math.round((completedWeight / totalWeight) * 100);
    }

    /**
     * Get profile sections with completion status
     */
    getProfileSections(): ProfileSection[] {
        return [
            {
                id: 'basic-info',
                title: 'Basic Information',
                description: 'Personal details and contact information',
                completed: this.hasBasicInfo(),
                completionPercentage: this.getBasicInfoCompletion(),
            },
            {
                id: 'professional-info',
                title: 'Professional Summary',
                description: 'Headline, summary, and current role',
                completed: this.hasProfessionalInfo(),
                completionPercentage: this.getProfessionalInfoCompletion(),
            },
            {
                id: 'skills',
                title: 'Skills & Assessments',
                description: 'Technical and soft skills with proficiency levels',
                completed: this.hasSkills(),
                completionPercentage: this.getSkillsCompletion(),
            },
            {
                id: 'experience',
                title: 'Work Experience',
                description: 'Professional experience and achievements',
                completed: this.hasExperience(),
                completionPercentage: this.getExperienceCompletion(),
            },
            {
                id: 'education',
                title: 'Education',
                description: 'Academic background and qualifications',
                completed: this.hasEducation(),
                completionPercentage: this.getEducationCompletion(),
            },
            {
                id: 'projects',
                title: 'Projects & Portfolio',
                description: 'Personal and professional projects',
                completed: this.hasProjects(),
                completionPercentage: this.getProjectsCompletion(),
            },
            {
                id: 'preferences',
                title: 'Career Preferences',
                description: 'Job preferences and career goals',
                completed: this.hasPreferences(),
                completionPercentage: this.getPreferencesCompletion(),
            },
        ];
    }

    /**
     * Assess skill proficiency based on experience and evidence
     */
    assessSkillProficiency(skill: string): SkillAssessment {
        const experience = this.profile.experience;
        const projects = this.profile.projects;
        const certifications = this.profile.certifications;

        // Find evidence of this skill
        const evidence: string[] = [];
        let totalExperience = 0;
        let skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';

        // Check experience entries
        experience.forEach(exp => {
            if (exp.skills.includes(skill)) {
                const duration = this.calculateDuration(exp.startDate, exp.endDate || new Date());
                totalExperience += duration;
                evidence.push(`${exp.title} at ${exp.company} (${duration} years)`);
            }
        });

        // Check projects
        projects.forEach(project => {
            if (project.technologies.includes(skill)) {
                evidence.push(`Project: ${project.name}`);
            }
        });

        // Check certifications
        certifications.forEach(cert => {
            if (cert.skills.includes(skill)) {
                evidence.push(`Certification: ${cert.name} from ${cert.issuer}`);
            }
        });

        // Determine skill level based on experience
        if (totalExperience >= 5) {
            skillLevel = 'expert';
        } else if (totalExperience >= 3) {
            skillLevel = 'advanced';
        } else if (totalExperience >= 1) {
            skillLevel = 'intermediate';
        }

        // Calculate confidence based on evidence
        const confidence = Math.min(100, (evidence.length * 20) + (totalExperience * 10));

        return {
            skill,
            level: skillLevel,
            confidence,
            evidence,
            verified: evidence.length > 0,
            lastAssessed: new Date(),
        };
    }

    /**
     * Get skill recommendations based on job market trends
     */
    getSkillRecommendations(): string[] {
        const currentSkills = this.profile.skillAssessments.map(s => s.skill);
        const trendingSkills = [
            'TypeScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
            'Kubernetes', 'Machine Learning', 'Data Science', 'DevOps',
            'GraphQL', 'Next.js', 'Vue.js', 'Angular', 'MongoDB',
            'PostgreSQL', 'Redis', 'Elasticsearch', 'Terraform', 'Jenkins'
        ];

        return trendingSkills.filter(skill => !currentSkills.includes(skill));
    }

    /**
     * Generate career insights and recommendations
     */
    generateCareerInsights(): {
        strengths: string[];
        areasForImprovement: string[];
        careerPath: string[];
        marketPosition: string;
        salaryBenchmark: {
            current: number;
            market: number;
            percentile: number;
        };
    } {
        const strengths: string[] = [];
        const areasForImprovement: string[] = [];
        const careerPath: string[] = [];

        // Analyze strengths
        const topSkills = this.profile.skillAssessments
            .filter(s => s.level === 'advanced' || s.level === 'expert')
            .map(s => s.skill);
        
        if (topSkills.length > 0) {
            strengths.push(`Strong expertise in ${topSkills.slice(0, 3).join(', ')}`);
        }

        if (this.profile.experience.length > 0) {
            strengths.push(`${this.profile.yearsOfExperience} years of professional experience`);
        }

        // Analyze areas for improvement
        const beginnerSkills = this.profile.skillAssessments
            .filter(s => s.level === 'beginner')
            .map(s => s.skill);
        
        if (beginnerSkills.length > 0) {
            areasForImprovement.push(`Consider developing skills in ${beginnerSkills.slice(0, 3).join(', ')}`);
        }

        // Generate career path suggestions
        if (this.profile.yearsOfExperience < 2) {
            careerPath.push('Focus on building core technical skills');
            careerPath.push('Gain experience with different technologies');
            careerPath.push('Build a strong portfolio of projects');
        } else if (this.profile.yearsOfExperience < 5) {
            careerPath.push('Consider specializing in a specific domain');
            careerPath.push('Develop leadership and mentoring skills');
            careerPath.push('Build industry connections and network');
        } else {
            careerPath.push('Consider senior or lead positions');
            careerPath.push('Explore management or architecture roles');
            careerPath.push('Mentor junior developers');
        }

        // Market position analysis
        let marketPosition = 'Entry Level';
        if (this.profile.yearsOfExperience >= 5) {
            marketPosition = 'Senior Level';
        } else if (this.profile.yearsOfExperience >= 3) {
            marketPosition = 'Mid Level';
        } else if (this.profile.yearsOfExperience >= 1) {
            marketPosition = 'Junior Level';
        }

        return {
            strengths,
            areasForImprovement,
            careerPath,
            marketPosition,
            salaryBenchmark: {
                current: this.profile.salaryExpectations.min,
                market: this.estimateMarketSalary(),
                percentile: this.calculateSalaryPercentile(),
            },
        };
    }

    /**
     * Validate profile data
     */
    validateProfile(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Required fields
        if (!this.profile.firstName || !this.profile.lastName) {
            errors.push('First name and last name are required');
        }

        if (!this.profile.email) {
            errors.push('Email is required');
        }

        if (!this.profile.headline) {
            errors.push('Professional headline is required');
        }

        if (!this.profile.summary) {
            errors.push('Professional summary is required');
        }

        // Experience validation
        this.profile.experience.forEach((exp, index) => {
            if (!exp.title || !exp.company) {
                errors.push(`Experience entry ${index + 1} is missing title or company`);
            }
            if (exp.startDate > (exp.endDate || new Date())) {
                errors.push(`Experience entry ${index + 1} has invalid date range`);
            }
        });

        // Education validation
        this.profile.education.forEach((edu, index) => {
            if (!edu.institution || !edu.degree) {
                errors.push(`Education entry ${index + 1} is missing institution or degree`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    // Private helper methods
    private hasBasicInfo(): boolean {
        return !!(this.profile.firstName && this.profile.lastName && this.profile.email);
    }

    private hasProfessionalInfo(): boolean {
        return !!(this.profile.headline && this.profile.summary);
    }

    private hasSkills(): boolean {
        return this.profile.skillAssessments.length > 0;
    }

    private hasExperience(): boolean {
        return this.profile.experience.length > 0;
    }

    private hasEducation(): boolean {
        return this.profile.education.length > 0;
    }

    private hasProjects(): boolean {
        return this.profile.projects.length > 0;
    }

    private hasPreferences(): boolean {
        return this.profile.careerGoals.length > 0;
    }

    private getBasicInfoCompletion(): number {
        let completed = 0;
        if (this.profile.firstName) completed++;
        if (this.profile.lastName) completed++;
        if (this.profile.email) completed++;
        if (this.profile.phone) completed++;
        if (this.profile.linkedinUrl) completed++;
        return (completed / 5) * 100;
    }

    private getProfessionalInfoCompletion(): number {
        let completed = 0;
        if (this.profile.headline) completed++;
        if (this.profile.summary) completed++;
        if (this.profile.currentRole) completed++;
        if (this.profile.currentCompany) completed++;
        return (completed / 4) * 100;
    }

    private getSkillsCompletion(): number {
        return Math.min(100, this.profile.skillAssessments.length * 10);
    }

    private getExperienceCompletion(): number {
        return Math.min(100, this.profile.experience.length * 25);
    }

    private getEducationCompletion(): number {
        return Math.min(100, this.profile.education.length * 50);
    }

    private getProjectsCompletion(): number {
        return Math.min(100, this.profile.projects.length * 33);
    }

    private getPreferencesCompletion(): number {
        let completed = 0;
        if (this.profile.careerGoals.length > 0) completed++;
        if (this.profile.salaryExpectations.min > 0) completed++;
        if (this.profile.preferredWorkEnvironments.length > 0) completed++;
        return (completed / 3) * 100;
    }

    private calculateDuration(startDate: Date, endDate: Date): number {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    }

    private estimateMarketSalary(): number {
        // Simple estimation based on experience and skills
        const baseSalary = 60000;
        const experienceMultiplier = this.profile.yearsOfExperience * 8000;
        const skillMultiplier = this.profile.skillAssessments.length * 2000;
        return baseSalary + experienceMultiplier + skillMultiplier;
    }

    private calculateSalaryPercentile(): number {
        const marketSalary = this.estimateMarketSalary();
        const currentSalary = this.profile.salaryExpectations.min;
        return Math.min(100, Math.round((currentSalary / marketSalary) * 100));
    }
}
