"use client"

import { useState } from 'react'
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@proof-of-fit/ui'
import { Alert, AlertDescription, AlertTitle } from '@proof-of-fit/ui'

const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6]
const PRICE_PER_MONTH = 12

export default function GiftCheckoutForm() {
  const [months, setMonths] = useState<number>(1)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(months * PRICE_PER_MONTH)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/gift/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          months,
          recipientEmail: recipientEmail.trim() || null,
          message: message.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Unable to start checkout')
      }

      const data = await response.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      throw new Error('Checkout URL missing from response')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="months">Months to sponsor</Label>
          <Select value={months.toString()} onValueChange={value => setMonths(parseInt(value, 10))}>
            <SelectTrigger id="months">
              <SelectValue placeholder="Select months" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map(option => (
                <SelectItem key={option} value={option.toString()}>
                  {option} month{option > 1 ? 's' : ''} ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(option * PRICE_PER_MONTH)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientEmail">Recipient email (optional)</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="candidate@email.com"
            value={recipientEmail}
            onChange={event => setRecipientEmail(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message to include (optional)</Label>
        <Textarea
          id="message"
          placeholder="Share encouragement or context to include with the gift email."
          value={message}
          onChange={event => setMessage(event.target.value)}
          maxLength={250}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">We’ll send this along with the gift code when checkout completes.</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to start checkout</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Total due today: <span className="font-semibold text-foreground">{formattedTotal}</span>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Redirecting…' : 'Proceed to secure checkout'}
        </Button>
      </div>
    </form>
  )
}
