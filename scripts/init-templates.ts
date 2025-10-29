/**
 * Initialize Default Email Templates
 * Run with: npx tsx scripts/init-templates.ts
 */

import { saveTemplate } from '../lib/redis'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_TEMPLATES = [
  {
    id: 'appointment-confirmation',
    name: 'Appointment Confirmation',
    subject: 'Appointment Confirmed - {{date}} at {{time}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Appointment Confirmed</h2>

        <p>Dear {{clientName}},</p>

        <p>Your appointment has been confirmed for {{petName}}.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Time:</strong> {{time}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
        </div>

        <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="color: #666; font-size: 12px;">
          {{clinicName}}<br />
          {{clinicAddress}}<br />
          {{clinicEmail}} | {{clinicPhone}}
        </p>
      </div>
    `,
    variables: ['clientName', 'petName', 'date', 'time', 'appointmentType', 'clinicName', 'clinicAddress', 'clinicEmail', 'clinicPhone'],
    isSystem: true,
  },
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder (24h)',
    subject: 'Reminder: Appointment Tomorrow for {{petName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Appointment Reminder</h2>

        <p>Dear {{clientName}},</p>

        <p>This is a friendly reminder that {{petName}} has an appointment tomorrow.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Time:</strong> {{time}}</p>
          <p><strong>Type:</strong> {{appointmentType}}</p>
        </div>

        <p><strong>Please arrive 10 minutes early</strong> to complete any necessary paperwork.</p>

        <p>If you need to cancel or reschedule, please let us know as soon as possible.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="color: #666; font-size: 12px;">
          {{clinicName}}<br />
          {{clinicAddress}}<br />
          {{clinicEmail}} | {{clinicPhone}}
        </p>
      </div>
    `,
    variables: ['clientName', 'petName', 'date', 'time', 'appointmentType', 'clinicName', 'clinicAddress', 'clinicEmail', 'clinicPhone'],
    isSystem: true,
  },
  {
    id: 'welcome-email',
    name: 'Welcome Email (New Client)',
    subject: 'Welcome to {{clinicName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Welcome to Continuum Clinic</h2>

        <p>Dear {{clientName}},</p>

        <p>Welcome to Continuum Clinic! We're delighted to have you and {{petName}} join our family.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What You Can Do in Your Portal:</h3>
          <ul>
            <li>View {{petName}}'s health records</li>
            <li>Schedule appointments online</li>
            <li>Track medications and treatments</li>
            <li>Access test results and reports</li>
            <li>Communicate with our team</li>
          </ul>
        </div>

        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="color: #666; font-size: 12px;">
          {{clinicName}}<br />
          {{clinicAddress}}<br />
          {{clinicEmail}} | {{clinicPhone}}
        </p>
      </div>
    `,
    variables: ['clientName', 'petName', 'clinicName', 'clinicAddress', 'clinicEmail', 'clinicPhone'],
    isSystem: true,
  },
  {
    id: 'follow-up-request',
    name: 'Follow-up Request',
    subject: 'Follow-up for {{petName}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Follow-up Appointment Recommended</h2>

        <p>Dear {{clientName}},</p>

        <p>We hope {{petName}} is doing well following the recent visit.</p>

        <p>Based on our last appointment, we recommend scheduling a follow-up to monitor {{petName}}'s progress.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Recommended timeframe:</strong> Within the next 2-4 weeks</p>
        </div>

        <p>Please contact us to schedule an appointment at your convenience.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="color: #666; font-size: 12px;">
          {{clinicName}}<br />
          {{clinicAddress}}<br />
          {{clinicEmail}} | {{clinicPhone}}
        </p>
      </div>
    `,
    variables: ['clientName', 'petName', 'clinicName', 'clinicAddress', 'clinicEmail', 'clinicPhone'],
    isSystem: true,
  },
  {
    id: 'newsletter',
    name: 'Monthly Newsletter Template',
    subject: 'Continuum Clinic Newsletter - {{date}}',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">Continuum Clinic Newsletter</h2>

        <p>Dear {{clientName}},</p>

        <p>Welcome to this month's newsletter with the latest news, tips, and updates from Continuum Clinic.</p>

        <div style="margin: 30px 0;">
          <h3>Featured This Month</h3>
          <p>[Add your newsletter content here]</p>
        </div>

        <div style="margin: 30px 0;">
          <h3>Pet Health Tips</h3>
          <p>[Add health tips here]</p>
        </div>

        <div style="margin: 30px 0;">
          <h3>Clinic Updates</h3>
          <p>[Add clinic updates here]</p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="color: #666; font-size: 12px;">
          {{clinicName}}<br />
          {{clinicAddress}}<br />
          {{clinicEmail}} | {{clinicPhone}}<br />
          <br />
          <a href="#" style="color: #666;">Unsubscribe</a>
        </p>
      </div>
    `,
    variables: ['clientName', 'date', 'clinicName', 'clinicAddress', 'clinicEmail', 'clinicPhone'],
    isSystem: true,
  },
]

async function initializeTemplates() {
  console.log('Initializing default email templates...')

  for (const template of DEFAULT_TEMPLATES) {
    const now = new Date().toISOString()
    const templateData = {
      ...template,
      createdAt: now,
      updatedAt: now,
    }

    await saveTemplate(template.id, templateData)
    console.log(`✓ Created template: ${template.name}`)
  }

  console.log('\nAll templates initialized successfully!')
  process.exit(0)
}

initializeTemplates().catch(error => {
  console.error('Error initializing templates:', error)
  process.exit(1)
})
