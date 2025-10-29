import { Resend } from 'resend'
import { EmailTemplateVariables } from '@/types/communications'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'boris@199.clinic'
const TO_EMAIL = process.env.EMAIL_TO || 'info@thecontinuumclinic.com'

/**
 * Replace template variables with actual values
 */
export function replaceVariables(template: string, data: EmailTemplateVariables): string {
  let result = template

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, value)
    }
  })

  return result
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface AppointmentData {
  clientName: string
  clientEmail: string
  petName: string
  appointmentType: string
  preferredDate: string
  notes?: string
}

interface HealthRecordData {
  petName: string
  recordType: string
  date: string
  summary: string
}

/**
 * Send contact form submission email
 */
export async function sendContactEmail(data: ContactFormData) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Contact Form: ${data.subject}`,
      replyTo: data.email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">New Contact Form Submission</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #000;">Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="color: #666; font-size: 12px;">
            Sent from Continuum Clinic contact form
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send contact email:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send appointment confirmation to client
 */
export async function sendAppointmentConfirmation(data: AppointmentData) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.clientEmail,
      subject: 'Appointment Request Received - Continuum Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Appointment Request Received</h2>

          <p>Dear ${data.clientName},</p>

          <p>Thank you for your appointment request. We have received your submission and will contact you shortly to confirm your appointment.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Pet:</strong> ${data.petName}</p>
            <p><strong>Type:</strong> ${data.appointmentType}</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          </div>

          <p>If you need to make any changes or have questions, please contact us at:</p>
          <ul>
            <li>Email: ${TO_EMAIL}</li>
            <li>Phone: +44 20 1234 5678</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="color: #666; font-size: 12px;">
            Continuum Clinic<br />
            12 Upper Wimpole Street, London W1G 6LW
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send appointment confirmation:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send appointment notification to clinic
 */
export async function sendAppointmentNotification(data: AppointmentData) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Appointment Request - ${data.petName}`,
      replyTo: data.clientEmail,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">New Appointment Request</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">Client Information:</h3>
            <p><strong>Name:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Pet:</strong> ${data.petName}</p>
            <p><strong>Type:</strong> ${data.appointmentType}</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          </div>

          <p style="color: #666; font-size: 12px;">
            Please respond to confirm the appointment.
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send appointment notification:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send client registration welcome email
 */
export async function sendWelcomeEmail(clientName: string, clientEmail: string) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: 'Welcome to Continuum Clinic Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Welcome to Continuum Clinic</h2>

          <p>Dear ${clientName},</p>

          <p>Welcome to Continuum Clinic's client portal! Your account has been successfully created.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Add your pet's profile to your account</li>
              <li>View and track health records</li>
              <li>Schedule appointments online</li>
              <li>Access medication information</li>
            </ul>
          </div>

          <p>If you have any questions, please don't hesitate to contact us.</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="color: #666; font-size: 12px;">
            Continuum Clinic<br />
            12 Upper Wimpole Street, London W1G 6LW<br />
            ${TO_EMAIL} | +44 20 1234 5678
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send health record update notification to client
 */
export async function sendHealthRecordNotification(
  clientName: string,
  clientEmail: string,
  data: HealthRecordData
) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `New Health Record for ${data.petName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">New Health Record Added</h2>

          <p>Dear ${clientName},</p>

          <p>A new health record has been added to ${data.petName}'s profile.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Record Type:</strong> ${data.recordType}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Summary:</strong> ${data.summary}</p>
          </div>

          <p>You can view the complete record in your client portal.</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="color: #666; font-size: 12px;">
            Continuum Clinic<br />
            12 Upper Wimpole Street, London W1G 6LW
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send health record notification:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Generic send email function with template support
 */
export async function sendEmail({
  to,
  subject,
  body,
  replyTo
}: {
  to: string | string[]
  subject: string
  body: string
  replyTo?: string
}) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      replyTo,
      html: body
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send bulk email to multiple recipients
 */
export async function sendBulkEmail({
  recipients,
  subject,
  body,
  replyTo
}: {
  recipients: { email: string; name: string }[]
  subject: string
  body: string
  replyTo?: string
}) {
  const results = []

  for (const recipient of recipients) {
    try {
      const personalizedBody = replaceVariables(body, {
        clientName: recipient.name
      })

      await sendEmail({
        to: recipient.email,
        subject,
        body: personalizedBody,
        replyTo
      })

      results.push({ email: recipient.email, success: true })
    } catch (error) {
      console.error(`Failed to send to ${recipient.email}:`, error)
      results.push({ email: recipient.email, success: false, error })
    }
  }

  return results
}

/**
 * Send reply to contact form submission
 */
export async function sendContactReply({
  to,
  toName,
  subject,
  message
}: {
  to: string
  toName: string
  subject: string
  message: string
}) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${toName},</p>

          <div style="margin: 20px 0; white-space: pre-wrap;">${message}</div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="color: #666; font-size: 12px;">
            Continuum Clinic<br />
            12 Upper Wimpole Street, London W1G 6LW<br />
            ${TO_EMAIL} | +44 20 1234 5678
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send contact reply:', error)
    throw new Error('Failed to send reply')
  }
}
