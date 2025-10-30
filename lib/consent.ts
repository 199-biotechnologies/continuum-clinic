import { kv } from '@vercel/kv'
import { ConsentAcceptance, ConsentStatus, ConsentDocument } from '@/types/consent'
import { getRequiredConsents } from '@/lib/consent-documents'

// Redis Keys
const CONSENT_ACCEPTANCE_KEY = (acceptanceId: string) =>
  `consent-acceptance:${acceptanceId}`
const CLIENT_CONSENTS_INDEX = (clientId: string) =>
  `client-consents:${clientId}`
const PET_CONSENTS_INDEX = (clientId: string, petId: string) =>
  `pet-consents:${clientId}:${petId}`

// Save Consent Acceptance
export async function saveConsentAcceptance(
  acceptance: ConsentAcceptance
): Promise<void> {
  const key = CONSENT_ACCEPTANCE_KEY(acceptance.id)

  // Save the acceptance record
  await kv.set(key, JSON.stringify(acceptance))

  // Add to client's consent index
  await kv.sadd(CLIENT_CONSENTS_INDEX(acceptance.clientId), acceptance.id)

  // If pet-specific, add to pet's consent index
  if (acceptance.petId) {
    await kv.sadd(
      PET_CONSENTS_INDEX(acceptance.clientId, acceptance.petId),
      acceptance.id
    )
  }
}

// Get Consent Acceptance by ID
export async function getConsentAcceptance(
  acceptanceId: string
): Promise<ConsentAcceptance | null> {
  const key = CONSENT_ACCEPTANCE_KEY(acceptanceId)
  const data = await kv.get<string>(key)

  if (!data) return null

  return JSON.parse(data) as ConsentAcceptance
}

// Get All Consent Acceptances for Client
export async function getClientConsents(
  clientId: string
): Promise<ConsentAcceptance[]> {
  const acceptanceIds = await kv.smembers(CLIENT_CONSENTS_INDEX(clientId))

  if (!acceptanceIds || acceptanceIds.length === 0) return []

  const acceptances: ConsentAcceptance[] = []

  for (const id of acceptanceIds) {
    const acceptance = await getConsentAcceptance(id as string)
    if (acceptance) {
      acceptances.push(acceptance)
    }
  }

  // Sort by acceptedAt date (most recent first)
  return acceptances.sort(
    (a, b) =>
      new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
  )
}

// Get Consent Acceptances for Specific Pet
export async function getPetConsents(
  clientId: string,
  petId: string
): Promise<ConsentAcceptance[]> {
  const acceptanceIds = await kv.smembers(
    PET_CONSENTS_INDEX(clientId, petId)
  )

  if (!acceptanceIds || acceptanceIds.length === 0) return []

  const acceptances: ConsentAcceptance[] = []

  for (const id of acceptanceIds) {
    const acceptance = await getConsentAcceptance(id as string)
    if (acceptance) {
      acceptances.push(acceptance)
    }
  }

  return acceptances.sort(
    (a, b) =>
      new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
  )
}

// Check if Client Has Accepted All Required Consents
export async function hasAcceptedRequiredConsents(
  clientId: string,
  petId?: string
): Promise<boolean> {
  const requiredConsents = getRequiredConsents()
  const acceptedConsents = petId
    ? await getPetConsents(clientId, petId)
    : await getClientConsents(clientId)

  // Create a Set of accepted document IDs for faster lookup
  const acceptedDocumentIds = new Set(
    acceptedConsents.map((a) => a.documentId)
  )

  // Check if all required consents have been accepted
  for (const required of requiredConsents) {
    if (!acceptedDocumentIds.has(required.id)) {
      return false
    }
  }

  return true
}

// Get Consent Status for Client (shows what's required vs accepted)
export async function getConsentStatus(
  clientId: string,
  petId?: string
): Promise<ConsentStatus> {
  const requiredConsents = getRequiredConsents()
  const acceptedConsents = petId
    ? await getPetConsents(clientId, petId)
    : await getClientConsents(clientId)

  // Create a Set of accepted document IDs
  const acceptedDocumentIds = new Set(
    acceptedConsents.map((a) => a.documentId)
  )

  // Determine pending consents
  const pendingConsents = requiredConsents.filter(
    (doc) => !acceptedDocumentIds.has(doc.id)
  )

  const allRequiredAccepted = pendingConsents.length === 0

  return {
    clientId,
    petId,
    requiredConsents,
    acceptedConsents,
    pendingConsents,
    allRequiredAccepted,
    lastUpdated: new Date().toISOString()
  }
}

// Check if Specific Consent Has Been Accepted
export async function hasAcceptedConsent(
  clientId: string,
  documentId: string,
  petId?: string
): Promise<boolean> {
  const consents = petId
    ? await getPetConsents(clientId, petId)
    : await getClientConsents(clientId)

  return consents.some((consent) => consent.documentId === documentId)
}

// Get Latest Version of Accepted Consent for Specific Document
export async function getLatestConsentAcceptance(
  clientId: string,
  documentId: string,
  petId?: string
): Promise<ConsentAcceptance | null> {
  const consents = petId
    ? await getPetConsents(clientId, petId)
    : await getClientConsents(clientId)

  // Filter by documentId and get most recent
  const matching = consents.filter((c) => c.documentId === documentId)

  if (matching.length === 0) return null

  // Already sorted by date, return first
  return matching[0]
}

// Revoke Consent (for GDPR compliance)
export async function revokeConsent(
  clientId: string,
  documentId: string,
  petId?: string
): Promise<void> {
  const latestAcceptance = await getLatestConsentAcceptance(
    clientId,
    documentId,
    petId
  )

  if (!latestAcceptance) {
    throw new Error('No consent acceptance found to revoke')
  }

  // Create a revocation record by saving a new acceptance with special flag
  const revocation: ConsentAcceptance = {
    id: `revoke-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    clientId,
    petId,
    documentId,
    documentType: latestAcceptance.documentType,
    documentVersion: latestAcceptance.documentVersion,
    acceptedAt: new Date().toISOString(),
    signature: {
      method: 'checkbox',
      value: 'REVOKED',
      timestamp: new Date().toISOString()
    }
  }

  await saveConsentAcceptance(revocation)
}
