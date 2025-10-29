import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCategoriesList, addCategory, getAllCategories } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'

const categorySchema = z.object({
  name: z.string().min(1).max(50)
})

// GET - List all categories
export async function GET() {
  try {
    await requireAdminAuth()
    const categoriesResult = await getCategoriesList()
    const categoriesWithCountsResult = await getAllCategories()

    const categories: string[] = Array.isArray(categoriesResult) ? categoriesResult : []
    const categoriesWithCounts: string[] = Array.isArray(categoriesWithCountsResult) ? categoriesWithCountsResult : []

    return NextResponse.json({
      categories: categories.map(cat => ({
        name: cat,
        count: categoriesWithCounts.filter(c => c === cat).length
      }))
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()

    const body = await request.json()
    const { name } = categorySchema.parse(body)

    await addCategory(name)

    return NextResponse.json({ category: name }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
