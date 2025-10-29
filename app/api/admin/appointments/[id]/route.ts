import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getAppointment, setAppointment, deleteAppointment } from '@/lib/redis'
import { z } from 'zod'

const updateSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  veterinarian: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
})

// GET single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const appointment = await getAppointment(id)
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json({ appointment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const existingAppointment = await getAppointment(id) as any
    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const updatedAppointment = {
      ...existingAppointment,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setAppointment(id, updatedAppointment)

    return NextResponse.json({ appointment: updatedAppointment, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth()
    const { id } = await params

    const appointment = await getAppointment(id)
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await deleteAppointment(id)

    return NextResponse.json({ success: true, message: 'Appointment deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
