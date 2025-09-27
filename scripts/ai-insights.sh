#!/bin/bash

# AI-Powered Agile Insights Script
# Provides intelligent recommendations and insights for Agile Cockpit

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

log_insight() {
    echo -e "${PURPLE}🧠 $1${NC}"
}

log_recommendation() {
    echo -e "${CYAN}💡 $1${NC}"
}

# Function to analyze WIP patterns
analyze_wip_patterns() {
    log_info "Analyzing WIP patterns..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Get current WIP
    local sprint_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local total_wip=$((sprint_items + progress_items))
    
    log_insight "Current WIP Analysis:"
    log_insight "  📊 Total WIP: $total_wip items"
    log_insight "  🏃 Sprint Ready: $sprint_items items"
    log_insight "  ⚡ In Progress: $progress_items items"
    
    # AI-powered insights
    if [ "$total_wip" -gt 8 ]; then
        log_recommendation "WIP limit exceeded! Consider:"
        echo "  • Complete 2-3 items before starting new ones"
        echo "  • Move some items back to backlog"
        echo "  • Focus on finishing rather than starting"
    elif [ "$total_wip" -gt 5 ]; then
        log_recommendation "WIP approaching limit. Consider:"
        echo "  • Finish current items before adding new ones"
        echo "  • Review if all items are truly necessary this sprint"
    elif [ "$total_wip" -lt 3 ]; then
        log_recommendation "Low WIP detected. You might:"
        echo "  • Pull in 1-2 items from backlog"
        echo "  • Focus on larger, more complex items"
        echo "  • Use extra capacity for process improvement"
    else
        log_success "WIP is well-balanced! 🎯"
    fi
}

# Function to analyze velocity trends
analyze_velocity_trends() {
    log_info "Analyzing velocity trends..."
    
    # Mock velocity data (in real implementation, you'd analyze historical data)
    local current_velocity=8
    local previous_velocity=6
    local trend=$((current_velocity - previous_velocity))
    
    log_insight "Velocity Analysis:"
    log_insight "  📈 Current Sprint: $current_velocity items"
    log_insight "  📊 Previous Sprint: $previous_velocity items"
    log_insight "  📉 Trend: $([ $trend -gt 0 ] && echo "+$trend" || echo "$trend") items"
    
    if [ "$trend" -gt 0 ]; then
        log_recommendation "Velocity is improving! 🚀"
        echo "  • Continue current practices"
        echo "  • Consider increasing sprint capacity"
        echo "  • Document what's working well"
    elif [ "$trend" -lt 0 ]; then
        log_recommendation "Velocity declining. Consider:"
        echo "  • Review blockers and impediments"
        echo "  • Check if items are too large"
        echo "  • Ensure team focus and availability"
    else
        log_recommendation "Velocity is stable. Consider:"
        echo "  • Experiment with process improvements"
        echo "  • Look for optimization opportunities"
    fi
}

# Function to analyze cycle time patterns
analyze_cycle_time_patterns() {
    log_info "Analyzing cycle time patterns..."
    
    # Mock cycle time data
    local avg_cycle_time=2.5
    local target_cycle_time=2.0
    
    log_insight "Cycle Time Analysis:"
    log_insight "  ⏱️  Average: $avg_cycle_time days"
    log_insight "  🎯 Target: $target_cycle_time days"
    log_insight "  📊 Variance: $(( $(echo "$avg_cycle_time * 10" | bc | cut -d. -f1) - $(echo "$target_cycle_time * 10" | bc | cut -d. -f1) )) days"
    
    if (( $(echo "$avg_cycle_time > $target_cycle_time" | bc -l) )); then
        log_recommendation "Cycle time above target. Optimize by:"
        echo "  • Breaking down large items into smaller ones"
        echo "  • Reducing context switching"
        echo "  • Improving definition of done clarity"
        echo "  • Addressing blockers faster"
    else
        log_success "Cycle time is excellent! ⚡"
        log_recommendation "Maintain current practices:"
        echo "  • Keep items small and focused"
        echo "  • Continue fast feedback loops"
    fi
}

# Function to analyze team workload distribution
analyze_team_workload() {
    log_info "Analyzing team workload distribution..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Get assignee distribution
    local assignees=$(echo "$project_data" | jq -r '.items[] | select(.fieldValues.nodes[]?.field.name == "Assignees") | .fieldValues.nodes[]?.value' | sort | uniq -c | sort -nr)
    
    if [ -n "$assignees" ]; then
        log_insight "Team Workload Distribution:"
        echo "$assignees" | while read -r count assignee; do
            if [ -n "$assignee" ] && [ "$assignee" != "null" ]; then
                log_insight "  👤 $assignee: $count items"
            fi
        done
        
        # Calculate workload balance
        local max_workload=$(echo "$assignees" | head -1 | awk '{print $1}')
        local min_workload=$(echo "$assignees" | tail -1 | awk '{print $1}')
        local workload_variance=$((max_workload - min_workload))
        
        if [ "$workload_variance" -gt 3 ]; then
            log_recommendation "Workload imbalance detected:"
            echo "  • Redistribute items for better balance"
            echo "  • Consider team member availability"
            echo "  • Review skill distribution"
        else
            log_success "Workload is well-distributed! ⚖️"
        fi
    else
        log_warning "No assignee data available for analysis"
    fi
}

# Function to predict sprint completion
predict_sprint_completion() {
    log_info "Predicting sprint completion..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Get sprint items
    local sprint_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    
    local total_sprint_items=$((sprint_items + progress_items + done_items))
    local remaining_items=$((sprint_items + progress_items))
    local completion_rate=0
    
    if [ "$total_sprint_items" -gt 0 ]; then
        completion_rate=$(( (done_items * 100) / total_sprint_items ))
    fi
    
    # Predict completion based on current velocity
    local current_velocity=8
    local days_remaining=3  # Mock remaining days
    local predicted_completion=$((current_velocity * days_remaining / 7))
    
    log_insight "Sprint Completion Prediction:"
    log_insight "  📊 Current Progress: $completion_rate%"
    log_insight "  📋 Remaining Items: $remaining_items"
    log_insight "  🎯 Predicted Completion: $predicted_completion items"
    
    if [ "$predicted_completion" -ge "$remaining_items" ]; then
        log_success "Sprint is on track for completion! 🎯"
    else
        log_recommendation "Sprint at risk. Consider:"
        echo "  • Focus on highest priority items"
        echo "  • Move some items to next sprint"
        echo "  • Increase team focus and availability"
    fi
}

# Function to generate intelligent recommendations
generate_intelligent_recommendations() {
    log_info "Generating intelligent recommendations..."
    
    echo ""
    log_recommendation "🎯 Priority Recommendations:"
    echo ""
    
    # Analyze current state and provide recommendations
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    local total_items=$(echo "$project_data" | jq '.items | length')
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    local completion_rate=0
    
    if [ "$total_items" -gt 0 ]; then
        completion_rate=$(( (done_items * 100) / total_items ))
    fi
    
    # Generate contextual recommendations
    if [ "$completion_rate" -lt 20 ]; then
        echo "1. 🚀 Focus on quick wins to build momentum"
        echo "2. 📋 Break down large items into smaller, achievable tasks"
        echo "3. ⏰ Set daily goals to maintain progress"
    elif [ "$completion_rate" -lt 50 ]; then
        echo "1. 🎯 Maintain current momentum and focus"
        echo "2. 🔄 Review and optimize your workflow"
        echo "3. 📊 Track daily progress to stay on target"
    elif [ "$completion_rate" -lt 80 ]; then
        echo "1. 🏁 Push for sprint completion"
        echo "2. 🧹 Clean up any remaining blockers"
        echo "3. 📈 Plan for next sprint based on learnings"
    else
        echo "1. 🎉 Celebrate the progress made!"
        echo "2. 📝 Document lessons learned"
        echo "3. 🚀 Plan ambitious goals for next sprint"
    fi
    
    echo ""
    log_recommendation "🔧 Process Improvements:"
    echo ""
    echo "1. 📊 Implement daily standups for better coordination"
    echo "2. 🎯 Use time-boxing for focused work sessions"
    echo "3. 🔄 Regular retrospectives for continuous improvement"
    echo "4. 📈 Track metrics to identify optimization opportunities"
    
    echo ""
    log_recommendation "🧠 Focus Areas:"
    echo ""
    echo "1. 🎯 Maintain WIP limits for optimal flow"
    echo "2. ⚡ Reduce cycle time through better planning"
    echo "3. 👥 Improve team collaboration and communication"
    echo "4. 📊 Use data-driven decisions for process improvements"
}

# Function to generate comprehensive AI insights report
generate_ai_insights_report() {
    log_info "Generating comprehensive AI insights report..."
    
    echo "# 🧠 AI-Powered Agile Insights Report"
    echo "**Generated:** $(date)"
    echo "**Project:** Agile Cockpit (ID: $PROJECT_ID)"
    echo ""
    
    echo "## 📊 Current State Analysis"
    echo ""
    analyze_wip_patterns
    echo ""
    
    echo "## 📈 Velocity & Performance"
    echo ""
    analyze_velocity_trends
    echo ""
    analyze_cycle_time_patterns
    echo ""
    
    echo "## 👥 Team Analysis"
    echo ""
    analyze_team_workload
    echo ""
    
    echo "## 🔮 Sprint Prediction"
    echo ""
    predict_sprint_completion
    echo ""
    
    echo "## 💡 Intelligent Recommendations"
    echo ""
    generate_intelligent_recommendations
    echo ""
    
    echo "## 🎯 Action Items"
    echo ""
    echo "### Immediate (This Week)"
    echo "- [ ] Review and adjust WIP limits"
    echo "- [ ] Address any blockers within 24 hours"
    echo "- [ ] Focus on highest priority items"
    echo ""
    echo "### Short-term (Next Sprint)"
    echo "- [ ] Implement recommended process improvements"
    echo "- [ ] Optimize cycle time through better planning"
    echo "- [ ] Improve team workload distribution"
    echo ""
    echo "### Long-term (Next Month)"
    echo "- [ ] Establish velocity baselines"
    echo "- [ ] Implement advanced metrics tracking"
    echo "- [ ] Create team performance dashboards"
    echo ""
    
    echo "---"
    echo "*Report generated by AI-Powered Agile Insights System*"
}

# Main function
main() {
    case "${1:-help}" in
        "wip-analysis")
            analyze_wip_patterns
            ;;
        "velocity-analysis")
            analyze_velocity_trends
            ;;
        "cycle-time-analysis")
            analyze_cycle_time_patterns
            ;;
        "team-analysis")
            analyze_team_workload
            ;;
        "sprint-prediction")
            predict_sprint_completion
            ;;
        "recommendations")
            generate_intelligent_recommendations
            ;;
        "report")
            generate_ai_insights_report
            ;;
        "help"|*)
            echo "AI-Powered Agile Insights Script"
            echo ""
            echo "Usage: $0 <command>"
            echo ""
            echo "Commands:"
            echo "  wip-analysis        Analyze WIP patterns and provide insights"
            echo "  velocity-analysis   Analyze velocity trends and performance"
            echo "  cycle-time-analysis Analyze cycle time patterns"
            echo "  team-analysis       Analyze team workload distribution"
            echo "  sprint-prediction   Predict sprint completion likelihood"
            echo "  recommendations     Generate intelligent recommendations"
            echo "  report              Generate comprehensive AI insights report"
            echo "  help                Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 wip-analysis"
            echo "  $0 recommendations"
            echo "  $0 report"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
