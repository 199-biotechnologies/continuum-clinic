import { NextRequest, NextResponse } from 'next/server'
import {
  createOnboardingStatus,
  getOnboardingStatus,
  updateOnboardingStatus,
  getClientOnboardingStatuses
} from '@/lib/medical-history'

// POST - Create onboarding status
export async function POST(request: NextRequest) {
  try {
    const { clientId, petId } = await request.json()

    if (!clientId || !petId) {
      return NextResponse.json(
        { error: 'Client ID and Pet ID required' },
        { status: 400 }
      )
    }

    const status = await createOnboardingStatus(clientId, petId)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Onboarding status creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create onboarding status' },
      { status: 500 }
    )
  }
}

// GET - Get onboarding status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const petId = searchParams.get('petId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    // If petId provided, get specific status
    if (petId) {
      const status = await getOnboardingStatus(clientId, petId)
      return NextResponse.json(status || { error: 'Status not found' })
    }

    // Otherwise get all statuses for client
    const statuses = await getClientOnboardingStatuses(clientId)
    return NextResponse.json({ statuses })
  } catch (error) {
    console.error('Onboarding status fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
}

// PUT - Update onboarding status
export async function PUT(request: NextRequest) {
  try {
    const { clientId, petId, ...updates } = await request.json()

    if (!clientId || !petId) {
      return NextResponse.json(
        { error: 'Client ID and Pet ID required' },
        { status: 400 }
      )
    }

    await updateOnboardingStatus(clientId, petId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding status update error:', error)
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    )
  }
}
