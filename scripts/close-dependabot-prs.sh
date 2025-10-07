#!/bin/bash

# Script to close all existing Dependabot PRs
# This allows Dependabot to create fresh PRs that will be properly handled

set -e

echo "🔧 Closing existing Dependabot PRs..."

# Get all open Dependabot PRs
prs=$(gh pr list --author "dependabot[bot]" --state open --json number,title,headRefName)

# Close each PR with a comment explaining why
echo "$prs" | jq -r '.[] | "\(.number):\(.title)"' | while IFS=':' read -r pr_number pr_title; do
    echo "📦 Closing PR #$pr_number: $pr_title"
    
    # Add a comment explaining why we're closing the PR
    gh pr comment $pr_number --body "🔧 **Closing this PR to implement proper Dependabot workflow**

This PR is being closed as part of implementing a proper Dependabot workflow that:
- Prevents Dependabot branches from being deployed directly
- Ensures all dependency updates are merged into main first
- Automatically merges PRs after they pass CI checks

Dependabot will create a new PR for these updates that will be properly handled by our new workflow.

**Changes made:**
- Added Vercel configuration to prevent deployments from \`dependabot/*\` branches
- Updated Dependabot configuration with proper labels and reviewers
- Added auto-merge workflow for PRs that pass CI checks

Thank you for your patience! 🚀"
    
    # Close the PR
    gh pr close $pr_number --delete-branch
    
    echo "✅ Closed PR #$pr_number"
    sleep 1  # Brief pause between operations
done

echo "🎉 All existing Dependabot PRs have been closed!"
echo ""
echo "📋 Next steps:"
echo "1. Dependabot will create new PRs for dependency updates"
echo "2. New PRs will be automatically merged after passing CI checks"
echo "3. No more direct deployments from Dependabot branches"
echo "4. All updates will go through the proper main branch workflow"
