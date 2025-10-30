import { NextRequest, NextResponse } from 'next/server'
import { verifyClientEmail, resendVerificationToken } from '@/lib/email-verification'
import { sendVerificationEmail } from '@/lib/email'
import { getClientById } from '@/lib/redis'

// GET - Verify email with token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token required' },
        { status: 400 }
      )
    }

    const result = await verifyClientEmail(token)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      clientId: result.clientId
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    )
  }
}

// POST - Resend verification email
export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json()

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    // Get client details
    const client = await getClientById(clientId)

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Generate new verification token
    const verificationToken = await resendVerificationToken(
      clientId,
      client.email
    )

    // Send verification email
    await sendVerificationEmail(
      client.email,
      `${client.firstName} ${client.lastName}`,
      verificationToken.token
    )

    return NextResponse.json({
      success: true,
      message: 'Verification email sent'
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}
