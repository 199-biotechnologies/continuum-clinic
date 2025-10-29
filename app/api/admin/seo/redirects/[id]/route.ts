import { NextRequest, NextResponse } from 'next/server'
import { getRedirect, setRedirect, deleteRedirect } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const redirectUpdateSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(['301', '302']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

/**
 * GET /api/admin/seo/redirects/[id]
 * Get a specific redirect (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const redirect = await getRedirect(id)

    if (!redirect) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 })
    }

    return NextResponse.json({ redirect })
  } catch (error: any) {
    console.error('Error fetching redirect:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redirect' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/seo/redirects/[id]
 * Update a redirect (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existingRedirect = await getRedirect(id)

    if (!existingRedirect) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = redirectUpdateSchema.parse(body)

    const updatedRedirect = {
      ...existingRedirect,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setRedirect(id, updatedRedirect)

    return NextResponse.json({ redirect: updatedRedirect, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating redirect:', error)
    return NextResponse.json(
      { error: 'Failed to update redirect' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/seo/redirects/[id]
 * Delete a redirect (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const redirect = await getRedirect(id)

    if (!redirect) {
      return NextResponse.json({ error: 'Redirect not found' }, { status: 404 })
    }

    await deleteRedirect(id)

    return NextResponse.json({ success: true, message: 'Redirect deleted' })
  } catch (error: any) {
    console.error('Error deleting redirect:', error)
    return NextResponse.json(
      { error: 'Failed to delete redirect' },
      { status: 500 }
    )
  }
}
