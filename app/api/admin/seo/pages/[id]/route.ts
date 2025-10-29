import { NextRequest, NextResponse } from 'next/server'
import { getSEOPage, setSEOPage, deleteSEOPage } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const seoPageUpdateSchema = z.object({
  path: z.string().optional(),
  locale: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().optional(),
})

/**
 * GET /api/admin/seo/pages/[id]
 * Get a specific SEO page (admin only)
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
    const page = await getSEOPage(id)

    if (!page) {
      return NextResponse.json({ error: 'SEO page not found' }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error: any) {
    console.error('Error fetching SEO page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO page' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/seo/pages/[id]
 * Update an SEO page (admin only)
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
    const existingPage = await getSEOPage(id)

    if (!existingPage) {
      return NextResponse.json({ error: 'SEO page not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = seoPageUpdateSchema.parse(body)

    const updatedPage = {
      ...existingPage,
      ...data,
      lastUpdated: new Date().toISOString(),
    }

    await setSEOPage(id, updatedPage)

    return NextResponse.json({ page: updatedPage, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating SEO page:', error)
    return NextResponse.json(
      { error: 'Failed to update SEO page' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/seo/pages/[id]
 * Delete an SEO page (admin only)
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
    const page = await getSEOPage(id)

    if (!page) {
      return NextResponse.json({ error: 'SEO page not found' }, { status: 404 })
    }

    await deleteSEOPage(id)

    return NextResponse.json({ success: true, message: 'SEO page deleted' })
  } catch (error: any) {
    console.error('Error deleting SEO page:', error)
    return NextResponse.json(
      { error: 'Failed to delete SEO page' },
      { status: 500 }
    )
  }
}
