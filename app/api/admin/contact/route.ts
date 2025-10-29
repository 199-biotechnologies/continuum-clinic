import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getAllContacts, getContactsByStatus } from '@/lib/redis'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Fetch contacts
    let contacts
    if (status) {
      contacts = await getContactsByStatus(status, limit)
    } else {
      contacts = await getAllContacts(limit)
    }

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
