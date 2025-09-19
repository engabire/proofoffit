import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@demo.com' },
    update: {},
    create: {
      id: 'demo-candidate-user',
      email: 'candidate@demo.com',
      plan: 'PRO',
    },
  })

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      id: 'demo-employer-user',
      email: 'employer@demo.com',
      plan: 'PREMIUM',
    },
  })

  console.log('✅ Created users:', candidateUser.email, employerUser.email)

  // Create sample proofs
  const proofs = [
    {
      userId: candidateUser.id,
      title: 'React Dashboard Project',
      kind: 'project' as const,
      url: 'https://github.com/demo/react-dashboard',
      summary: 'Led development of React-based dashboard serving 10,000+ daily active users',
    },
    {
      userId: candidateUser.id,
      title: 'TypeScript Migration',
      kind: 'metric' as const,
      url: 'https://github.com/demo/typescript-migration',
      summary: 'Implemented TypeScript across 5 microservices, reducing runtime errors by 40%',
    },
    {
      userId: candidateUser.id,
      title: 'Team Leadership Experience',
      kind: 'project' as const,
      summary: 'Managed team of 8 engineers using Agile methodologies and CI/CD pipelines',
    },
    {
      userId: candidateUser.id,
      title: 'Published Research Paper',
      kind: 'publication' as const,
      url: 'https://doi.org/10.1000/182',
      summary: 'Co-authored research paper on software engineering best practices',
    },
  ]

  for (const proof of proofs) {
    await prisma.proof.create({
      data: proof,
    })
  }

  console.log('✅ Created sample proofs')

  // Create sample targets
  const target = await prisma.target.create({
    data: {
      userId: candidateUser.id,
      title: 'Senior Frontend Developer',
      role: 'Frontend Engineer',
      companyHint: 'TechCorp Inc.',
      layout: 'REPORT',
      rubricJson: {
        requirements: [
          'React experience',
          'TypeScript proficiency',
          'Team leadership',
          '5+ years experience',
        ],
      },
    },
  })

  console.log('✅ Created sample target')

  // Create target-proof weights
  const allProofs = await prisma.proof.findMany({
    where: { userId: candidateUser.id },
  })

  for (const proof of allProofs) {
    await prisma.targetProofWeight.create({
      data: {
        targetId: target.id,
        proofId: proof.id,
        weight: Math.floor(Math.random() * 5) + 1, // Random weight 1-5
      },
    })
  }

  console.log('✅ Created target-proof weights')

  // Create sample audit link
  const auditLink = await prisma.auditLink.create({
    data: {
      userId: candidateUser.id,
      targetId: target.id,
      token: 'demo-token-123456789',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      maxViews: 100,
      watermark: true,
    },
  })

  console.log('✅ Created sample audit link')

  // Create sample analytics events
  const events = [
    {
      userId: candidateUser.id,
      targetId: target.id,
      eventType: 'target_created',
      metadata: { targetTitle: target.title },
    },
    {
      userId: candidateUser.id,
      targetId: target.id,
      eventType: 'audit_link_created',
      metadata: { linkId: auditLink.id },
    },
    {
      targetId: target.id,
      eventType: 'audit_view',
      metadata: { viewerHash: 'demo-viewer-hash' },
    },
  ]

  for (const event of events) {
    await prisma.analyticsEvent.create({
      data: event,
    })
  }

  console.log('✅ Created sample analytics events')

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