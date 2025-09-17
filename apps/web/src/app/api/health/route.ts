import { NextResponse } from 'next/server'
import packageJson from '../../../../package.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    return NextResponse.json({
      status: 'ok',
      time: now.toISOString(),
      version: packageJson.version || '0.0.0',
      service: 'web',
    })
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}
