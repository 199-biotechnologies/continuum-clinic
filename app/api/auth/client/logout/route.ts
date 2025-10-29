import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Client logout endpoint
 * POST /api/auth/client/logout
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Delete the client token cookie
    cookieStore.delete('client-token')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
