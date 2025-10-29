/**
 * Health record types
 */

export type HealthRecordType =
  | 'checkup'
  | 'diagnostic'
  | 'treatment'
  | 'medication'
  | 'vaccination'
  | 'lab-result'

export interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
  purpose: string
  notes?: string
  active: boolean
}

export interface LabResult {
  testName: string
  value: number | string
  unit: string
  referenceRange?: {
    min: number
    max: number
  }
  abnormal?: boolean
}

export interface Biomarker {
  type: string
  value: number
  unit: string
  date: string
  referenceRange?: {
    min: number
    max: number
  }
  notes?: string
}

export interface HealthRecord {
  id: string
  petId: string
  type: HealthRecordType
  date: string
  veterinarian: string
  diagnosis?: string
  notes: string
  attachments?: Array<{
    name: string
    url: string
    type: string
  }>
  medications?: Medication[]
  labResults?: LabResult[]
  biomarkers?: Biomarker[]
  followUpDate?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface HealthRecordCreateData {
  petId: string
  type: HealthRecordType
  date: string
  veterinarian: string
  diagnosis?: string
  notes: string
  medications?: Medication[]
  labResults?: LabResult[]
  biomarkers?: Biomarker[]
  followUpDate?: string
}

export interface HealthRecordUpdateData {
  type?: HealthRecordType
  date?: string
  veterinarian?: string
  diagnosis?: string
  notes?: string
  medications?: Medication[]
  labResults?: LabResult[]
  biomarkers?: Biomarker[]
  followUpDate?: string
}
