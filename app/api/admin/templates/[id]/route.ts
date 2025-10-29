import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getTemplate, saveTemplate, deleteTemplate } from '@/lib/redis'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

const updateTemplateSchema = z.object({
  name: z.string().min(3).optional(),
  subject: z.string().min(3).optional(),
  body: z.string().min(10).optional(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const template = await getTemplate(id)

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updates = updateTemplateSchema.parse(body)

    const template = await getTemplate(id) as any
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.isSystem) {
      return NextResponse.json(
        { error: 'Cannot modify system templates' },
        { status: 403 }
      )
    }

    const updated = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await saveTemplate(id, updated)

    return NextResponse.json({ template: updated })
  } catch (error) {
    console.error('Error updating template:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const success = await deleteTemplate(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Template not found or cannot delete system template' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
