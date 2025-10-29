/**
 * Appointment types
 */

export type AppointmentType =
  | 'initial-consultation'
  | 'follow-up'
  | 'diagnostic'
  | 'treatment'
  | 'emergency'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  clientId?: string
  petId?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  petName: string
  type: AppointmentType
  date: string
  time: string
  duration?: number
  status: AppointmentStatus
  notes?: string
  internalNotes?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentCreateData {
  clientName: string
  clientEmail: string
  clientPhone?: string
  petName: string
  type: AppointmentType
  preferredDate: string
  preferredTime?: string
  notes?: string
}

export interface AppointmentUpdateData {
  date?: string
  time?: string
  status?: AppointmentStatus
  internalNotes?: string
}
