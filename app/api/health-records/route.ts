import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/auth-helpers'
import { getAllPets } from '@/lib/redis'

/**
 * GET /api/health-records
 * Get all health records for the authenticated client's pets
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getClientUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all pets belonging to this client
    const allPets = await getAllPets()
    const clientPets = allPets.filter((pet: any) => pet.clientId === user.userId)

    // For now, return empty health records
    // TODO: Implement health records storage and retrieval
    const healthRecords: any[] = []

    return NextResponse.json({
      healthRecords,
      pets: clientPets
    })
  } catch (error: any) {
    console.error('Get health records error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    )
  }
}
