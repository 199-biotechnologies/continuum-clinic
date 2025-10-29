import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { saveContactSubmission, incrementContact } from '@/lib/redis'
import { incrementConversion } from '@/lib/analytics'
import { ContactFormSubmission } from '@/types/communications'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['general', 'consultation', 'investment', 'media', 'careers']).default('general'),
  preferredContact: z.enum(['email', 'phone']).default('email'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    const { name, email, phone, subject, message, type, preferredContact } = validatedData

    // Create submission record
    const contactId = uuidv4()
    const submittedAt = new Date().toISOString()

    const submission: ContactFormSubmission = {
      id: contactId,
      name,
      email,
      phone,
      subject,
      message,
      type,
      preferredContact,
      status: 'new',
      submittedAt,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    }

    // Save to Redis
    await saveContactSubmission(contactId, submission)

    // Increment analytics counter
    const today = new Date().toISOString().split('T')[0]
    await incrementContact(today)

    // Track conversion
    await incrementConversion('contact', today)

    // Send notification email to clinic
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'boris@199.clinic',
      to: process.env.EMAIL_TO || 'info@thecontinuumclinic.com',
      replyTo: email,
      subject: `[${type.toUpperCase()}] Contact Form: ${subject}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-weight: 300; color: #111;">New Contact Form Submission</h2>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Type:</strong> ${type.toUpperCase()}</p>
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Email:</strong> ${email}</p>
            ${phone ? `<p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Phone:</strong> ${phone}</p>` : ''}
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Preferred Contact:</strong> ${preferredContact}</p>
            <p style="margin: 0; font-weight: 300;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="margin: 24px 0;">
            <p style="font-weight: 300; margin: 0 0 8px 0;"><strong>Message:</strong></p>
            <p style="font-weight: 200; line-height: 1.6; color: #444; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="font-size: 12px; font-weight: 200; color: #888;">
              Sent from Continuum Clinic contact form<br/>
              View in admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/communications/contact/${contactId}">Click here</a>
            </p>
          </div>
        </div>
      `,
    })

    // Send auto-reply to user
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'boris@199.clinic',
      to: email,
      subject: 'Thank you for contacting Continuum Clinic',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-weight: 300; color: #111;">Thank You for Reaching Out</h2>

          <p style="font-weight: 300;">Dear ${name},</p>

          <p style="font-weight: 300; line-height: 1.6;">
            Thank you for contacting Continuum Clinic. We have received your message and will respond
            ${preferredContact === 'phone' && phone ? 'by phone' : 'by email'} as soon as possible.
          </p>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: 300;"><strong>Your inquiry:</strong></p>
            <p style="margin: 0; font-weight: 200;">${subject}</p>
          </div>

          <p style="font-weight: 300;">If you need immediate assistance, please call us at +44 20 1234 5678.</p>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="font-size: 12px; font-weight: 200; color: #888;">
              Continuum Clinic<br />
              12 Upper Wimpole Street, London W1G 6LW<br />
              info@thecontinuumclinic.com
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
    }

    return NextResponse.json({ success: true, id: contactId })
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
