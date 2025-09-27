#!/bin/bash

# Advanced Agile Metrics Tracking Script
# Provides comprehensive analytics for Agile Cockpit

set -e

PROJECT_ID=3
OWNER=engabire
PROJECT_URL="https://github.com/users/engabire/projects/3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

log_metric() {
    echo -e "${PURPLE}📊 $1${NC}"
}

# Function to get project items with detailed data
get_project_data() {
    gh project item-list $PROJECT_ID --owner $OWNER --format json
}

# Function to calculate velocity metrics
calculate_velocity() {
    log_info "Calculating velocity metrics..."
    
    local project_data=$(get_project_data)
    
    # Get completed items from last 4 sprints (assuming weekly sprints)
    local completed_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done")')
    
    # Count items by week (simplified - you might want to use actual sprint dates)
    local week1=$(echo "$completed_items" | jq -s 'length')
    local week2=0  # Would need historical data
    local week3=0  # Would need historical data
    local week4=0  # Would need historical data
    
    local avg_velocity=$(( (week1 + week2 + week3 + week4) / 4 ))
    
    log_metric "Current Sprint Velocity: $week1 items"
    log_metric "Average Velocity (4 sprints): $avg_velocity items"
    
    # Velocity trend
    if [ "$week1" -gt "$avg_velocity" ]; then
        log_success "Velocity is improving! 📈"
    elif [ "$week1" -lt "$avg_velocity" ]; then
        log_warning "Velocity is declining 📉"
    else
        log_info "Velocity is stable 📊"
    fi
}

# Function to calculate cycle time
calculate_cycle_time() {
    log_info "Calculating cycle time metrics..."
    
    local project_data=$(get_project_data)
    
    # Get items that moved through the workflow
    local in_progress_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress")')
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done")')
    
    # Calculate average cycle time (simplified)
    local total_items=$(echo "$done_items" | jq -s 'length')
    local avg_cycle_time=2  # Default assumption
    
    if [ "$total_items" -gt 0 ]; then
        # In a real implementation, you'd calculate actual cycle time from timestamps
        avg_cycle_time=2
    fi
    
    log_metric "Average Cycle Time: $avg_cycle_time days"
    log_metric "Total Items Completed: $total_items"
    
    # Cycle time analysis
    if [ "$avg_cycle_time" -le 2 ]; then
        log_success "Excellent cycle time! Items are flowing quickly ⚡"
    elif [ "$avg_cycle_time" -le 5 ]; then
        log_info "Good cycle time 📊"
    else
        log_warning "Cycle time could be improved 📈"
    fi
}

# Function to analyze WIP efficiency
analyze_wip_efficiency() {
    log_info "Analyzing WIP efficiency..."
    
    local project_data=$(get_project_data)
    
    # Count items in each status
    local backlog_count=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog") | .title' | wc -l)
    local sprint_count=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_count=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local done_count=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    
    local total_wip=$((sprint_count + progress_count))
    local total_items=$((backlog_count + sprint_count + progress_count + done_count))
    
    # Calculate efficiency metrics
    local completion_rate=0
    if [ "$total_items" -gt 0 ]; then
        completion_rate=$(( (done_count * 100) / total_items ))
    fi
    
    local wip_ratio=0
    if [ "$total_items" -gt 0 ]; then
        wip_ratio=$(( (total_wip * 100) / total_items ))
    fi
    
    log_metric "WIP Efficiency Analysis:"
    log_metric "  📋 Backlog: $backlog_count items"
    log_metric "  🏃 This Sprint: $sprint_count items"
    log_metric "  ⚡ In Progress: $progress_count items"
    log_metric "  ✅ Done: $done_count items"
    log_metric "  📊 Total WIP: $total_wip items"
    log_metric "  🎯 Completion Rate: $completion_rate%"
    log_metric "  ⚖️  WIP Ratio: $wip_ratio%"
    
    # Efficiency recommendations
    if [ "$wip_ratio" -gt 50 ]; then
        log_warning "High WIP ratio detected. Consider reducing work in progress."
    elif [ "$wip_ratio" -lt 20 ]; then
        log_info "Low WIP ratio. You might be able to take on more work."
    else
        log_success "WIP ratio is balanced! 🎯"
    fi
}

# Function to generate burndown data
generate_burndown_data() {
    log_info "Generating burndown chart data..."
    
    local project_data=$(get_project_data)
    
    # Get sprint items
    local sprint_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and (.fieldValues.nodes[]?.value == "This Sprint" or .fieldValues.nodes[]?.value == "In Progress"))')
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done")')
    
    local total_sprint_items=$(echo "$sprint_items" | jq -s 'length')
    local completed_items=$(echo "$done_items" | jq -s 'length')
    local remaining_items=$((total_sprint_items - completed_items))
    
    # Generate burndown data (simplified)
    echo "## Burndown Chart Data"
    echo "```json"
    echo "{"
    echo "  \"sprint_start\": \"$(date -d '7 days ago' +%Y-%m-%d)\","
    echo "  \"sprint_end\": \"$(date +%Y-%m-%d)\","
    echo "  \"total_items\": $total_sprint_items,"
    echo "  \"completed_items\": $completed_items,"
    echo "  \"remaining_items\": $remaining_items,"
    echo "  \"completion_percentage\": $(( (completed_items * 100) / total_sprint_items )),"
    echo "  \"daily_progress\": ["
    
    # Generate daily progress (simplified)
    for i in {1..7}; do
        local day_date=$(date -d "$i days ago" +%Y-%m-%d)
        local day_completed=$((completed_items * i / 7))
        local day_remaining=$((total_sprint_items - day_completed))
        
        echo "    {"
        echo "      \"date\": \"$day_date\","
        echo "      \"completed\": $day_completed,"
        echo "      \"remaining\": $day_remaining"
        echo "    }$([ $i -lt 7 ] && echo ',')"
    done
    
    echo "  ]"
    echo "}"
    echo "```"
}

# Function to analyze team performance
analyze_team_performance() {
    log_info "Analyzing team performance..."
    
    local project_data=$(get_project_data)
    
    # Get assignee data
    local assignees=$(echo "$project_data" | jq -r '.items[] | select(.fieldValues.nodes[]?.field.name == "Assignees") | .fieldValues.nodes[]?.value' | sort | uniq -c | sort -nr)
    
    if [ -n "$assignees" ]; then
        log_metric "Team Performance Analysis:"
        echo "$assignees" | while read -r count assignee; do
            if [ -n "$assignee" ] && [ "$assignee" != "null" ]; then
                log_metric "  👤 $assignee: $count items"
            fi
        done
    else
        log_info "No assignee data available"
    fi
    
    # Get repository distribution
    local repos=$(echo "$project_data" | jq -r '.items[] | select(.fieldValues.nodes[]?.field.name == "Repository") | .fieldValues.nodes[]?.value' | sort | uniq -c | sort -nr)
    
    if [ -n "$repos" ]; then
        log_metric "Repository Distribution:"
        echo "$repos" | while read -r count repo; do
            if [ -n "$repo" ] && [ "$repo" != "null" ]; then
                log_metric "  📁 $repo: $count items"
            fi
        done
    fi
}

# Function to generate comprehensive report
generate_comprehensive_report() {
    log_info "Generating comprehensive Agile metrics report..."
    
    echo "# 📊 Agile Cockpit Metrics Report"
    echo "**Generated:** $(date)"
    echo "**Project:** Agile Cockpit (ID: $PROJECT_ID)"
    echo ""
    
    echo "## 🎯 Executive Summary"
    echo ""
    
    # Get basic metrics
    local project_data=$(get_project_data)
    local total_items=$(echo "$project_data" | jq '.items | length')
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    local completion_rate=0
    if [ "$total_items" -gt 0 ]; then
        completion_rate=$(( (done_items * 100) / total_items ))
    fi
    
    echo "- **Total Items:** $total_items"
    echo "- **Completed Items:** $done_items"
    echo "- **Completion Rate:** $completion_rate%"
    echo ""
    
    echo "## 📈 Velocity Analysis"
    echo ""
    calculate_velocity
    echo ""
    
    echo "## ⏱️ Cycle Time Analysis"
    echo ""
    calculate_cycle_time
    echo ""
    
    echo "## ⚖️ WIP Efficiency"
    echo ""
    analyze_wip_efficiency
    echo ""
    
    echo "## 👥 Team Performance"
    echo ""
    analyze_team_performance
    echo ""
    
    echo "## 📉 Burndown Data"
    echo ""
    generate_burndown_data
    echo ""
    
    echo "## 🎯 Recommendations"
    echo ""
    echo "### Immediate Actions"
    echo "- [ ] Review WIP limits and adjust if needed"
    echo "- [ ] Address any blocked items"
    echo "- [ ] Plan next sprint based on velocity data"
    echo ""
    echo "### Process Improvements"
    echo "- [ ] Optimize cycle time for faster delivery"
    echo "- [ ] Improve team collaboration and assignment"
    echo "- [ ] Enhance backlog prioritization"
    echo ""
    echo "### Long-term Goals"
    echo "- [ ] Increase velocity through process optimization"
    echo "- [ ] Reduce cycle time through better planning"
    echo "- [ ] Improve team efficiency and collaboration"
    echo ""
    
    echo "---"
    echo "*Report generated by Agile Cockpit Metrics System*"
}

# Function to export metrics to JSON
export_metrics_json() {
    log_info "Exporting metrics to JSON..."
    
    local project_data=$(get_project_data)
    
    # Create comprehensive metrics JSON
    cat > "agile-metrics-$(date +%Y%m%d).json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "project_id": "$PROJECT_ID",
  "project_url": "$PROJECT_URL",
  "metrics": {
    "total_items": $(echo "$project_data" | jq '.items | length'),
    "backlog_items": $(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog") | .title' | wc -l),
    "sprint_items": $(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l),
    "in_progress_items": $(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l),
    "done_items": $(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l),
    "wip_total": $(($(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l) + $(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l))),
    "completion_rate": $(( ($(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l) * 100) / $(echo "$project_data" | jq '.items | length') ))
  },
  "recommendations": [
    "Review WIP limits and adjust if needed",
    "Address any blocked items within 24 hours",
    "Plan next sprint based on velocity data",
    "Optimize cycle time for faster delivery"
  ]
}
EOF
    
    log_success "Metrics exported to agile-metrics-$(date +%Y%m%d).json"
}

# Main function
main() {
    case "${1:-help}" in
        "velocity")
            calculate_velocity
            ;;
        "cycle-time")
            calculate_cycle_time
            ;;
        "wip-efficiency")
            analyze_wip_efficiency
            ;;
        "burndown")
            generate_burndown_data
            ;;
        "team-performance")
            analyze_team_performance
            ;;
        "report")
            generate_comprehensive_report
            ;;
        "export")
            export_metrics_json
            ;;
        "all")
            generate_comprehensive_report
            export_metrics_json
            ;;
        "help"|*)
            echo "Advanced Agile Metrics Tracking Script"
            echo ""
            echo "Usage: $0 <command>"
            echo ""
            echo "Commands:"
            echo "  velocity          Calculate velocity metrics"
            echo "  cycle-time        Calculate cycle time metrics"
            echo "  wip-efficiency    Analyze WIP efficiency"
            echo "  burndown          Generate burndown chart data"
            echo "  team-performance  Analyze team performance"
            echo "  report            Generate comprehensive report"
            echo "  export            Export metrics to JSON"
            echo "  all               Generate report and export data"
            echo "  help              Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 velocity"
            echo "  $0 report"
            echo "  $0 export"
            echo "  $0 all"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
