import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  saveConsentAcceptance,
  getClientConsents,
  getPetConsents,
  getConsentStatus,
  hasAcceptedRequiredConsents,
  getLatestConsentAcceptance,
  revokeConsent
} from '@/lib/consent'
import { ConsentAcceptance } from '@/types/consent'

// Validation schemas
const SignatureSchema = z.object({
  method: z.enum(['checkbox', 'typed-name', 'digital-signature']),
  value: z.string().min(1),
  timestamp: z.string()
})

const ConsentAcceptanceSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
  petId: z.string().optional(),
  documentId: z.string().min(1),
  documentType: z.enum([
    'informed-consent',
    'liability-waiver',
    'data-privacy',
    'treatment-authorization',
    'experimental-treatment',
    'telemedicine',
    'financial-responsibility',
    'terms-of-service'
  ]),
  documentVersion: z.string().min(1),
  acceptedAt: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  signature: SignatureSchema.optional()
})

// POST - Record consent acceptance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validated = ConsentAcceptanceSchema.parse(body)

    // Save to Redis
    await saveConsentAcceptance(validated as ConsentAcceptance)

    // Check if all required consents are now accepted
    const allAccepted = await hasAcceptedRequiredConsents(
      validated.clientId,
      validated.petId
    )

    return NextResponse.json({
      success: true,
      message: 'Consent recorded successfully',
      allRequiredAccepted: allAccepted
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Consent acceptance error:', error)
    return NextResponse.json(
      { error: 'Failed to record consent' },
      { status: 500 }
    )
  }
}

// GET - Retrieve consent status or history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const petId = searchParams.get('petId')
    const action = searchParams.get('action') // 'status' | 'history' | 'check'
    const documentId = searchParams.get('documentId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    // Action: Get consent status (what's required vs accepted)
    if (action === 'status') {
      const status = await getConsentStatus(clientId, petId || undefined)
      return NextResponse.json(status)
    }

    // Action: Get consent history for client or pet
    if (action === 'history') {
      const consents = petId
        ? await getPetConsents(clientId, petId)
        : await getClientConsents(clientId)

      return NextResponse.json({ consents })
    }

    // Action: Check if all required consents are accepted
    if (action === 'check') {
      const allAccepted = await hasAcceptedRequiredConsents(
        clientId,
        petId || undefined
      )

      return NextResponse.json({ allRequiredAccepted: allAccepted })
    }

    // Action: Get latest acceptance for specific document
    if (documentId) {
      const latestAcceptance = await getLatestConsentAcceptance(
        clientId,
        documentId,
        petId || undefined
      )

      if (!latestAcceptance) {
        return NextResponse.json(
          { error: 'Consent not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(latestAcceptance)
    }

    // Default: Return consent status
    const status = await getConsentStatus(clientId, petId || undefined)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Consent retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve consent information' },
      { status: 500 }
    )
  }
}

// DELETE - Revoke consent (for GDPR compliance)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const documentId = searchParams.get('documentId')
    const petId = searchParams.get('petId')

    if (!clientId || !documentId) {
      return NextResponse.json(
        { error: 'Client ID and Document ID required' },
        { status: 400 }
      )
    }

    await revokeConsent(clientId, documentId, petId || undefined)

    return NextResponse.json({
      success: true,
      message: 'Consent revoked successfully'
    })
  } catch (error) {
    console.error('Consent revocation error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to revoke consent' },
      { status: 500 }
    )
  }
}
