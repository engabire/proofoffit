"use client"

import { useState } from 'react'
import { Button, Badge } from '@proof-of-fit/ui'
import { Copy, CheckCircle, Gift } from 'lucide-react'

interface GiftCodeClipboardProps {
  code: string
  months: number
}

export default function GiftCodeClipboard({ code, months }: GiftCodeClipboardProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy gift code', error)
    }
  }

  return (
    <div className="rounded-lg border bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label htmlFor="gift-code" className="text-sm font-medium text-emerald-700">
            Gift code
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="gift-code"
              type="text"
              value={code}
              readOnly
              className="text-2xl font-bold tracking-widest bg-white border border-emerald-300 rounded-lg px-4 py-2 font-mono flex-1 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-describedby="gift-code-description"
            />
            <Button 
              variant={copied ? 'secondary' : 'default'} 
              onClick={onCopy} 
              className={`shrink-0 ${copied ? 'bg-green-100 text-green-800 border-green-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              aria-label={copied ? 'Gift code copied to clipboard' : 'Copy gift code to clipboard'}
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" /> Copy code
                </>
              )}
            </Button>
          </div>
          <div id="gift-code-description" className="mt-3 flex items-center gap-2">
            {months > 0 ? (
              <Badge variant="outline" className="bg-white border-emerald-300 text-emerald-700">
                <Gift className="h-3 w-3 mr-1" aria-hidden="true" />
                {months} sponsored month{months > 1 ? 's' : ''}
              </Badge>
            ) : null}
            <span className="text-sm text-emerald-600">
              Share this code with your recipient
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
