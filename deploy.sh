#!/bin/bash

# 🚀 ProofOfFit Platform Deployment Script
# This script handles the deployment of the ProofOfFit platform

set -e  # Exit on any error

echo "🚀 Starting ProofOfFit Platform Deployment..."

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
    print_error "Please run this script from the ProofOfFit root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking system requirements..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "System requirements check passed"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Run linting
print_status "Running linting checks..."
npm run lint

if [ $? -eq 0 ]; then
    print_success "Linting checks passed"
else
    print_warning "Linting issues found, but continuing with deployment"
fi

# Build the application
print_status "Building application..."
cd apps/web
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Go back to root directory
cd ../..

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    print_success "Your ProofOfFit platform is now live!"
else
    print_error "Deployment failed"
    exit 1
fi

# Display deployment information
echo ""
echo "🎉 Deployment Summary:"
echo "======================"
echo "✅ Dependencies installed"
echo "✅ Linting checks completed"
echo "✅ Application built successfully"
echo "✅ Deployed to Vercel production"
echo ""
echo "🌐 Your ProofOfFit platform is now live!"
echo "📊 Check the deployment URL above for your live application"
echo ""
echo "📋 Next Steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Set up your custom domain"
echo "3. Configure Supabase production database"
echo "4. Set up monitoring and analytics"
echo ""
echo "📚 Documentation: PROOFOFFIT_DEPLOYMENT_READY_SUMMARY.md"
echo ""
print_success "Deployment script completed successfully!"
