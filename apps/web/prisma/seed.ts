import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: {},
    create: {
      id: 'demo-tenant',
      name: 'Demo Organization',
      plan: 'pro',
    },
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create demo users
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@demo.com' },
    update: {},
    create: {
      id: 'demo-candidate-user',
      tenantId: tenant.id,
      email: 'candidate@demo.com',
      role: 'candidate',
      locale: 'en',
    },
  })

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      id: 'demo-employer-user',
      tenantId: tenant.id,
      email: 'employer@demo.com',
      role: 'employer',
      locale: 'en',
    },
  })

  console.log('✅ Created users:', candidateUser.email, employerUser.email)

  // Create candidate profile
  const candidateProfile = await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {},
    create: {
      id: 'demo-candidate-profile',
      tenantId: tenant.id,
      userId: candidateUser.id,
      preferences: {
        workType: ['remote', 'hybrid'],
        location: ['San Francisco', 'New York', 'Remote'],
        salaryRange: { min: 80000, max: 150000 },
        industries: ['Technology', 'Healthcare', 'Finance'],
      },
      contactPolicy: {
        allowDirectContact: true,
        preferredMethod: 'email',
        availability: 'business_hours',
      },
    },
  })

  console.log('✅ Created candidate profile')

  // Create sample bullets
  const bullets = [
    {
      candidateId: candidateProfile.id,
      text: 'Led development of React-based dashboard serving 10,000+ daily active users',
      tags: {
        criterion: 'frontend_development',
        evidence_type: 'result',
        metric: 10000,
        scope: 'daily_active_users',
        tool: 'React',
      },
    },
    {
      candidateId: candidateProfile.id,
      text: 'Implemented TypeScript across 5 microservices, reducing runtime errors by 40%',
      tags: {
        criterion: 'typescript',
        evidence_type: 'result',
        metric: 40,
        scope: 'error_reduction',
        tool: 'TypeScript',
      },
    },
    {
      candidateId: candidateProfile.id,
      text: 'Managed team of 8 engineers using Agile methodologies and CI/CD pipelines',
      tags: {
        criterion: 'team_leadership',
        evidence_type: 'method',
        metric: 8,
        scope: 'team_size',
        tool: 'Agile',
      },
    },
  ]

  for (const bullet of bullets) {
    await prisma.bullet.create({
      data: bullet,
    })
  }

  console.log('✅ Created candidate bullets')

  // Create sample jobs
  const jobs = [
    {
      id: 'demo-job-1',
      source: 'usajobs',
      org: 'TechCorp Inc.',
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      workType: 'hybrid',
      pay: { min: 120000, max: 160000, currency: 'USD' },
      description: 'We are looking for a senior frontend developer to join our growing team...',
      requirements: {
        must_have: ['React', 'TypeScript', '5+ years experience'],
        preferred: ['Next.js', 'GraphQL', 'Team leadership'],
      },
      constraints: {
        work_auth: 'US_citizen_or_green_card',
        clearance: null,
        language: ['English'],
      },
      tos: {
        allowed: true,
        captcha: false,
        notes: 'Standard application process',
      },
    },
    {
      id: 'demo-job-2',
      source: 'reliefweb',
      org: 'Global Health Foundation',
      title: 'Software Engineer - Healthcare',
      location: 'Remote',
      workType: 'remote',
      pay: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Join our mission to improve healthcare access worldwide...',
      requirements: {
        must_have: ['JavaScript', 'Healthcare experience', '3+ years experience'],
        preferred: ['React', 'Node.js', 'International experience'],
      },
      constraints: {
        work_auth: 'any',
        clearance: null,
        language: ['English', 'French'],
      },
      tos: {
        allowed: true,
        captcha: false,
        notes: 'Non-profit organization',
      },
    },
  ]

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: job,
    })
  }

  console.log('✅ Created sample jobs')

  // Create criteria nodes
  const criteriaNodes = [
    {
      id: 'frontend_development',
      key: 'frontend_development',
      label: 'Frontend Development',
      parentId: null,
      synonyms: ['frontend', 'client-side', 'UI development'],
      meta: { category: 'technical', weight: 1.0 },
    },
    {
      id: 'typescript',
      key: 'typescript',
      label: 'TypeScript',
      parentId: 'frontend_development',
      synonyms: ['TS', 'type safety'],
      meta: { category: 'technical', weight: 0.8 },
    },
    {
      id: 'team_leadership',
      key: 'team_leadership',
      label: 'Team Leadership',
      parentId: null,
      synonyms: ['management', 'leadership', 'team lead'],
      meta: { category: 'soft_skills', weight: 0.9 },
    },
  ]

  for (const node of criteriaNodes) {
    await prisma.criteriaNode.upsert({
      where: { key: node.key },
      update: {},
      create: node,
    })
  }

  console.log('✅ Created criteria nodes')

  // Create policy sources
  const policySources = [
    {
      id: 'usajobs-policy',
      domain: 'usajobs.gov',
      allowed: true,
      captcha: false,
      notes: 'Government job board - standard application process',
      version: '1.0',
    },
    {
      id: 'reliefweb-policy',
      domain: 'reliefweb.int',
      allowed: true,
      captcha: false,
      notes: 'UN humanitarian job board - direct applications allowed',
      version: '1.0',
    },
    {
      id: 'restricted-site-policy',
      domain: 'restricted-careers.com',
      allowed: false,
      captcha: true,
      notes: 'Site requires CAPTCHA and manual application only',
      version: '1.0',
    },
  ]

  for (const policy of policySources) {
    await prisma.policySource.upsert({
      where: { domain: policy.domain },
      update: {},
      create: policy,
    })
  }

  console.log('✅ Created policy sources')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
