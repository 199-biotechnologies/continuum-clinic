import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/auth-helpers'
import { getAllPets, getPetHealthRecords } from '@/lib/redis'

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

    // Fetch health records for all client's pets
    const healthRecordsPromises = clientPets.map((pet: any) =>
      getPetHealthRecords(pet.id)
    )
    const petHealthRecords = await Promise.all(healthRecordsPromises)

    // Flatten the array of arrays into a single array
    const healthRecords = petHealthRecords.flat()

    // Sort by date (most recent first)
    healthRecords.sort((a: any, b: any) => b.date - a.date)

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
