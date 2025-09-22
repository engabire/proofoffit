import { env } from '@/lib/env'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type AuditLinkNotificationPayload = {
  userEmail: string
  targetTitle: string
  auditUrl: string
  expiresAt: Date | null
  maxViews: number | null
  watermark: boolean
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = env.email?.resendKey || process.env.RESEND_API_KEY
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

function formatSecurityFeatures(expiresAt: Date | null, maxViews: number | null, watermark: boolean): string {
  const features = []
  
  if (expiresAt) {
    features.push(`<li><strong>Expiration:</strong> ${expiresAt.toLocaleDateString()}</li>`)
  }
  
  if (maxViews) {
    features.push(`<li><strong>View Limit:</strong> ${maxViews} views maximum</li>`)
  }
  
  if (watermark) {
    features.push(`<li><strong>Watermark:</strong> Security watermark enabled</li>`)
  }
  
  return features.length > 0 ? `<ul>${features.join('')}</ul>` : '<p>No additional security restrictions</p>'
}

export async function sendAuditLinkNotification(details: AuditLinkNotificationPayload) {
  const { userEmail, targetTitle, auditUrl, expiresAt, maxViews, watermark } = details

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔗 Audit Link Created</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your secure evidence sharing link is ready</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #333; margin-top: 0;">Evidence Board: ${targetTitle}</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #28a745;">✅ Link Created Successfully</h3>
          <p style="margin-bottom: 15px;">Your audit link has been generated and is ready to share with stakeholders.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <strong>Audit Link:</strong><br>
            <a href="${auditUrl}" style="color: #007bff; word-break: break-all;">${auditUrl}</a>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #17a2b8;">🔒 Security Features</h3>
          ${formatSecurityFeatures(expiresAt, maxViews, watermark)}
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #e0a800;">📋 Next Steps</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li><strong>Share the link</strong> with stakeholders who need to review your evidence</li>
            <li><strong>Monitor access</strong> through your ProofOfFit dashboard</li>
            <li><strong>Track views</strong> and engagement with your evidence board</li>
            <li><strong>Revoke access</strong> anytime if needed for security</li>
          </ol>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6f42c1; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #6f42c1;">🛡️ Compliance & Security</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>All access is logged and tracked for audit purposes</li>
            <li>Links are cryptographically secure and tamper-proof</li>
            <li>You maintain full control over access permissions</li>
            <li>Evidence is protected with enterprise-grade security</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://app.proofoffit.com/dashboard" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 14px;">
          <p>This email was sent because you created an audit link in ProofOfFit.</p>
          <p>Need help? Reply to this email and our team will assist you.</p>
        </div>
      </div>
    </div>
  `

  await sendResendEmail(
    userEmail,
    `Audit Link Created: ${targetTitle}`,
    html,
  )
}

export async function sendAuditLinkAccessNotification(details: {
  userEmail: string
  targetTitle: string
  viewerInfo: string
  accessTime: Date
  auditUrl: string
}) {
  const { userEmail, targetTitle, viewerInfo, accessTime, auditUrl } = details

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">👁️ Audit Link Accessed</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Someone viewed your evidence board</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #333; margin-top: 0;">Evidence Board: ${targetTitle}</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #28a745;">📊 Access Details</h3>
          <p><strong>Accessed by:</strong> ${viewerInfo}</p>
          <p><strong>Access time:</strong> ${accessTime.toLocaleString()}</p>
          <p><strong>Link:</strong> <a href="${auditUrl}" style="color: #007bff;">${auditUrl}</a></p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #17a2b8;">🔍 What This Means</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Someone clicked on your audit link and viewed your evidence</li>
            <li>This access has been logged for compliance purposes</li>
            <li>You can view detailed analytics in your dashboard</li>
            <li>All access is tracked and auditable</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://app.proofoffit.com/dashboard" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Analytics
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 14px;">
          <p>This notification helps you track who is viewing your evidence.</p>
          <p>Need help? Reply to this email and our team will assist you.</p>
        </div>
      </div>
    </div>
  `

  await sendResendEmail(
    userEmail,
    `Audit Link Accessed: ${targetTitle}`,
    html,
  )
}
