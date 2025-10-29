import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getPet, setPet, deletePet } from '@/lib/redis'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().optional(),
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

// GET single pet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const pet = await getPet(id)
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    return NextResponse.json({ pet })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT update pet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const existingPet = await getPet(id) as any
    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const pet = await getPet(id)
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    await deletePet(id)

    return NextResponse.json({ success: true, message: 'Pet deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
