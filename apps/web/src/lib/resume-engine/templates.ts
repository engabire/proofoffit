// Resume template system with industry-specific formats

export interface ResumeTemplate {
  id: string
  name: string
  industry: string[]
  description: string
  atsScore: number
  designStyle: 'classic' | 'modern' | 'creative' | 'executive' | 'technical'
  sections: ResumeSection[]
  formatting: TemplateFormatting
  sampleUrl: string
  popularity: number
  successRate: number
}

export interface ResumeSection {
  id: string
  name: string
  required: boolean
  order: number
  maxLength?: number
  formatting: SectionFormatting
  aiSuggestions: string[]
}

export interface TemplateFormatting {
  layout: 'single-column' | 'two-column' | 'sidebar'
  font: string
  fontSize: number
  margins: string
  colorScheme: 'monochrome' | 'accent' | 'professional'
  spacing: 'compact' | 'balanced' | 'spacious'
  bulletStyle: 'classic' | 'modern' | 'minimal'
}

export interface SectionFormatting {
  headerStyle: 'bold' | 'underline' | 'capslock' | 'accent'
  contentStyle: 'paragraph' | 'bullets' | 'table'
  emphasis: 'metrics' | 'keywords' | 'achievements'
}

// Industry-specific templates
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'tech-modern',
    name: 'Tech Professional',
    industry: ['technology', 'software', 'engineering', 'data'],
    description: 'Clean, modern format optimized for tech roles. Emphasizes technical skills, projects, and quantifiable achievements.',
    atsScore: 95,
    designStyle: 'modern',
    popularity: 92,
    successRate: 87,
    sampleUrl: '/templates/tech-modern.pdf',
    sections: [
      {
        id: 'header',
        name: 'Contact Information',
        required: true,
        order: 1,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include professional profile and source control activity',
          'Use professional email address',
          'Consider adding portfolio URL'
        ]
      },
      {
        id: 'summary',
        name: 'Professional Summary',
        required: true,
        order: 2,
        maxLength: 150,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'paragraph',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Lead with years of experience and specialization',
          'Include 2-3 key technical competencies',
          'Mention measurable impact or achievements'
        ]
      },
      {
        id: 'technical-skills',
        name: 'Technical Skills',
        required: true,
        order: 3,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Group by category (Languages, Frameworks, Tools)',
          'List most relevant skills first',
          'Include proficiency levels for key technologies'
        ]
      },
      {
        id: 'experience',
        name: 'Professional Experience',
        required: true,
        order: 4,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Start bullets with strong action verbs',
          'Quantify impact with metrics (%, $, scale)',
          'Focus on technical achievements and leadership'
        ]
      },
      {
        id: 'projects',
        name: 'Key Projects',
        required: false,
        order: 5,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'achievements'
        },
        aiSuggestions: [
          'Include open source contributions',
          'Highlight technologies used and impact',
          'Link to live demos or repositories'
        ]
      },
      {
        id: 'education',
        name: 'Education',
        required: true,
        order: 6,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include relevant coursework for recent grads',
          'Mention academic honors or GPA if strong',
          'Add certifications and continuing education'
        ]
      }
    ],
    formatting: {
      layout: 'single-column',
      font: 'Inter',
      fontSize: 11,
      margins: '0.75in',
      colorScheme: 'accent',
      spacing: 'balanced',
      bulletStyle: 'modern'
    }
  },
  {
    id: 'finance-executive',
    name: 'Finance Executive',
    industry: ['finance', 'banking', 'investment', 'consulting'],
    description: 'Professional, executive-level format for finance roles. Emphasizes leadership, strategic impact, and financial achievements.',
    atsScore: 93,
    designStyle: 'executive',
    popularity: 85,
    successRate: 91,
    sampleUrl: '/templates/finance-executive.pdf',
    sections: [
      {
        id: 'header',
        name: 'Executive Profile',
        required: true,
        order: 1,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include professional credentials (CFA, CPA)',
          'Add executive summary line under name',
          'Consider adding location and willingness to relocate'
        ]
      },
      {
        id: 'executive-summary',
        name: 'Executive Summary',
        required: true,
        order: 2,
        maxLength: 200,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'paragraph',
          emphasis: 'achievements'
        },
        aiSuggestions: [
          'Lead with total years in finance leadership',
          'Highlight P&L responsibility and team size',
          'Include key strategic achievements with dollar impact'
        ]
      },
      {
        id: 'core-competencies',
        name: 'Core Competencies',
        required: true,
        order: 3,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Focus on strategic and leadership competencies',
          'Include financial modeling and analysis skills',
          'Mention regulatory knowledge and compliance'
        ]
      },
      {
        id: 'professional-experience',
        name: 'Professional Experience',
        required: true,
        order: 4,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Emphasize strategic initiatives and outcomes',
          'Quantify financial impact (revenue, cost savings, ROI)',
          'Highlight team leadership and organizational change'
        ]
      },
      {
        id: 'education-credentials',
        name: 'Education & Credentials',
        required: true,
        order: 5,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Lead with highest degree and prestigious institutions',
          'Include professional certifications prominently',
          'Add continuing education and board memberships'
        ]
      }
    ],
    formatting: {
      layout: 'single-column',
      font: 'Times New Roman',
      fontSize: 11,
      margins: '1in',
      colorScheme: 'monochrome',
      spacing: 'balanced',
      bulletStyle: 'classic'
    }
  },
  {
    id: 'healthcare-clinical',
    name: 'Healthcare Clinical',
    industry: ['healthcare', 'medical', 'nursing', 'clinical'],
    description: 'Clinical format emphasizing certifications, patient care experience, and medical competencies.',
    atsScore: 94,
    designStyle: 'classic',
    popularity: 88,
    successRate: 89,
    sampleUrl: '/templates/healthcare-clinical.pdf',
    sections: [
      {
        id: 'header',
        name: 'Professional Information',
        required: true,
        order: 1,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include license numbers and state',
          'Add specialty certifications after name',
          'Include professional healthcare email'
        ]
      },
      {
        id: 'licenses-certifications',
        name: 'Licenses & Certifications',
        required: true,
        order: 2,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'List active licenses with states and numbers',
          'Include expiration dates for certifications',
          'Prioritize specialty and advanced certifications'
        ]
      },
      {
        id: 'professional-summary',
        name: 'Professional Summary',
        required: true,
        order: 3,
        maxLength: 150,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'paragraph',
          emphasis: 'achievements'
        },
        aiSuggestions: [
          'Highlight years of patient care experience',
          'Mention specialty areas and patient populations',
          'Include quality metrics and patient satisfaction'
        ]
      },
      {
        id: 'clinical-experience',
        name: 'Clinical Experience',
        required: true,
        order: 4,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Quantify patient load and care complexity',
          'Highlight specialized procedures and protocols',
          'Include quality improvement initiatives'
        ]
      },
      {
        id: 'education',
        name: 'Education',
        required: true,
        order: 5,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include clinical rotations and specializations',
          'Mention honors, scholarships, and GPA if strong',
          'Add continuing medical education hours'
        ]
      }
    ],
    formatting: {
      layout: 'single-column',
      font: 'Arial',
      fontSize: 11,
      margins: '0.75in',
      colorScheme: 'professional',
      spacing: 'compact',
      bulletStyle: 'classic'
    }
  },
  {
    id: 'creative-marketing',
    name: 'Creative Marketing',
    industry: ['marketing', 'advertising', 'design', 'creative'],
    description: 'Visually appealing format for creative roles. Balances creativity with ATS compatibility.',
    atsScore: 88,
    designStyle: 'creative',
    popularity: 79,
    successRate: 84,
    sampleUrl: '/templates/creative-marketing.pdf',
    sections: [
      {
        id: 'header',
        name: 'Creative Profile',
        required: true,
        order: 1,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include portfolio URL prominently',
          'Add social media handles if relevant',
          'Consider adding a tagline or brand statement'
        ]
      },
      {
        id: 'brand-statement',
        name: 'Brand Statement',
        required: true,
        order: 2,
        maxLength: 120,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'paragraph',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Write in first person with personality',
          'Highlight unique creative perspective',
          'Include measurable creative impact'
        ]
      },
      {
        id: 'creative-skills',
        name: 'Creative & Technical Skills',
        required: true,
        order: 3,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'bullets',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Group by creative tools and marketing skills',
          'Include both hard and soft skills',
          'Mention emerging technologies and trends'
        ]
      },
      {
        id: 'creative-experience',
        name: 'Creative Experience',
        required: true,
        order: 4,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'bullets',
          emphasis: 'achievements'
        },
        aiSuggestions: [
          'Describe creative process and outcomes',
          'Include campaign results and engagement metrics',
          'Highlight awards and recognition'
        ]
      },
      {
        id: 'portfolio-projects',
        name: 'Featured Projects',
        required: false,
        order: 5,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'bullets',
          emphasis: 'achievements'
        },
        aiSuggestions: [
          'Include links to live work or case studies',
          'Describe creative challenge and solution',
          'Quantify business impact where possible'
        ]
      },
      {
        id: 'education-awards',
        name: 'Education & Recognition',
        required: true,
        order: 6,
        formatting: {
          headerStyle: 'accent',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include relevant creative education and workshops',
          'Highlight industry awards and recognitions',
          'Mention speaking engagements and publications'
        ]
      }
    ],
    formatting: {
      layout: 'two-column',
      font: 'Calibri',
      fontSize: 10.5,
      margins: '0.5in',
      colorScheme: 'accent',
      spacing: 'spacious',
      bulletStyle: 'modern'
    }
  },
  {
    id: 'sales-professional',
    name: 'Sales Professional',
    industry: ['sales', 'business development', 'account management'],
    description: 'Results-driven format emphasizing revenue generation, relationship building, and sales achievements.',
    atsScore: 92,
    designStyle: 'modern',
    popularity: 86,
    successRate: 88,
    sampleUrl: '/templates/sales-professional.pdf',
    sections: [
      {
        id: 'header',
        name: 'Sales Professional',
        required: true,
        order: 1,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include phone number prominently',
          'Add location and territory coverage',
          'Consider adding professional sales tools'
        ]
      },
      {
        id: 'sales-summary',
        name: 'Sales Performance Summary',
        required: true,
        order: 2,
        maxLength: 150,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'paragraph',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Lead with total revenue generated or quota attainment',
          'Highlight top performer rankings and awards',
          'Include average deal size and sales cycle length'
        ]
      },
      {
        id: 'key-achievements',
        name: 'Key Sales Achievements',
        required: true,
        order: 3,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Quantify revenue, growth percentages, and quotas',
          'Include customer acquisition and retention metrics',
          'Highlight awards, rankings, and recognitions'
        ]
      },
      {
        id: 'sales-experience',
        name: 'Sales Experience',
        required: true,
        order: 4,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'metrics'
        },
        aiSuggestions: [
          'Start with revenue and quota achievement',
          'Include territory management and growth',
          'Highlight major accounts and partnerships'
        ]
      },
      {
        id: 'sales-skills',
        name: 'Sales & Technical Skills',
        required: true,
        order: 5,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'bullets',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include CRM platforms and sales tools',
          'Mention industry knowledge and certifications',
          'Add soft skills like negotiation and presentation'
        ]
      },
      {
        id: 'education',
        name: 'Education',
        required: true,
        order: 6,
        formatting: {
          headerStyle: 'bold',
          contentStyle: 'table',
          emphasis: 'keywords'
        },
        aiSuggestions: [
          'Include business-related education',
          'Add sales training and certifications',
          'Mention relevant professional development'
        ]
      }
    ],
    formatting: {
      layout: 'single-column',
      font: 'Calibri',
      fontSize: 11,
      margins: '0.75in',
      colorScheme: 'professional',
      spacing: 'balanced',
      bulletStyle: 'modern'
    }
  }
]

// Template selection logic
export function selectOptimalTemplate(
  industry: string,
  experienceLevel: string,
  roleType: string
): ResumeTemplate {
  // Filter templates by industry match
  const industryMatches = resumeTemplates.filter(template => 
    template.industry.some(ind => 
      industry.toLowerCase().includes(ind) || ind.includes(industry.toLowerCase())
    )
  )
  
  if (industryMatches.length === 0) {
    // Fallback to most popular general template
    return resumeTemplates.find(t => t.id === 'tech-modern') || resumeTemplates[0]
  }
  
  // Sort by success rate and ATS score
  const sortedTemplates = industryMatches.sort((a, b) => {
    const scoreA = (a.successRate * 0.6) + (a.atsScore * 0.4)
    const scoreB = (b.successRate * 0.6) + (b.atsScore * 0.4)
    return scoreB - scoreA
  })
  
  return sortedTemplates[0]
}

// Get template recommendations
export function getTemplateRecommendations(
  industry: string,
  currentTemplate?: string
): ResumeTemplate[] {
  const recommendations = resumeTemplates
    .filter(template => 
      template.industry.some(ind => 
        industry.toLowerCase().includes(ind) || ind.includes(industry.toLowerCase())
      )
    )
    .filter(template => template.id !== currentTemplate)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3)
  
  return recommendations.length > 0 ? recommendations : resumeTemplates.slice(0, 3)
}