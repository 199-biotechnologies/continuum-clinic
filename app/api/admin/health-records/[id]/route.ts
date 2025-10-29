import { NextRequest, NextResponse } from 'next/server'
import { getHealthRecord, setHealthRecord, deleteHealthRecord } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const healthRecordUpdateSchema = z.object({
  petId: z.string().optional(),
  type: z.string().optional(),
  date: z.number().optional(),
  veterinarian: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(z.string()).optional(),
  labResults: z.array(z.any()).optional(),
  biomarkers: z.array(z.any()).optional(),
  followUpDate: z.number().optional(),
})

/**
 * GET /api/admin/health-records/[id]
 * Get a specific health record (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const record = await getHealthRecord(id)

    if (!record) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 })
    }

    return NextResponse.json({ record })
  } catch (error: any) {
    console.error('Error fetching health record:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health record' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/health-records/[id]
 * Update a health record (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existingRecord = await getHealthRecord(id)

    if (!existingRecord) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = healthRecordUpdateSchema.parse(body)

    const updatedRecord = {
      ...existingRecord,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    await setHealthRecord(id, updatedRecord)

    return NextResponse.json({ record: updatedRecord, success: true })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating health record:', error)
    return NextResponse.json(
      { error: 'Failed to update health record' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/health-records/[id]
 * Delete a health record (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const record = await getHealthRecord(id)

    if (!record) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 })
    }

    await deleteHealthRecord(id)

    return NextResponse.json({ success: true, message: 'Health record deleted' })
  } catch (error: any) {
    console.error('Error deleting health record:', error)
    return NextResponse.json(
      { error: 'Failed to delete health record' },
      { status: 500 }
    )
  }
}
