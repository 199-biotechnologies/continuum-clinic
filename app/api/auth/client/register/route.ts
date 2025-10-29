import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, setClientSessionData, type ClientSession } from '@/lib/auth'
import { getClientByEmail, setClient, setClientEmailMapping, setClientPasswordHash } from '@/lib/redis'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = registerSchema.parse(body)

    // Check if client already exists
    const existingClient = await getClientByEmail(email)
    if (existingClient) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Create client account
    const clientId = `client-${Date.now()}`
    const passwordHash = await hashPassword(password)

    const clientData = {
      id: clientId,
      email,
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    // Store in Redis
    await setClient(clientId, clientData)
    await setClientEmailMapping(email, clientId)
    await setClientPasswordHash(clientId, passwordHash)

    // Create session
    const session: ClientSession = {
      clientId,
      email,
      role: 'client',
      createdAt: Date.now()
    }

    await setClientSessionData(session)

    return NextResponse.json({
      success: true,
      user: {
        id: clientId,
        email,
        firstName,
        lastName,
        role: 'client'
      }
    })
  } catch (error) {
    console.error('Client registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
