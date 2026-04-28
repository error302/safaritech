import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { sendEmail, getPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Return success even if user doesn't exist to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent.',
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send password reset email
    try {
      const emailTemplate = getPasswordResetEmail(resetUrl)
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
