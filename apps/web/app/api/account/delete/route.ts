import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  // Placeholder delete: would enqueue deletion job; respond accepted
  return NextResponse.json({ status: 'accepted' }, { status: 202 })
}
