import { kv } from '@vercel/kv'
import { MedicalHistory, OnboardingStatus } from '@/types/medical-history'

// Redis Keys
const MEDICAL_HISTORY_KEY = (petId: string) => `medical-history:${petId}`
const ONBOARDING_STATUS_KEY = (clientId: string, petId: string) =>
  `onboarding-status:${clientId}:${petId}`
const CLIENT_ONBOARDING_INDEX = (clientId: string) =>
  `onboarding-index:${clientId}`

// Save Medical History
export async function saveMedicalHistory(
  history: MedicalHistory
): Promise<void> {
  const key = MEDICAL_HISTORY_KEY(history.petId)

  // Add completion timestamp
  const historyWithTimestamp = {
    ...history,
    completedAt: history.completedAt || new Date().toISOString()
  }

  await kv.set(key, JSON.stringify(historyWithTimestamp))

  // Update onboarding status to completed
  await updateOnboardingStatus(history.clientId, history.petId, {
    completed: true,
    completedAt: new Date().toISOString(),
    currentStep: 8,
    stepsCompleted: {
      basicInfo: true,
      currentHealth: true,
      medicalHistory: true,
      lifestyle: true,
      previousCare: true,
      insurance: true,
      emergency: true,
      additional: true
    }
  })
}

// Get Medical History
export async function getMedicalHistory(
  petId: string
): Promise<MedicalHistory | null> {
  const key = MEDICAL_HISTORY_KEY(petId)
  const data = await kv.get<string>(key)

  if (!data) return null

  return JSON.parse(data) as MedicalHistory
}

// Update Medical History (partial updates)
export async function updateMedicalHistory(
  petId: string,
  updates: Partial<MedicalHistory>
): Promise<void> {
  const existing = await getMedicalHistory(petId)

  if (!existing) {
    throw new Error('Medical history not found')
  }

  const updated = { ...existing, ...updates }
  await kv.set(MEDICAL_HISTORY_KEY(petId), JSON.stringify(updated))
}

// Onboarding Status Management
export async function createOnboardingStatus(
  clientId: string,
  petId: string
): Promise<OnboardingStatus> {
  const status: OnboardingStatus = {
    clientId,
    petId,
    currentStep: 0,
    totalSteps: 8,
    completed: false,
    startedAt: new Date().toISOString(),
    stepsCompleted: {
      basicInfo: false,
      currentHealth: false,
      medicalHistory: false,
      lifestyle: false,
      previousCare: false,
      insurance: false,
      emergency: false,
      additional: false
    }
  }

  const key = ONBOARDING_STATUS_KEY(clientId, petId)
  await kv.set(key, JSON.stringify(status))

  // Add to client's onboarding index
  await kv.sadd(CLIENT_ONBOARDING_INDEX(clientId), petId)

  return status
}

export async function getOnboardingStatus(
  clientId: string,
  petId: string
): Promise<OnboardingStatus | null> {
  const key = ONBOARDING_STATUS_KEY(clientId, petId)
  const data = await kv.get<string>(key)

  if (!data) return null

  return JSON.parse(data) as OnboardingStatus
}

export async function updateOnboardingStatus(
  clientId: string,
  petId: string,
  updates: Partial<OnboardingStatus>
): Promise<void> {
  const existing = await getOnboardingStatus(clientId, petId)

  if (!existing) {
    throw new Error('Onboarding status not found')
  }

  const updated = { ...existing, ...updates }
  const key = ONBOARDING_STATUS_KEY(clientId, petId)
  await kv.set(key, JSON.stringify(updated))
}

// Check if client has completed onboarding for all pets
export async function hasCompletedOnboarding(
  clientId: string
): Promise<boolean> {
  const petIds = await kv.smembers(CLIENT_ONBOARDING_INDEX(clientId))

  if (!petIds || petIds.length === 0) return false

  for (const petId of petIds) {
    const status = await getOnboardingStatus(clientId, petId as string)
    if (!status || !status.completed) {
      return false
    }
  }

  return true
}

// Get all onboarding statuses for a client
export async function getClientOnboardingStatuses(
  clientId: string
): Promise<OnboardingStatus[]> {
  const petIds = await kv.smembers(CLIENT_ONBOARDING_INDEX(clientId))

  if (!petIds || petIds.length === 0) return []

  const statuses: OnboardingStatus[] = []

  for (const petId of petIds) {
    const status = await getOnboardingStatus(clientId, petId as string)
    if (status) {
      statuses.push(status)
    }
  }

  return statuses
}
