import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: expose admin eligibility audit trail.
  return NextResponse.json({ status: 'pending', message: 'Audit log not yet implemented.' }, { status: 501 })
}
