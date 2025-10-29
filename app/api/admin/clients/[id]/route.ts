import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getClient, setClient, deleteClient, getClientPets } from '@/lib/redis'
import { z } from 'zod'

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
})

// GET single client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const client = await getClient(id)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const pets = await getClientPets(id)

    return NextResponse.json({ client, pets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const existingClient = await getClient(id) as any
    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const updatedClient = {
      ...existingClient,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setClient(id, updatedClient)

    return NextResponse.json({ client: updatedClient, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const client = await getClient(id)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    await deleteClient(id)

    return NextResponse.json({ success: true, message: 'Client deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
