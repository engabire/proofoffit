#!/usr/bin/env node

// Vercel Deployment Guard
// Return code 0 => skip build, any other => proceed (per Vercel docs)

const branch = process.env.VERCEL_GIT_COMMIT_REF || ''
const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || ''

const allowedBranches = new Set(['main'])
const blockedPrefixes = [
  'dependabot/',
  'feature/',
  'hotfix/',
  'release/',
  'test/',
  'experimental/',
  'dev/',
  'development/',
  'temp/',
  'temporary/'
]

const isDependabotAuthor = author === 'dependabot[bot]'
const hasBlockedPrefix = blockedPrefixes.some((prefix) =>
  branch.startsWith(prefix)
)
const missingBranch = branch.length === 0

console.log(`[vercel-deployment-guard] Checking branch "${branch || 'unknown'}"`)

if (missingBranch) {
  console.log('[vercel-deployment-guard] No branch info, skipping deployment')
  process.exit(0)
}

if (isDependabotAuthor || hasBlockedPrefix) {
  console.log(
    `[vercel-deployment-guard] Skipping deployment for blocked branch "${branch}"`
  )
  process.exit(0)
}

if (!allowedBranches.has(branch)) {
  console.log(
    `[vercel-deployment-guard] Skipping deployment, only ${[
      ...allowedBranches
    ].join(', ')} allowed`
  )
  process.exit(0)
}

console.log(
  `[vercel-deployment-guard] ${branch} allowed, continuing build execution`
)
process.exit(1)
