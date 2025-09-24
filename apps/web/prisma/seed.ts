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

  // Create candidate target
  const candidateTarget = await prisma.target.create({
    data: {
      userId: candidateUser.id,
      title: "Senior Software Engineer",
      role: "Software Engineer",
      companyHint: "Tech Company",
      layout: "REPORT",
      rubricJson: {
        skills: ["JavaScript", "React", "Node.js"],
        experience: "5+ years",
        education: "Bachelor's degree"
      }
    }
  })

  // Create candidate proof
  const candidateProof = await prisma.proof.create({
    data: {
      userId: candidateUser.id,
      targetId: candidateTarget.id,
      title: "Built scalable web application",
      summary: "Developed a full-stack web application serving 10,000+ users",
      kind: "achievement",
      artifacts: [
        {
          type: "portfolio",
          title: "Project Demo",
          url: "https://example.com/demo"
        }
      ]
    }
  })

  // Create target-proof weight
  const targetProofWeight = await prisma.targetProofWeight.create({
    data: {
      targetId: candidateTarget.id,
      proofId: candidateProof.id,
      weight: 1.0
    }
  })

         // Create system health record
         await prisma.systemHealth.create({
           data: {
             status: 'healthy',
             message: 'System initialized successfully',
             metadata: {
               version: '1.0.0',
               initialized_at: new Date().toISOString()
             }
           }
         })

         console.log('✅ Database seeded successfully!')
         console.log('👤 Demo users created:')
         console.log(`   - Candidate: ${candidateUser.email}`)
         console.log(`   - Employer: ${employerUser.email}`)
         console.log(`   - Job: ${job.title} at ${job.org}`)
         console.log(`   - Target: ${candidateTarget.title}`)
         console.log(`   - Proof: ${candidateProof.title}`)
         console.log('🏥 System health record created')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })