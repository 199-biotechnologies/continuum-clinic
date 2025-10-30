// Medical History Types for Onboarding

export interface MedicalHistory {
  petId: string
  clientId: string
  completedAt?: string

  // Current Health Status
  currentMedications: Medication[]
  chronicConditions: ChronicCondition[]
  allergies: Allergy[]

  // Medical History
  previousSurgeries: Surgery[]
  vaccinationHistory: Vaccination[]
  previousIllnesses: Illness[]

  // Lifestyle & Diet
  diet: DietInformation
  exercise: ExerciseInformation

  // Previous Veterinary Care
  previousVeterinarian?: VeterinarianInfo

  // Insurance
  insurance?: InsuranceInfo

  // Emergency Contact
  emergencyContact: EmergencyContact

  // Additional Information
  behavioralIssues?: string
  additionalNotes?: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy?: string
  reason: string
}

export interface ChronicCondition {
  condition: string
  diagnosedDate: string
  diagnosedBy?: string
  currentlyManaged: boolean
  treatment?: string
}

export interface Allergy {
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  diagnosedDate?: string
}

export interface Surgery {
  procedure: string
  date: string
  veterinarian?: string
  clinic?: string
  complications?: string
  notes?: string
}

export interface Vaccination {
  vaccine: string
  date: string
  nextDue?: string
  administeredBy?: string
  batchNumber?: string
}

export interface Illness {
  illness: string
  diagnosedDate: string
  resolvedDate?: string
  treatment?: string
  notes?: string
}

export interface DietInformation {
  currentFood: string
  feedingSchedule: string
  treats?: string
  supplements?: string
  dietaryRestrictions?: string
  waterIntake: 'low' | 'normal' | 'high'
}

export interface ExerciseInformation {
  frequency: string // e.g., "daily", "3-4 times per week"
  duration: string // e.g., "30 minutes", "1 hour"
  intensity: 'low' | 'moderate' | 'high'
  activityTypes: string[] // e.g., ["walking", "running", "swimming"]
}

export interface VeterinarianInfo {
  name: string
  clinicName: string
  phone: string
  email?: string
  address?: string
  yearsWithVet?: number
  reasonForChange?: string
}

export interface InsuranceInfo {
  provider: string
  policyNumber: string
  coverageType: string
  expiryDate?: string
  annualLimit?: number
  deductible?: number
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  alternatePhone?: string
  email?: string
  canAuthorize: boolean // Can authorize emergency treatment
}

// Onboarding Status Tracking
export interface OnboardingStatus {
  clientId: string
  petId: string
  currentStep: number
  totalSteps: number
  completed: boolean
  startedAt: string
  completedAt?: string
  stepsCompleted: {
    basicInfo: boolean
    currentHealth: boolean
    medicalHistory: boolean
    lifestyle: boolean
    previousCare: boolean
    insurance: boolean
    emergency: boolean
    additional: boolean
  }
}

// Common veterinary conditions for dropdowns
export const COMMON_CONDITIONS = [
  'Arthritis',
  'Diabetes',
  'Heart Disease',
  'Kidney Disease',
  'Liver Disease',
  'Cancer',
  'Epilepsy',
  'Thyroid Issues',
  'Dental Disease',
  'Skin Conditions',
  'Digestive Issues',
  'Respiratory Issues',
  'Obesity',
  'Other'
]

export const COMMON_ALLERGIES = [
  'Food Allergy',
  'Environmental Allergy',
  'Flea Allergy',
  'Drug/Medication Allergy',
  'Contact Allergy',
  'Other'
]

export const COMMON_VACCINES = [
  'Rabies',
  'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)',
  'Bordetella (Kennel Cough)',
  'Leptospirosis',
  'Lyme Disease',
  'Canine Influenza',
  'Feline Panleukopenia',
  'Feline Calicivirus',
  'Feline Herpesvirus',
  'FeLV (Feline Leukemia)',
  'Other'
]
