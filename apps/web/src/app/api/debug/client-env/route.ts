import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // This endpoint will show what environment variables are available on the client side
  // by returning them in a way that can be accessed by the browser
  
  return NextResponse.json({
    clientEnv: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
      NODE_ENV: process.env.NODE_ENV,
    },
    // Also return a simple script that can be run in the browser
    browserScript: `
      console.log('Client-side environment check:');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET');
      console.log('NEXT_PUBLIC_DEMO_MODE:', process.env.NEXT_PUBLIC_DEMO_MODE);
    `
  })
}
