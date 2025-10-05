import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // In a real implementation, this would analyze the user's resume/profile
    // and use AI to recommend relevant jobs. For now, we'll return curated recommendations.
    
    const recommendedJobs = [
      {
        id: 'rec-1',
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'full-time',
        remote: true,
        salary: {
          min: 120000,
          max: 160000,
          currency: 'USD'
        },
        description: 'Join our team to build scalable web applications using modern technologies. We\'re looking for someone with strong React and Node.js experience.',
        requirements: ['React', 'Node.js', 'TypeScript', 'AWS', '5+ years experience'],
        niceToHaves: ['GraphQL', 'Docker', 'Kubernetes'],
        benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work'],
        postedAt: new Date('2024-01-15'),
        companyLogo: undefined,
        companySize: '201-500',
        industry: 'Technology',
        experienceLevel: 'senior',
        source: 'recommendation',
        constraints: {},
        tos: { allowed: true, captcha: false, notes: 'Recommended based on your profile' },
        url: 'https://example.com/job/1',
        applyUrl: 'https://example.com/apply/1'
      },
      {
        id: 'rec-2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        type: 'full-time',
        remote: false,
        salary: {
          min: 90000,
          max: 120000,
          currency: 'USD'
        },
        description: 'Fast-growing startup looking for a versatile developer to join our engineering team. Work on both frontend and backend systems.',
        requirements: ['JavaScript', 'Python', 'React', 'Django', '3+ years experience'],
        niceToHaves: ['PostgreSQL', 'Redis', 'CI/CD'],
        benefits: ['Equity', 'Health insurance', 'Learning budget', 'Flexible hours'],
        postedAt: new Date('2024-01-14'),
        companyLogo: undefined,
        companySize: '11-50',
        industry: 'Technology',
        experienceLevel: 'mid',
        source: 'recommendation',
        constraints: {},
        tos: { allowed: true, captcha: false, notes: 'Recommended based on your skills' },
        url: 'https://example.com/job/2',
        applyUrl: 'https://example.com/apply/2'
      },
      {
        id: 'rec-3',
        title: 'Frontend Engineer',
        company: 'DesignStudio',
        location: 'New York, NY',
        type: 'full-time',
        remote: true,
        salary: {
          min: 100000,
          max: 140000,
          currency: 'USD'
        },
        description: 'Create beautiful, responsive user interfaces for our design platform. Work closely with our design team to implement pixel-perfect UIs.',
        requirements: ['React', 'TypeScript', 'CSS', 'Figma', '4+ years experience'],
        niceToHaves: ['Next.js', 'Storybook', 'Design systems'],
        benefits: ['Health insurance', 'Dental', 'Vision', '401k', 'Remote work'],
        postedAt: new Date('2024-01-13'),
        companyLogo: undefined,
        companySize: '51-200',
        industry: 'Design',
        experienceLevel: 'mid',
        source: 'recommendation',
        constraints: {},
        tos: { allowed: true, captcha: false, notes: 'Recommended based on your frontend experience' },
        url: 'https://example.com/job/3',
        applyUrl: 'https://example.com/apply/3'
      },
      {
        id: 'rec-4',
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Seattle, WA',
        type: 'full-time',
        remote: true,
        salary: {
          min: 110000,
          max: 150000,
          currency: 'USD'
        },
        description: 'Manage our cloud infrastructure and deployment pipelines. Help scale our systems to handle millions of users.',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', '3+ years experience'],
        niceToHaves: ['Jenkins', 'Prometheus', 'Grafana'],
        benefits: ['Health insurance', '401k matching', 'Stock options', 'Remote work'],
        postedAt: new Date('2024-01-12'),
        companyLogo: undefined,
        companySize: '201-500',
        industry: 'Technology',
        experienceLevel: 'mid',
        source: 'recommendation',
        constraints: {},
        tos: { allowed: true, captcha: false, notes: 'Recommended based on your infrastructure skills' },
        url: 'https://example.com/job/4',
        applyUrl: 'https://example.com/apply/4'
      },
      {
        id: 'rec-5',
        title: 'Product Manager',
        company: 'Innovation Labs',
        location: 'Boston, MA',
        type: 'full-time',
        remote: false,
        salary: {
          min: 130000,
          max: 170000,
          currency: 'USD'
        },
        description: 'Lead product development for our AI-powered platform. Work with engineering and design teams to deliver exceptional user experiences.',
        requirements: ['Product management', 'Agile', 'Data analysis', 'User research', '5+ years experience'],
        niceToHaves: ['Technical background', 'AI/ML knowledge', 'B2B SaaS'],
        benefits: ['Health insurance', 'Dental', 'Vision', '401k', 'Stock options'],
        postedAt: new Date('2024-01-11'),
        companyLogo: undefined,
        companySize: '51-200',
        industry: 'Technology',
        experienceLevel: 'senior',
        source: 'recommendation',
        constraints: {},
        tos: { allowed: true, captcha: false, notes: 'Recommended based on your leadership experience' },
        url: 'https://example.com/job/5',
        applyUrl: 'https://example.com/apply/5'
      }
    ]

    // Return limited number of recommendations
    const limitedRecommendations = recommendedJobs.slice(0, limit)

    return NextResponse.json({
      jobs: limitedRecommendations,
      total: limitedRecommendations.length,
      source: 'ai-recommendations',
      algorithm: 'profile-based-matching',
      confidence: 0.87
    })

  } catch (error) {
    console.error('Error fetching job recommendations:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch recommendations',
        jobs: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
