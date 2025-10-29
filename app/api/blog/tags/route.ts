import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getTagsList, addTag, getAllTags } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'

const tagSchema = z.object({
  name: z.string().min(1).max(30)
})

// GET - List all tags
export async function GET() {
  try {
    const tags = await getTagsList()
    const tagsWithCounts = await getAllTags()

    return NextResponse.json({
      tags: tags.map(tag => ({
        name: tag,
        count: tagsWithCounts.filter(t => t === tag).length
      }))
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST - Create tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = tagSchema.parse(body)

    await addTag(name)

    return NextResponse.json({ tag: name }, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
