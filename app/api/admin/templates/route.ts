import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getAllTemplates, saveTemplate } from '@/lib/redis'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const createTemplateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  variables: z.array(z.string()).optional(),
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

    const templates = await getAllTemplates()

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createTemplateSchema.parse(body)

    const templateId = uuidv4()
    const now = new Date().toISOString()

    const template = {
      id: templateId,
      ...data,
      variables: data.variables || [],
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    }

    await saveTemplate(templateId, template)

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error creating template:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
