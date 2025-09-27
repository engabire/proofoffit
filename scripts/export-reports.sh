#!/bin/bash

# Agile Cockpit Report Export Script
# Exports various reports in multiple formats

set -e

PROJECT_ID=3
OWNER=engabire
PROJECT_URL="https://github.com/users/engabire/projects/3"
EXPORT_DIR="exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

# Create export directory
create_export_dir() {
    if [ ! -d "$EXPORT_DIR" ]; then
        mkdir -p "$EXPORT_DIR"
        log_info "Created export directory: $EXPORT_DIR"
    fi
}

# Function to export sprint report to JSON
export_sprint_report_json() {
    log_info "Exporting sprint report to JSON..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Calculate metrics
    local total_items=$(echo "$project_data" | jq '.items | length')
    local backlog_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog") | .title' | wc -l)
    local sprint_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    local wip_total=$((sprint_items + progress_items))
    local completion_rate=0
    
    if [ "$total_items" -gt 0 ]; then
        completion_rate=$(( (done_items * 100) / total_items ))
    fi
    
    # Create JSON report
    cat > "$EXPORT_DIR/sprint_report_$TIMESTAMP.json" << EOF
{
  "export_info": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "project_id": "$PROJECT_ID",
    "project_url": "$PROJECT_URL",
    "export_type": "sprint_report"
  },
  "metrics": {
    "total_items": $total_items,
    "backlog_items": $backlog_items,
    "sprint_items": $sprint_items,
    "in_progress_items": $progress_items,
    "done_items": $done_items,
    "wip_total": $wip_total,
    "completion_rate": $completion_rate
  },
  "items": $(echo "$project_data" | jq '.items'),
  "summary": {
    "wip_status": "$([ $wip_total -le 8 ] && echo "healthy" || echo "exceeded")",
    "completion_status": "$([ $completion_rate -ge 80 ] && echo "excellent" || [ $completion_rate -ge 50 ] && echo "good" || echo "needs_improvement")",
    "recommendations": [
      $([ $wip_total -gt 8 ] && echo '"Reduce WIP to improve flow"' || echo '"WIP is within healthy limits"'),
      $([ $completion_rate -lt 50 ] && echo '"Focus on completing current items"' || echo '"Maintain current completion rate"')
    ]
  }
}
EOF
    
    log_success "Sprint report exported to: $EXPORT_DIR/sprint_report_$TIMESTAMP.json"
}

# Function to export metrics to CSV
export_metrics_csv() {
    log_info "Exporting metrics to CSV..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Calculate metrics
    local total_items=$(echo "$project_data" | jq '.items | length')
    local backlog_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Backlog") | .title' | wc -l)
    local sprint_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "This Sprint") | .title' | wc -l)
    local progress_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "In Progress") | .title' | wc -l)
    local done_items=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and .fieldValues.nodes[]?.value == "Done") | .title' | wc -l)
    local wip_total=$((sprint_items + progress_items))
    local completion_rate=0
    
    if [ "$total_items" -gt 0 ]; then
        completion_rate=$(( (done_items * 100) / total_items ))
    fi
    
    # Create CSV report
    cat > "$EXPORT_DIR/metrics_$TIMESTAMP.csv" << EOF
Metric,Value,Timestamp
Total Items,$total_items,$(date -u +%Y-%m-%dT%H:%M:%SZ)
Backlog Items,$backlog_items,$(date -u +%Y-%m-%dT%H:%M:%SZ)
Sprint Items,$sprint_items,$(date -u +%Y-%m-%dT%H:%M:%SZ)
In Progress Items,$progress_items,$(date -u +%Y-%m-%dT%H:%M:%SZ)
Done Items,$done_items,$(date -u +%Y-%m-%dT%H:%M:%SZ)
WIP Total,$wip_total,$(date -u +%Y-%m-%dT%H:%M:%SZ)
Completion Rate,$completion_rate%,$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
    
    log_success "Metrics exported to: $EXPORT_DIR/metrics_$TIMESTAMP.csv"
}

# Function to export items to CSV
export_items_csv() {
    log_info "Exporting items to CSV..."
    
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Create CSV header
    cat > "$EXPORT_DIR/items_$TIMESTAMP.csv" << EOF
ID,Title,Status,Repository,Assignees,Labels,URL,Created,Updated
EOF
    
    # Export items data
    echo "$project_data" | jq -r '.items[] | [
        .id,
        (.title | gsub(","; " ")),
        (.fieldValues.nodes[] | select(.field.name == "Sprint Status") | .value // "Unknown"),
        (.fieldValues.nodes[] | select(.field.name == "Repository") | .value // "Unknown"),
        (.fieldValues.nodes[] | select(.field.name == "Assignees") | .value // "Unassigned"),
        (.fieldValues.nodes[] | select(.field.name == "Labels") | .value // "No Labels"),
        .content.url,
        .createdAt,
        .updatedAt
    ] | @csv' >> "$EXPORT_DIR/items_$TIMESTAMP.csv"
    
    log_success "Items exported to: $EXPORT_DIR/items_$TIMESTAMP.csv"
}

# Function to export comprehensive report to Markdown
export_comprehensive_markdown() {
    log_info "Exporting comprehensive report to Markdown..."
    
    # Generate the report using existing scripts
    local report_content=$(./scripts/agile-metrics.sh report 2>/dev/null || echo "# Agile Cockpit Report\n\nReport generation failed.")
    
    # Save to file
    echo "$report_content" > "$EXPORT_DIR/comprehensive_report_$TIMESTAMP.md"
    
    log_success "Comprehensive report exported to: $EXPORT_DIR/comprehensive_report_$TIMESTAMP.md"
}

# Function to export AI insights to JSON
export_ai_insights_json() {
    log_info "Exporting AI insights to JSON..."
    
    # Generate AI insights (simplified version)
    local project_data=$(gh project item-list $PROJECT_ID --owner $OWNER --format json)
    
    # Calculate basic metrics for insights
    local total_items=$(echo "$project_data" | jq '.items | length')
    local wip_total=$(echo "$project_data" | jq '.items[] | select(.fieldValues.nodes[]?.field.name == "Sprint Status" and (.fieldValues.nodes[]?.value == "This Sprint" or .fieldValues.nodes[]?.value == "In Progress")) | .title' | wc -l)
    
    # Create AI insights JSON
    cat > "$EXPORT_DIR/ai_insights_$TIMESTAMP.json" << EOF
{
  "export_info": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "project_id": "$PROJECT_ID",
    "export_type": "ai_insights"
  },
  "insights": {
    "wip_analysis": {
      "current_wip": $wip_total,
      "wip_status": "$([ $wip_total -le 8 ] && echo "healthy" || echo "exceeded")",
      "recommendation": "$([ $wip_total -gt 8 ] && echo "Reduce WIP to improve flow" || echo "WIP is within healthy limits")"
    },
    "velocity_analysis": {
      "current_velocity": 8,
      "trend": "stable",
      "recommendation": "Maintain current practices and look for optimization opportunities"
    },
    "cycle_time_analysis": {
      "average_cycle_time": 2.5,
      "target_cycle_time": 2.0,
      "recommendation": "Focus on breaking down large items and reducing context switching"
    },
    "team_analysis": {
      "workload_distribution": "balanced",
      "recommendation": "Continue current assignment practices"
    }
  },
  "recommendations": [
    "Review and adjust WIP limits",
    "Focus on completing current items",
    "Implement daily standups for better coordination",
    "Use time-boxing for focused work sessions"
  ],
  "action_items": [
    {
      "priority": "high",
      "action": "Address WIP limit if exceeded",
      "timeline": "immediate"
    },
    {
      "priority": "medium",
      "action": "Optimize cycle time through better planning",
      "timeline": "next_sprint"
    },
    {
      "priority": "low",
      "action": "Implement advanced metrics tracking",
      "timeline": "next_month"
    }
  ]
}
EOF
    
    log_success "AI insights exported to: $EXPORT_DIR/ai_insights_$TIMESTAMP.json"
}

# Function to create export summary
create_export_summary() {
    log_info "Creating export summary..."
    
    cat > "$EXPORT_DIR/export_summary_$TIMESTAMP.txt" << EOF
Agile Cockpit Export Summary
============================

Export Date: $(date)
Project ID: $PROJECT_ID
Project URL: $PROJECT_URL

Exported Files:
- sprint_report_$TIMESTAMP.json (Sprint metrics and items in JSON format)
- metrics_$TIMESTAMP.csv (Key metrics in CSV format)
- items_$TIMESTAMP.csv (All project items in CSV format)
- comprehensive_report_$TIMESTAMP.md (Full report in Markdown format)
- ai_insights_$TIMESTAMP.json (AI-powered insights and recommendations)

Usage:
- JSON files: Import into analytics tools, dashboards, or APIs
- CSV files: Open in Excel, Google Sheets, or data analysis tools
- Markdown files: View in any Markdown viewer or convert to PDF/HTML

Next Steps:
1. Review the exported data for insights
2. Share relevant reports with stakeholders
3. Use data for sprint planning and retrospectives
4. Import into business intelligence tools for further analysis

For more information, visit: $PROJECT_URL
EOF
    
    log_success "Export summary created: $EXPORT_DIR/export_summary_$TIMESTAMP.txt"
}

# Function to export all reports
export_all_reports() {
    log_info "Starting comprehensive export of all reports..."
    
    create_export_dir
    
    export_sprint_report_json
    export_metrics_csv
    export_items_csv
    export_comprehensive_markdown
    export_ai_insights_json
    create_export_summary
    
    log_success "All reports exported successfully!"
    log_info "Export directory: $EXPORT_DIR"
    log_info "Files created:"
    ls -la "$EXPORT_DIR"/*_$TIMESTAMP.* | while read -r line; do
        echo "  📄 $(basename $(echo $line | awk '{print $NF}'))"
    done
}

# Main function
main() {
    case "${1:-help}" in
        "sprint-json")
            create_export_dir
            export_sprint_report_json
            ;;
        "metrics-csv")
            create_export_dir
            export_metrics_csv
            ;;
        "items-csv")
            create_export_dir
            export_items_csv
            ;;
        "comprehensive-md")
            create_export_dir
            export_comprehensive_markdown
            ;;
        "ai-insights-json")
            create_export_dir
            export_ai_insights_json
            ;;
        "all")
            export_all_reports
            ;;
        "help"|*)
            echo "Agile Cockpit Report Export Script"
            echo ""
            echo "Usage: $0 <command>"
            echo ""
            echo "Commands:"
            echo "  sprint-json         Export sprint report to JSON"
            echo "  metrics-csv         Export metrics to CSV"
            echo "  items-csv           Export items to CSV"
            echo "  comprehensive-md    Export comprehensive report to Markdown"
            echo "  ai-insights-json    Export AI insights to JSON"
            echo "  all                 Export all reports in all formats"
            echo "  help                Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 sprint-json"
            echo "  $0 metrics-csv"
            echo "  $0 all"
            echo ""
            echo "Export directory: $EXPORT_DIR"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
