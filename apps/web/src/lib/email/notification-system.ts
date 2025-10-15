import { env } from '@/lib/env'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export type EmailNotificationType = 
  | 'verification_sent'
  | 'verification_success'
  | 'audit_link_created'
  | 'audit_link_accessed'
  | 'password_reset'
  | 'account_created'
  | 'security_alert'

export interface EmailNotificationPayload {
  type: EmailNotificationType
  userEmail: string
  data: Record<string, any>
  metadata?: {
    timestamp: Date
    ipAddress?: string
    userAgent?: string
  }
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = env.email?.resendKey || process.env.RESEND_API_KEY
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn('Resend API key missing; skipping email send')
    return { success: false, error: 'Email service not configured' }
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
      // eslint-disable-next-line no-console
      console.error('Failed to send Resend email', response.status, text)
      return { success: false, error: `Email service error: ${response.status}` }
    }

    return { success: true, messageId: response.headers.get('x-message-id') }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Resend email error', error)
    return { success: false, error: 'Network error' }
  }
}

function generateEmailTemplate(type: EmailNotificationType, data: Record<string, any>): { subject: string; html: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.proofoffit.com'
  
  switch (type) {
    case 'verification_sent':
      return {
        subject: 'Verify your ProofOfFit account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Verify Your Account</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Complete your ProofOfFit setup</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">Welcome to ProofOfFit!</h2>
              <p>Thank you for signing up. To complete your account setup and start using ProofOfFit, please verify your email address.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.verificationUrl}" 
                   style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #17a2b8;">What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Click the verification link above</li>
                  <li>You'll be redirected to your dashboard</li>
                  <li>Start building your evidence portfolio</li>
                  <li>Connect with opportunities that match your skills</li>
                </ul>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #e0a800;">Security Note</h3>
                <p style="margin: 0;">This verification link expires in 1 hour for your security. If you didn't create an account with ProofOfFit, you can safely ignore this email.</p>
              </div>
            </div>
          </div>
        `
      }

    case 'verification_success':
      return {
        subject: 'Welcome to ProofOfFit! Your account is verified',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Welcome to ProofOfFit!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your account is now verified and ready to use</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">Account Successfully Verified</h2>
              <p>Great news! Your email address has been verified and your ProofOfFit account is now active.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard" 
                   style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #28a745;">What you can do now:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>Upload your resume</strong> and get AI-powered fit analysis</li>
                  <li><strong>Search for jobs</strong> that match your skills and experience</li>
                  <li><strong>Build your evidence portfolio</strong> to showcase your achievements</li>
                  <li><strong>Connect with employers</strong> who value your unique background</li>
                </ul>
              </div>
            </div>
          </div>
        `
      }

    case 'audit_link_created':
      return {
        subject: `Audit Link Created: ${data.targetTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔗 Audit Link Created</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your secure evidence sharing link is ready</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">Evidence Board: ${data.targetTitle}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #28a745;">✅ Link Created Successfully</h3>
                <p style="margin-bottom: 15px;">Your audit link has been generated and is ready to share with stakeholders.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <strong>Audit Link:</strong><br>
                  <a href="${data.auditUrl}" style="color: #007bff; word-break: break-all;">${data.auditUrl}</a>
                </div>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #17a2b8;">🔒 Security Features</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${data.expiresAt ? `<li><strong>Expiration:</strong> ${new Date(data.expiresAt).toLocaleDateString()}</li>` : ''}
                  ${data.maxViews ? `<li><strong>View Limit:</strong> ${data.maxViews} views maximum</li>` : ''}
                  ${data.watermark ? `<li><strong>Watermark:</strong> Security watermark enabled</li>` : ''}
                </ul>
              </div>
            </div>
          </div>
        `
      }

    case 'security_alert':
      return {
        subject: 'Security Alert: Unusual Activity Detected',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚨 Security Alert</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Unusual activity detected on your account</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">Security Notice</h2>
              <p>We detected unusual activity on your ProofOfFit account that may require your attention.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #dc3545;">Activity Details</h3>
                <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                <p><strong>Activity:</strong> ${data.activity}</p>
                ${data.ipAddress ? `<p><strong>IP Address:</strong> ${data.ipAddress}</p>` : ''}
                ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/security" 
                   style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Review Security Settings
                </a>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #e0a800;">If this wasn't you:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Change your password immediately</li>
                  <li>Review your account activity</li>
                  <li>Contact our support team</li>
                  <li>Enable two-factor authentication</li>
                </ul>
              </div>
            </div>
          </div>
        `
      }

    default:
      return {
        subject: 'ProofOfFit Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
              <h2 style="color: #333; margin-top: 0;">ProofOfFit Notification</h2>
              <p>You have a new notification from ProofOfFit.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          </div>
        `
      }
  }
}

export async function sendEmailNotification(payload: EmailNotificationPayload) {
  const { type, userEmail, data } = payload
  
  try {
    const { subject, html } = generateEmailTemplate(type, data)
    const result = await sendResendEmail(userEmail, subject, html)
    
    // Log the notification attempt
    // eslint-disable-next-line no-console
    console.log(`Email notification sent: ${type} to ${userEmail}`, {
      success: result.success,
      messageId: result.messageId,
      error: result.error
    })
    
    return result
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send email notification: ${type}`, error)
    return { success: false, error: 'Failed to send notification' }
  }
}

// Convenience functions for common notifications
export async function sendVerificationEmail(userEmail: string, verificationUrl: string) {
  return sendEmailNotification({
    type: 'verification_sent',
    userEmail,
    data: { verificationUrl },
    metadata: { timestamp: new Date() }
  })
}

export async function sendVerificationSuccessEmail(userEmail: string) {
  return sendEmailNotification({
    type: 'verification_success',
    userEmail,
    data: {},
    metadata: { timestamp: new Date() }
  })
}

export async function sendAuditLinkCreatedEmail(userEmail: string, targetTitle: string, auditUrl: string, options: {
  expiresAt?: Date
  maxViews?: number
  watermark?: boolean
}) {
  return sendEmailNotification({
    type: 'audit_link_created',
    userEmail,
    data: {
      targetTitle,
      auditUrl,
      ...options
    },
    metadata: { timestamp: new Date() }
  })
}

export async function sendSecurityAlertEmail(userEmail: string, activity: string, details: {
  ipAddress?: string
  location?: string
  timestamp?: Date
}) {
  return sendEmailNotification({
    type: 'security_alert',
    userEmail,
    data: {
      activity,
      timestamp: details.timestamp || new Date(),
      ipAddress: details.ipAddress,
      location: details.location
    },
    metadata: { 
      timestamp: new Date(),
      ipAddress: details.ipAddress
    }
  })
}
