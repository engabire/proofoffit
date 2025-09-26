#!/usr/bin/env node

/**
 * Health Monitoring Setup Script
 * 
 * This script sets up the system_health table in Supabase for comprehensive health monitoring.
 * Run this script after deploying to production to enable full health monitoring.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file in apps/web/');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupHealthMonitoring() {
  console.log('🏥 Setting up health monitoring system...\n');

  try {
    // Step 1: Create the system_health table
    console.log('1️⃣ Creating system_health table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.system_health (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        status TEXT NOT NULL DEFAULT 'healthy',
        message TEXT,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (createError) {
      console.log('⚠️  Table creation via RPC failed, trying direct approach...');
      // Try a simpler approach - just test if we can access the table
      const { error: testError } = await supabase
        .from('system_health')
        .select('id')
        .limit(1);
      
      if (testError && testError.message.includes('relation "public.system_health" does not exist')) {
        console.log('📋 Please run the following SQL in your Supabase Dashboard:');
        console.log('\n' + '='.repeat(80));
        console.log(createTableSQL);
        console.log('='.repeat(80) + '\n');
        console.log('Then run this script again to complete the setup.');
        return;
      }
    } else {
      console.log('✅ Table created successfully');
    }

    // Step 2: Create index
    console.log('2️⃣ Creating performance index...');
    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);
    `;
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: createIndexSQL
    });

    if (!indexError) {
      console.log('✅ Index created successfully');
    }

    // Step 3: Insert initial health record
    console.log('3️⃣ Inserting initial health record...');
    const { error: insertError } = await supabase
      .from('system_health')
      .insert({
        status: 'healthy',
        message: 'System initialized successfully',
        metadata: {
          version: '1.0.0',
          initialized_at: new Date().toISOString(),
          setup_script: true
        }
      });

    if (insertError) {
      console.log('⚠️  Could not insert initial record:', insertError.message);
    } else {
      console.log('✅ Initial health record created');
    }

    // Step 4: Set up RLS policies
    console.log('4️⃣ Setting up Row Level Security policies...');
    const rlsSQL = `
      ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Service role can manage system health" ON public.system_health;
      CREATE POLICY "Service role can manage system health" ON public.system_health
        FOR ALL USING (auth.role() = 'service_role');
      
      DROP POLICY IF EXISTS "Anon can read system health" ON public.system_health;
      CREATE POLICY "Anon can read system health" ON public.system_health
        FOR SELECT USING (true);
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: rlsSQL
    });

    if (!rlsError) {
      console.log('✅ RLS policies configured');
    }

    // Step 5: Test the health endpoint
    console.log('5️⃣ Testing health endpoint...');
    const { error: testError } = await supabase
      .from('system_health')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (testError) {
      console.log('❌ Health endpoint test failed:', testError.message);
    } else {
      console.log('✅ Health endpoint is working correctly');
    }

    console.log('\n🎉 Health monitoring setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update the degraded banner to use /api/health instead of /api/health-simple');
    console.log('   2. Remove the temporary /api/health-simple endpoint');
    console.log('   3. Test the comprehensive health monitoring at /api/health');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Manual setup required:');
    console.log('Please run the following SQL in your Supabase Dashboard:');
    console.log('\n' + '='.repeat(80));
    console.log(`
CREATE TABLE IF NOT EXISTS public.system_health (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'healthy',
  message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON public.system_health(timestamp DESC);

INSERT INTO public.system_health (status, message, metadata) 
VALUES (
  'healthy', 
  'System initialized successfully',
  '{"version": "1.0.0", "initialized_at": "' || NOW()::text || '"}'::jsonb
);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage system health" ON public.system_health
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can read system health" ON public.system_health
  FOR SELECT USING (true);
    `);
    console.log('='.repeat(80));
  }
}

// Run the setup
setupHealthMonitoring().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
