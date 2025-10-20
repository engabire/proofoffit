import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { ProfileManager } from "@/lib/profile/profile-manager";
import { EnhancedUserProfile } from "@/lib/profile/profile-manager";

// Mock profile data - in production, this would come from your database
const mockProfile: EnhancedUserProfile = {
    id: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    experience: 5,
    skills: [],
    education: [],
    location: "San Francisco, CA",
    preferences: {
        salaryRange: [80000, 150000],
        jobTypes: ["Full-time"],
        industries: ["Technology"],
        remote: true,
    },
    // Enhanced fields
    firstName: "John",
    lastName: "Doe",
    phone: "+1-555-0123",
    website: "https://johndoe.dev",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    githubUrl: "https://github.com/johndoe",
    portfolioUrl: "https://johndoe.dev",
    headline: "Senior Full-Stack Developer",
    summary: "Experienced developer with 5+ years building scalable web applications using modern technologies.",
    currentRole: "Senior Developer",
    currentCompany: "TechCorp",
    yearsOfExperience: 5,
    topSkills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"],
    experience: [
        {
            id: "exp-1",
            title: "Senior Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            startDate: new Date("2022-01-01"),
            current: true,
            description: "Lead development of customer-facing web applications",
            skills: ["JavaScript", "React", "Node.js", "TypeScript"],
            achievements: ["Improved performance by 40%", "Led team of 3 developers"],
            type: "full-time",
        },
        {
            id: "exp-2",
            title: "Full-Stack Developer",
            company: "StartupXYZ",
            location: "Remote",
            startDate: new Date("2020-06-01"),
            endDate: new Date("2021-12-31"),
            current: false,
            description: "Built and maintained web applications from scratch",
            skills: ["JavaScript", "React", "Python", "PostgreSQL"],
            achievements: ["Built MVP in 3 months", "Scaled to 10k users"],
            type: "full-time",
        },
    ],
    education: [
        {
            id: "edu-1",
            institution: "University of California",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: new Date("2016-09-01"),
            endDate: new Date("2020-05-31"),
            gpa: 3.8,
            honors: ["Magna Cum Laude", "Dean's List"],
            description: "Focused on software engineering and algorithms",
        },
    ],
    certifications: [
        {
            id: "cert-1",
            name: "AWS Certified Developer",
            issuer: "Amazon Web Services",
            issueDate: new Date("2023-03-15"),
            credentialId: "AWS-DEV-123456",
            verificationUrl: "https://aws.amazon.com/verification",
            skills: ["AWS", "Cloud Computing", "DevOps"],
        },
    ],
    projects: [
        {
            id: "proj-1",
            name: "E-commerce Platform",
            description: "Full-stack e-commerce solution with React and Node.js",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-06-30"),
            url: "https://ecommerce-demo.com",
            githubUrl: "https://github.com/johndoe/ecommerce",
            achievements: ["Handles 1000+ concurrent users", "99.9% uptime"],
            role: "Lead Developer",
        },
    ],
    careerGoals: [
        "Become a technical lead",
        "Learn machine learning",
        "Contribute to open source",
    ],
    preferredWorkEnvironments: ["Remote", "Startup", "Collaborative"],
    salaryExpectations: {
        min: 120000,
        max: 180000,
        currency: "USD",
    },
    availability: "2weeks",
    profileCompleteness: 0, // Will be calculated
    sections: [], // Will be populated
    profileVisibility: "public",
    allowContact: true,
    allowJobRecommendations: true,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
};

export const GET = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const profileManager = new ProfileManager(mockProfile);
        
        // Calculate profile completeness and sections
        mockProfile.profileCompleteness = profileManager.calculateProfileCompleteness();
        mockProfile.sections = profileManager.getProfileSections();

        return NextResponse.json({
            success: true,
            data: {
                profile: mockProfile,
                insights: profileManager.generateCareerInsights(),
                skillRecommendations: profileManager.getSkillRecommendations(),
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});

export const PUT = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const body = await req.json();
        
        // Update profile with new data
        const updatedProfile = { ...mockProfile, ...body, updatedAt: new Date() };
        const profileManager = new ProfileManager(updatedProfile);
        
        // Validate profile
        const validation = profileManager.validateProfile();
        if (!validation.isValid) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.errors },
                { status: 400 }
            );
        }

        // Calculate updated completeness and sections
        updatedProfile.profileCompleteness = profileManager.calculateProfileCompleteness();
        updatedProfile.sections = profileManager.getProfileSections();

        return NextResponse.json({
            success: true,
            data: {
                profile: updatedProfile,
                insights: profileManager.generateCareerInsights(),
                validation,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});
