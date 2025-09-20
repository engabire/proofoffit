import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo tenants
  const candidateTenant = await prisma.tenant.upsert({
    where: { id: 'demo-candidate-tenant' },
    update: {},
    create: {
      id: 'demo-candidate-tenant',
      name: 'Demo Candidate Tenant',
      plan: 'pro',
    },
  })

  const employerTenant = await prisma.tenant.upsert({
    where: { id: 'demo-employer-tenant' },
    update: {},
    create: {
      id: 'demo-employer-tenant',
      name: 'Demo Employer Tenant',
      plan: 'team',
    },
  })

  // Create demo users
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@demo.com' },
    update: {},
    create: {
      id: 'demo-candidate-user',
      tenantId: candidateTenant.id,
      email: 'candidate@demo.com',
      role: 'candidate',
    },
  })

  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      id: 'demo-employer-user',
      tenantId: employerTenant.id,
      email: 'employer@demo.com',
      role: 'employer',
    },
  })

  console.log('✅ Created tenants and users:', candidateUser.email, employerUser.email)

  // TODO: Add more seed data when additional models are available (proofs, targets, etc.)

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