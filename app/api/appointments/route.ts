import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const appointmentSchema = z.object({
  ownerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  petName: z.string().min(1, 'Pet name is required'),
  petSpecies: z.enum(['dog', 'cat', 'other']),
  appointmentType: z.enum(['initial', 'followup', 'diagnostic', 'treatment', 'emergency']),
  preferredDate: z.string(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = appointmentSchema.parse(body)

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Format date nicely
    const date = new Date(data.preferredDate)
    const formattedDate = date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Send email to clinic
    const { data: clinicEmail, error: clinicError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'boris@199.clinic',
      to: process.env.EMAIL_TO || 'info@thecontinuumclinic.com',
      replyTo: data.email,
      subject: `New Consultation Request: ${data.petName} (${data.petSpecies})`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-weight: 300; color: #111;">New Consultation Booking Request</h2>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="font-weight: 300; margin: 0 0 12px 0;">Client Information</h3>
            <p style="margin: 0 0 6px 0; font-weight: 300;"><strong>Name:</strong> ${data.ownerName}</p>
            <p style="margin: 0 0 6px 0; font-weight: 300;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 0; font-weight: 300;"><strong>Phone:</strong> ${data.phone}</p>
          </div>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="font-weight: 300; margin: 0 0 12px 0;">Pet Information</h3>
            <p style="margin: 0 0 6px 0; font-weight: 300;"><strong>Pet Name:</strong> ${data.petName}</p>
            <p style="margin: 0; font-weight: 300;"><strong>Species:</strong> ${data.petSpecies}</p>
          </div>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="font-weight: 300; margin: 0 0 12px 0;">Appointment Details</h3>
            <p style="margin: 0 0 6px 0; font-weight: 300;"><strong>Type:</strong> ${data.appointmentType}</p>
            <p style="margin: 0; font-weight: 300;"><strong>Preferred Date:</strong> ${formattedDate}</p>
          </div>

          ${data.message ? `
            <div style="margin: 24px 0;">
              <h3 style="font-weight: 300; margin: 0 0 8px 0;">Additional Notes</h3>
              <p style="font-weight: 200; line-height: 1.6; color: #444; white-space: pre-wrap;">${data.message}</p>
            </div>
          ` : ''}

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="font-size: 12px; font-weight: 200; color: #888;">
              Sent from Continuum Clinic booking form
            </p>
          </div>
        </div>
      `,
    })

    if (clinicError) {
      console.error('Resend clinic email error:', clinicError)
      return NextResponse.json(
        { error: 'Failed to send confirmation email to clinic' },
        { status: 500 }
      )
    }

    // Send confirmation email to client
    const { error: clientError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'boris@199.clinic',
      to: data.email,
      subject: 'Consultation Request Received - Continuum Clinic',
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="font-weight: 300; color: #111;">Consultation Request Received</h2>

          <p style="font-weight: 200; line-height: 1.6; color: #444;">
            Dear ${data.ownerName},
          </p>

          <p style="font-weight: 200; line-height: 1.6; color: #444;">
            Thank you for your consultation request for ${data.petName}. We've received your booking request for ${formattedDate}.
          </p>

          <p style="font-weight: 200; line-height: 1.6; color: #444;">
            Our team will review your request and contact you within 24 hours to confirm the appointment time and discuss next steps.
          </p>

          <div style="margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="font-weight: 300; margin: 0 0 12px 0;">Your Request Summary</h3>
            <p style="margin: 0 0 6px 0; font-weight: 300;">Pet: ${data.petName} (${data.petSpecies})</p>
            <p style="margin: 0 0 6px 0; font-weight: 300;">Type: ${data.appointmentType}</p>
            <p style="margin: 0; font-weight: 300;">Preferred Date: ${formattedDate}</p>
          </div>

          <p style="font-weight: 200; line-height: 1.6; color: #444;">
            If you have any questions in the meantime, please don't hesitate to contact us.
          </p>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="font-weight: 200; margin: 0 0 4px 0;">Continuum Clinic</p>
            <p style="font-size: 12px; font-weight: 200; color: #888; margin: 0;">
              Veterinary longevity medicine. London.
            </p>
          </div>
        </div>
      `,
    })

    if (clientError) {
      console.error('Resend client email error:', clientError)
      // Don't fail the request if client email fails, clinic still got the booking
    }

    return NextResponse.json({ success: true, data: clinicEmail })
  } catch (error) {
    console.error('Appointment booking error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    )
  }
}
