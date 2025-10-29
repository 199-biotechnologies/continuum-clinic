import { NextRequest, NextResponse } from 'next/server'
import { deleteTag } from '@/lib/redis'
import { requireAdminAuth } from '@/lib/auth-helpers'

// DELETE - Delete tag (admin only)
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
    await deleteTag(decodeURIComponent(name))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
