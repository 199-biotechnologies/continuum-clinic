import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = contactSchema.parse(body)

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'boris@199.clinic',
      to: process.env.EMAIL_TO || 'info@thecontinuumclinic.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-weight: 300; color: #111;">New Contact Form Submission</h2>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0; font-weight: 300;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="margin: 24px 0;">
            <p style="font-weight: 300; margin: 0 0 8px 0;"><strong>Message:</strong></p>
            <p style="font-weight: 200; line-height: 1.6; color: #444; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="font-size: 12px; font-weight: 200; color: #888;">
              Sent from Continuum Clinic contact form
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
