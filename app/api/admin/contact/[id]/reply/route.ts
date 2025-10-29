import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getContactSubmission, updateContactStatus } from '@/lib/redis'
import { sendContactReply } from '@/lib/email'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const replySchema = z.object({
  message: z.string().min(10, 'Reply must be at least 10 characters'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { message } = replySchema.parse(body)

    // Get contact submission
    const contact = await getContactSubmission(id) as any
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Send reply email
    await sendContactReply({
      to: contact.email,
      toName: contact.name,
      subject: contact.subject,
      message,
    })

    // Update status to replied
    await updateContactStatus(id, 'replied', contact.status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending reply:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}
