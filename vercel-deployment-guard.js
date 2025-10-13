#!/usr/bin/env node

// Vercel Ignore Build Step: only allow deployments from `main`
// Blocks dependabot and any non-main branches for both Preview and Production

const branch = process.env.VERCEL_GIT_COMMIT_REF || ''
const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || ''
const isDependabot = author === 'dependabot[bot]' || branch.startsWith('dependabot/')

if (branch !== 'main' || isDependabot) {
  console.log(`[vercel-deployment-guard] Skipping build. Allowed branch: "main". Got: "${branch}" (author: ${author || 'unknown'})`)
  process.exit(1) // non-zero exit => Vercel skips build
}

console.log(`[vercel-deployment-guard] Proceeding with build for branch: ${branch}`)
process.exit(0)

#!/usr/bin/env node

// Vercel Deployment Guard
// This script prevents deployments from unwanted branches

const branch = process.env.VERCEL_GIT_COMMIT_REF;
const allowedBranches = ['main'];

console.log(`🔍 Checking deployment for branch: ${branch}`);

if (!branch) {
  console.error('❌ No branch information available');
  process.exit(1);
}

if (branch.startsWith('dependabot/')) {
  console.error('❌ Dependabot branches are not allowed for deployment');
  process.exit(1);
}

if (branch.startsWith('feature/') || 
    branch.startsWith('hotfix/') || 
    branch.startsWith('release/') || 
    branch.startsWith('test/') || 
    branch.startsWith('experimental/') || 
    branch.startsWith('dev/') || 
    branch.startsWith('development/') || 
    branch.startsWith('temp/') || 
    branch.startsWith('temporary/')) {
  console.error(`❌ Branch ${branch} is not allowed for deployment`);
  process.exit(1);
}

if (!allowedBranches.includes(branch)) {
  console.error(`❌ Branch ${branch} is not in the allowed list: ${allowedBranches.join(', ')}`);
  process.exit(1);
}

console.log(`✅ Branch ${branch} is allowed for deployment`);
process.exit(0);
