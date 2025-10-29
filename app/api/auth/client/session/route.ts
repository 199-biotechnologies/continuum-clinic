import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/auth-helpers'
import { getClient } from '@/lib/redis'

/**
 * Check client session status
 * GET /api/auth/client/session
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getClientUser()

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    // Get full client data
    const clientData = await getClient(user.userId)

    if (!clientData) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const client = clientData as any

    return NextResponse.json({
      authenticated: true,
      user: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        createdAt: client.createdAt
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
