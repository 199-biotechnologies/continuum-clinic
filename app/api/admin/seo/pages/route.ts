import { NextRequest, NextResponse } from 'next/server'
import { getAllSEOPages, setSEOPage } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const seoPageSchema = z.object({
  path: z.string(),
  locale: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().optional(),
})

/**
 * GET /api/admin/seo/pages
 * List all SEO pages (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await getAllSEOPages()
    return NextResponse.json({ pages })
  } catch (error: any) {
    console.error('Error fetching SEO pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO pages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/seo/pages
 * Create a new SEO page configuration (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = seoPageSchema.parse(body)

    const pageId = uuidv4()
    const now = new Date().toISOString()

    const seoPage = {
      id: pageId,
      ...data,
      createdAt: now,
      lastUpdated: now,
    }

    await setSEOPage(pageId, seoPage)

    return NextResponse.json({ page: seoPage, success: true }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating SEO page:', error)
    return NextResponse.json(
      { error: 'Failed to create SEO page' },
      { status: 500 }
    )
  }
}
