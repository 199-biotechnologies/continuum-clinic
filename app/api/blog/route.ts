import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAllPosts, setPost, getPostsByLocale, getPostsByStatus } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'
import type { Post } from '@/types/content'

const postSchema = z.object({
  locale: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  author: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
})

// Calculate reading time (approx 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

// GET - List all posts with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let posts: any[]

    if (locale) {
      posts = await getPostsByLocale(locale, limit)
    } else if (status) {
      posts = await getPostsByStatus(status, limit)
    } else {
      posts = await getAllPosts(limit)
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await requireAdminAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const post: Post = {
      id: postId,
      ...validatedData,
      createdAt: now,
      updatedAt: now,
      views: 0,
      readingTime: calculateReadingTime(validatedData.content),
      publishedAt: validatedData.status === 'published'
        ? (validatedData.publishedAt || now)
        : undefined
    }

    await setPost(postId, post)

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
