import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword, setClientSessionData, type ClientSession } from '@/lib/auth'
import { getClientByEmail, getClientPasswordHash } from '@/lib/redis'
import { isEmailVerified } from '@/lib/email-verification'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Get client by email
    const clientData = await getClientByEmail(email)
    if (!clientData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const client = clientData as any

    // Verify password
    const passwordHash = await getClientPasswordHash(client.id)
    if (!passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, passwordHash as string)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if email is verified
    const verified = await isEmailVerified(client.id)
    if (!verified) {
      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in.',
          requiresVerification: true
        },
        { status: 403 }
      )
    }

    // Create session
    const session: ClientSession = {
      clientId: client.id,
      email: client.email,
      role: 'client',
      createdAt: Date.now()
    }

    await setClientSessionData(session)

    return NextResponse.json({
      success: true,
      user: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        role: 'client'
      }
    })
  } catch (error) {
    console.error('Client login error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
