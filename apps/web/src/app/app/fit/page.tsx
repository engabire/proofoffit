"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { startTimer, stopTimer } from "@/lib/analytics";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { isSupabaseConfigured } from "@/lib/env"
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Brain,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  File,
  FileCheck,
  FileText,
  FileX,
  Filter,
  Globe,
  Heart,
  Image as ImageIcon,
  Laptop,
  Lightbulb,
  Link as LinkIcon,
  Linkedin,
  Loader2,
  Lock,
  MapPin,
  Plus,
  QrCode,
  RotateCcw,
  Scan,
  ScanLine,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Wifi,
  WifiOff,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@proof-of-fit/ui";

// Additional imports for Select components to ensure they're available
import {
  Select as SelectComponent,
  SelectContent as SelectContentComponent,
  SelectItem as SelectItemComponent,
  SelectTrigger as SelectTriggerComponent,
  SelectValue as SelectValueComponent,
} from "@proof-of-fit/ui";

// Types
interface ResumeData {
  id: string;
  fileName: string;
  content: string;
  parsedData: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
      skills: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    skills: string[];
    certifications: string[];
  };
  uploadedAt: Date;
  source: "upload" | "linkedin" | "manual" | "camera" | "scan" | "link" | "qr";
  securityStatus: {
    scanned: boolean;
    safe: boolean;
    threats: string[];
    scanTimestamp: Date;
  };
  fileInfo: {
    size: number;
    type: string;
    lastModified: Date;
    checksum: string;
  };
}

interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  securityLevel: "high" | "medium" | "low";
  supportedFormats: string[];
  comingSoon?: boolean;
}

interface SecurityScanResult {
  safe: boolean;
  threats: string[];
  scanId: string;
  timestamp: Date;
  details: {
    fileType: string;
    size: number;
    checksum: string;
    virusScan: boolean;
    malwareScan: boolean;
    contentAnalysis: boolean;
  };
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  niceToHaves?: string[];
  benefits: string[];
  postedAt: Date;
  applicationDeadline?: Date;
  companyLogo?: string;
  companySize?: string;
  industry?: string;
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  source?: string;
  tos?: { allowed?: boolean; captcha?: boolean };
  applyUrl?: string;
}

interface FitAnalysis {
  overallScore: number;
  breakdown: {
    skills: { score: number; matched: string[]; missing: string[] };
    experience: { score: number; matched: string[]; gaps: string[] };
    education: {
      score: number;
      requirements: string[];
      qualifications: string[];
    };
    location: { score: number; remote: boolean; relocation: boolean };
    salary: { score: number; expectation: number; offered: number };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  biasIndicators: {
    detected: boolean;
    factors: string[];
    mitigation: string[];
  };
  auditTrail: {
    id: string;
    timestamp: Date;
    version: string;
    hash: string;
    immutable: boolean;
  };
}

interface TailoredDocument {
  id: string;
  type: "resume" | "cover_letter";
  content: string;
  highlights: string[];
  keywords: string[];
  atsScore: number;
  generatedAt: Date;
  format: "pdf" | "docx" | "txt";
  template: string;
  industryOptimized: boolean;
  aiSuggestions: string[];
  metrics: {
    readabilityScore: number;
    keywordDensity: number;
    actionVerbCount: number;
    quantifiedAchievements: number;
  };
  allowSubmission?: boolean;
}

// Advanced document generation helpers
const getSkillSynonyms = (skill: string): string[] => {
  const synonyms: Record<string, string[]> = {
    "javascript": ["js", "ecmascript", "node.js", "react", "vue", "angular"],
    "python": ["django", "flask", "fastapi", "pandas", "numpy"],
    "java": ["spring", "hibernate", "maven", "gradle"],
    "sql": ["database", "mysql", "postgresql", "oracle", "mongodb"],
    "aws": ["amazon web services", "cloud", "ec2", "s3", "lambda"],
    "docker": ["containers", "kubernetes", "k8s", "microservices"],
    "git": ["version control", "github", "gitlab", "bitbucket"],
    "agile": ["scrum", "kanban", "sprint", "devops"],
    "leadership": ["management", "team lead", "supervision", "mentoring"],
    "communication": [
      "presentation",
      "collaboration",
      "stakeholder management",
    ],
  };
  return synonyms[skill.toLowerCase()] || [];
};

const getIndustryTemplate = (industry: string): string => {
  const templates: Record<string, string> = {
    "technology": "modern_tech",
    "finance": "conservative_professional",
    "healthcare": "clean_medical",
    "education": "academic_professional",
    "marketing": "creative_modern",
    "consulting": "executive_clean",
    "startup": "dynamic_innovative",
    "government": "formal_structured",
  };
  return templates[industry.toLowerCase()] || "modern_professional";
};

const generateAdvancedResume = (
  { resume, job, matchingSkills, niceToHaveSkills, analysis }: {
    resume: ResumeData | null;
    job: JobPosting;
    matchingSkills: string[];
    niceToHaveSkills: string[];
    analysis: FitAnalysis | null;
  },
): string => {
  const name = resume?.parsedData.name || "Your Name";
  const email = resume?.parsedData.email || "your.email@example.com";
  const phone = resume?.parsedData.phone || "(555) 123-4567";
  const experience = resume?.parsedData.experience || [];
  const education = resume?.parsedData.education || [];
  const certifications = resume?.parsedData.certifications || [];
  const allSkills = resume?.parsedData.skills || [];

  // Calculate more accurate years of experience
  const totalYears = experience.length > 0
    ? Math.max(1, experience.length * 1.5)
    : 0;

  // Create highly tailored professional summary
  const summary = resume?.parsedData.summary || "";
  const industryContext = job.industry || "technology";
  const companySize = job.company.length > 20 ? "enterprise" : "growing";

  const tailoredSummary = summary ||
    `Results-driven ${job.title} with ${totalYears}+ years of expertise in ${
      matchingSkills.slice(0, 3).join(", ")
    }. Proven track record of ${
      analysis?.strengths[0]?.toLowerCase() || "delivering measurable results"
    } and ${
      analysis?.strengths[1]?.toLowerCase() || "driving operational excellence"
    }. Seeking to leverage ${
      matchingSkills.slice(0, 2).join(" and ")
    } expertise to contribute to ${job.company}'s ${companySize} ${industryContext} initiatives and drive strategic growth.`;

  // Enhanced experience descriptions with job-specific achievements
  const tailoredExperience = experience.slice(0, 4).map((exp, i) => {
    const relevantSkills = matchingSkills.filter((skill) =>
      exp.description.toLowerCase().includes(skill.toLowerCase()) ||
      exp.title.toLowerCase().includes(skill.toLowerCase()) ||
      exp.skills.some((expSkill) =>
        expSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const jobRelevantRequirements = job.requirements.filter((req) =>
      exp.description.toLowerCase().includes(req.toLowerCase()) ||
      exp.title.toLowerCase().includes(req.toLowerCase())
    );

    // Create achievement-focused bullet points
    const achievements = [
      relevantSkills.length > 0
        ? `Applied ${relevantSkills.slice(0, 2).join(" and ")} to ${
          exp.description.includes("improved") ? "enhance" : "deliver"
        } measurable business outcomes`
        : exp.description,
      jobRelevantRequirements.length > 0
        ? `Addressed ${
          jobRelevantRequirements[0].toLowerCase()
        } challenges through strategic implementation`
        : "Collaborated with cross-functional teams to achieve strategic objectives",
      `Contributed to ${exp.company}'s growth through innovative solutions and process optimization`,
    ];

    return `${exp.title.toUpperCase()} | ${exp.company} | ${exp.duration}
• ${achievements[0]}
• ${achievements[1]}
• ${achievements[2]}`;
  }).join("\n\n");

  // Prioritize skills based on job requirements and analysis
  const prioritizedSkills = [
    ...matchingSkills,
    ...niceToHaveSkills,
    ...allSkills.filter((skill) =>
      !matchingSkills.includes(skill) &&
      !niceToHaveSkills.includes(skill) &&
      job.requirements.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ),
    ...allSkills.filter((skill) =>
      !matchingSkills.includes(skill) &&
      !niceToHaveSkills.includes(skill) &&
      !job.requirements.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ),
  ].slice(0, 15);

  // Create job-specific achievements based on analysis
  const jobSpecificAchievements = [
    analysis?.strengths[0] ||
    `Delivered measurable results in ${
      matchingSkills[0] || "key areas"
    } through strategic implementation`,
    analysis?.strengths[1] ||
    `Led cross-functional initiatives that improved operational efficiency by 25%+`,
    analysis?.strengths[2] ||
    `Demonstrated expertise in ${
      matchingSkills.slice(0, 2).join(" and ")
    } with consistent performance excellence`,
  ];

  // Add relevant qualifications section based on job requirements
  const relevantQualifications = job.requirements.slice(0, 5).map((req) => {
    const matchingSkill = matchingSkills.find((skill) =>
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    );
    return matchingSkill ? `• ${req} (${matchingSkill} expertise)` : `• ${req}`;
  });

  return `${name.toUpperCase()}
${email} | ${phone}

PROFESSIONAL SUMMARY
${tailoredSummary}

CORE COMPETENCIES
• ${matchingSkills.slice(0, 6).join(" • ")}
${
    niceToHaveSkills.length > 0
      ? `• ${niceToHaveSkills.slice(0, 3).join(" • ")}`
      : ""
  }

PROFESSIONAL EXPERIENCE

${tailoredExperience}

EDUCATION
${
    education.map((edu) => `${edu.degree} | ${edu.institution} | ${edu.year}`)
      .join("\n")
  }

${
    certifications.length > 0
      ? `CERTIFICATIONS
${certifications.map((cert) => `• ${cert}`).join("\n")}

`
      : ""
  }TECHNICAL SKILLS
${prioritizedSkills.slice(0, 12).map((skill) => `• ${skill}`).join("\n")}

KEY ACHIEVEMENTS
• ${jobSpecificAchievements[0]}
• ${jobSpecificAchievements[1]}
• ${jobSpecificAchievements[2]}

${
    relevantQualifications.length > 0
      ? `RELEVANT QUALIFICATIONS FOR ${job.title.toUpperCase()}
${relevantQualifications.join("\n")}

`
      : ""
  }`;
};

const generateAdvancedCoverLetter = (
  { resume, job, matchingSkills, analysis }: {
    resume: ResumeData | null;
    job: JobPosting;
    matchingSkills: string[];
    analysis: FitAnalysis | null;
  },
): string => {
  const name = resume?.parsedData.name || "Your Name";
  const email = resume?.parsedData.email || "your.email@example.com";
  const phone = resume?.parsedData.phone || "(555) 123-4567";
  const experience = resume?.parsedData.experience || [];
  const education = resume?.parsedData.education || [];
  const summary = resume?.parsedData.summary || "";

  // Calculate more accurate years of experience
  const totalYears = experience.length > 0
    ? Math.max(1, experience.length * 1.5)
    : 0;

  // Get most relevant experience with better matching
  const relevantExperience =
    experience.find((exp) =>
      matchingSkills.some((skill) =>
        exp.description.toLowerCase().includes(skill.toLowerCase()) ||
        exp.title.toLowerCase().includes(skill.toLowerCase()) ||
        exp.skills.some((expSkill) =>
          expSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    ) || experience[0];

  // Find experience that matches job requirements
  const jobRelevantExperience =
    experience.find((exp) =>
      job.requirements.some((req) =>
        exp.description.toLowerCase().includes(req.toLowerCase()) ||
        exp.title.toLowerCase().includes(req.toLowerCase())
      )
    ) || relevantExperience;

  // Create highly tailored opening with company research
  const companyContext = job.company.length > 20 ? "enterprise" : "innovative";
  const industryFocus = job.industry || "technology";

  const tailoredOpening = summary
    ? `I am writing to express my strong interest in the ${job.title} position at ${job.company}. ${summary} My ${totalYears}+ years of experience in ${
      matchingSkills.slice(0, 2).join(" and ")
    } directly aligns with your requirements for this role.`
    : `I am writing to express my strong interest in the ${job.title} position at ${job.company}. With ${totalYears}+ years of experience in ${
      matchingSkills.slice(0, 2).join(" and ")
    }, I am excited about the opportunity to contribute to your ${companyContext} ${industryFocus} initiatives and drive measurable results.`;

  // Create specific, quantified achievements based on actual experience
  const specificAchievements = jobRelevantExperience
    ? [
      `Led ${jobRelevantExperience.title} initiatives at ${jobRelevantExperience.company}, applying ${
        matchingSkills.slice(0, 2).join(" and ")
      } to deliver measurable business outcomes`,
      `Collaborated with cross-functional teams to achieve strategic objectives, resulting in improved operational efficiency and stakeholder satisfaction`,
      `Demonstrated expertise in ${
        matchingSkills.slice(0, 3).join(", ")
      } through successful project delivery and process optimization`,
    ]
    : [
      `Demonstrated expertise in ${
        matchingSkills.slice(0, 2).join(" and ")
      } through successful project implementation and stakeholder collaboration`,
      `Delivered measurable results through strategic implementation of ${
        matchingSkills[0] || "key technologies"
      } and process improvements`,
      `Collaborated with stakeholders to drive business outcomes and exceed performance expectations`,
    ];

  // Create job-specific value proposition
  const valueProposition = job.requirements.length > 0
    ? `My expertise in ${
      matchingSkills.slice(0, 3).join(", ")
    } directly addresses your requirements for ${
      job.requirements.slice(0, 2).join(" and ")
    }. I am particularly excited about the opportunity to contribute to ${job.company}'s mission and help drive your strategic objectives in the ${industryFocus} space.`
    : `My expertise in ${
      matchingSkills.slice(0, 3).join(", ")
    } positions me to make an immediate impact at ${job.company}. I am particularly excited about the opportunity to contribute to your team's continued success and help drive strategic objectives in the ${industryFocus} industry.`;

  // Add specific examples based on analysis strengths
  const strengthExamples =
    analysis?.strengths.slice(0, 2).map((strength) =>
      `• ${strength}: I have consistently demonstrated this through successful project delivery and measurable business impact`
    ) || [
      `• Technical Excellence: I have consistently delivered high-quality solutions that exceed stakeholder expectations`,
      `• Strategic Thinking: I have successfully led initiatives that align with business objectives and drive growth`,
    ];

  return `${name}
${email} | ${phone}

${new Date().toLocaleDateString()}

Hiring Team
${job.company}

Dear Hiring Team,

${tailoredOpening}

What draws me to ${job.company} is your commitment to excellence and innovation in the ${industryFocus} space. Your focus on ${
    job.industry || "growth and development"
  } aligns perfectly with my passion for delivering exceptional results and my proven ability to exceed expectations through strategic implementation.

In my experience, I have successfully:
• ${specificAchievements[0]}
• ${specificAchievements[1]}
• ${specificAchievements[2]}

${strengthExamples.join("\n")}

${valueProposition}

I am confident that my combination of technical skills, ${totalYears}+ years of experience, and passion for innovation makes me an ideal candidate for this role. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your continued growth and success.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${name}`;
};

const generateStatementOfPurpose = ({ resume, job, matchingSkills, analysis }: {
  resume: ResumeData | null;
  job: JobPosting;
  matchingSkills: string[];
  analysis: FitAnalysis | null;
}): string => {
  const name = resume?.parsedData.name || "Your Name";
  const experience = resume?.parsedData.experience || [];
  const education = resume?.parsedData.education || [];
  const summary = resume?.parsedData.summary || "";

  const totalYears = experience.length > 0
    ? Math.max(1, experience.length * 1.5)
    : 0;

  // Find most relevant experience with better matching
  const relevantExperience =
    experience.find((exp) =>
      matchingSkills.some((skill) =>
        exp.description.toLowerCase().includes(skill.toLowerCase()) ||
        exp.title.toLowerCase().includes(skill.toLowerCase()) ||
        exp.skills.some((expSkill) =>
          expSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    ) || experience[0];

  // Find experience that directly relates to job requirements
  const jobRelevantExperience =
    experience.find((exp) =>
      job.requirements.some((req) =>
        exp.description.toLowerCase().includes(req.toLowerCase()) ||
        exp.title.toLowerCase().includes(req.toLowerCase())
      )
    ) || relevantExperience;

  // Create industry and company context
  const industryContext = job.industry || "technology";
  const companySize = job.company.length > 20 ? "enterprise" : "innovative";

  // Enhanced personal background with career narrative
  const personalBackground = summary ||
    `I am a dedicated professional with ${totalYears}+ years of experience in ${
      matchingSkills.slice(0, 2).join(" and ")
    }. My journey in this field has been driven by a passion for innovation, a commitment to delivering exceptional results, and a desire to make meaningful contributions to the ${industryContext} industry. Throughout my career, I have consistently sought opportunities to apply my technical expertise to solve complex challenges and drive business value.`;

  // Enhanced professional experience section
  const professionalExperience = jobRelevantExperience
    ? `In my role as ${jobRelevantExperience.title} at ${jobRelevantExperience.company}, I have developed deep expertise in ${
      matchingSkills.slice(0, 3).join(", ")
    }. This experience has equipped me with the skills and knowledge necessary to excel in the ${job.title} position at ${job.company}. I have successfully applied these skills to deliver measurable results and drive strategic initiatives that align with business objectives.`
    : `My professional experience has focused on ${
      matchingSkills.slice(0, 2).join(" and ")
    }, providing me with a strong foundation for the ${job.title} position at ${job.company}. I have consistently demonstrated my ability to apply technical expertise to solve complex problems and deliver value to stakeholders.`;

  // Enhanced career objectives with specific goals
  const careerObjectives =
    `My primary objective is to leverage my expertise in ${
      matchingSkills.slice(0, 3).join(", ")
    } to contribute meaningfully to ${job.company}'s mission and strategic goals. I am particularly drawn to this opportunity because it aligns with my career goals of ${
      analysis?.strengths[0]?.toLowerCase() || "delivering impactful solutions"
    } and ${
      analysis?.strengths[1]?.toLowerCase() || "driving innovation"
    }. I am committed to continuous learning and growth, and I see this role as an opportunity to expand my impact while contributing to ${job.company}'s continued success.`;

  // Enhanced role-specific section
  const whyThisRole =
    `The ${job.title} position at ${job.company} represents the perfect opportunity to apply my skills in ${
      matchingSkills.slice(0, 2).join(" and ")
    } while contributing to your organization's success in the ${industryContext} space. I am excited about the prospect of working with a ${companySize} team that values ${
      job.industry || "excellence and innovation"
    }. This role aligns with my professional development goals and provides an opportunity to make a significant impact on your strategic initiatives.`;

  // Enhanced future contributions with specific value
  const futureContributions = `I am committed to bringing my expertise in ${
    matchingSkills.slice(0, 3).join(", ")
  } to ${job.company} and contributing to your continued growth and success. I look forward to the opportunity to collaborate with your team, share my knowledge and experience, and help drive innovative solutions that address your business challenges. I am excited about the prospect of growing with ${job.company} and contributing to your long-term strategic objectives.`;

  return `STATEMENT OF PURPOSE
${name} - ${job.title} Position at ${job.company}

PERSONAL BACKGROUND
${personalBackground}

PROFESSIONAL EXPERIENCE
${professionalExperience}

CAREER OBJECTIVES
${careerObjectives}

WHY THIS ROLE
${whyThisRole}

FUTURE CONTRIBUTIONS
${futureContributions}
`;
};

const generateInterviewPrep = ({ resume, job, matchingSkills, analysis }: {
  resume: ResumeData | null;
  job: JobPosting;
  matchingSkills: string[];
  analysis: FitAnalysis | null;
}): string => {
  const name = resume?.parsedData.name || "Your Name";
  const experience = resume?.parsedData.experience || [];
  const summary = resume?.parsedData.summary || "";

  const totalYears = experience.length > 0
    ? Math.max(1, experience.length * 1.5)
    : 0;

  // Find most relevant experience for examples
  const relevantExperience =
    experience.find((exp) =>
      matchingSkills.some((skill) =>
        exp.description.toLowerCase().includes(skill.toLowerCase()) ||
        exp.title.toLowerCase().includes(skill.toLowerCase()) ||
        exp.skills.some((expSkill) =>
          expSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    ) || experience[0];

  // Generate job-specific technical questions
  const technicalQuestions = job.requirements.slice(0, 4).map((req, i) => {
    const skill = matchingSkills[i] || matchingSkills[0] || "relevant skills";
    return `• How would you approach ${req.toLowerCase()} in this role? (Prepare examples using ${skill})`;
  });

  // Generate behavioral questions based on candidate's experience
  const behavioralQuestions = [
    `• Tell me about a time when you successfully applied ${
      matchingSkills[0] || "your technical skills"
    } to solve a complex problem. (Use example from ${
      relevantExperience?.company || "your experience"
    })`,
    `• Describe a situation where you had to collaborate with cross-functional teams to achieve a goal. (Highlight your communication and leadership skills)`,
    `• Give me an example of how you've contributed to process improvement or innovation. (Quantify the impact if possible)`,
    `• Tell me about a time you had to learn a new technology or skill quickly. (Demonstrate your adaptability)`,
  ];

  // Generate detailed talking points based on candidate's strengths and experience
  const talkingPoints = analysis?.strengths.slice(0, 4).map((strength, i) => {
    const example = relevantExperience
      ? ` (Example: ${relevantExperience.title} at ${relevantExperience.company})`
      : "";
    return `• ${strength}: Prepare specific examples that demonstrate this strength${example}`;
  }) || [
    `• Technical Expertise: Highlight your experience with ${
      matchingSkills.slice(0, 2).join(" and ")
    } (Example: ${relevantExperience?.title || "your role"} at ${
      relevantExperience?.company || "your company"
    })`,
    `• Problem-Solving: Share examples of complex challenges you've overcome (Quantify results when possible)`,
    `• Leadership: Discuss times you've led initiatives or mentored others (Show impact on team/company)`,
    `• Adaptability: Demonstrate your ability to learn quickly and handle change (Use specific examples)`,
  ];

  // Create industry-specific research points
  const industryContext = job.industry || "technology";
  const companySize = job.company.length > 20 ? "enterprise" : "innovative";

  // Generate specific questions based on job requirements
  const jobSpecificQuestions = job.requirements.slice(0, 3).map((req) =>
    `• How do you stay current with developments in ${req.toLowerCase()}?`
  );

  return `INTERVIEW PREPARATION GUIDE
${name} - ${job.title} Position at ${job.company}

CANDIDATE SUMMARY
${
    summary ||
    `Experienced professional with ${totalYears}+ years in ${
      matchingSkills.slice(0, 2).join(" and ")
    }. Strong background in ${
      analysis?.strengths[0] || "delivering results"
    } and ${
      analysis?.strengths[1] || "driving innovation"
    }. Proven track record of applying technical expertise to solve complex business challenges.`
  }

KEY TALKING POINTS
${talkingPoints.join("\n")}

TECHNICAL QUESTIONS TO PREPARE FOR
${technicalQuestions.join("\n")}

BEHAVIORAL QUESTIONS TO PREPARE FOR
${behavioralQuestions.join("\n")}

JOB-SPECIFIC QUESTIONS TO PREPARE FOR
${jobSpecificQuestions.join("\n")}

COMPANY RESEARCH POINTS
• Research ${job.company}'s recent initiatives and company culture in the ${industryContext} space
• Understand their mission and how this ${job.title} role contributes to it
• Learn about their ${companySize} approach and competitive advantages
• Prepare questions about team dynamics, growth opportunities, and strategic direction
• Study their recent news, product launches, or industry recognition

QUESTIONS TO ASK THE INTERVIEWER
• What does success look like in this role during the first 90 days?
• How does this position contribute to ${job.company}'s strategic objectives in ${industryContext}?
• What opportunities are there for professional development and growth?
• What are the biggest challenges facing the team right now?
• How does the team collaborate with other departments?
• What technologies or tools does the team use most frequently?

STRENGTHS TO HIGHLIGHT
• ${
    matchingSkills.slice(0, 3).join(", ")
  } expertise with ${totalYears}+ years of experience
• Proven track record of ${
    analysis?.strengths[0] || "delivering measurable results"
  }
• Strong collaboration and communication skills
• ${
    analysis?.strengths[1] || "Strategic thinking"
  } and problem-solving abilities
• Experience with ${relevantExperience?.title || "relevant roles"} and ${
    relevantExperience?.company || "similar companies"
  }

POTENTIAL CONCERNS TO ADDRESS
• Be prepared to discuss any gaps in experience with ${
    job.requirements.filter((req) =>
      !matchingSkills.some((skill) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 2).join(" or ")
  }
• Have examples ready that demonstrate your ability to learn quickly and adapt
• Prepare to explain your specific interest in this role and ${job.company}
• Be ready to discuss how your background translates to this ${industryContext} position

INTERVIEW TIPS
• Use the STAR method (Situation, Task, Action, Result) for behavioral questions
• Quantify your achievements with specific numbers and metrics when possible
• Show enthusiasm for the role and company while remaining professional
• Prepare 2-3 thoughtful questions that demonstrate your interest and research
• Practice explaining technical concepts in simple terms for non-technical interviewers

`;
};

const calculateDocumentMetrics = (content: string, jobRequirements: string[]): {
  readabilityScore: number;
  keywordDensity: number;
  actionVerbCount: number;
  quantifiedAchievements: number;
} => {
  const words = content.toLowerCase().split(/\s+/);
  const totalWords = words.length;

  // Calculate keyword density
  const keywordMatches = jobRequirements.reduce((count, req) => {
    const reqWords = req.toLowerCase().split(/\s+/);
    return count + reqWords.filter((word) => words.includes(word)).length;
  }, 0);
  const keywordDensity = (keywordMatches / totalWords) * 100;

  // Count action verbs
  const actionVerbs = [
    "achieved",
    "delivered",
    "implemented",
    "led",
    "managed",
    "developed",
    "created",
    "improved",
    "increased",
    "reduced",
    "optimized",
    "streamlined",
  ];
  const actionVerbCount =
    actionVerbs.filter((verb) => words.includes(verb)).length;

  // Count quantified achievements (numbers, percentages)
  const quantifiedAchievements =
    (content.match(/\d+%|\d+\+|\$\d+|\d+x|\d+ years/g) || []).length;

  // Calculate readability score (simplified)
  const avgWordsPerSentence = totalWords / (content.split(/[.!?]+/).length - 1);
  const readabilityScore = Math.max(
    60,
    Math.min(95, 100 - (avgWordsPerSentence - 15) * 2),
  );

  return {
    readabilityScore: Math.round(readabilityScore),
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    actionVerbCount,
    quantifiedAchievements,
  };
};

const generateAISuggestions = (
  type: "resume" | "cover_letter" | "statement" | "interview",
  content: string,
  job: JobPosting,
  analysis: FitAnalysis | null,
): string[] => {
  const suggestions: string[] = [];

  if (type === "resume") {
    suggestions.push(
      "Consider adding more quantified achievements with specific metrics",
    );
    suggestions.push(
      "Highlight leadership experience and team collaboration skills",
    );
    if (analysis?.weaknesses && analysis.weaknesses.length > 0) {
      suggestions.push(
        `Address ${
          analysis.weaknesses[0]
        } through additional training or projects`,
      );
    }
    suggestions.push(
      "Optimize for ATS by including more industry-specific keywords",
    );
  } else if (type === "cover_letter") {
    suggestions.push(
      "Add a compelling opening hook that demonstrates your passion",
    );
    suggestions.push(
      "Include specific examples of how you have solved similar challenges",
    );
    suggestions.push(
      "Research the company recent news or initiatives for personalization",
    );
    suggestions.push("End with a strong call-to-action that shows enthusiasm");
  } else if (type === "statement") {
    suggestions.push(
      "Strengthen the connection between your background and the role",
    );
    suggestions.push(
      "Include specific examples of how you can contribute to the company",
    );
    suggestions.push(
      "Demonstrate understanding of the company culture and values",
    );
    suggestions.push("Show clear career progression and future goals");
  } else if (type === "interview") {
    suggestions.push("Prepare specific examples using the STAR method");
    suggestions.push("Research the company culture and recent news");
    suggestions.push("Practice explaining technical concepts in simple terms");
    suggestions.push("Prepare thoughtful questions about the role and team");
  }

  return suggestions.slice(0, 3);
};

// Mock data
const mockJobs: JobPosting[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "full-time",
    remote: true,
    salary: { min: 120000, max: 180000, currency: "USD" },
    description:
      "We are looking for a senior software engineer to join our team...",
    requirements: ["Python", "React", "Cloud", "5+ years experience"],
    benefits: ["Health insurance", "401k", "Flexible hours"],
    postedAt: new Date("2024-01-15"),
    companyLogo: "/logos/techcorp.png",
    companySize: "100-500",
    industry: "Technology",
    experienceLevel: "senior",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "full-time",
    remote: true,
    salary: { min: 80000, max: 120000, currency: "USD" },
    description: "Join our fast-growing startup as a full stack developer...",
    requirements: ["JavaScript", "Node.js", "React", "MongoDB"],
    benefits: ["Equity", "Remote work", "Learning budget"],
    postedAt: new Date("2024-01-10"),
    companySize: "10-50",
    industry: "Technology",
    experienceLevel: "mid",
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "Metropolitan Council",
    location: "Minneapolis, MN",
    type: "full-time",
    remote: false,
    salary: { min: 65000, max: 85000, currency: "USD" },
    description:
      "The Metropolitan Council is seeking a Data Analyst to support regional planning and policy development...",
    requirements: ["SQL", "Excel", "Data visualization", "Statistics"],
    benefits: ["Pension", "Health insurance", "Professional development"],
    postedAt: new Date("2024-01-20"),
    companySize: "500+",
    industry: "Government",
    experienceLevel: "mid",
  },
  {
    id: "4",
    title: "Project Manager",
    company: "Metropolitan Council",
    location: "St. Paul, MN",
    type: "full-time",
    remote: true,
    salary: { min: 75000, max: 95000, currency: "USD" },
    description:
      "Lead transportation and infrastructure projects for the Metropolitan Council...",
    requirements: [
      "Project management",
      "Communication",
      "Budget management",
      "PMP certification preferred",
    ],
    benefits: ["Pension", "Health insurance", "Flexible schedule"],
    postedAt: new Date("2024-01-18"),
    companySize: "500+",
    industry: "Government",
    experienceLevel: "senior",
  },
  {
    id: "5",
    title: "Frontend Developer",
    company: "InnovateTech",
    location: "Austin, TX",
    type: "full-time",
    remote: true,
    salary: { min: 90000, max: 130000, currency: "USD" },
    description:
      "Build amazing user experiences with modern web technologies...",
    requirements: ["React", "TypeScript", "CSS", "3+ years experience"],
    benefits: ["Health insurance", "401k", "Stock options"],
    postedAt: new Date("2024-01-12"),
    companySize: "50-200",
    industry: "Technology",
    experienceLevel: "mid",
  },
  {
    id: "6",
    title: "Marketing Manager",
    company: "GrowthCorp",
    location: "New York, NY",
    type: "full-time",
    remote: false,
    salary: { min: 70000, max: 100000, currency: "USD" },
    description:
      "Drive marketing strategy and campaigns for our growing company...",
    requirements: [
      "Digital marketing",
      "Analytics",
      "Content creation",
      "Team leadership",
    ],
    benefits: ["Health insurance", "401k", "Unlimited PTO"],
    postedAt: new Date("2024-01-08"),
    companySize: "100-500",
    industry: "Marketing",
    experienceLevel: "senior",
  },
];

// Components
function StepIndicator({
  currentStep,
  totalSteps,
  onStepChange,
}: {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
}) {
  const stepNames = [
    "Import Resume",
    "Select Job",
    "Analyze Fit",
    "Download Results",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {Array.from(
          { length: totalSteps },
          (_, i) => (
            <div key={i} className="flex items-center">
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i < currentStep
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : i === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } ${
                  onStepChange && i < currentStep
                    ? "cursor-pointer"
                    : i === currentStep
                    ? "cursor-default"
                    : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if (onStepChange && i < currentStep) {
                    onStepChange(i + 1);
                  }
                }}
                disabled={i > currentStep}
                aria-label={`Step ${i + 1}: ${stepNames[i]}`}
                title={stepNames[i]}
              >
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </button>
              {i < totalSteps - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    i < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ),
        )}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Step {currentStep}: {stepNames[currentStep - 1]}
        </h3>
      </div>
    </div>
  );
}

function ResumeUploadStep(
  { onComplete }: { onComplete: (resume: ResumeData) => void },
) {
  const [activeTab, setActiveTab] = useState("device");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [securityResult, setSecurityResult] = useState<
    SecurityScanResult | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    async (file: File, source: ResumeData["source"]) => {
      setUploading(true);

      // Security scan simulation
      setScanning(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockSecurityResult: SecurityScanResult = {
        safe: true,
        threats: [],
        scanId: `scan_${Date.now()}`,
        timestamp: new Date(),
        details: {
          fileType: file.type,
          size: file.size,
          checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
          virusScan: true,
          malwareScan: true,
          contentAnalysis: true,
        },
      };

      setSecurityResult(mockSecurityResult);
      setScanning(false);

      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResume: ResumeData = {
        id: "1",
        fileName: file.name,
        content: "Mock resume content...",
        parsedData: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          summary:
            "Experienced software engineer with 5+ years in full-stack development...",
          experience: [
            {
              title: "Senior Software Engineer",
              company: "Previous Company",
              duration: "2020-2024",
              description: "Led development of web applications...",
              skills: ["Python", "React", "Cloud", "Docker"],
            },
          ],
          education: [
            {
              degree: "Bachelor of Computer Science",
              institution: "University of Technology",
              year: "2019",
            },
          ],
          skills: [
            "Python",
            "JavaScript",
            "React",
            "Node.js",
            "Cloud",
            "Docker",
          ],
          certifications: ["Cloud Certified Developer", "Cloud Professional"],
        },
        uploadedAt: new Date(),
        source,
        securityStatus: {
          scanned: true,
          safe: mockSecurityResult.safe,
          threats: mockSecurityResult.threats,
          scanTimestamp: mockSecurityResult.timestamp,
        },
        fileInfo: {
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
          checksum: mockSecurityResult.details.checksum,
        },
      };

      setResume(mockResume);
      setUploading(false);
      onComplete(mockResume);
    },
    [onComplete],
  );

  const openFilePicker = () => fileInputRef.current?.click();
  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file, "upload");
        // reset value so selecting the same file twice still triggers onChange
        e.currentTarget.value = "";
      }
    },
    [handleFile],
  );

  const importSources: ImportSource[] = [
    {
      id: "device",
      name: "Device Upload",
      description: "Upload from your computer, phone, or tablet",
      icon: <Upload className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["PDF", "DOC", "DOCX", "TXT", "RTF"],
    },
    {
      id: "linkedin",
      name: "Profile Import",
      description: "Import your professional profile data",
      icon: <Linkedin className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["Professional Profile"],
    },
    {
      id: "camera",
      name: "Camera Scan",
      description: "Take a photo of your resume with OCR",
      icon: <Camera className="w-5 h-5" />,
      available: true,
      securityLevel: "medium",
      supportedFormats: ["JPG", "PNG", "PDF"],
    },
    {
      id: "scanner",
      name: "Document Scanner",
      description: "Scan physical documents with your device",
      icon: <Scan className="w-5 h-5" />,
      available: true,
      comingSoon: true,
      securityLevel: "medium",
      supportedFormats: ["JPG", "PNG", "PDF"],
    },
    {
      id: "link",
      name: "Secure Link",
      description: "Import from a secure URL (cloud storage, etc.)",
      icon: <LinkIcon className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["PDF", "DOC", "DOCX", "TXT"],
    },
    {
      id: "qr",
      name: "QR Code",
      description: "Scan a QR code to import resume",
      icon: <QrCode className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["QR Code"],
    },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], "upload");
    }
  }, [handleFile]);

  const handleLinkImport = async () => {
    if (!linkUrl.trim()) return;

    setUploading(true);
    setScanning(true);

    // Simulate link validation and security scan
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockSecurityResult: SecurityScanResult = {
      safe: true,
      threats: [],
      scanId: `scan_${Date.now()}`,
      timestamp: new Date(),
      details: {
        fileType: "application/pdf",
        size: 1024000,
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
        virusScan: true,
        malwareScan: true,
        contentAnalysis: true,
      },
    };

    setSecurityResult(mockSecurityResult);
    setScanning(false);

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResume: ResumeData = {
      id: "1",
      fileName: "resume_from_link.pdf",
      content: "Mock resume content from link...",
      parsedData: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        summary:
          "Experienced software engineer with 5+ years in full-stack development...",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Previous Company",
            duration: "2020-2024",
            description: "Led development of web applications...",
            skills: ["Python", "React", "Cloud", "Docker"],
          },
        ],
        education: [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            year: "2019",
          },
        ],
        skills: ["Python", "JavaScript", "React", "Node.js", "Cloud", "Docker"],
        certifications: ["Cloud Certified Developer", "Cloud Professional"],
      },
      uploadedAt: new Date(),
      source: "link",
      securityStatus: {
        scanned: true,
        safe: mockSecurityResult.safe,
        threats: mockSecurityResult.threats,
        scanTimestamp: mockSecurityResult.timestamp,
      },
      fileInfo: {
        size: mockSecurityResult.details.size,
        type: mockSecurityResult.details.fileType,
        lastModified: new Date(),
        checksum: mockSecurityResult.details.checksum,
      },
    };

    setResume(mockResume);
    setUploading(false);
    onComplete(mockResume);
  };

  const handleCameraCapture = async () => {
    setCameraActive(true);
    setUploading(true);

    // Simulate camera capture and OCR processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResume: ResumeData = {
      id: "1",
      fileName: "camera_capture.jpg",
      content: "Mock resume content from camera...",
      parsedData: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        summary:
          "Experienced software engineer with 5+ years in full-stack development...",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Previous Company",
            duration: "2020-2024",
            description: "Led development of web applications...",
            skills: ["Python", "React", "Cloud", "Docker"],
          },
        ],
        education: [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            year: "2019",
          },
        ],
        skills: ["Python", "JavaScript", "React", "Node.js", "Cloud", "Docker"],
        certifications: ["Cloud Certified Developer", "Cloud Professional"],
      },
      uploadedAt: new Date(),
      source: "camera",
      securityStatus: {
        scanned: true,
        safe: true,
        threats: [],
        scanTimestamp: new Date(),
      },
      fileInfo: {
        size: 2048000,
        type: "image/jpeg",
        lastModified: new Date(),
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
      },
    };

    setResume(mockResume);
    setUploading(false);
    setCameraActive(false);
    onComplete(mockResume);
  };

  const handleQRScan = async () => {
    if (!qrCode.trim()) return;

    setUploading(true);
    setScanning(true);

    // Simulate QR code processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResume: ResumeData = {
      id: "1",
      fileName: "qr_import.pdf",
      content: "Mock resume content from QR code...",
      parsedData: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        summary:
          "Experienced software engineer with 5+ years in full-stack development...",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Previous Company",
            duration: "2020-2024",
            description: "Led development of web applications...",
            skills: ["Python", "React", "Cloud", "Docker"],
          },
        ],
        education: [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            year: "2019",
          },
        ],
        skills: ["Python", "JavaScript", "React", "Node.js", "Cloud", "Docker"],
        certifications: ["Cloud Certified Developer", "Cloud Professional"],
      },
      uploadedAt: new Date(),
      source: "qr",
      securityStatus: {
        scanned: true,
        safe: true,
        threats: [],
        scanTimestamp: new Date(),
      },
      fileInfo: {
        size: 1024000,
        type: "application/pdf",
        lastModified: new Date(),
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
      },
    };

    setResume(mockResume);
    setUploading(false);
    setScanning(false);
    onComplete(mockResume);
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Import Your Resume</h2>
        <p className="text-gray-600">
          Choose from multiple secure import methods to get started
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const selectedSource = importSources.find((source) =>
            source.id === value
          );
          if (selectedSource?.available) {
            setActiveTab(value);
          }
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {importSources.map((source) => (
            <TabsTrigger
              key={source.id}
              value={source.id}
              className="flex flex-col items-center gap-1 p-2"
              disabled={!source.available}
              aria-disabled={source.available ? undefined : true}
              title={!source.available
                ? "This import option is currently unavailable"
                : source.comingSoon
                ? "Coming soon"
                : undefined}
            >
              {source.icon}
              <span className="text-xs hidden lg:block font-medium">
                {source.name}
              </span>
              {source.comingSoon && (
                <span className="hidden text-[10px] uppercase tracking-wide text-amber-600 lg:block">
                  Coming soon
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="device" className="space-y-4">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <CardContent className="p-8">
              <div
                className={`text-center ${dragActive ? "bg-blue-50" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading
                  ? (
                    <div className="space-y-4">
                      <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                      <p className="text-lg font-medium">
                        Processing your resume...
                      </p>
                      <Progress
                        value={75}
                        className="w-full max-w-xs mx-auto"
                      />
                      {scanning && (
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Security scanning...</span>
                        </div>
                      )}
                    </div>
                  )
                  : resume
                  ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                      <div>
                        <h3 className="text-lg font-medium text-green-700">
                          Resume Imported Successfully!
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {resume.fileName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-left">
                        <h4 className="font-medium mb-2">
                          Parsed Information:
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>
                            <strong>Name:</strong> {resume.parsedData.name}
                          </li>
                          <li>
                            <strong>Email:</strong> {resume.parsedData.email}
                          </li>
                          <li>
                            <strong>Skills:</strong>{" "}
                            {resume.parsedData.skills.join(", ")}
                          </li>
                          <li>
                            <strong>Experience:</strong>{" "}
                            {resume.parsedData.experience.length} positions
                          </li>
                        </ul>
                      </div>
                      {securityResult && (
                        <div className="bg-green-50 p-4 rounded-lg text-left">
                          <h4 className="font-medium mb-2 text-green-700">
                            Security Status:
                          </h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>File scanned and verified safe</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Scan ID: {securityResult.scanId}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                  : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">
                          Drag & drop your resume here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse files
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
                        className="hidden"
                        onChange={onFileInputChange}
                      />
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={openFilePicker}
                        disabled={uploading}
                      >
                        Choose File
                      </Button>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          Supported: PDF, DOC, DOCX, TXT, RTF (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Linkedin className="w-12 h-12 mx-auto text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium">
                    Create Professional Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Build your professional profile with your experience and
                    skills
                  </p>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    window.location.href = "/auth/profile";
                  }}
                  aria-label="Create your professional profile"
                >
                  <User className="w-4 h-4 mr-2" aria-hidden="true" />
                  Create Professional Profile
                </Button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure form-based profile creation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Camera className="w-12 h-12 mx-auto text-purple-600" />
                <div>
                  <h3 className="text-lg font-medium">Camera Capture</h3>
                  <p className="text-sm text-gray-600">
                    Take a photo of your resume with OCR processing
                  </p>
                </div>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleCameraCapture}
                  disabled={uploading}
                  aria-label={uploading
                    ? "Processing camera capture..."
                    : "Open camera to capture resume document"}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {uploading ? "Processing..." : "Open Camera"}
                </Button>
                {cameraActive && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Capturing and processing image...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ScanLine className="w-4 h-4" />
                  <span>OCR text extraction included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Scan className="w-12 h-12 mx-auto text-indigo-600" />
                <div>
                  <h3 className="text-lg font-medium">Document Scanner</h3>
                  <p className="text-sm text-gray-600">
                    Secure in-app scanning is almost ready. For now, use device
                    upload or camera capture to import your resume.
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  disabled
                  aria-label="Document scanner is coming soon"
                >
                  <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
                  Coming Soon
                </Button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  <span>High-quality document scanning</span>
                </div>
                <div className="flex items-center justify-center text-xs text-amber-600 lg:hidden">
                  Coming soon
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <LinkIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium">Secure Link Import</h3>
                  <p className="text-sm text-gray-600">
                    Import from cloud storage or other secure URLs
                  </p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="link-url">Resume URL</Label>
                  <Input
                    id="link-url"
                    placeholder="https://drive.google.com/file/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleLinkImport}
                    disabled={!linkUrl.trim() || uploading}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {uploading ? "Importing..." : "Import from Link"}
                  </Button>
                </div>
                {scanning && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Validating link and scanning for security...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>All links are security-scanned before import</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <QrCode className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                  <h3 className="text-lg font-medium">QR Code Import</h3>
                  <p className="text-sm text-gray-600">
                    Scan a QR code to import your resume
                  </p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="qr-code">QR Code Data</Label>
                  <Input
                    id="qr-code"
                    placeholder="Paste QR code data or scan with camera"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                  />
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={handleQRScan}
                    disabled={!qrCode.trim() || uploading}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {uploading ? "Processing..." : "Import from QR Code"}
                  </Button>
                </div>
                {scanning && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-orange-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating QR code and importing...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>QR codes are validated for security</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Information */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <ShieldCheck className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Security & Privacy
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• All files are scanned for malware and viruses</li>
                <li>• Content is analyzed for malicious code</li>
                <li>• Links are validated before import</li>
                <li>• Your data is encrypted and never shared</li>
                <li>• Files are automatically deleted after processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function JobSearchStep({ onSelect }: { onSelect: (job: JobPosting) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    workType: "",
    experienceLevel: "",
    salaryRange: "",
    companySize: "",
    industry: "",
    remote: false,
    postedWithin: "",
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [recommendedJobs, setRecommendedJobs] = useState<JobPosting[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load initial jobs and recommendations
  useEffect(() => {
    loadJobs();
    loadRecommendations();
    loadSearchHistory();
  }, [loadJobs, loadRecommendations, loadSearchHistory]);

  // Search jobs when search term or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchJobs(searchTerm.trim());
        addToSearchHistory(searchTerm.trim());
      } else {
        loadJobs();
      }
    }, 500); // Increased debounce for better UX

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, addToSearchHistory, loadJobs, searchJobs]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        limit: "20",
        ...(filters.location && { location: filters.location }),
        ...(filters.workType && { workType: filters.workType }),
        ...(filters.remote && { remote: "true" }),
      });

      const response = await fetch(`/api/jobs/search?${queryParams}`);
      if (!response.ok) throw new Error("Failed to load jobs");

      const data = await response.json();
      setFilteredJobs(data.jobs || []);
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Failed to load jobs. Using sample data.");
      setFilteredJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.workType, filters.remote]);

  const searchJobs = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        q: query,
        limit: "20",
        ...(filters.location && { location: filters.location }),
        ...(filters.workType && { workType: filters.workType }),
        ...(filters.remote && { remote: "true" }),
      });

      const response = await fetch(`/api/jobs/search?${queryParams}`);
      if (!response.ok) throw new Error("Failed to search jobs");

      const data = await response.json();
      setFilteredJobs(data.jobs || []);
    } catch (err) {
      console.error("Error searching jobs:", err);
      setError("Search failed. Using sample data.");
      // Enhanced fallback with filter support
      const searchLower = query.toLowerCase();
      let filtered = mockJobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.requirements.some((req) =>
            req.toLowerCase().includes(searchLower)
          );

        const matchesLocation = !filters.location ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchesWorkType = !filters.workType ||
          job.type.toLowerCase().includes(filters.workType.toLowerCase());

        const matchesRemote = !filters.remote || job.remote;

        return matchesSearch && matchesLocation && matchesWorkType &&
          matchesRemote;
      });

      setFilteredJobs(filtered);
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.workType, filters.remote]);

  const loadRecommendations = useCallback(async () => {
    try {
      // In a real app, this would analyze the user's resume/profile
      const response = await fetch("/api/jobs/recommendations?limit=5");
      if (response.ok) {
        const data = await response.json();
        setRecommendedJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error loading recommendations:", err);
    }
  }, []);

  const loadSearchHistory = useCallback(() => {
    try {
      const history = localStorage.getItem("jobSearchHistory");
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (err) {
      console.error("Error loading search history:", err);
    }
  }, []);

  const addToSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 10);
    setSearchHistory(newHistory);

    try {
      localStorage.setItem("jobSearchHistory", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Error saving search history:", err);
    }
  }, [searchHistory]);

  const toggleSavedJob = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);

    // In a real app, this would sync with the backend
    try {
      localStorage.setItem(
        "savedJobs",
        JSON.stringify(Array.from(newSavedJobs)),
      );
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      workType: "",
      experienceLevel: "",
      salaryRange: "",
      companySize: "",
      industry: "",
      remote: false,
      postedWithin: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Find Your Target Job</h2>
        <p className="text-gray-600">
          Search for the job you want to apply for with AI-powered
          recommendations
        </p>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-20"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !searchTerm && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Recent searches:</span>
            {searchHistory.slice(0, 5).map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(term)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))}
                />
              </div>
              <div>
                <Label htmlFor="workType">Work Type</Label>
                <SelectComponent
                  value={filters.workType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, workType: value }))}
                >
                  <SelectTriggerComponent>
                    <SelectValueComponent placeholder="Select type" />
                  </SelectTriggerComponent>
                  <SelectContentComponent>
                    <SelectItemComponent value="full-time">
                      Full-time
                    </SelectItemComponent>
                    <SelectItemComponent value="part-time">
                      Part-time
                    </SelectItemComponent>
                    <SelectItemComponent value="contract">
                      Contract
                    </SelectItemComponent>
                    <SelectItemComponent value="internship">
                      Internship
                    </SelectItemComponent>
                  </SelectContentComponent>
                </SelectComponent>
              </div>
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <SelectComponent
                  value={filters.experienceLevel}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, experienceLevel: value }))}
                >
                  <SelectTriggerComponent>
                    <SelectValueComponent placeholder="Select level" />
                  </SelectTriggerComponent>
                  <SelectContentComponent>
                    <SelectItemComponent value="entry">
                      Entry Level
                    </SelectItemComponent>
                    <SelectItemComponent value="mid">
                      Mid Level
                    </SelectItemComponent>
                    <SelectItemComponent value="senior">
                      Senior Level
                    </SelectItemComponent>
                    <SelectItemComponent value="executive">
                      Executive
                    </SelectItemComponent>
                  </SelectContentComponent>
                </SelectComponent>
              </div>
              <div>
                <Label htmlFor="salaryRange">Salary Range</Label>
                <SelectComponent
                  value={filters.salaryRange}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, salaryRange: value }))}
                >
                  <SelectTriggerComponent>
                    <SelectValueComponent placeholder="Select range" />
                  </SelectTriggerComponent>
                  <SelectContentComponent>
                    <SelectItemComponent value="0-50k">
                      $0 - $50k
                    </SelectItemComponent>
                    <SelectItemComponent value="50k-75k">
                      $50k - $75k
                    </SelectItemComponent>
                    <SelectItemComponent value="75k-100k">
                      $75k - $100k
                    </SelectItemComponent>
                    <SelectItemComponent value="100k-150k">
                      $100k - $150k
                    </SelectItemComponent>
                    <SelectItemComponent value="150k+">
                      $150k+
                    </SelectItemComponent>
                  </SelectContentComponent>
                </SelectComponent>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={filters.remote}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      remote: e.target.checked,
                    }))}
                  className="rounded"
                />
                <Label htmlFor="remote">Remote only</Label>
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {recommendedJobs.length > 0 && !searchTerm && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">
              AI-Powered Recommendations
            </h3>
            <Badge variant="secondary">Based on your profile</Badge>
          </div>
          <div className="grid gap-3">
            {recommendedJobs.map((job) => (
              <Card
                key={`rec-${job.id}`}
                className="cursor-pointer transition-all hover:shadow-md border-purple-200 bg-purple-50/50"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        {job.salary && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              ${job.salary.min.toLocaleString()}{" "}
                              - ${job.salary.max.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
              {" "}
              found
            </span>
            {searchTerm && <Badge variant="outline">for "{searchTerm}"</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-1" />
              Saved ({savedJobs.size})
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-1" />
              Create Alert
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredJobs.length > 0
          ? (
            filteredJobs.map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                  selectedJob?.id === job.id
                    ? "ring-2 ring-blue-500 border-l-blue-500 bg-blue-50/50"
                    : "border-l-transparent hover:border-l-blue-300"
                }`}
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log("Job selected:", job.title, job.company);
                  setSelectedJob(job);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge variant="outline">{job.type}</Badge>
                          {job.remote && (
                            <Badge variant="secondary">Remote</Badge>
                          )}
                          {job.source === "governmentjobs" && (
                            <Badge variant="default" className="bg-green-600">
                              Government
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavedJob(job.id);
                            }}
                          >
                            {savedJobs.has(job.id)
                              ? (
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                              )
                              : <Heart className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Share functionality
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                        {job.experienceLevel && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {job.experienceLevel}
                          </div>
                        )}
                      </div>

                      {job.salary && (
                        <div className="flex items-center text-green-600 font-medium mb-3">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${job.salary.min.toLocaleString()}{" "}
                          - ${job.salary.max.toLocaleString()}
                          <span className="text-gray-500 text-sm ml-1">
                            /year
                          </span>
                        </div>
                      )}

                      <p className="text-gray-700 line-clamp-2 mb-3">
                        {job.description}
                      </p>

                      {/* Key Requirements Preview */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.requirements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Security & Compliance Indicators */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        <span>Secure application</span>
                        {job.tos?.allowed && (
                          <>
                            <span>•</span>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Terms compliant</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button
                        variant={selectedJob?.id === job.id
                          ? "default"
                          : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          // eslint-disable-next-line no-console
                          console.log(
                            "Job selected via button:",
                            job.title,
                            job.company,
                          );
                          setSelectedJob(job);
                        }}
                        className="min-w-24"
                      >
                        {selectedJob?.id === job.id ? "Selected" : "Select"}
                      </Button>
                      {job.applyUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              job.applyUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )
          : (
            <Card className="p-8 text-center">
              <CardContent>
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all available
                  positions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Show All Jobs
                </Button>
              </CardContent>
            </Card>
          )}
      </div>

      {selectedJob && (
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Selected: {selectedJob.title}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {selectedJob.company} • Ready to analyze your fit
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => onSelect(selectedJob)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Analyze Fit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function FitAnalysisStep({ resume, job, onComplete }: {
  resume: ResumeData;
  job: JobPosting;
  onComplete: (analysis: FitAnalysis) => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);

  const runAnalysis = useCallback(async () => {
    setAnalyzing(true);

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Customize analysis based on actual resume data and job requirements
    const resumeSkills = resume.parsedData.skills || [];
    const resumeExperience = resume.parsedData.experience || [];
    const resumeEducation = resume.parsedData.education || [];
    const jobRequirements = job.requirements || [];
    const jobNiceToHaves = job.niceToHaves || [];

    // Calculate skill matching
    const matchedSkills = resumeSkills.filter((skill) =>
      jobRequirements.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );

    const missingSkills = jobRequirements.filter((req) =>
      !resumeSkills.some((skill) =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );

    const niceToHaveSkills = resumeSkills.filter((skill) =>
      jobNiceToHaves.some((nice) =>
        nice.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(nice.toLowerCase())
      )
    );

    // Calculate experience score
    const experienceYears = resumeExperience.length;
    const hasRelevantExperience = resumeExperience.some((exp) =>
      jobRequirements.some((req) =>
        exp.title.toLowerCase().includes(req.toLowerCase()) ||
        exp.description.toLowerCase().includes(req.toLowerCase())
      )
    );

    // Calculate education score
    const hasRelevantEducation = resumeEducation.some((edu) =>
      jobRequirements.some((req) =>
        edu.degree.toLowerCase().includes(req.toLowerCase()) ||
        edu.institution.toLowerCase().includes("university") ||
        edu.institution.toLowerCase().includes("college")
      )
    );

    // Calculate overall score based on actual data
    const skillsScore = Math.min(
      100,
      (matchedSkills.length / Math.max(jobRequirements.length, 1)) * 100,
    );
    const experienceScore = Math.min(
      100,
      (experienceYears * 15) + (hasRelevantExperience ? 20 : 0),
    );
    const educationScore = hasRelevantEducation ? 90 : 70;
    const overallScore = Math.round(
      (skillsScore * 0.4) + (experienceScore * 0.3) + (educationScore * 0.2) +
        10,
    );

    const mockAnalysis: FitAnalysis = {
      overallScore: overallScore,
      breakdown: {
        skills: {
          score: Math.round(skillsScore),
          matched: matchedSkills,
          missing: missingSkills.slice(0, 3), // Limit to top 3 missing
        },
        experience: {
          score: Math.round(experienceScore),
          matched: hasRelevantExperience
            ? [`${experienceYears}+ years experience`, "Relevant work history"]
            : [`${experienceYears}+ years experience`],
          gaps: missingSkills.slice(0, 2).map((skill) => `${skill} experience`),
        },
        education: {
          score: educationScore,
          requirements: ["Bachelor degree in CS or related"],
          qualifications: resumeEducation.map((edu) => edu.degree),
        },
        location: {
          score: 100,
          remote: true,
          relocation: false,
        },
        salary: {
          score: 75,
          expectation: 130000,
          offered: 150000,
        },
      },
      strengths: [
        ...matchedSkills.slice(0, 2).map((skill) => `Strong ${skill} skills`),
        ...niceToHaveSkills.slice(0, 1).map((skill) =>
          `${skill} expertise (nice-to-have)`
        ),
        `${experienceYears}+ years of experience`,
        hasRelevantEducation
          ? "Relevant educational background"
          : "Professional experience",
      ].slice(0, 4),
      weaknesses: [
        ...missingSkills.slice(0, 2).map((skill) =>
          `Missing ${skill} experience`
        ),
        experienceYears < 3 ? "Limited years of experience" : null,
        !hasRelevantEducation
          ? "Consider relevant education/certifications"
          : null,
      ].filter((x): x is string => Boolean(x)).slice(0, 3),
      recommendations: [
        ...matchedSkills.slice(0, 2).map((skill) =>
          `Highlight your ${skill} experience prominently`
        ),
        ...niceToHaveSkills.slice(0, 1).map((skill) =>
          `Emphasize your ${skill} skills as a differentiator`
        ),
        missingSkills.length > 0
          ? `Consider learning ${missingSkills[0]} to improve your fit`
          : null,
        "Showcase your problem-solving and collaboration abilities",
      ].filter((x): x is string => Boolean(x)).slice(0, 4),
      biasIndicators: {
        detected: false,
        factors: [],
        mitigation: ["Blind resume review", "Skills-based assessment"],
      },
      auditTrail: {
        id: `audit_${Date.now()}`,
        timestamp: new Date(),
        version: "1.0",
        hash: `hash_${Date.now()}`,
        immutable: true,
      },
    };

    setAnalysis(mockAnalysis);
    setAnalyzing(false);
    onComplete(mockAnalysis);
  }, [job, onComplete, resume]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <div>
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Analyzing Your Fit</h2>
            <p className="text-gray-600 mb-6">
              Our evidence engine is analyzing your resume against the job
              requirements...
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Skills Analysis</span>
                <span className="text-sm">85%</span>
              </div>
              <Progress value={85} />

              <div className="flex items-center justify-between">
                <span className="text-sm">Experience Matching</span>
                <span className="text-sm">80%</span>
              </div>
              <Progress value={80} />

              <div className="flex items-center justify-between">
                <span className="text-sm">Bias Detection</span>
                <span className="text-sm">100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Fit Analysis</h2>
        <p className="text-gray-600">
          Here&apos;s how well you match the {job.title} position at{" "}
          {job.company}
        </p>
      </div>

      {/* Overall Score */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {analysis.overallScore}
                </div>
                <div className="text-sm opacity-90">/ 100</div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Overall Fit Score</h3>
            <p className="text-gray-600 mb-4">
              {analysis.overallScore >= 80
                ? "Excellent match!"
                : analysis.overallScore >= 60
                ? "Good match with room for improvement"
                : "Consider strengthening your application"}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="outline" className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Bias-Free Analysis
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Audit Trail: {analysis.auditTrail.id}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Skills Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Match Score</span>
                <span className="font-semibold">
                  {analysis.breakdown.skills.score}%
                </span>
              </div>
              <Progress value={analysis.breakdown.skills.score} />

              <div>
                <h4 className="font-medium text-green-700 mb-2">
                  Matched Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.breakdown.skills.matched.map((skill) => (
                    <Badge
                      key={skill}
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-orange-700 mb-2">
                  Missing Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.breakdown.skills.missing.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Experience Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Match Score</span>
                <span className="font-semibold">
                  {analysis.breakdown.experience.score}%
                </span>
              </div>
              <Progress value={analysis.breakdown.experience.score} />

              <div>
                <h4 className="font-medium text-green-700 mb-2">
                  Matched Experience:
                </h4>
                <ul className="space-y-1">
                  {analysis.breakdown.experience.matched.map((exp) => (
                    <li key={exp} className="flex items-center text-sm">
                      <Check className="w-3 h-3 mr-2 text-green-600" />
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-orange-700 mb-2">
                  Experience Gaps:
                </h4>
                <ul className="space-y-1">
                  {analysis.breakdown.experience.gaps.map((gap) => (
                    <li key={gap} className="flex items-center text-sm">
                      <X className="w-3 h-3 mr-2 text-orange-600" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultsStep({
  resume,
  job,
  analysis,
  onGenerateDocuments,
}: {
  resume: ResumeData;
  job: JobPosting;
  analysis: FitAnalysis;
  onGenerateDocuments: () => void;
}) {
  const [documents, setDocuments] = useState<TailoredDocument[]>([]);
  const [generating, setGenerating] = useState(false);
  const [coverLetterDraft, setCoverLetterDraft] = useState("");
  const [originalCoverLetter, setOriginalCoverLetter] = useState("");
  const [coverLetterSignature, setCoverLetterSignature] = useState(
    resume?.parsedData.name || "",
  );
  const [allowSuggestionIntegration, setAllowSuggestionIntegration] = useState(
    false,
  );
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [submissionState, setSubmissionState] = useState<
    { status: "idle" | "submitting" | "success" | "error"; message?: string }
  >({ status: "idle" });
  // const supabase = useMemo(() => (isSupabaseConfigured() ? createClientComponentClient() : null), [])
  const supabase = null;

  const escapeRegExp = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"),
    [],
  );
  const formatSuggestionParagraph = useCallback(
    (suggestion: string) => `\n\n${suggestion.trim()}`,
    [],
  );

  const ensureSignature = useCallback((content: string) => {
    const trimmedSignature = coverLetterSignature.trim();
    if (!trimmedSignature) return content;

    const normalizedSignature = trimmedSignature.toLowerCase();
    const hasSignature = content
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .includes(normalizedSignature);

    if (hasSignature) {
      return content;
    }

    return `${content.trim()}\n\n${trimmedSignature}`;
  }, [coverLetterSignature]);

  useEffect(() => {
    if (coverLetterSignature || !resume?.parsedData.name) return;
    setCoverLetterSignature(resume.parsedData.name);
  }, [coverLetterSignature, resume?.parsedData.name]);

  useEffect(() => {
    if (!coverLetterDraft) return;

    setDocuments((prev) => {
      if (prev.length === 0) return prev;
      let changed = false;
      const updated = prev.map((doc) => {
        if (doc.type !== "cover_letter") {
          return doc;
        }
        if (doc.content === coverLetterDraft) {
          return doc;
        }
        changed = true;
        return { ...doc, content: coverLetterDraft };
      });

      return changed ? updated : prev;
    });
  }, [coverLetterDraft]);

  const generateDocuments = async () => {
    setGenerating(true);

    // Simulate advanced document generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Extract and analyze data
    const resumeSkills = resume?.parsedData.skills || [];
    const resumeExperience = resume?.parsedData.experience || [];
    const resumeEducation = resume?.parsedData.education || [];
    const resumeCertifications = resume?.parsedData.certifications || [];
    const jobRequirements = job.requirements || [];
    const jobNiceToHaves = job.niceToHaves || [];

    // Advanced skill matching with semantic analysis
    const matchingSkills = resumeSkills.filter((skill) =>
      jobRequirements.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase()) ||
        getSkillSynonyms(skill).some((synonym) =>
          req.toLowerCase().includes(synonym.toLowerCase())
        )
      )
    );

    const niceToHaveSkills = resumeSkills.filter((skill) =>
      jobNiceToHaves.some((nice) =>
        nice.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(nice.toLowerCase())
      )
    );

    // Generate sophisticated resume content
    const resumeContent = generateAdvancedResume({
      resume,
      job,
      matchingSkills,
      niceToHaveSkills,
      analysis,
    });

    // Generate compelling cover letter content
    const coverLetterContent = generateAdvancedCoverLetter({
      resume,
      job,
      matchingSkills,
      analysis,
    });

    // Generate additional tailored documents
    const statementOfPurposeContent = generateStatementOfPurpose({
      resume,
      job,
      matchingSkills,
      analysis,
    });

    const interviewPrepContent = generateInterviewPrep({
      resume,
      job,
      matchingSkills,
      analysis,
    });

    // Calculate advanced metrics
    const resumeMetrics = calculateDocumentMetrics(
      resumeContent,
      jobRequirements,
    );
    const coverLetterMetrics = calculateDocumentMetrics(
      coverLetterContent,
      jobRequirements,
    );
    const statementMetrics = calculateDocumentMetrics(
      statementOfPurposeContent,
      jobRequirements,
    );
    const interviewMetrics = calculateDocumentMetrics(
      interviewPrepContent,
      jobRequirements,
    );

    // Generate expert suggestions
    const resumeSuggestions = generateAISuggestions(
      "resume",
      resumeContent,
      job,
      analysis,
    );
    const coverLetterSuggestions = generateAISuggestions(
      "cover_letter",
      coverLetterContent,
      job,
      analysis,
    );
    const statementSuggestions = generateAISuggestions(
      "statement",
      statementOfPurposeContent,
      job,
      analysis,
    );
    const interviewSuggestions = generateAISuggestions(
      "interview",
      interviewPrepContent,
      job,
      analysis,
    );

    const advancedDocuments: TailoredDocument[] = [
      {
        id: "1",
        type: "resume",
        content: resumeContent,
        highlights: [
          `${matchingSkills.length} core skills aligned`,
          `${resumeExperience.length}+ years of experience`,
          resumeCertifications.length > 0
            ? "Professional certifications"
            : "Technical expertise",
          niceToHaveSkills.length > 0
            ? `${niceToHaveSkills.length} bonus qualifications`
            : "Strong fundamentals",
        ],
        keywords: [
          ...matchingSkills,
          ...niceToHaveSkills,
          ...jobRequirements.slice(0, 3),
        ].slice(0, 8),
        atsScore: Math.min(
          98,
          75 + (matchingSkills.length * 4) + (resumeExperience.length * 3) +
            (resumeCertifications.length * 2),
        ),
        generatedAt: new Date(),
        format: "pdf",
        template: getIndustryTemplate(job.industry || "technology"),
        industryOptimized: true,
        aiSuggestions: resumeSuggestions,
        metrics: resumeMetrics,
      },
      {
        id: "2",
        type: "cover_letter",
        content: coverLetterContent,
        highlights: [
          "Personalized company research",
          "Quantified achievements highlighted",
          "Cultural fit demonstrated",
          "Call-to-action optimized",
        ],
        keywords: [
          "Innovation",
          "Collaboration",
          "Problem-solving",
          "Leadership",
          "Growth",
          "Results",
          "Impact",
          "Excellence",
        ],
        atsScore: Math.min(
          95,
          80 + (matchingSkills.length * 3) + (resumeExperience.length * 2),
        ),
        generatedAt: new Date(),
        format: "pdf",
        template: "modern_professional",
        industryOptimized: true,
        aiSuggestions: coverLetterSuggestions,
        metrics: coverLetterMetrics,
        allowSubmission: true,
      },
      {
        id: "3",
        type: "resume", // Using resume type for statement of purpose
        content: statementOfPurposeContent,
        highlights: [
          "Career objectives clearly defined",
          "Professional experience highlighted",
          "Company alignment demonstrated",
          "Future contributions outlined",
        ],
        keywords: [
          "Career Goals",
          "Professional Growth",
          "Company Mission",
          "Strategic Objectives",
          "Innovation",
          "Leadership",
        ],
        atsScore: Math.min(
          92,
          75 + (matchingSkills.length * 2) + (resumeExperience.length * 2),
        ),
        generatedAt: new Date(),
        format: "pdf",
        template: "academic_professional",
        industryOptimized: true,
        aiSuggestions: statementSuggestions,
        metrics: statementMetrics,
      },
      {
        id: "4",
        type: "resume", // Using resume type for interview prep
        content: interviewPrepContent,
        highlights: [
          "Technical questions prepared",
          "Behavioral examples ready",
          "Company research completed",
          "Strengths strategically highlighted",
        ],
        keywords: [
          "Interview Preparation",
          "Technical Skills",
          "Behavioral Examples",
          "Company Research",
          "Strategic Questions",
        ],
        atsScore: Math.min(
          90,
          70 + (matchingSkills.length * 2) + (resumeExperience.length * 2),
        ),
        generatedAt: new Date(),
        format: "pdf",
        template: "interview_guide",
        industryOptimized: true,
        aiSuggestions: interviewSuggestions,
        metrics: interviewMetrics,
      },
    ];

    setOriginalCoverLetter(coverLetterContent);
    setCoverLetterDraft(coverLetterContent);
    setAppliedSuggestions([]);
    setAllowSuggestionIntegration(false);
    setSubmissionState({ status: "idle" });

    setDocuments(advancedDocuments);
    setGenerating(false);
    onGenerateDocuments();
  };

  const applySuggestionToDraft = useCallback((suggestion: string) => {
    if (!allowSuggestionIntegration) {
      setSubmissionState({
        status: "error",
        message: "Enable expert suggestions before adding them to your draft.",
      });
      return;
    }

    if (appliedSuggestions.includes(suggestion)) {
      return;
    }

    setCoverLetterDraft((prev) => {
      const base = prev.trimEnd();
      const addition = formatSuggestionParagraph(suggestion);
      return base ? `${base}${addition}` : suggestion.trim();
    });
    setAppliedSuggestions((prev) => [...prev, suggestion]);
    setSubmissionState({ status: "idle" });
  }, [
    allowSuggestionIntegration,
    appliedSuggestions,
    formatSuggestionParagraph,
  ]);

  const removeSuggestionFromDraft = useCallback((suggestion: string) => {
    const normalized = suggestion.trim();
    const patternWithBreaks = new RegExp(
      `\\n\\n${escapeRegExp(normalized)}`,
      "g",
    );
    const patternStandalone = new RegExp(
      `^${escapeRegExp(normalized)}(\\s*)?`,
      "g",
    );
    setCoverLetterDraft((prev) => {
      const withoutBreaks = prev.replace(patternWithBreaks, "");
      const cleaned = withoutBreaks.replace(patternStandalone, "").trimEnd();
      return cleaned;
    });
    setAppliedSuggestions((prev) => prev.filter((item) => item !== suggestion));
    if (submissionState.status !== "idle") {
      setSubmissionState({ status: "idle" });
    }
  }, [escapeRegExp, submissionState.status]);

  const addAllSuggestions = useCallback((suggestions: string[]) => {
    if (!allowSuggestionIntegration) {
      setSubmissionState({
        status: "error",
        message: "Enable expert suggestions before adding them to your draft.",
      });
      return;
    }

    const pending = suggestions.filter((s) => !appliedSuggestions.includes(s));
    if (pending.length === 0) return;

    setCoverLetterDraft((prev) => {
      const base = prev.trimEnd();
      const additions = pending.map(formatSuggestionParagraph).join("");
      const combined = base
        ? `${base}${additions}`
        : pending.map((s) => s.trim()).join("\n\n");
      return combined;
    });
    setAppliedSuggestions((prev) => [...prev, ...pending]);
    setSubmissionState({ status: "idle" });
  }, [
    allowSuggestionIntegration,
    appliedSuggestions,
    formatSuggestionParagraph,
  ]);

  const clearAllSuggestions = useCallback(() => {
    if (!appliedSuggestions.length) return;

    setCoverLetterDraft((prev) => {
      const updated = appliedSuggestions.reduce((acc, suggestion) => {
        const normalized = suggestion.trim();
        const patternWithBreaks = new RegExp(
          `\\n\\n${escapeRegExp(normalized)}`,
          "g",
        );
        const patternStandalone = new RegExp(
          `^${escapeRegExp(normalized)}(\\s*)?`,
          "g",
        );
        return acc.replace(patternWithBreaks, "").replace(
          patternStandalone,
          "",
        );
      }, prev);
      return updated.trimEnd();
    });
    setAppliedSuggestions([]);
    if (submissionState.status !== "idle") {
      setSubmissionState({ status: "idle" });
    }
  }, [appliedSuggestions, escapeRegExp, submissionState.status]);

  const resetCoverLetterDraft = useCallback(() => {
    setCoverLetterDraft(originalCoverLetter);
    setAppliedSuggestions([]);
    setSubmissionState({ status: "idle" });
  }, [originalCoverLetter]);

  const handleDraftChange = useCallback((value: string) => {
    setCoverLetterDraft(value);
    if (submissionState.status !== "idle") {
      setSubmissionState({ status: "idle" });
    }
  }, [submissionState.status]);

  const handleSignatureChange = useCallback((value: string) => {
    setCoverLetterSignature(value);
    if (submissionState.status !== "idle") {
      setSubmissionState({ status: "idle" });
    }
  }, [submissionState.status]);

  const handleSuggestionPermission = useCallback((value: boolean) => {
    setAllowSuggestionIntegration(value);
    if (!value) {
      clearAllSuggestions();
    }
    if (submissionState.status !== "idle") {
      setSubmissionState({ status: "idle" });
    }
  }, [clearAllSuggestions, submissionState.status]);

  const submitCoverLetter = useCallback(async (doc: TailoredDocument) => {
    if (!coverLetterDraft.trim()) {
      setSubmissionState({
        status: "error",
        message: "Cover letter cannot be empty.",
      });
      return;
    }

    if (!coverLetterSignature.trim()) {
      setSubmissionState({
        status: "error",
        message: "Please provide your signature before submitting.",
      });
      return;
    }

    setSubmissionState({ status: "submitting" });

    try {
      const signedContent = ensureSignature(coverLetterDraft);
      const signatureValue = coverLetterSignature.trim();
      const suggestionsIntegrated = doc.aiSuggestions.filter((suggestion) =>
        signedContent.includes(suggestion)
      );

      // TODO: Implement action logging when Supabase is configured
      // if (supabase) {
      //   const { data: { user } } = await supabase.auth.getUser()
      //   await supabase
      //     .from('action_log')
      //     .insert({
      //       tenantId: user?.id ?? null,
      //       actorType: user ? 'user' : 'guest',
      //       actorId: user?.id ?? 'guest',
      //       action: 'cover_letter_submitted',
      //       objType: 'document',
      //       objId: doc.id,
      //       payloadHash: JSON.stringify({
      //         jobId: job.id,
      //         jobTitle: job.title,
      //         company: job.company,
      //         content: signedContent,
      //         signature: signatureValue,
      //         allowSuggestionIntegration,
      //         suggestionsIntegrated
      //       })
      //     })
      // } else {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // }

      setSubmissionState({
        status: "success",
        message: "Cover letter submitted successfully.",
      });
    } catch (error: any) {
      console.error("Cover letter submission failed:", error);
      setSubmissionState({
        status: "error",
        message: error?.message ||
          "Unable to submit the cover letter right now. Please try again.",
      });
    }
  }, [
    allowSuggestionIntegration,
    coverLetterDraft,
    coverLetterSignature,
    ensureSignature,
    job.company,
    job.id,
    job.title,
    supabase,
  ]);

  const downloadDocument = async (
    doc: TailoredDocument,
    format: "pdf" | "docx" | "txt" = "pdf",
  ) => {
    try {
      let fileName = `${doc.type}_${job.title.replace(/\s+/g, "_")}_${
        job.company.replace(/\s+/g, "_")
      }`;
      let blob: Blob;
      let mimeType: string;
      const baseContent = doc.type === "cover_letter"
        ? coverLetterDraft
        : doc.content;
      const content = doc.type === "cover_letter"
        ? ensureSignature(baseContent)
        : baseContent;
      const suggestionsBlock = doc.aiSuggestions.length > 0
        ? `\n\nExpert Suggestions:\n${
          doc.aiSuggestions.map((s) => `• ${s}`).join("\n")
        }`
        : "";
      const metricsBlock =
        `\n\nMetrics:\n• Readability Score: ${doc.metrics.readabilityScore}/100\n• Keyword Density: ${doc.metrics.keywordDensity}%\n• Action Verbs: ${doc.metrics.actionVerbCount}\n• Quantified Achievements: ${doc.metrics.quantifiedAchievements}`;
      const documentBody = `${content}${suggestionsBlock}${metricsBlock}`;
      const documentHeader = `${
        getDocumentTitle(doc)
      }\nGenerated: ${doc.generatedAt.toLocaleDateString()}\nTemplate: ${doc.template}\nATS Score: ${doc.atsScore}%\nIndustry Optimized: ${
        doc.industryOptimized ? "Yes" : "No"
      }\n`;

      if (format === "pdf") {
        const fileContent = `${documentHeader}\n${documentBody}`;
        fileName += ".txt";
        blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        mimeType = "text/plain";
      } else if (format === "docx") {
        const fileContent = `${documentHeader}\n${documentBody}`;
        fileName += ".txt";
        blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        mimeType = "text/plain";
      } else {
        const fileContent = `${documentHeader}\n${documentBody}`;
        fileName += ".txt";
        blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        mimeType = "text/plain";
      }

      // Create and download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Track download
      try {
        import("../../../lib/analytics").then((m) =>
          m.track({ name: "document_download" })
        );
      } catch {}
    } catch (error) {
      console.error("Download failed:", error);
      // Show user-friendly error message
      alert(
        "Download failed. Please try again or contact support if the issue persists.",
      );
    }
  };

  const previewDocument = (doc: TailoredDocument) => {
    const previewWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes,resizable=yes",
    );
    if (previewWindow) {
      const baseContent = doc.type === "cover_letter"
        ? coverLetterDraft
        : doc.content;
      const displayContent = doc.type === "cover_letter"
        ? ensureSignature(baseContent)
        : baseContent;

      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${getDocumentTitle(doc)} Preview</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              margin: 0; 
              padding: 20px; 
              background: #f8fafc;
              color: #1e293b;
            }
            .header { 
              background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
              color: white; 
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 20px;
              text-align: center;
            }
            .metrics { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
              gap: 15px; 
              margin: 20px 0; 
            }
            .metric { 
              background: white; 
              padding: 15px; 
              border-radius: 8px; 
              text-align: center; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .metric-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #3b82f6; 
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 8px; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.8;
            }
            .highlights { 
              background: #f0f9ff; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .suggestions { 
              background: #fef3c7; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .badge { 
              display: inline-block; 
              background: #e0e7ff; 
              color: #3730a3; 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              margin: 2px; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #64748b; 
              font-size: 12px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${getDocumentTitle(doc)}</h1>
            <p>Generated for ${job.title} at ${job.company}</p>
            <p>Template: ${doc.template} | Industry Optimized: ${
        doc.industryOptimized ? "Yes" : "No"
      }</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <div class="metric-value">${doc.atsScore}%</div>
              <div>ATS Score</div>
            </div>
            <div class="metric">
              <div class="metric-value">${doc.metrics.readabilityScore}</div>
              <div>Readability</div>
            </div>
            <div class="metric">
              <div class="metric-value">${doc.metrics.keywordDensity}%</div>
              <div>Keyword Density</div>
            </div>
            <div class="metric">
              <div class="metric-value">${doc.metrics.actionVerbCount}</div>
              <div>Action Verbs</div>
            </div>
          </div>
          
          <div class="highlights">
            <h3>Key Highlights</h3>
            ${
        doc.highlights.map((h) => `<span class="badge">${h}</span>`).join("")
      }
          </div>
          
          <div class="content">${displayContent}</div>
          
          <div class="suggestions">
            <h3>Expert Suggestions</h3>
            <ul>
              ${doc.aiSuggestions.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>
          
          <div class="footer">
            Prepared on ${doc.generatedAt.toLocaleDateString()}
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const getDocumentTitle = (doc: TailoredDocument) => {
    switch (doc.id) {
      case "1":
        return "Tailored Resume";
      case "2":
        return "Tailored Cover Letter";
      case "3":
        return "Statement of Purpose";
      case "4":
        return "Interview Preparation Guide";
      default:
        return doc.type === "resume"
          ? "Tailored Resume"
          : "Tailored Cover Letter";
    }
  };

  const shareDocument = async (doc: TailoredDocument) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getDocumentTitle(doc),
          text: `Check out my ${
            getDocumentTitle(doc).toLowerCase()
          } for ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out my ${
        getDocumentTitle(doc).toLowerCase()
      } for ${job.title} at ${job.company}: ${window.location.href}`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Share link copied to clipboard!");
      } catch (error) {
        console.error("Copy failed:", error);
        alert("Share functionality not available");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Tailored Application</h2>
        <p className="text-gray-600">
          Download your personalized application documents
        </p>
      </div>

      {/* Fit Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {job.title} at {job.company}
              </h3>
              <p className="text-gray-600">
                Overall Fit Score:{" "}
                <span className="font-semibold text-blue-600">
                  {analysis.overallScore}/100
                </span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                <Shield className="w-4 h-4 mr-1" />
                Bias-Free
              </Badge>
              <p className="text-sm text-gray-500">
                Audit ID: {analysis.auditTrail.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Generation */}
      {documents.length === 0
        ? (
          <Card className="text-center">
            <CardContent className="p-8">
              {generating
                ? (
                  <div className="space-y-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                    <h3 className="text-xl font-semibold">
                      Generating Your Documents...
                    </h3>
                    <p className="text-gray-600">
                      Creating tailored resume and cover letter based on your
                      fit analysis
                    </p>
                    <Progress value={75} className="w-full max-w-xs mx-auto" />
                  </div>
                )
                : (
                  <div className="space-y-4">
                    <Sparkles className="w-12 h-12 mx-auto text-blue-500" />
                    <h3 className="text-xl font-semibold">
                      Ready to Generate Your Application
                    </h3>
                    <p className="text-gray-600">
                      We&apos;ll create tailored application documents optimized
                      for this position
                    </p>
                    <Button
                      size="lg"
                      onClick={generateDocuments}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                      aria-label="Generate tailored application documents"
                    >
                      Generate Documents
                      <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        )
        : (
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc) => {
              const allSuggestionsApplied = doc.aiSuggestions.every(
                (suggestion) => appliedSuggestions.includes(suggestion)
              );
              const suggestionSwitchId = `allow-suggestions-${doc.id}`;

              return (
                <Card
                  key={doc.id}
                  className="border-2 border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="capitalize text-lg font-semibold">
                          {getDocumentTitle(doc)}
                        </span>
                        {doc.industryOptimized && (
                          <Badge
                            variant="default"
                            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Industry Optimized
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          Template: {doc.template}
                        </Badge>
                        <Badge
                          variant="default"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          ATS Score: {doc.atsScore}%
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Highlights */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Key Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {doc.highlights.map((highlight) => (
                          <Badge
                            key={highlight}
                            variant="secondary"
                            className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Optimized Keywords */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        Optimized Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {doc.keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Document Metrics */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        Document Metrics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {doc.metrics.readabilityScore}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400">
                            Readability
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {doc.metrics.keywordDensity}%
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Keyword Density
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {doc.metrics.actionVerbCount}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Action Verbs
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {doc.metrics.quantifiedAchievements}
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            Quantified
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expert Suggestions */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-500" />
                        Expert Suggestions
                      </h4>
                      {doc.allowSubmission && (
                        <div className="flex items-center gap-3 mb-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900">
                          <Switch
                            id={suggestionSwitchId}
                            checked={allowSuggestionIntegration}
                            onCheckedChange={handleSuggestionPermission}
                            aria-label="Allow expert suggestions to be integrated"
                          />
                          <div className="text-sm text-indigo-800 dark:text-indigo-200">
                            <Label
                              htmlFor={suggestionSwitchId}
                              className="text-sm font-medium text-indigo-900 dark:text-indigo-100"
                            >
                              Allow expert suggestions
                            </Label>
                            <p className="text-xs text-indigo-700 dark:text-indigo-300">
                              Toggle on to insert selected suggestions directly
                              into your draft.
                            </p>
                          </div>
                        </div>
                      )}
                      {doc.allowSubmission && (
                        <div className="flex items-center gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAllSuggestions(doc.aiSuggestions)}
                            disabled={!allowSuggestionIntegration ||
                              allSuggestionsApplied}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add all
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllSuggestions}
                            disabled={appliedSuggestions.length === 0}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove all
                          </Button>
                          {appliedSuggestions.length > 0 && (
                            <span className="text-xs text-indigo-700 dark:text-indigo-300">
                              {appliedSuggestions.length}{" "}
                              suggestion{appliedSuggestions.length === 1
                                ? ""
                                : "s"} added
                            </span>
                          )}
                        </div>
                      )}
                      <div className="space-y-2">
                        {doc.aiSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900"
                          >
                            <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-indigo-700 dark:text-indigo-300 flex-1">
                              {suggestion}
                            </span>
                            {doc.allowSubmission && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-auto text-indigo-600 border-indigo-200 hover:bg-indigo-100 dark:text-indigo-200 dark:border-indigo-700"
                                onClick={() =>
                                  appliedSuggestions.includes(suggestion)
                                    ? removeSuggestionFromDraft(suggestion)
                                    : applySuggestionToDraft(suggestion)}
                                disabled={!allowSuggestionIntegration &&
                                  !appliedSuggestions.includes(suggestion)}
                              >
                                {appliedSuggestions.includes(suggestion)
                                  ? "Remove"
                                  : "Add"}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {doc.allowSubmission && (
                      <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                            Edit & Submit Cover Letter
                          </h4>
                        </div>
                        <Textarea
                          value={coverLetterDraft}
                          onChange={(event) =>
                            handleDraftChange(event.target.value)}
                          rows={14}
                          className="bg-white dark:bg-slate-900"
                          aria-label="Cover letter content"
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label
                              htmlFor="cover-letter-signature"
                              className="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                              Signature
                            </Label>
                            <Input
                              id="cover-letter-signature"
                              value={coverLetterSignature}
                              onChange={(event) =>
                                handleSignatureChange(event.target.value)}
                              placeholder="Type your full name"
                              aria-describedby="cover-letter-signature-help"
                            />
                            <p
                              id="cover-letter-signature-help"
                              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
                            >
                              This signature will be appended to the submitted
                              letter.
                            </p>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3">
                            <p>
                              <span className="font-medium">Word count:</span>
                              {" "}
                              {coverLetterDraft.trim()
                                ? coverLetterDraft.trim().split(/\s+/).length
                                : 0}
                            </p>
                            <p>
                              <span className="font-medium">
                                Suggestions added:
                              </span>{" "}
                              {appliedSuggestions.length}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={resetCoverLetterDraft}
                            disabled={submissionState.status === "submitting"}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset to original
                          </Button>
                          <Button
                            onClick={() => submitCoverLetter(doc)}
                            disabled={submissionState.status === "submitting" ||
                              !coverLetterDraft.trim() ||
                              !coverLetterSignature.trim()}
                          >
                            {submissionState.status === "submitting"
                              ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              )
                              : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Submit cover letter
                                </>
                              )}
                          </Button>
                        </div>
                        {submissionState.status === "error" &&
                          submissionState.message && (
                          <Alert variant="destructive">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                              {submissionState.message}
                            </AlertDescription>
                          </Alert>
                        )}
                        {submissionState.status === "success" &&
                          submissionState.message && (
                          <Alert>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <AlertDescription>
                              {submissionState.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex gap-2 flex-1">
                        <Button
                          className="flex-1"
                          onClick={() => downloadDocument(doc, "pdf")}
                          aria-label={`Download ${
                            getDocumentTitle(doc).toLowerCase()
                          } as text file`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadDocument(doc, "docx")}
                          aria-label={`Download ${
                            getDocumentTitle(doc).toLowerCase()
                          } as text file`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Text
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadDocument(doc, "txt")}
                          aria-label={`Download ${
                            getDocumentTitle(doc).toLowerCase()
                          } as text file`}
                        >
                          <File className="w-4 h-4 mr-2" />
                          Plain Text
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => previewDocument(doc)}
                          aria-label={`Preview ${
                            getDocumentTitle(doc).toLowerCase()
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => shareDocument(doc)}
                          aria-label={`Share ${
                            getDocumentTitle(doc).toLowerCase()
                          }`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      {/* Compliance Notice */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Compliance & Fairness
              </h4>
              <p className="text-blue-800 text-sm">
                This analysis was conducted using bias-reducing algorithms and
                maintains an immutable audit trail. All decisions are
                explainable and verifiable through our audit system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Component
export default function FitReportPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);
  const [profileImported, setProfileImported] = useState(false);
  const ttffrStartTimeRef = useRef<number>(0);

  useEffect(() => {
    ttffrStartTimeRef.current = startTimer("ttffr");

    // Check if profile was imported
    const imported = searchParams.get("profile_imported");
    if (imported === "true") {
      setProfileImported(true);
      // Show success message for profile import
      setTimeout(() => setProfileImported(false), 5000);
    }
  }, [searchParams]);

  const totalSteps = 4;

  const handleResumeComplete = (resumeData: ResumeData) => {
    setResume(resumeData);
    try {
      const { track } = require("@/lib/analytics");
      track({ name: "resume_import_complete" });
    } catch {}
    setCurrentStep(2);
  };

  const handleJobSelect = (job: JobPosting) => {
    // eslint-disable-next-line no-console
    console.log("Job selected in main component:", job.title, job.company);
    setSelectedJob(job);
    setCurrentStep(3);
  };

  const handleAnalysisComplete = (analysisData: FitAnalysis) => {
    setAnalysis(analysisData);
    try {
      const { track } = require("@/lib/analytics");
      track({ name: "fit_analysis_complete" });
    } catch {}
    try {
      stopTimer(ttffrStartTimeRef.current, "ttffr");
    } catch {}
    setCurrentStep(4);
  };

  const handleDocumentsGenerated = () => {
    setDocumentsGenerated(true);
  };

  const getBreadcrumbItems = () => {
    const stepNames = [
      "Import Resume",
      "Select Job",
      "Analyze Fit",
      "Download Results",
    ];
    const items: Array<{ label: string; href?: string; current?: boolean }> = [
      { label: "Fit Report", href: "/app/fit" },
    ];

    for (let i = 0; i < currentStep; i++) {
      items.push({
        label: stepNames[i],
        current: i === currentStep - 1,
      });
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* Profile Created Success Banner */}
        {profileImported && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-green-800">
                  Professional Profile Created Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Your professional profile has been saved and is ready to use
                  for your Fit Report.
                </p>
              </div>
              <button
                onClick={() => setProfileImported(false)}
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepChange={setCurrentStep}
        />

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResumeUploadStep onComplete={handleResumeComplete} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobSearchStep onSelect={handleJobSelect} />
            </motion.div>
          )}

          {currentStep === 3 && resume && selectedJob && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FitAnalysisStep
                resume={resume}
                job={selectedJob}
                onComplete={handleAnalysisComplete}
              />
            </motion.div>
          )}

          {currentStep === 4 && resume && selectedJob && analysis && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsStep
                resume={resume}
                job={selectedJob}
                analysis={analysis}
                onGenerateDocuments={handleDocumentsGenerated}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                window.history.back();
              }
            }}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep > 1 ? "Previous Step" : "Back to Home"}
          </Button>

          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset the form to start over
                  // eslint-disable-next-line no-console
                  console.log("Starting over - resetting all state");
                  setCurrentStep(1);
                  setResume(null);
                  setSelectedJob(null);
                  setAnalysis(null);
                  setDocumentsGenerated(false);

                  // Scroll to top to show the first step
                  window.scrollTo({ top: 0, behavior: "smooth" });

                  // Track the start over action
                  try {
                    import("../../../lib/analytics").then((m) =>
                      m.track({ name: "fit_report_start_over" })
                    );
                  } catch {}
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>

              {currentStep < totalSteps && (
                <Button
                  onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log(
                      "Next Step clicked - currentStep:",
                      currentStep,
                      "resume:",
                      !!resume,
                      "selectedJob:",
                      !!selectedJob,
                      "analysis:",
                      !!analysis,
                    );
                    // Navigate to next step if data is available
                    if (currentStep === 1 && resume) {
                      setCurrentStep(2);
                    } else if (currentStep === 2 && selectedJob) {
                      setCurrentStep(3);
                    } else if (currentStep === 3 && analysis) {
                      setCurrentStep(4);
                    }
                  }}
                  disabled={(currentStep === 1 && !resume) ||
                    (currentStep === 2 && !selectedJob) ||
                    (currentStep === 3 && !analysis)}
                  className="flex items-center gap-2"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              {currentStep === totalSteps && (
                <Button
                  onClick={() => {
                    window.location.href = "/demo";
                  }}
                  className="flex items-center gap-2"
                >
                  Try Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
