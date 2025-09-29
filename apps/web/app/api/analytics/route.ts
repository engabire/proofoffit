import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // In a real system we would enqueue to a data sink. For now, accept.
    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 400 })
  }
}
