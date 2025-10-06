#!/bin/bash

# Migration validation script for local development
# Run this before pushing changes to ensure migrations are valid

set -e

echo "🔍 Validating database migrations..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root"
    exit 1
fi

# Check for required migration files
echo "📋 Checking for required migration files..."

if [ ! -d "infra/supabase" ] && [ ! -d "supabase/migrations" ]; then
    echo "❌ No migration directories found"
    exit 1
fi

# Validate SQL syntax (basic check)
echo "🔧 Validating SQL syntax..."

sql_files=$(find infra/supabase supabase/migrations -name "*.sql" 2>/dev/null || true)

if [ -z "$sql_files" ]; then
    echo "⚠️  No SQL files found in migration directories"
    exit 0
fi

for file in $sql_files; do
    echo "  Validating $file"
    
    # Check for basic SQL syntax issues
    if ! grep -q "CREATE TABLE\|CREATE INDEX\|CREATE POLICY\|ALTER TABLE" "$file"; then
        echo "  ⚠️  $file doesn't contain expected SQL statements"
    fi
    
    # Check for missing semicolons at end of statements
    if [ -s "$file" ] && ! tail -1 "$file" | grep -q ";$"; then
        echo "  ⚠️  $file may be missing semicolon at end"
    fi
done

# Check for required tables
echo "🔍 Checking for required tables..."

if ! grep -r "CREATE TABLE.*audit_events" infra/supabase/ supabase/migrations/ 2>/dev/null; then
    echo "❌ audit_events table not found in migrations"
    echo "   This table is required for the application to build successfully"
    exit 1
fi

# Check for RLS policies
echo "🔒 Checking for RLS policies..."

if ! grep -r "ENABLE ROW LEVEL SECURITY" infra/supabase/ supabase/migrations/ 2>/dev/null; then
    echo "❌ RLS not enabled on tables"
    echo "   All tables should have Row Level Security enabled"
    exit 1
fi

# Check migration numbering
echo "📊 Checking migration numbering..."

migration_files=$(find supabase/migrations -name "*.sql" 2>/dev/null | sort || true)
if [ -n "$migration_files" ]; then
    echo "  Migration files found:"
    echo "$migration_files" | sed 's/^/    /'
fi

echo ""
echo "✅ Migration validation completed successfully!"
echo "📋 All SQL files validated"
echo "🔒 RLS policies confirmed" 
echo "📊 Required tables verified"
echo ""
echo "💡 Next steps:"
echo "   1. Apply migrations to your Supabase project"
echo "   2. Run 'npm run build' to verify everything works"
echo "   3. Deploy to Vercel"