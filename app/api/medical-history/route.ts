import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  saveMedicalHistory,
  getMedicalHistory,
  createOnboardingStatus,
  getOnboardingStatus
} from '@/lib/medical-history'

// Validation schemas
const MedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  prescribedBy: z.string().optional(),
  reason: z.string().min(1)
})

const ChronicConditionSchema = z.object({
  condition: z.string().min(1),
  diagnosedDate: z.string(),
  diagnosedBy: z.string().optional(),
  currentlyManaged: z.boolean(),
  treatment: z.string().optional()
})

const AllergySchema = z.object({
  allergen: z.string().min(1),
  reaction: z.string().min(1),
  severity: z.enum(['mild', 'moderate', 'severe', 'life-threatening']),
  diagnosedDate: z.string().optional()
})

const SurgerySchema = z.object({
  procedure: z.string().min(1),
  date: z.string(),
  veterinarian: z.string().optional(),
  clinic: z.string().optional(),
  complications: z.string().optional(),
  notes: z.string().optional()
})

const VaccinationSchema = z.object({
  vaccine: z.string().min(1),
  date: z.string(),
  nextDue: z.string().optional(),
  administeredBy: z.string().optional(),
  batchNumber: z.string().optional()
})

const IllnessSchema = z.object({
  illness: z.string().min(1),
  diagnosedDate: z.string(),
  resolvedDate: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional()
})

const DietSchema = z.object({
  currentFood: z.string().min(1),
  feedingSchedule: z.string().min(1),
  treats: z.string().optional(),
  supplements: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  waterIntake: z.enum(['low', 'normal', 'high'])
})

const ExerciseSchema = z.object({
  frequency: z.string().min(1),
  duration: z.string().min(1),
  intensity: z.enum(['low', 'moderate', 'high']),
  activityTypes: z.array(z.string())
})

const VeterinarianInfoSchema = z.object({
  name: z.string().min(1),
  clinicName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
  yearsWithVet: z.number().optional(),
  reasonForChange: z.string().optional()
})

const InsuranceInfoSchema = z.object({
  provider: z.string().min(1),
  policyNumber: z.string().min(1),
  coverageType: z.string().min(1),
  expiryDate: z.string().optional(),
  annualLimit: z.number().optional(),
  deductible: z.number().optional()
})

const EmergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  alternatePhone: z.string().optional(),
  email: z.string().email().optional(),
  canAuthorize: z.boolean()
})

const MedicalHistorySchema = z.object({
  petId: z.string().min(1),
  clientId: z.string().min(1),
  currentMedications: z.array(MedicationSchema),
  chronicConditions: z.array(ChronicConditionSchema),
  allergies: z.array(AllergySchema),
  previousSurgeries: z.array(SurgerySchema),
  vaccinationHistory: z.array(VaccinationSchema),
  previousIllnesses: z.array(IllnessSchema),
  diet: DietSchema,
  exercise: ExerciseSchema,
  previousVeterinarian: VeterinarianInfoSchema.optional(),
  insurance: InsuranceInfoSchema.optional(),
  emergencyContact: EmergencyContactSchema,
  behavioralIssues: z.string().optional(),
  additionalNotes: z.string().optional()
})

// POST - Save medical history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validated = MedicalHistorySchema.parse(body)

    // Save to Redis
    await saveMedicalHistory(validated)

    return NextResponse.json({
      success: true,
      message: 'Medical history saved successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Medical history save error:', error)
    return NextResponse.json(
      { error: 'Failed to save medical history' },
      { status: 500 }
    )
  }
}

// GET - Retrieve medical history by petId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petId = searchParams.get('petId')

    if (!petId) {
      return NextResponse.json(
        { error: 'Pet ID required' },
        { status: 400 }
      )
    }

    const history = await getMedicalHistory(petId)

    if (!history) {
      return NextResponse.json(
        { error: 'Medical history not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(history)
  } catch (error) {
    console.error('Medical history fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical history' },
      { status: 500 }
    )
  }
}
