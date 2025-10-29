import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPost, setPost, deletePost } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishedAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
})

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

// GET - Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await getPost(id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT - Update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const existingPost = await getPost(id)

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    const updatedPost = {
      ...existingPost,
      ...validatedData,
      updatedAt: new Date().toISOString(),
      readingTime: validatedData.content
        ? calculateReadingTime(validatedData.content)
        : existingPost.readingTime
    }

    // Update published date if status changes to published
    if (validatedData.status === 'published' && existingPost.status !== 'published') {
      updatedPost.publishedAt = validatedData.publishedAt || new Date().toISOString()
    }

    await setPost(id, updatedPost)

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error('Error updating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const post = await getPost(id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await deletePost(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
