#!/bin/bash

echo "🔍 Checking external dependencies..."

# Function to check service status with fallback
check_service_status() {
    local service_name=$1
    local api_url=$2
    local status="unknown"
    
    echo "Checking $service_name status..."
    
    # Try to get JSON response first
    response=$(curl -s -L "$api_url" 2>/dev/null)
    
    if echo "$response" | jq -e '.status.indicator' >/dev/null 2>&1; then
        # Valid JSON response
        status=$(echo "$response" | jq -r '.status.indicator')
    elif echo "$response" | grep -q "All Systems Operational\|Operational\|Healthy" 2>/dev/null; then
        # HTML response indicating operational status
        status="operational"
    elif echo "$response" | grep -q "Degraded\|Minor\|Partial" 2>/dev/null; then
        # HTML response indicating degraded status
        status="degraded"
    elif echo "$response" | grep -q "Outage\|Major\|Critical" 2>/dev/null; then
        # HTML response indicating outage
        status="major_outage"
    else
        # Default to unknown if we can't parse
        status="unknown"
    fi
    
    echo "$service_name status: $status"
    echo "$status"
}

# Check each service
SUPABASE_STATUS=$(check_service_status "Supabase" "https://status.supabase.com/api/v2/status.json")
VERCEL_STATUS=$(check_service_status "Vercel" "https://www.vercel-status.com/api/v2/status.json")
STRIPE_STATUS=$(check_service_status "Stripe" "https://status.stripe.com/api/v2/status.json")

# Create status summary
echo ""
echo "📊 Dependency Status Summary:"
echo "================================"
echo "Supabase: $SUPABASE_STATUS"
echo "Vercel:   $VERCEL_STATUS"
echo "Stripe:   $STRIPE_STATUS"

# Determine overall health
if [[ "$SUPABASE_STATUS" == "operational" && "$VERCEL_STATUS" == "operational" && "$STRIPE_STATUS" == "operational" ]]; then
    OVERALL_STATUS="healthy"
elif [[ "$SUPABASE_STATUS" == "major_outage" || "$VERCEL_STATUS" == "major_outage" || "$STRIPE_STATUS" == "major_outage" ]]; then
    OVERALL_STATUS="unhealthy"
else
    OVERALL_STATUS="degraded"
fi

echo "Overall:  $OVERALL_STATUS"
echo ""

# Log to our monitoring endpoint (if available)
BASE_URL="https://www.proofoffit.com"

if command -v curl >/dev/null 2>&1; then
    echo "📝 Logging dependency status..."
    curl -X POST "$BASE_URL/api/monitoring/dependencies" \
        -H "Content-Type: application/json" \
        -d "{
            \"supabase_status\": \"$SUPABASE_STATUS\",
            \"vercel_status\": \"$VERCEL_STATUS\",
            \"stripe_status\": \"$STRIPE_STATUS\",
            \"overall_status\": \"$OVERALL_STATUS\",
            \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
        }" 2>/dev/null || echo "⚠️  Failed to log dependency status (endpoint may not exist yet)"
fi

echo "✅ Dependency check complete!"
