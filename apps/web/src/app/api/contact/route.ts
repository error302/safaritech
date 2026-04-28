import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Save contact submission to database
    await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'NEW',
      },
    })

    // Send email notification to admin
    try {
      await sendEmail({
        to: 'hello@safaritech.co.ke',
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message - Safaritech',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message about "${subject}" and will get back to you within 24 hours.</p>
          <p>Best regards,<br>Safaritech Team</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
