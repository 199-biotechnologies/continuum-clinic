import { NextRequest, NextResponse } from 'next/server'
import { getAllRedirects, setRedirect } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const redirectSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(['301', '302']),
  status: z.enum(['active', 'inactive']).optional(),
})

/**
 * GET /api/admin/seo/redirects
 * List all redirects (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const redirects = await getAllRedirects()
    return NextResponse.json({ redirects })
  } catch (error: any) {
    console.error('Error fetching redirects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redirects' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/seo/redirects
 * Create a new redirect (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = redirectSchema.parse(body)

    const redirectId = uuidv4()
    const now = new Date().toISOString()

    const redirect = {
      id: redirectId,
      ...data,
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now,
    }

    await setRedirect(redirectId, redirect)

    return NextResponse.json({ redirect, success: true }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating redirect:', error)
    return NextResponse.json(
      { error: 'Failed to create redirect' },
      { status: 500 }
    )
  }
}
