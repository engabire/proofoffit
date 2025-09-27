import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if system_health table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'system_health')

    if (tableError) {
      console.error('Error checking tables:', tableError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to check table existence',
        details: tableError.message 
      }, { status: 500 })
    }

    if (tables && tables.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'system_health table already exists',
        tableExists: true 
      })
    }

    // Execute the migration SQL
    const migrationSQL = `
      -- Create system_health table for health monitoring
      CREATE TABLE IF NOT EXISTS public.system_health (
          id SERIAL PRIMARY KEY,
          service_name VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
          last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          response_time_ms INTEGER,
          error_message TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_system_health_service_name ON public.system_health(service_name);
      CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);
      CREATE INDEX IF NOT EXISTS idx_system_health_last_check ON public.system_health(last_check);

      -- Enable RLS
      ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY "Allow service role to manage system health" ON public.system_health
          FOR ALL USING (auth.role() = 'service_role');

      CREATE POLICY "Allow authenticated users to read system health" ON public.system_health
          FOR SELECT USING (auth.role() = 'authenticated');

      -- Insert initial health records
      INSERT INTO public.system_health (service_name, status, response_time_ms, metadata) VALUES
          ('database', 'healthy', 5, '{"version": "16.1", "connections": 10}'),
          ('storage', 'healthy', 15, '{"bucket": "proofoffit-storage", "region": "us-east-1"}'),
          ('auth', 'healthy', 8, '{"provider": "supabase", "users": 0}'),
          ('api', 'healthy', 12, '{"version": "1.0.0", "endpoints": 25}')
      ON CONFLICT DO NOTHING;

      -- Create function to update timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger for updated_at
      CREATE TRIGGER update_system_health_updated_at 
          BEFORE UPDATE ON public.system_health 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    })

    if (migrationError) {
      console.error('Migration error:', migrationError)
      return NextResponse.json({ 
        success: false, 
        error: 'Migration failed',
        details: migrationError.message 
      }, { status: 500 })
    }

    // Verify the table was created
    const { data: newTables, error: verifyError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'system_health')

    if (verifyError || !newTables || newTables.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Table creation verification failed' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'system_health table created successfully',
      tableExists: true 
    })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error.message 
    }, { status: 500 })
  }
}
