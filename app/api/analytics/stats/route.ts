import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helpers'
import { getAnalyticsSummary } from '@/lib/analytics'

export async function GET(request: Request) {
  try {
    await requireAdminAuth()
    
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const summary = await getAnalyticsSummary(days)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
