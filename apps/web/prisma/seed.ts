import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo tenant first
  const demoTenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: {},
    create: {
      id: 'demo-tenant',
      name: 'Demo Tenant',
      plan: 'pro',
    },
  })

  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@demo.com' },
    update: {},
    create: {
      email: 'candidate@demo.com',
      tenantId: 'demo-tenant',
    },
  })

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      email: 'employer@demo.com',
      tenantId: 'demo-tenant',
    },
  })

  // Create candidate profile
  const candidateProfile = await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {},
    create: {
      userId: candidateUser.id,
      tenantId: 'demo-tenant',
      preferences: {
        name: 'Demo Candidate',
        title: 'Senior Product Manager',
        summary: 'Experienced product manager with a track record of successful launches',
      },
    },
  })

  // Create a demo job
  const job = await prisma.job.upsert({
    where: { id: 'demo-job' },
    update: {},
    create: {
      id: 'demo-job',
      source: 'demo',
      org: 'Demo Company',
      title: 'Senior Product Manager',
      location: 'San Francisco, CA',
      workType: 'hybrid',
      description: 'We are looking for a senior product manager to lead our product strategy.',
      requirements: {
        must_have: ['5+ years product management experience', 'Strong analytical skills'],
        preferred: ['MBA degree', 'Technical background']
      },
      pay: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Demo users created:')
  console.log(`   - Candidate: ${candidateUser.email}`)
  console.log(`   - Employer: ${employerUser.email}`)
  console.log(`   - Job: ${job.title} at ${job.org}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })