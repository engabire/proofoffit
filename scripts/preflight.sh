#!/usr/bin/env bash
set -euo pipefail
START=$(date +%s)
echo "🔍 Preflight: lint, type-check, test, build (ui only)"

echo "➡️  Lint" && npm run lint || { echo "Lint failed"; exit 1; }
echo "➡️  Type-check" && npm run type-check || { echo "Type-check failed"; exit 1; }
echo "➡️  Test" && npm run test || { echo "Tests failed"; exit 1; }
echo "➡️  UI Build" && npm run build:ui || { echo "UI build failed"; exit 1; }

END=$(date +%s)
echo "✅ Preflight completed in $((END-START))s"
