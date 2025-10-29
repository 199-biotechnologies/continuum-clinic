import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getNotificationSettings, saveNotificationSettings } from '@/lib/redis'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const settingsSchema = z.object({
  sendAppointmentConfirmation: z.boolean(),
  sendReminders: z.boolean(),
  sendWelcomeEmail: z.boolean(),
  sendMonthlyNewsletter: z.boolean(),
  replyToEmail: z.string().email(),
  emailFooter: z.string(),
})

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.role === 'admin' ? payload : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await getNotificationSettings()

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const settings = settingsSchema.parse(body)

    await saveNotificationSettings(settings)

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error updating settings:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
