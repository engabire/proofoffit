#!/bin/bash

# Environment Setup Script for ProofOfFit
# This script helps set up the development environment

set -e

echo "🚀 Setting up ProofOfFit development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env.local exists
ENV_FILE="apps/web/.env.local"
if [ -f "$ENV_FILE" ]; then
    print_warning ".env.local already exists. Backing up to .env.local.backup"
    cp "$ENV_FILE" "$ENV_FILE.backup"
fi

print_status "Creating .env.local template..."

# Create .env.local template
cat > "$ENV_FILE" << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration (Optional for MVP)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=price_your_pro_monthly_price_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3006
NEXTAUTH_SECRET=your_nextauth_secret_here

# AI/LLM Configuration (Optional)
OPENAI_API_KEY=sk-your_openai_api_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key

# Email Configuration (Optional)
RESEND_API_KEY=re_your_resend_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# USAJOBS API (Optional)
USAJOBS_API_KEY=your_usajobs_api_key

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3006
EOF

print_success "Created .env.local template"

# Interactive setup
echo ""
print_status "Interactive setup - Please provide your credentials:"
echo ""

# Supabase setup
echo -e "${YELLOW}Supabase Configuration:${NC}"
read -p "Enter your Supabase URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Enter your Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY

# Update .env.local with actual values
sed -i.bak "s|https://your-project-id.supabase.co|$SUPABASE_URL|g" "$ENV_FILE"
sed -i.bak "s|your_supabase_anon_key_here|$SUPABASE_ANON_KEY|g" "$ENV_FILE"
sed -i.bak "s|your_supabase_service_role_key_here|$SUPABASE_SERVICE_ROLE_KEY|g" "$ENV_FILE"

# Generate NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
sed -i.bak "s|your_nextauth_secret_here|$NEXTAUTH_SECRET|g" "$ENV_FILE"

# Clean up backup files
rm -f "$ENV_FILE.bak"

print_success "Updated .env.local with Supabase credentials"

# Test the setup
print_status "Testing the setup..."

# Check if development server is running
if curl -s http://localhost:3006/api/health-simple > /dev/null; then
    print_success "Development server is running"
    
    # Test health endpoint
    print_status "Testing health endpoint..."
    HEALTH_RESPONSE=$(curl -s http://localhost:3006/api/health)
    
    if echo "$HEALTH_RESPONSE" | grep -q "unhealthy"; then
        print_warning "Health endpoint shows unhealthy - this is expected until database is set up"
    else
        print_success "Health endpoint is working"
    fi
else
    print_warning "Development server is not running. Please start it with: cd apps/web && npm run dev"
fi

echo ""
print_success "Environment setup completed!"
echo ""
print_status "Next steps:"
echo "1. Restart your development server: cd apps/web && npm run dev"
echo "2. Create the database table by visiting: http://localhost:3006/api/admin/create-system-health"
echo "3. Or execute the SQL manually in your Supabase SQL Editor"
echo "4. Test the health endpoint: curl http://localhost:3006/api/health"
echo ""
print_status "Your application is now ready for development!"
