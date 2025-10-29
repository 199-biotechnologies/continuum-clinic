import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getTemplate } from '@/lib/redis'
import { sendEmail, replaceVariables } from '@/lib/email'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const testSchema = z.object({
  testEmail: z.string().email('Invalid test email address'),
  testData: z.record(z.string()).optional(),
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
    const requestBody = await request.json()
    const { testEmail, testData } = testSchema.parse(requestBody)

    // Get template
    const template = await getTemplate(id) as any
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Replace variables with test data
    const defaultTestData = {
      clientName: 'Test Client',
      petName: 'Test Pet',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      clinicName: 'Continuum Clinic',
      clinicEmail: 'info@thecontinuumclinic.com',
      clinicPhone: '+44 20 1234 5678',
      clinicAddress: '12 Upper Wimpole Street, London W1G 6LW',
      ...testData,
    }

    const subject = replaceVariables(template.subject, defaultTestData)
    const body = replaceVariables(template.body, defaultTestData)

    // Send test email
    await sendEmail({
      to: testEmail,
      subject: `[TEST] ${subject}`,
      body: `
        <div style="padding: 16px; background: #fff3cd; border: 1px solid #ffc107; margin-bottom: 16px;">
          <strong>This is a test email</strong> - Template: ${template.name}
        </div>
        ${body}
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending test email:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
