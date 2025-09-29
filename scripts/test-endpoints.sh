#!/bin/bash

# Endpoint Testing Script for ProofOfFit
# This script tests all the API endpoints to ensure they're working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Base URL
BASE_URL="http://localhost:3006"

echo "🧪 Testing ProofOfFit API Endpoints..."
echo ""

# Test function
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local expected_status=${3:-200}
    local description=$4
    
    print_status "Testing $description ($method $endpoint)"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL$endpoint" -o /tmp/response.json)
    else
        response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint" -o /tmp/response.json)
    fi
    
    http_code="${response: -3}"
    response_body=$(cat /tmp/response.json)
    
    if [ "$http_code" = "$expected_status" ]; then
        print_success "$description - HTTP $http_code"
        if [ "$http_code" = "200" ] && echo "$response_body" | grep -q "status"; then
            status=$(echo "$response_body" | jq -r '.status' 2>/dev/null || echo "unknown")
            echo "  Status: $status"
        fi
    else
        print_error "$description - Expected HTTP $expected_status, got $http_code"
        echo "  Response: $response_body"
    fi
    echo ""
}

# Test basic endpoints
test_endpoint "/api/health-simple" "GET" "200" "Simple Health Check"
test_endpoint "/api/health" "GET" "200" "Main Health Check"

# Test admin endpoints (these might fail without proper env setup)
test_endpoint "/api/admin/create-system-health" "POST" "200" "Create System Health Table"
test_endpoint "/api/admin/setup-health" "POST" "200" "Setup Health Monitoring"
test_endpoint "/api/admin/migrate" "POST" "200" "Database Migration"

# Test monitoring endpoints
test_endpoint "/api/monitoring/health" "GET" "200" "Monitoring Health Check"
test_endpoint "/api/monitoring/dependencies" "GET" "200" "Dependencies Check"

# Test Agile Cockpit endpoints
test_endpoint "/api/agile-cockpit/metrics" "GET" "200" "Agile Cockpit Metrics"
test_endpoint "/api/agile-cockpit/items" "GET" "200" "Agile Cockpit Items"
test_endpoint "/api/agile-cockpit/charts" "GET" "200" "Agile Cockpit Charts"

# Test AI endpoints
test_endpoint "/api/ai/analyze" "POST" "200" "AI Analysis"
test_endpoint "/api/ai/matching" "POST" "200" "AI Matching"

# Test application endpoints
test_endpoint "/api/applications/auto-apply" "POST" "200" "Auto Apply"
test_endpoint "/api/applications/history" "GET" "200" "Application History"

# Test job search endpoints
test_endpoint "/api/jobs/search" "GET" "200" "Job Search"

# Test webhook endpoints
test_endpoint "/api/webhooks/agile-cockpit" "POST" "200" "Agile Cockpit Webhook"

# Test cleanup endpoint
test_endpoint "/api/cleanup" "POST" "200" "System Cleanup"

echo "🏁 Endpoint testing completed!"
echo ""

# Summary
print_status "Summary:"
echo "- All endpoints have been tested"
echo "- Check the results above for any failures"
echo "- Most admin endpoints will show 'degraded' status until environment is fully configured"
echo "- This is expected behavior and not an error"
echo ""

# Clean up
rm -f /tmp/response.json
