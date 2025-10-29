import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword, setAdminSession, type AdminSession } from '@/lib/auth'
import { getAdminByEmail, getAdminPasswordHash } from '@/lib/redis'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Get admin by email
    const admin = await getAdminByEmail(email)
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordHash = await getAdminPasswordHash(admin.id)
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

    // Create session
    const session: AdminSession = {
      userId: admin.id,
      email: admin.email,
      role: 'admin',
      createdAt: Date.now()
    }

    await setAdminSession(session)

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)

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
