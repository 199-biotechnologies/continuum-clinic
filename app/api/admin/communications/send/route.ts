import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getAllClients, getTemplate } from '@/lib/redis'
import { sendBulkEmail, replaceVariables } from '@/lib/email'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const bulkEmailSchema = z.object({
  recipientFilter: z.enum(['all-clients', 'clients-with-pets', 'custom-list']),
  customEmails: z.array(z.string().email()).optional(),
  templateId: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  body: z.string().min(10, 'Body required'),
  replyTo: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const data = bulkEmailSchema.parse(body)

    // Get recipients based on filter
    let recipients: { email: string; name: string }[] = []

    if (data.recipientFilter === 'custom-list' && data.customEmails) {
      recipients = data.customEmails.map((email, idx) => ({
        email,
        name: `Recipient ${idx + 1}`,
      }))
    } else if (data.recipientFilter === 'all-clients') {
      const clients = await getAllClients() as any[]
      recipients = clients.map(c => ({
        email: c.email,
        name: `${c.firstName} ${c.lastName}`,
      }))
    } else if (data.recipientFilter === 'clients-with-pets') {
      const clients = await getAllClients() as any[]
      // Note: Would need to filter clients who have pets
      // For now, just get all clients
      recipients = clients.map(c => ({
        email: c.email,
        name: `${c.firstName} ${c.lastName}`,
      }))
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      )
    }

    // Use template if provided
    let subject = data.subject
    let emailBody = data.body

    if (data.templateId) {
      const template = await getTemplate(data.templateId) as any
      if (template) {
        subject = template.subject
        emailBody = template.body
      }
    }

    // Send bulk email
    const results = await sendBulkEmail({
      recipients,
      subject,
      body: emailBody,
      replyTo: data.replyTo,
    })

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: recipients.length,
    })
  } catch (error) {
    console.error('Error sending bulk email:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send bulk email' },
      { status: 500 }
    )
  }
}
