#!/bin/bash

# Build script for Vercel deployment
# This ensures the UI package is built before the web app

echo "Building UI package first..."
cd ../../packages/ui
npm run build

echo "Building web app..."
cd ../../apps/web
npm run build
