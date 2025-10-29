import { NextRequest, NextResponse } from 'next/server'
import { incrementPageView, incrementLLMVisit } from '@/lib/redis'
import { incrementTrafficSource, trackSession, updateSessionActivity } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, date, aiBot, source, sessionId, userAgent } = body

    // Track page view
    if (path && date) {
      await incrementPageView(path, date)
    }

    // Track AI bot visit
    if (aiBot && date) {
      await incrementLLMVisit(aiBot, date)
    }

    // Track traffic source
    if (source && date) {
      await incrementTrafficSource(source, date)
    }

    // Track session
    if (sessionId) {
      const existingSession = await updateSessionActivity(sessionId, path)
      
      if (!existingSession) {
        // New session
        await trackSession(sessionId, {
          startTime: new Date().toISOString(),
          pages: [path],
          userAgent,
          lastActivity: new Date().toISOString()
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
