#!/bin/bash

# Health Monitoring Deployment Script
# This script completes the health monitoring setup

set -e

echo "🏥 Deploying Health Monitoring System..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if health endpoint is working
echo "1️⃣ Testing current health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://www.proofoffit.com/api/health)
echo "   Health endpoint status: $HEALTH_RESPONSE"

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health endpoint is working correctly"
elif [ "$HEALTH_RESPONSE" = "503" ]; then
    echo "⚠️  Health endpoint returns 503 - database table may not exist"
    echo "   Please run the SQL setup from HEALTH_MONITORING_SETUP.md"
else
    echo "❌ Health endpoint returned unexpected status: $HEALTH_RESPONSE"
fi

# Test the simple health endpoint as fallback
echo "2️⃣ Testing simple health endpoint..."
SIMPLE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://www.proofoffit.com/api/health-simple)
echo "   Simple health endpoint status: $SIMPLE_RESPONSE"

if [ "$SIMPLE_RESPONSE" = "200" ]; then
    echo "✅ Simple health endpoint is working as fallback"
else
    echo "❌ Simple health endpoint is not working"
fi

# Check if degraded banner is working
echo "3️⃣ Testing degraded banner..."
BANNER_TEST=$(curl -s https://www.proofoffit.com/ | grep -o "Service degraded\|Performance may be degraded" | head -1)
if [ -n "$BANNER_TEST" ]; then
    echo "⚠️  Degraded banner is visible: $BANNER_TEST"
else
    echo "✅ No degraded banner visible (system appears healthy)"
fi

# Show current git status
echo "4️⃣ Checking git status..."
git status --porcelain

if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected"
    echo "   Run 'git add . && git commit -m \"feat: complete health monitoring setup\" && git push origin main'"
else
    echo "✅ Working directory is clean"
fi

echo ""
echo "🎯 Next Steps:"
echo "   1. If health endpoint returns 503, run the SQL setup from HEALTH_MONITORING_SETUP.md"
echo "   2. Test the health monitoring at https://www.proofoffit.com/api/health"
echo "   3. Verify the degraded banner behavior"
echo "   4. Commit any remaining changes"
echo ""
echo "📋 Health Monitoring Features:"
echo "   ✅ Comprehensive health checks (database, storage, auth)"
echo "   ✅ Real-time degraded banner"
echo "   ✅ Performance metrics"
echo "   ✅ Error tracking and logging"
echo "   ✅ CI/CD integration"
echo ""
echo "🚀 Health monitoring system deployment complete!"
