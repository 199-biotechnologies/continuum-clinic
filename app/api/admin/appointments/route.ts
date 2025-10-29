import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getAllAppointments, setAppointment, getClient, getPet } from '@/lib/redis'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const appointmentSchema = z.object({
  clientId: z.string().uuid(),
  petId: z.string().uuid(),
  type: z.enum(['initial-consultation', 'follow-up', 'diagnostic', 'treatment', 'emergency']),
  date: z.string(),
  time: z.string(),
  veterinarian: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
})

// GET all appointments
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth()
    const appointments = await getAllAppointments()
    return NextResponse.json({ appointments })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

// POST create new appointment
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()
    const body = await request.json()
    const data = appointmentSchema.parse(body)

    // Verify client and pet exist
    const client = await getClient(data.clientId) as any
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const pet = await getPet(data.petId) as any
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Verify pet belongs to client
    if (pet.clientId !== data.clientId) {
      return NextResponse.json({ error: 'Pet does not belong to this client' }, { status: 400 })
    }

    const appointmentId = uuidv4()
    const now = new Date().toISOString()

    const appointment = {
      id: appointmentId,
      ...data,
      clientName: `${client.firstName} ${client.lastName}`,
      clientEmail: client.email,
      clientPhone: client.phone,
      petName: pet.name,
      createdAt: now,
      updatedAt: now,
    }

    await setAppointment(appointmentId, appointment)

    return NextResponse.json({ appointment, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
