import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getAllClients, setClient, setClientEmailMapping, setClientPasswordHash } from '@/lib/redis'
import { hashPassword } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const clientSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  password: z.string().min(6).optional(), // Optional for admin-created accounts
  notes: z.string().optional(),
})

// GET all clients
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth()
    const clients = await getAllClients()
    return NextResponse.json({ clients })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth()
    const body = await request.json()
    const data = clientSchema.parse(body)

    const clientId = uuidv4()
    const now = new Date().toISOString()

    // Set default password if not provided
    const password = data.password || 'Welcome2024!'
    const passwordHash = await hashPassword(password)

    const client = {
      id: clientId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    }

    await setClient(clientId, client)
    await setClientEmailMapping(data.email, clientId)
    await setClientPasswordHash(clientId, passwordHash)

    return NextResponse.json({
      client,
      success: true,
      message: 'Client created successfully',
      defaultPassword: !data.password ? 'Welcome2024!' : undefined
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
