import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const startedAt = Date.now()

function buildHeaders(status: number) {
  const isHealthy = status >= 200 && status < 300

  return {
    'cache-control': 'no-store',
    'x-health-status': isHealthy ? 'ok' : 'degraded',
    'x-health-uptime-seconds': Math.floor((Date.now() - startedAt) / 1000).toString(),
  }
}

export function HEAD() {
  return new Response(null, {
    status: 204,
    headers: buildHeaders(204),
  })
}

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000)

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.VERCEL_ENV || 'local',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
    },
    {
      status: 200,
      headers: buildHeaders(200),
    },
  )
}
