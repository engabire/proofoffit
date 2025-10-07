#!/bin/bash

# Script to merge Dependabot PRs systematically
# This script prioritizes security updates and merges them in a safe order

set -e

echo "🔧 Starting Dependabot PR merge process..."

# Function to merge a PR with error handling
merge_pr() {
    local pr_number=$1
    local pr_title=$2
    
    echo "📦 Merging PR #$pr_number: $pr_title"
    
    # Check if PR is mergeable
    if gh pr view $pr_number --json mergeable | jq -r '.mergeable' | grep -q "true"; then
        # Merge the PR
        gh pr merge $pr_number --squash --delete-branch
        echo "✅ Successfully merged PR #$pr_number"
        return 0
    else
        echo "❌ PR #$pr_number is not mergeable, skipping"
        return 1
    fi
}

# Priority 1: Security updates (most critical)
echo "🔒 Processing security updates..."
security_prs=(
    "20:security-updates"
    "7:codecov-action"
)

for pr_info in "${security_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 2  # Brief pause between merges
    fi
done

# Priority 2: GitHub Actions updates (CI/CD infrastructure)
echo "⚙️ Processing GitHub Actions updates..."
actions_prs=(
    "6:setup-node"
    "5:github-script"
    "4:download-artifact"
    "3:checkout"
)

for pr_info in "${actions_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 2
    fi
done

# Priority 3: Development dependencies (types, testing)
echo "🧪 Processing development dependencies..."
dev_prs=(
    "22:types-node"
    "17:types-react-dom"
    "14:types-jest"
    "11:jest-environment-jsdom"
)

for pr_info in "${dev_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 2
    fi
done

# Priority 4: UI and styling dependencies
echo "🎨 Processing UI dependencies..."
ui_prs=(
    "16:tailwindcss"
    "12:framer-motion"
)

for pr_info in "${ui_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 2
    fi
done

# Priority 5: Runtime dependencies (more careful with these)
echo "🚀 Processing runtime dependencies..."
runtime_prs=(
    "13:next-intl"
    "10:sonner"
    "9:stripe"
)

for pr_info in "${runtime_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 3  # Longer pause for runtime deps
    fi
done

# Priority 6: Bulk dependency updates (process these last)
echo "📦 Processing bulk dependency updates..."
bulk_prs=(
    "24:all-dependencies-root"
    "21:all-dependencies-ui"
)

for pr_info in "${bulk_prs[@]}"; do
    IFS=':' read -r pr_number pr_type <<< "$pr_info"
    if gh pr view $pr_number --json state | jq -r '.state' | grep -q "OPEN"; then
        pr_title=$(gh pr view $pr_number --json title | jq -r '.title')
        merge_pr $pr_number "$pr_title"
        sleep 5  # Longer pause for bulk updates
    fi
done

echo "🎉 Dependabot PR merge process completed!"
echo "📊 Summary:"
echo "- Security updates: Merged"
echo "- GitHub Actions: Merged"
echo "- Development deps: Merged"
echo "- UI dependencies: Merged"
echo "- Runtime deps: Merged"
echo "- Bulk updates: Merged"

echo ""
echo "⚠️  Important:"
echo "1. Monitor the main branch for any build failures"
echo "2. Test the application thoroughly after these updates"
echo "3. The new Vercel configuration will prevent future Dependabot deployments"
echo "4. Future Dependabot PRs will be auto-merged after passing CI checks"
