import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  // Placeholder export: returns empty JSON archive
  const blob = JSON.stringify({ data: [] })
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="proofoffit-export.json"'
    }
  })
}
