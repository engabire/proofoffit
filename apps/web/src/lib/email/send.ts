import { env } from '@/lib/env'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type GiftEmailPayload = {
  code: string
  months: number
  amountCents: number
  currency: string
  sponsorEmail: string
  recipientEmail?: string | null
  message?: string | null
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = env.email.resendKey || process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('Resend API key missing; skipping email send')
    return
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ProofOfFit <no-reply@updates.proofoffit.com>',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Failed to send Resend email', response.status, text)
    }
  } catch (error) {
    console.error('Resend email error', error)
  }
}

function formatGiftSummary({ code, months, amountCents, currency }: GiftEmailPayload) {
  const amount = (amountCents / 100).toFixed(2)
  return `<p><strong>Gift Code:</strong> ${code}<br /><strong>Duration:</strong> ${months} month${months > 1 ? 's' : ''}<br /><strong>Value:</strong> ${currency} ${amount}</p>`
}

export async function sendGiftCreatedEmails(details: GiftEmailPayload) {
  const { code, months, amountCents, currency, sponsorEmail, recipientEmail, message } = details

  const sponsorHtml = `
    <h2>Thanks for sponsoring ProofOfFit Pro</h2>
    <p>Share the code below with your recipient. They can redeem it from their dashboard without adding a card.</p>
    ${formatGiftSummary(details)}
    ${message ? `<p><em>Your message:</em><br />${message}</p>` : ''}
    <p>Need help? Reply to this email and our team will jump in.</p>
  `

  await sendResendEmail(
    sponsorEmail,
    `Your ProofOfFit gift code (${code})`,
    sponsorHtml,
  )

  if (recipientEmail) {
    const recipientHtml = `
      <h2>You've been sponsored for ProofOfFit Pro</h2>
      <p>${sponsorEmail} just gifted you ProofOfFit Pro. Use the code below to unlock your sponsored months.</p>
      ${formatGiftSummary(details)}
      <p>Redeem at <a href="https://app.proofoffit.com/gift">proofoffit.com/gift</a> or inside the app.</p>
      ${message ? `<p><em>Message from ${sponsorEmail}:</em><br />${message}</p>` : ''}
      <p>We never auto-charge after a gift ends. You can renew manually if you’d like to continue.</p>
    `

    await sendResendEmail(
      recipientEmail,
      `${sponsorEmail} gifted you ProofOfFit Pro`,
      recipientHtml,
    )
  }
}
