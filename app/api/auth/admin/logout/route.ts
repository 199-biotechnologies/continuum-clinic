import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Admin logout endpoint
 * POST /api/auth/admin/logout
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Delete the admin token cookie
    cookieStore.delete('admin-token')

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
