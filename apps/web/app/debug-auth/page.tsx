"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'

export default function DebugAuthPage() {
  const [results, setResults] = useState<string[]>([])
  const [email, setEmail] = useState('test@example.com')
  
  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const testSupabaseConfig = () => {
    addResult('Testing Supabase configuration...')
    addResult(`isSupabaseConfigured(): ${isSupabaseConfigured()}`)
    addResult(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET'}`)
    addResult(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'}`)
  }

  const testSupabaseClient = () => {
    addResult('Testing Supabase client initialization...')
    try {
      const supabase = createClientComponentClient()
      addResult('✅ Supabase client created successfully')
      addResult(`Client created successfully`)
      return supabase
    } catch (error: any) {
      addResult(`❌ Supabase client creation failed: ${error.message}`)
      return null
    }
  }

  const testMagicLink = async () => {
    addResult('Testing magic link authentication...')
    const supabase = testSupabaseClient()
    if (!supabase) return

    try {
      addResult(`Sending magic link to: ${email}`)
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { role: 'candidate', authMethod: 'magic' },
        },
      })
      
      if (error) {
        addResult(`❌ Magic link error: ${error.message}`)
      } else {
        addResult('✅ Magic link sent successfully')
        addResult(`Response data: ${JSON.stringify(data)}`)
      }
    } catch (error: any) {
      addResult(`❌ Magic link exception: ${error.message}`)
    }
  }

  const testPasswordAuth = async () => {
    addResult('Testing password authentication...')
    const supabase = testSupabaseClient()
    if (!supabase) return

    try {
      addResult(`Attempting sign up with: ${email}`)
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'testpassword123',
        options: {
          data: { role: 'candidate', authMethod: 'password' },
        },
      })
      
      if (error) {
        addResult(`❌ Password auth error: ${error.message}`)
      } else {
        addResult('✅ Password auth successful')
        addResult(`Response data: ${JSON.stringify(data)}`)
      }
    } catch (error: any) {
      addResult(`❌ Password auth exception: ${error.message}`)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="test@example.com"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={testSupabaseConfig}>Test Config</Button>
              <Button onClick={testSupabaseClient}>Test Client</Button>
              <Button onClick={testMagicLink}>Test Magic Link</Button>
              <Button onClick={testPasswordAuth}>Test Password Auth</Button>
              <Button onClick={clearResults} variant="outline">Clear Results</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-gray-500">No results yet. Click a test button above.</div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
