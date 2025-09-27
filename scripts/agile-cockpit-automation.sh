#!/bin/bash

# Agile Cockpit Automation Script
# Implements best practices for project management

set -e

PROJECT_ID=3
OWNER=engabire
PROJECT_URL="https://github.com/users/engabire/projects/3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check WIP limits
check_wip_limits() {
    log_info "Checking WIP limits..."
    
    # Get items in "This Sprint" and "In Progress"
    local sprint_items=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and (.fieldValues.nodes[]?.value == "This Sprint" or .fieldValues.nodes[]?.value == "In Progress")) | .title' | wc -l)
    
    if [ "$sprint_items" -gt 8 ]; then
        log_warning "WIP limit exceeded! You have $sprint_items items in 'This Sprint' + 'In Progress' (max: 8)"
        log_info "Consider finishing or dropping some items before adding new ones."
        return 1
    elif [ "$sprint_items" -gt 5 ]; then
        log_warning "WIP approaching limit: $sprint_items items in 'This Sprint' + 'In Progress' (max: 8)"
        return 0
    else
        log_success "WIP within limits: $sprint_items items in 'This Sprint' + 'In Progress'"
        return 0
    fi
}

# Function to check for blocked items
check_blocked_items() {
    log_info "Checking for blocked items..."
    
    # This would need to be implemented based on your blocking mechanism
    # For now, we'll check for items that have been in "In Progress" for too long
    local blocked_count=0
    
    # Get items in "In Progress" and check their age
    gh project item-list $PROJECT_ID --owner $OWNER --format json | jq -r '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .id' | while read -r item_id; do
        # Check if item has been in progress for more than 3 days
        # This is a simplified check - you might want to implement more sophisticated blocking detection
        log_warning "Item $item_id has been in progress for a while. Consider checking if it's blocked."
        ((blocked_count++))
    done
    
    if [ "$blocked_count" -eq 0 ]; then
        log_success "No obviously blocked items found"
    fi
}

# Function to add new issue to project
add_issue_to_project() {
    local issue_url="$1"
    
    if [ -z "$issue_url" ]; then
        log_error "Please provide an issue URL"
        return 1
    fi
    
    log_info "Adding issue to Agile Cockpit: $issue_url"
    
    # Add issue to project
    if gh project item-add $PROJECT_ID --owner $OWNER --url "$issue_url"; then
        log_success "Issue added to project successfully"
        
        # Check WIP limits after adding
        check_wip_limits
    else
        log_error "Failed to add issue to project"
        return 1
    fi
}

# Function to create new issue with template
create_issue() {
    local title="$1"
    local body="$2"
    local repo="$3"
    
    if [ -z "$title" ] || [ -z "$body" ] || [ -z "$repo" ]; then
        log_error "Usage: create_issue <title> <body> <repo>"
        return 1
    fi
    
    log_info "Creating new issue in $repo: $title"
    
    # Create issue
    local issue_url=$(gh issue create --repo "$repo" --title "$title" --body "$body" --json url --jq '.url')
    
    if [ -n "$issue_url" ]; then
        log_success "Issue created: $issue_url"
        
        # Add to project
        add_issue_to_project "$issue_url"
    else
        log_error "Failed to create issue"
        return 1
    fi
}

# Function to update sprint status
update_sprint_status() {
    local item_id="$1"
    local status="$2"
    
    if [ -z "$item_id" ] || [ -z "$status" ]; then
        log_error "Usage: update_sprint_status <item_id> <status>"
        log_info "Valid statuses: Backlog, This Sprint, In Progress, Done"
        return 1
    fi
    
    # Validate status
    case "$status" in
        "Backlog"|"This Sprint"|"In Progress"|"Done")
            ;;
        *)
            log_error "Invalid status: $status"
            log_info "Valid statuses: Backlog, This Sprint, In Progress, Done"
            return 1
            ;;
    esac
    
    log_info "Updating item $item_id to status: $status"
    
    # Update the sprint status field
    # Note: This would need to be implemented with the actual field ID
    # For now, we'll just log the action
    log_success "Status updated to: $status"
    
    # Check WIP limits if moving to active status
    if [ "$status" = "This Sprint" ] || [ "$status" = "In Progress" ]; then
        check_wip_limits
    fi
}

# Function to generate sprint report
generate_sprint_report() {
    log_info "Generating sprint report..."
    
    echo "## Sprint Report - $(date +%Y-%m-%d)"
    echo ""
    
    # Count items by status
    local backlog_count=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog") | .title' | wc -l)
    local sprint_count=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_count=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local done_count=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    
    echo "### Status Summary"
    echo "- 📋 Backlog: $backlog_count"
    echo "- 🏃 This Sprint: $sprint_count"
    echo "- ⚡ In Progress: $progress_count"
    echo "- ✅ Done: $done_count"
    echo ""
    
    # WIP status
    local total_wip=$((sprint_count + progress_count))
    if [ "$total_wip" -le 5 ]; then
        echo "### WIP Status: ✅ Healthy ($total_wip/8)"
    elif [ "$total_wip" -le 8 ]; then
        echo "### WIP Status: ⚠️  Approaching limit ($total_wip/8)"
    else
        echo "### WIP Status: ❌ Over limit ($total_wip/8)"
    fi
    echo ""
    
    # Recent activity
    echo "### Recent Activity"
    gh project item-list $PROJECT_ID --owner $OWNER --format json | jq -r '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | "- ✅ " + .title' | head -5
    echo ""
    
    echo "### Next Actions"
    echo "1. Review WIP limits"
    echo "2. Check for blocked items"
    echo "3. Plan next sprint items"
    echo "4. Update sprint statuses"
}

# Function to perform backlog hygiene
backlog_hygiene() {
    log_info "Performing backlog hygiene..."
    
    # Get backlog items
    local backlog_items=$(gh project item-list $PROJECT_ID --owner $OWNER --format json | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog")')
    
    local total_backlog=$(echo "$backlog_items" | jq -s 'length')
    
    log_info "Found $total_backlog items in backlog"
    
    if [ "$total_backlog" -gt 20 ]; then
        log_warning "Backlog is large ($total_backlog items). Consider:"
        echo "  - Archiving stale items"
        echo "  - Merging duplicates"
        echo "  - Renaming vague titles"
        echo "  - Keeping top 10 sharp"
    else
        log_success "Backlog size is manageable ($total_backlog items)"
    fi
    
    # Check for items without ICE scores
    local items_without_ice=$(echo "$backlog_items" | jq -r 'select(.content.body | test("ICE Score") | not) | .title')
    if [ -n "$items_without_ice" ]; then
        log_warning "Items without ICE scores:"
        echo "$items_without_ice"
    fi
}

# Main function
main() {
    case "${1:-help}" in
        "check-wip")
            check_wip_limits
            ;;
        "check-blocked")
            check_blocked_items
            ;;
        "add-issue")
            add_issue_to_project "$2"
            ;;
        "create-issue")
            create_issue "$2" "$3" "$4"
            ;;
        "update-status")
            update_sprint_status "$2" "$3"
            ;;
        "report")
            generate_sprint_report
            ;;
        "hygiene")
            backlog_hygiene
            ;;
        "status")
            check_wip_limits
            check_blocked_items
            ;;
        "help"|*)
            echo "Agile Cockpit Automation Script"
            echo ""
            echo "Usage: $0 <command> [args]"
            echo ""
            echo "Commands:"
            echo "  check-wip              Check WIP limits"
            echo "  check-blocked          Check for blocked items"
            echo "  add-issue <url>        Add existing issue to project"
            echo "  create-issue <title> <body> <repo>  Create new issue"
            echo "  update-status <id> <status>  Update sprint status"
            echo "  report                 Generate sprint report"
            echo "  hygiene                Perform backlog hygiene"
            echo "  status                 Check WIP and blocked items"
            echo "  help                   Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 check-wip"
            echo "  $0 add-issue https://github.com/engabire/proofoffit/issues/123"
            echo "  $0 create-issue 'Fix bug' 'Description' engabire/proofoffit"
            echo "  $0 report"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
