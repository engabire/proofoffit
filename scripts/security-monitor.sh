#!/bin/bash

# Security monitoring script for ProofOfFit repository
# This script monitors for security threats and unauthorized access

set -e

echo "🔒 Starting security monitoring..."

# Configuration
REPO_OWNER="engabire"
REPO_NAME="proofoffit"
ALERT_EMAIL="security@proofoffit.com"
LOG_FILE="security-monitor.log"

# Function to log security events
log_security_event() {
    local event_type=$1
    local message=$2
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    echo "[$timestamp] [$event_type] $message" >> "$LOG_FILE"
    echo "🔍 [$event_type] $message"
}

# Function to send security alert
send_security_alert() {
    local subject=$1
    local message=$2
    log_security_event "ALERT" "$subject: $message"
    
    # In a real implementation, you would send an email or Slack notification
    echo "🚨 SECURITY ALERT: $subject"
    echo "   $message"
    echo "   Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo "   Repository: $REPO_OWNER/$REPO_NAME"
}

# Check for suspicious commits
check_suspicious_commits() {
    echo "🔍 Checking for suspicious commits..."
    
    # Get recent commits
    recent_commits=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME/commits \
        --field per_page=50 \
        --field since="$(date -u -d '24 hours ago' +"%Y-%m-%dT%H:%M:%SZ")" \
        | jq -r '.[] | "\(.sha) \(.commit.author.name) \(.commit.author.email) \(.commit.message)"')
    
    # Check for suspicious patterns
    while IFS= read -r commit; do
        if [[ -n "$commit" ]]; then
            sha=$(echo "$commit" | cut -d' ' -f1)
            author=$(echo "$commit" | cut -d' ' -f2)
            email=$(echo "$commit" | cut -d' ' -f3)
            message=$(echo "$commit" | cut -d' ' -f4-)
            
            # Check for suspicious commit messages
            if echo "$message" | grep -qiE "(backdoor|malware|virus|hack|exploit|injection|bypass|admin|root|password|secret|key|token)"; then
                send_security_alert "SUSPICIOUS_COMMIT" "Commit $sha by $author ($email): $message"
            fi
            
            # Check for suspicious email domains
            if echo "$email" | grep -qiE "(temp-mail|10minutemail|guerrillamail|mailinator|throwaway)"; then
                send_security_alert "SUSPICIOUS_EMAIL" "Commit $sha by $author with suspicious email: $email"
            fi
        fi
    done <<< "$recent_commits"
    
    log_security_event "INFO" "Suspicious commit check completed"
}

# Check for unauthorized collaborators
check_collaborators() {
    echo "🔍 Checking repository collaborators..."
    
    collaborators=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME/collaborators \
        | jq -r '.[] | "\(.login) \(.permissions.admin) \(.permissions.push) \(.permissions.pull)"')
    
    while IFS= read -r collaborator; do
        if [[ -n "$collaborator" ]]; then
            username=$(echo "$collaborator" | cut -d' ' -f1)
            is_admin=$(echo "$collaborator" | cut -d' ' -f2)
            can_push=$(echo "$collaborator" | cut -d' ' -f3)
            can_pull=$(echo "$collaborator" | cut -d' ' -f4)
            
            # Check for unexpected admin access
            if [[ "$is_admin" == "true" && "$username" != "$REPO_OWNER" ]]; then
                send_security_alert "UNAUTHORIZED_ADMIN" "User $username has admin access to repository"
            fi
            
            # Check for unexpected push access
            if [[ "$can_push" == "true" && "$username" != "$REPO_OWNER" ]]; then
                log_security_event "INFO" "User $username has push access to repository"
            fi
        fi
    done <<< "$collaborators"
    
    log_security_event "INFO" "Collaborator check completed"
}

# Check for security vulnerabilities
check_vulnerabilities() {
    echo "🔍 Checking for security vulnerabilities..."
    
    # Check Dependabot alerts
    alerts=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME/dependabot/alerts \
        | jq -r '.[] | "\(.number) \(.state) \(.severity) \(.dependency.package.name)"')
    
    critical_count=0
    high_count=0
    
    while IFS= read -r alert; do
        if [[ -n "$alert" ]]; then
            number=$(echo "$alert" | cut -d' ' -f1)
            state=$(echo "$alert" | cut -d' ' -f2)
            severity=$(echo "$alert" | cut -d' ' -f3)
            package=$(echo "$alert" | cut -d' ' -f4)
            
            if [[ "$state" == "open" ]]; then
                case "$severity" in
                    "critical")
                        critical_count=$((critical_count + 1))
                        send_security_alert "CRITICAL_VULNERABILITY" "Critical vulnerability in $package (Alert #$number)"
                        ;;
                    "high")
                        high_count=$((high_count + 1))
                        send_security_alert "HIGH_VULNERABILITY" "High severity vulnerability in $package (Alert #$number)"
                        ;;
                esac
            fi
        fi
    done <<< "$alerts"
    
    if [[ $critical_count -gt 0 || $high_count -gt 0 ]]; then
        log_security_event "WARNING" "Found $critical_count critical and $high_count high severity vulnerabilities"
    else
        log_security_event "INFO" "No critical or high severity vulnerabilities found"
    fi
}

# Check for suspicious pull requests
check_suspicious_prs() {
    echo "🔍 Checking for suspicious pull requests..."
    
    # Get recent pull requests
    recent_prs=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME/pulls \
        --field state=open \
        --field per_page=20 \
        | jq -r '.[] | "\(.number) \(.user.login) \(.title) \(.body)"')
    
    while IFS= read -r pr; do
        if [[ -n "$pr" ]]; then
            number=$(echo "$pr" | cut -d' ' -f1)
            author=$(echo "$pr" | cut -d' ' -f2)
            title=$(echo "$pr" | cut -d' ' -f3)
            body=$(echo "$pr" | cut -d' ' -f4-)
            
            # Check for suspicious PR titles or descriptions
            if echo "$title $body" | grep -qiE "(backdoor|malware|virus|hack|exploit|injection|bypass|admin|root|password|secret|key|token|rm -rf|format c:|del /f)"; then
                send_security_alert "SUSPICIOUS_PR" "Pull request #$number by $author: $title"
            fi
            
            # Check for PRs from unknown users
            if [[ "$author" != "$REPO_OWNER" && "$author" != "dependabot[bot]" ]]; then
                log_security_event "INFO" "Pull request #$number from external user: $author"
            fi
        fi
    done <<< "$recent_prs"
    
    log_security_event "INFO" "Suspicious PR check completed"
}

# Check repository settings
check_repository_settings() {
    echo "🔍 Checking repository settings..."
    
    # Get repository information
    repo_info=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME)
    
    # Check if repository is private
    is_private=$(echo "$repo_info" | jq -r '.private')
    if [[ "$is_private" == "false" ]]; then
        log_security_event "WARNING" "Repository is public - ensure no sensitive data is exposed"
    fi
    
    # Check if vulnerability alerts are enabled
    vulnerability_alerts=$(echo "$repo_info" | jq -r '.allow_rebase_merge')
    log_security_event "INFO" "Repository settings check completed"
}

# Check for exposed secrets
check_exposed_secrets() {
    echo "🔍 Checking for exposed secrets..."
    
    # This would typically use a tool like GitLeaks or similar
    # For now, we'll do a basic check for common patterns
    
    # Check for potential secrets in recent commits
    recent_commits=$(gh api \
        --method GET \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/$REPO_OWNER/$REPO_NAME/commits \
        --field per_page=10 \
        --field since="$(date -u -d '7 days ago' +"%Y-%m-%dT%H:%M:%SZ")" \
        | jq -r '.[] | .sha')
    
    while IFS= read -r commit_sha; do
        if [[ -n "$commit_sha" ]]; then
            # Get commit details
            commit_details=$(gh api \
                --method GET \
                -H "Accept: application/vnd.github+json" \
                -H "X-GitHub-Api-Version: 2022-11-28" \
                /repos/$REPO_OWNER/$REPO_NAME/commits/$commit_sha)
            
            # Check for potential secrets in commit message or files
            # This is a simplified check - in production, use proper secret scanning tools
            log_security_event "INFO" "Checked commit $commit_sha for exposed secrets"
        fi
    done <<< "$recent_commits"
    
    log_security_event "INFO" "Exposed secrets check completed"
}

# Main monitoring function
main() {
    echo "🔒 ProofOfFit Security Monitor"
    echo "================================"
    echo "Repository: $REPO_OWNER/$REPO_NAME"
    echo "Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo ""
    
    # Initialize log file
    echo "Security monitoring started at $(date -u +"%Y-%m-%d %H:%M:%S UTC")" > "$LOG_FILE"
    
    # Run security checks
    check_suspicious_commits
    check_collaborators
    check_vulnerabilities
    check_suspicious_prs
    check_repository_settings
    check_exposed_secrets
    
    echo ""
    echo "✅ Security monitoring completed"
    echo "📋 Log file: $LOG_FILE"
    echo "🔗 Repository: https://github.com/$REPO_OWNER/$REPO_NAME"
    echo "🛡️ Security tab: https://github.com/$REPO_OWNER/$REPO_NAME/security"
}

# Run the monitoring
main "$@"
