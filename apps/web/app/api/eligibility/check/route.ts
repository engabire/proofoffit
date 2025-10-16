import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: implement EIN eligibility check.
  return NextResponse.json({ status: 'pending', message: 'Eligibility check not yet implemented.' }, { status: 501 })
}
