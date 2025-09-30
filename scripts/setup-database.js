#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps set up the required database tables for ProofOfFit.
 * Run this script after deploying to production to enable full functionality.
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

async function checkTable(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error && error.message.includes(`relation "public.${tableName}" does not exist`)) {
      return { exists: false, error: null };
    } else if (error) {
      return { exists: false, error: error.message };
    } else {
      return { exists: true, error: null };
    }
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function setupDatabase() {
  console.log('🗄️  Checking database setup...\n');

  const tables = ['system_health', 'audit_events'];
  const results = {};

  for (const table of tables) {
    console.log(`Checking ${table} table...`);
    const result = await checkTable(table);
    results[table] = result;
    
    if (result.exists) {
      console.log(`✅ ${table} table exists`);
    } else {
      console.log(`❌ ${table} table missing`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }

  console.log('\n📋 Setup Summary:');
  console.log('================');
  
  const missingTables = tables.filter(table => !results[table].exists);
  
  if (missingTables.length === 0) {
    console.log('✅ All required tables are present!');
    return;
  }

  console.log(`❌ Missing tables: ${missingTables.join(', ')}`);
  console.log('\n🔧 To fix this:');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run the appropriate migration scripts:');
  
  if (missingTables.includes('system_health')) {
    console.log('   - Execute: supabase/migrations/003_system_health_table.sql');
  }
  
  if (missingTables.includes('audit_events')) {
    console.log('   - Execute: supabase/migrations/004_audit_events_table.sql');
  }
  
  console.log('\n4. Or use the API endpoints:');
  console.log('   - POST /api/admin/setup-health');
  console.log('   - POST /api/admin/create-audit-events');
}

// Run the setup
setupDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
