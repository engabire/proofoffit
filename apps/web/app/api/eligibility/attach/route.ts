import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: implement eligibility attachment to account.
  return NextResponse.json({ status: 'pending', message: 'Attach flow not yet implemented.' }, { status: 501 })
}
