// Demo data for ProofOfFit.com demonstration
export const demoUser = {
  id: 'demo-user-1',
  email: 'demo@proofoffit.com',
  role: 'candidate' as const,
  tenantId: 'demo-tenant-1'
}

export const demoProfile = {
  id: 'demo-profile-1',
  userId: 'demo-user-1',
  photoUrl: null as string | null,
  preferences: {
    workType: ['remote', 'hybrid'],
    location: ['San Francisco, CA', 'New York, NY'],
    salary: { min: 80000, max: 150000 }
  },
  contactPolicy: {
    allowDirectContact: true,
    preferredMethod: 'email',
    availability: 'Business hours'
  }
}

export const demoBullets = [
  {
    id: 'bullet-1',
    text: 'Led a team of 8 engineers to deliver a React-based healthcare application that improved patient outcomes by 40%',
    tags: {
      criterion: 'Team Leadership',
      tool: 'React',
      evidence_type: 'result',
      metric: '40% improvement',
      domain: 'Healthcare'
    }
  },
  {
    id: 'bullet-2',
    text: 'Built advanced TypeScript components with 95% test coverage, reducing bugs by 60%',
    tags: {
      criterion: 'TypeScript',
      tool: 'TypeScript',
      evidence_type: 'result',
      metric: '95% coverage, 60% bug reduction'
    }
  },
  {
    id: 'bullet-3',
    text: 'Optimized application performance by 50% using React optimization techniques and code splitting',
    tags: {
      criterion: 'Performance',
      tool: 'React',
      evidence_type: 'result',
      metric: '50% performance improvement'
    }
  }
]

export const demoJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    org: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    workType: 'hybrid',
    pay: { min: 120000, max: 180000, currency: 'USD' },
    description: 'We are looking for a senior frontend developer with 5+ years of React experience and strong TypeScript skills. The role involves building modern web applications and working with cross-functional teams.',
    requirements: {
      must_have: ['React', 'TypeScript', '5+ years experience'],
      preferred: ['Healthcare domain', 'Team leadership', 'UI/UX design']
    },
    source: 'usajobs.gov',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    org: 'HealthTech Solutions',
    location: 'New York, NY',
    workType: 'remote',
    pay: { min: 100000, max: 160000, currency: 'USD' },
    description: 'Join our team to build innovative healthcare solutions using modern web technologies. We need someone with strong frontend skills and experience in healthcare applications.',
    requirements: {
      must_have: ['React', 'Node.js', 'Healthcare experience'],
      preferred: ['TypeScript', 'Cloud', 'Team collaboration']
    },
    source: 'linkedin.com',
    createdAt: new Date('2024-01-20')
  }
]

export const demoMatches = [
  {
    job: demoJobs[0],
    fitScore: 94,
    explanations: [
      {
        criterion: 'React Experience',
        evidence: '5+ years React experience',
        score: 98,
        strength: true
      },
      {
        criterion: 'TypeScript',
        evidence: 'Advanced TypeScript skills',
        score: 92,
        strength: true
      },
      {
        criterion: 'Team Leadership',
        evidence: 'Led team of 8 engineers',
        score: 89,
        strength: true
      }
    ],
    strengths: ['Strong technical background', 'Leadership experience', 'Modern tech stack'],
    gaps: ['Healthcare domain experience']
  },
  {
    job: demoJobs[1],
    fitScore: 87,
    explanations: [
      {
        criterion: 'React Experience',
        evidence: '4+ years React',
        score: 85,
        strength: true
      },
      {
        criterion: 'Healthcare Domain',
        evidence: 'Healthcare application experience',
        score: 95,
        strength: true
      },
      {
        criterion: 'TypeScript',
        evidence: 'Intermediate TypeScript',
        score: 78,
        strength: true
      }
    ],
    strengths: ['Healthcare domain experience', 'Modern tech stack'],
    gaps: ['Node.js backend experience']
  }
]

export const demoApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    job: demoJobs[0],
    status: 'submitted',
    channel: 'auto_apply',
    policyDecision: { allowed: true, captcha: false },
    documents: {
      resume: 'tailored-resume-job-1.pdf',
      coverLetter: 'cover-letter-job-1.pdf'
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    job: demoJobs[1],
    status: 'interview',
    channel: 'prep_confirm',
    policyDecision: { allowed: true, captcha: true },
    documents: {
      resume: 'tailored-resume-job-2.pdf'
    },
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-25')
  }
]

export const demoSlates = [
  {
    id: 'slate-1',
    jobId: 'job-1',
    job: demoJobs[0],
    candidates: [
      {
        id: 'candidate-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        fitScore: 94,
        explanations: [
          { criterion: 'React Experience', evidence: '6+ years React', score: 98 },
          { criterion: 'TypeScript', evidence: 'Advanced TypeScript', score: 92 },
          { criterion: 'Team Leadership', evidence: 'Led 8-person team', score: 89 }
        ],
        status: 'pending'
      },
      {
        id: 'candidate-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        fitScore: 87,
        explanations: [
          { criterion: 'React Experience', evidence: '4+ years React', score: 85 },
          { criterion: 'TypeScript', evidence: 'Intermediate TypeScript', score: 78 },
          { criterion: 'Healthcare Domain', evidence: '2 years healthcare', score: 95 }
        ],
        status: 'pending'
      }
    ],
    createdAt: new Date('2024-01-15'),
    auditUrl: 'https://audit.proofoffit.com/slates/slate-1'
  }
]

export const demoPolicySources = [
  {
    domain: 'usajobs.gov',
    allowed: true,
    captcha: false,
    notes: 'Government jobs are safe for automation',
    version: '1.0'
  },
  {
    domain: 'linkedin.com',
    allowed: true,
    captcha: true,
    notes: 'Requires CAPTCHA verification',
    version: '1.0'
  },
  {
    domain: 'indeed.com',
    allowed: false,
    captcha: true,
    notes: 'Domain not trusted for automation',
    version: '1.0'
  }
]
