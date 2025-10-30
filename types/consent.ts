// Consent & Legal Document Types

export interface ConsentDocument {
  id: string
  type: ConsentType
  version: string
  title: string
  content: string
  effectiveDate: string
  required: boolean
  category: 'legal' | 'medical' | 'data' | 'financial'
}

export type ConsentType =
  | 'informed-consent'
  | 'liability-waiver'
  | 'data-privacy'
  | 'treatment-authorization'
  | 'experimental-treatment'
  | 'telemedicine'
  | 'financial-responsibility'
  | 'terms-of-service'

export interface ConsentAcceptance {
  id: string
  clientId: string
  petId?: string // Optional - some consents are client-level, some pet-level
  documentId: string
  documentType: ConsentType
  documentVersion: string
  acceptedAt: string
  ipAddress?: string
  userAgent?: string
  signature?: SignatureData
}

export interface SignatureData {
  method: 'checkbox' | 'typed-name' | 'digital-signature'
  value: string // Checkbox = "true", Typed = name, Digital = base64 image
  timestamp: string
}

export interface ConsentStatus {
  clientId: string
  petId?: string
  requiredConsents: ConsentDocument[]
  acceptedConsents: ConsentAcceptance[]
  pendingConsents: ConsentDocument[]
  allRequiredAccepted: boolean
  lastUpdated: string
}

// Consent template IDs (for reference)
export const CONSENT_IDS = {
  INFORMED_CONSENT: 'informed-consent-v1.0',
  LIABILITY_WAIVER: 'liability-waiver-v1.0',
  DATA_PRIVACY: 'data-privacy-gdpr-v1.0',
  TREATMENT_AUTH: 'treatment-authorization-v1.0',
  EXPERIMENTAL_TREATMENT: 'experimental-treatment-v1.0',
  TELEMEDICINE: 'telemedicine-consent-v1.0',
  FINANCIAL: 'financial-responsibility-v1.0',
  TERMS: 'terms-of-service-v1.0'
} as const
