import fs from 'node:fs/promises'
import path from 'node:path'

type NonprofitAttachment = {
  accountId: string
  eligibilityId: string
  addendumPath?: string
  donorAgreementPath?: string
}

const DEFAULT_ADDENDUM = path.resolve('legal/nonprofit-addendum.md')
const DEFAULT_DONOR = path.resolve('legal/donor-agreement.md')

export async function applyNonprofitAddendum({
  accountId,
  eligibilityId,
  addendumPath = DEFAULT_ADDENDUM,
  donorAgreementPath = DEFAULT_DONOR,
}: NonprofitAttachment) {
  const [addendum, donorAgreement] = await Promise.all([
    fs.readFile(addendumPath, 'utf-8'),
    fs.readFile(donorAgreementPath, 'utf-8'),
  ])

  // TODO: replace with CRM / billing API call to store rendered documents.
  console.info(`Prepared nonprofit documents for ${accountId} (eligibility ${eligibilityId}).`)
  return {
    addendum,
    donorAgreement,
  }
}

if (require.main === module) {
  const accountId = process.argv[2]
  const eligibilityId = process.argv[3]

  if (!accountId || !eligibilityId) {
    console.error('Usage: ts-node scripts/apply_addendum.ts <accountId> <eligibilityId>')
    process.exit(1)
  }

  applyNonprofitAddendum({ accountId, eligibilityId })
    .then(() => console.info('Nonprofit addendum bundle ready for upload.'))
    .catch((error) => {
      console.error('Failed to prepare nonprofit documents', error)
      process.exit(1)
    })
}
