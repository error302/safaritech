interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions) {
  // Try to send via Resend if API key is configured
  const resendApiKey = process.env.RESEND_API_KEY

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Safaritech <orders@safaritech.co.ke>',
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[EMAIL] Sent to ${options.to}: ${options.subject} (ID: ${data.id})`)
        return { success: true, id: data.id }
      } else {
        const error = await response.json()
        console.error('[EMAIL] Resend API error:', error)
      }
    } catch (error) {
      console.error('[EMAIL] Failed to send via Resend:', error)
    }
  }

  // Fallback: log to console
  console.log(`[EMAIL] Would send to ${options.to}: ${options.subject}`)
  console.log('[EMAIL] To enable real emails, set RESEND_API_KEY in environment variables')
  return { success: false, error: 'Email service not configured' }
}

export function getOrderConfirmationEmail(orderId: string, customerName: string) {
  return {
    subject: `Order Confirmed - ${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #00f5ff; font-size: 28px; margin: 0;">⚡ Safaritech</h1>
          </div>
          
          <div style="background-color: #141414; border: 1px solid #2a2a2a; border-radius: 12px; padding: 32px;">
            <h2 style="color: #ffffff; margin-top: 0;">Order Confirmed!</h2>
            <p style="color: #a0a0a0;">Hi ${customerName},</p>
            <p style="color: #a0a0a0;">Thank you for your order! We've received your order and it's being processed.</p>
            
            <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #a0a0a0; margin: 0;">Order ID</p>
              <p style="color: #00f5ff; font-size: 18px; font-weight: bold; margin: 4px 0 0 0;">${orderId}</p>
            </div>
            
            <p style="color: #a0a0a0;">You can track your order at:</p>
            <a href="https://safaritech.co.ke/track-order" style="display: inline-block; background-color: #00f5ff; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Track Order</a>
          </div>
          
          <div style="text-align: center; margin-top: 32px; color: #666;">
            <p>© 2024 Safaritech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function getPasswordResetEmail(resetLink: string) {
  return {
    subject: 'Reset Your Password - Safaritech',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #00f5ff; font-size: 28px; margin: 0;">⚡ Safaritech</h1>
          </div>
          
          <div style="background-color: #141414; border: 1px solid #2a2a2a; border-radius: 12px; padding: 32px;">
            <h2 style="color: #ffffff; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #a0a0a0;">We received a request to reset your password. Click the button below to set a new password:</p>
            
            <a href="${resetLink}" style="display: inline-block; background-color: #00f5ff; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
            
            <p style="color: #a0a0a0; margin-top: 24px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px; color: #666;">
            <p>© 2024 Safaritech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function getOrderShippedEmail(orderId: string, customerName: string) {
  return {
    subject: `Order Shipped - ${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #00f5ff; font-size: 28px; margin: 0;">⚡ Safaritech</h1>
          </div>
          
          <div style="background-color: #141414; border: 1px solid #2a2a2a; border-radius: 12px; padding: 32px;">
            <h2 style="color: #ffffff; margin-top: 0;">Your Order is On the Way! 🚚</h2>
            <p style="color: #a0a0a0;">Hi ${customerName},</p>
            <p style="color: #a0a0a0;">Great news! Your order ${orderId} has been shipped and is on its way to you.</p>
            
            <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #a0a0a0; margin: 0;">Expected Delivery</p>
              <p style="color: #00f5ff; font-size: 18px; font-weight: bold; margin: 4px 0 0 0;">Within 24-48 hours</p>
            </div>
            
            <a href="https://safaritech.co.ke/track-order" style="display: inline-block; background-color: #00f5ff; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Track Order</a>
          </div>
          
          <div style="text-align: center; margin-top: 32px; color: #666;">
            <p>© 2024 Safaritech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}
