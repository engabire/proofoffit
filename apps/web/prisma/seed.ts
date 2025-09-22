import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@demo.com' },
    update: {},
    create: {
      email: 'candidate@demo.com',
      plan: 'PRO',
    },
  })

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      email: 'employer@demo.com',
      plan: 'PREMIUM',
    },
  })

  const candidateTarget = await prisma.target.upsert({
    where: { id: 'demo-candidate-target' },
    update: {},
    create: {
      id: 'demo-candidate-target',
      userId: candidateUser.id,
      title: 'Senior Product Manager',
      role: 'Product Manager',
      companyHint: 'Proof of Fit',
      layout: 'REPORT',
      rubricJson: {
        summary: 'Demo rubric for evaluating product strategy work',
        competencies: [
          {
            name: 'Product Strategy',
            weight: 3,
          },
          {
            name: 'Execution',
            weight: 2,
          },
        ],
      },
    },
  })

  const candidateProof = await prisma.proof.upsert({
    where: { id: 'demo-candidate-proof' },
    update: {},
    create: {
      id: 'demo-candidate-proof',
      userId: candidateUser.id,
      title: 'Launched analytics overhaul',
      kind: 'project',
      summary: 'Led rollout of a new analytics suite that improved adoption by 45%.',
      url: 'https://example.com/demo-proof',
    },
  })

  const candidateProfile = await prisma.candidateProfile.upsert({
    where: { userId: candidateUser.id },
    update: {},
    create: {
      userId: candidateUser.id,
      preferences: {
        desiredRoles: ['Product Manager'],
        preferredLocations: ['Remote', 'Washington, D.C.'],
      },
      contactPolicy: {
        email: true,
        sms: false,
      },
    },
  })

  await prisma.bullet.upsert({
    where: { id: 'demo-bullet-1' },
    update: {
      text: 'Led a cross-functional team to ship analytics overhaul with 45% adoption gain.',
      tags: {
        criterion: 'Product Strategy',
        evidence_type: 'result',
        metric: '45% adoption lift',
      },
    },
    create: {
      id: 'demo-bullet-1',
      candidateId: candidateProfile.id,
      text: 'Led a cross-functional team to ship analytics overhaul with 45% adoption gain.',
      tags: {
        criterion: 'Product Strategy',
        evidence_type: 'result',
        metric: '45% adoption lift',
      },
    },
  })

  const demoJobId = 'usajobs-senior-product-manager-proof-of-fit'

  const job = await prisma.job.upsert({
    where: { id: demoJobId },
    update: {
      description: 'Help Proof of Fit expand product-market fit analytics across federal buyers.',
      fetchedAt: new Date(),
    },
    create: {
      id: demoJobId,
      source: 'usajobs',
      org: 'Proof of Fit',
      title: 'Senior Product Manager',
      location: 'Washington, D.C. (Hybrid)',
      workType: 'hybrid',
      description: 'Help Proof of Fit expand product-market fit analytics across federal buyers.',
      requirements: {
        must_have: ['5+ years product management experience', 'Evidence of data-driven decision making'],
        preferred: ['GovTech or civic experience'],
      },
      constraints: {
        clearance: 'Public trust eligible',
      },
      tos: {
        allowed: true,
        captcha: false,
      },
    },
  })

  await prisma.application.upsert({
    where: { id: 'demo-application' },
    update: {
      metadata: {
        jobSource: job.source,
        autoApplied: true,
      },
    },
    create: {
      id: 'demo-application',
      candidateId: candidateProfile.id,
      jobId: job.id,
      status: 'submitted',
      documents: {
        resume: 'Demo resume content for Proof of Fit role.',
        coverLetter: 'Demo cover letter content for Proof of Fit role.',
      },
      source: 'auto-apply',
      metadata: {
        jobSource: job.source,
        autoApplied: true,
      },
    },
  })

  await prisma.targetProofWeight.upsert({
    where: {
      targetId_proofId: {
        targetId: candidateTarget.id,
        proofId: candidateProof.id,
      },
    },
    update: {
      weight: 3,
    },
    create: {
      targetId: candidateTarget.id,
      proofId: candidateProof.id,
      weight: 3,
    },
  })

  console.log('✅ Seeded demo users, profiles, targets, proofs, and jobs')
  console.log('   Candidate:', candidateUser.email)
  console.log('   Employer: ', employerUser.email)

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
