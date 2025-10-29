import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { setAdmin, setAdminEmailMapping, setAdminPasswordHash, getAdminByEmail } from '@/lib/redis'

/**
 * Initialize admin account
 * POST /api/admin/init
 * Body: { email, password, secret }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, secret } = body

    // Verify init secret from environment variable
    const ADMIN_INIT_SECRET = process.env.ADMIN_INIT_SECRET
    if (!ADMIN_INIT_SECRET || secret !== ADMIN_INIT_SECRET) {
      return NextResponse.json(
        { error: 'Invalid initialization secret' },
        { status: 403 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await getAdminByEmail(email)
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin account already exists with this email' },
        { status: 400 }
      )
    }

    // Create admin account
    const adminId = `admin-${Date.now()}`
    const passwordHash = await hashPassword(password)

    const adminData = {
      id: adminId,
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    }

    // Store in Redis
    await setAdmin(adminId, adminData)
    await setAdminEmailMapping(email, adminId)
    await setAdminPasswordHash(adminId, passwordHash)

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: adminId,
        email
      }
    })
  } catch (error) {
    console.error('Admin initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize admin account' },
      { status: 500 }
    )
  }
}
