import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import {
  getContactSubmission,
  updateContactStatus,
  deleteContactSubmission
} from '@/lib/redis'
import { sendContactReply } from '@/lib/email'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const updateSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
})

const replySchema = z.object({
  message: z.string().min(10, 'Reply must be at least 10 characters'),
})

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.role !== 'admin') {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const contact = await getContactSubmission(id)

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Mark as read if status is new
    if ((contact as any).status === 'new') {
      await updateContactStatus(id, 'read', 'new')
    }

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = updateSchema.parse(body)

    if (!status) {
      return NextResponse.json({ error: 'No status provided' }, { status: 400 })
    }

    const contact = await getContactSubmission(id) as any
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const updated = await updateContactStatus(id, status, contact.status)

    return NextResponse.json({ contact: updated })
  } catch (error) {
    console.error('Error updating contact:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const success = await deleteContactSubmission(id)

    if (!success) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
