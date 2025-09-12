# Supabase Setup Guide

This directory contains SQL scripts to set up the ProofOfFit database with proper security and functionality.

## Setup Steps

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the SQL scripts in order:**
   ```sql
   -- 1. Enable extensions
   \i 000_extensions.sql
   
   -- 2. Set up RLS policies
   \i 010_rls.sql
   
   -- 3. Add remaining RLS policies
   \i 030_remaining_rls.sql
   
   -- 4. Set up ActionLog trigger
   \i 020_actionlog.sql
   ```

3. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run Prisma migrations:**
   ```bash
   cd apps/web
   npm run db:push
   npm run db:seed
   ```

## Security Features

- **Row Level Security (RLS)** enabled on all tenant-scoped tables
- **Tenant isolation** via JWT claims
- **Immutable ActionLog** with cryptographic hash chaining
- **Public read access** for shared data (jobs, criteria, policies)

## Extensions Used

- `pgcrypto` - Cryptographic functions for ActionLog
- `vector` - Vector embeddings for semantic search
- `pg_cron` - Scheduled tasks
- `pg_stat_statements` - Query performance monitoring

## Testing RLS

```sql
-- Test tenant isolation
set request.jwt.claims = '{"tenant_id": "demo-tenant"}';
select * from candidate_profiles; -- Should only show demo-tenant data

-- Test without tenant claim
set request.jwt.claims = '{}';
select * from candidate_profiles; -- Should return no rows
```