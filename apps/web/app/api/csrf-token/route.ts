import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, generateCSRFHash } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.CSRF_SECRET || 'default-secret-change-in-production'
    const token = generateCSRFToken()
    const hash = generateCSRFHash(token, secret)
    
    // Set the hash as a secure cookie
    const response = NextResponse.json({ token })
    
    response.cookies.set('csrf-token', hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
