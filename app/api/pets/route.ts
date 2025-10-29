import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/auth-helpers'
import { getAllPets, setPet } from '@/lib/redis'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const petSchema = z.object({
  name: z.string().min(1),
  species: z.enum(['dog', 'cat', 'other']),
  breed: z.string().min(1),
  dateOfBirth: z.string(),
  weight: z.number().positive(),
  sex: z.enum(['male', 'female', 'neutered', 'spayed']),
  microchipId: z.string().optional(),
  insuranceDetails: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    expiryDate: z.string().optional(),
  }).optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().optional(),
})

/**
 * GET /api/pets
 * Get all pets for the authenticated client
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

    const allPets = await getAllPets()
    // Filter to only pets belonging to this client
    const clientPets = allPets.filter((pet: any) => pet.clientId === user.userId)

    return NextResponse.json({ pets: clientPets })
  } catch (error: any) {
    console.error('Get pets error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pets
 * Create a new pet for the authenticated client
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getClientUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = petSchema.parse(body)

    const petId = uuidv4()
    const now = new Date().toISOString()

    const pet = {
      id: petId,
      clientId: user.userId,
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    await setPet(petId, pet)

    return NextResponse.json({ pet, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create pet error:', error)
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    )
  }
}
