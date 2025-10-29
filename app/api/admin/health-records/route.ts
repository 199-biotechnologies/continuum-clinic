import { NextRequest, NextResponse } from 'next/server'
import { getAllHealthRecords, setHealthRecord } from '@/lib/redis'
import { getAdminUser } from '@/lib/auth-helpers'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const healthRecordSchema = z.object({
  petId: z.string(),
  type: z.string(),
  date: z.number(),
  veterinarian: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(z.string()).optional(),
  labResults: z.array(z.any()).optional(),
  biomarkers: z.array(z.any()).optional(),
  followUpDate: z.number().optional(),
})

/**
 * GET /api/admin/health-records
 * List all health records (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const records = await getAllHealthRecords()
    return NextResponse.json({ records })
  } catch (error: any) {
    console.error('Error fetching health records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/health-records
 * Create a new health record (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = healthRecordSchema.parse(body)

    const recordId = uuidv4()
    const now = new Date().toISOString()

    const record = {
      id: recordId,
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    await setHealthRecord(recordId, record)

    return NextResponse.json({ record, success: true }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating health record:', error)
    return NextResponse.json(
      { error: 'Failed to create health record' },
      { status: 500 }
    )
  }
}
