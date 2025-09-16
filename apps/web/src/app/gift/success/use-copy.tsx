"use client"

import { useState } from 'react'
import { Button, Badge } from '@proof-of-fit/ui'
import { Copy, CheckCircle } from 'lucide-react'

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
    <div className="rounded-md border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Gift code</p>
          <p className="text-2xl font-semibold tracking-widest">{code}</p>
          {months > 0 ? (
            <Badge variant="outline" className="mt-2">{months} sponsored month{months > 1 ? 's' : ''}</Badge>
          ) : null}
        </div>
        <Button variant={copied ? 'secondary' : 'default'} onClick={onCopy} className="self-start sm:self-center">
          {copied ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Copy code
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
