import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getAllPets, setPet, getClient } from '@/lib/redis'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const petSchema = z.object({
  clientId: z.string().uuid(),
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

// GET all pets
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth()
    const pets = await getAllPets()
    return NextResponse.json({ pets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

// POST create new pet
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()
    const body = await request.json()
    const data = petSchema.parse(body)

    // Verify client exists
    const client = await getClient(data.clientId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const petId = uuidv4()
    const now = new Date().toISOString()

    const pet = {
      id: petId,
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
