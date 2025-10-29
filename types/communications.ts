/**
 * Contact Form Types
 */
export type ContactFormType =
  | 'general'
  | 'consultation'
  | 'investment'
  | 'media'
  | 'careers'

export type ContactStatus =
  | 'new'
  | 'read'
  | 'replied'
  | 'archived'

export type PreferredContactMethod = 'email' | 'phone'

export interface ContactFormSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: ContactFormType
  preferredContact: PreferredContactMethod
  status: ContactStatus
  submittedAt: string
  readAt?: string
  repliedAt?: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Email Template Types
 */
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailTemplateVariables {
  clientName?: string
  petName?: string
  date?: string
  time?: string
  clinicName?: string
  clinicEmail?: string
  clinicPhone?: string
  clinicAddress?: string
  appointmentType?: string
  [key: string]: string | undefined
}

export type SystemTemplateType =
  | 'appointment-confirmation'
  | 'appointment-reminder'
  | 'welcome-email'
  | 'follow-up-request'
  | 'newsletter'

/**
 * Notification Settings Types
 */
export interface NotificationSettings {
  sendAppointmentConfirmation: boolean
  sendReminders: boolean
  sendWelcomeEmail: boolean
  sendMonthlyNewsletter: boolean
  replyToEmail: string
  emailFooter: string
}

/**
 * Bulk Email Types
 */
export type RecipientFilter =
  | 'all-clients'
  | 'clients-with-pets'
  | 'clients-with-appointments'
  | 'custom-list'

export interface BulkEmailRequest {
  recipientFilter: RecipientFilter
  dateRangeStart?: string
  dateRangeEnd?: string
  customEmails?: string[]
  templateId?: string
  subject: string
  body: string
  scheduledFor?: string
}

export interface EmailRecipient {
  email: string
  name: string
  clientId?: string
}
