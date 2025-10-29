import { NextRequest, NextResponse } from 'next/server'
import { deleteCategory } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'

// DELETE - Delete category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const authResult = await requireAdminAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name } = await params
    await deleteCategory(decodeURIComponent(name))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
