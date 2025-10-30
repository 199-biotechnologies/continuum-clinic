import { NextRequest, NextResponse } from 'next/server'
import { getClientUser } from '@/lib/auth-helpers'
import { getPet, setPet } from '@/lib/redis'
import { z } from 'zod'

const petUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().min(1).optional(),
  weight: z.number().positive().optional(),
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
 * GET /api/pets/[id]
 * Get a specific pet (only if it belongs to the authenticated client)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getClientUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const pet = await getPet(id) as any

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      )
    }

    // Verify the pet belongs to this client
    if (pet.clientId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ pet })
  } catch (error: any) {
    console.error('Get pet error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pet' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/pets/[id]
 * Update a pet (only if it belongs to the authenticated client)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getClientUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const existingPet = await getPet(id) as any

    if (!existingPet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      )
    }

    // Verify the pet belongs to this client
    if (existingPet.clientId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = petUpdateSchema.parse(body)

    const updatedPet = {
      ...existingPet,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setPet(id, updatedPet)

    return NextResponse.json({ pet: updatedPet, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update pet error:', error)
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    )
  }
}
