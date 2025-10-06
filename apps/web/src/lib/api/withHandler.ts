import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/log'

type Handler<T = any> = (req: NextRequest) => Promise<NextResponse<T>> | NextResponse<T>

export class UserInputError extends Error { status = 400 }
export class AuthError extends Error { status = 401 }
export class ForbiddenError extends Error { status = 403 }
export class NotFoundError extends Error { status = 404 }

export function withHandler(handler: Handler) {
  return async function wrapped(req: NextRequest) {
    const started = performance.now()
    try {
      return await handler(req)
    } catch (err: any) {
      const status = err?.status || 500
      if (status >= 500) {
        log.error('API error', { path: req.nextUrl.pathname, message: err.message, stack: err.stack })
      } else {
        log.warn('API client error', { path: req.nextUrl.pathname, message: err.message })
      }
      return NextResponse.json({ success: false, error: { message: err.message, status } }, { status })
    } finally {
      const duration = (performance.now() - started).toFixed(1)
      log.debug('API timing', { path: req.nextUrl.pathname, ms: duration })
    }
  }
}
