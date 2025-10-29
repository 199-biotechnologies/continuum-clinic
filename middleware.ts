import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// AI Bot detection patterns
const AI_BOTS = {
  'ChatGPT': /ChatGPT-User|GPTBot/i,
  'Claude': /Claude-Web|ClaudeBot/i,
  'Perplexity': /PerplexityBot/i,
  'Gemini': /Google-Extended|Gemini-Bot/i,
  'GoogleBot': /Googlebot/i,
  'BingBot': /bingbot/i
}

// Traffic source detection
function detectTrafficSource(referer: string | null, userAgent: string): string {
  if (!referer) return 'direct'

  const refererLower = referer.toLowerCase()
  if (refererLower.includes('google.com')) return 'organic_google'
  if (refererLower.includes('bing.com')) return 'organic_bing'
  if (refererLower.includes('facebook.com') || refererLower.includes('instagram.com')) return 'social_meta'
  if (refererLower.includes('twitter.com') || refererLower.includes('x.com')) return 'social_x'
  if (refererLower.includes('linkedin.com')) return 'social_linkedin'

  // Check if it's an AI bot
  for (const [botName, pattern] of Object.entries(AI_BOTS)) {
    if (pattern.test(userAgent)) {
      return `ai_bot_${botName.toLowerCase()}`
    }
  }

  return 'referral'
}

// Detect AI bot from user agent
function detectAIBot(userAgent: string): string | null {
  for (const [botName, pattern] of Object.entries(AI_BOTS)) {
    if (pattern.test(userAgent)) {
      return botName
    }
  }
  return null
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Only track analytics for non-API, non-static routes
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return response
  }

  // Track analytics asynchronously (fire and forget)
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer')
  const today = new Date().toISOString().split('T')[0]

  // Detect AI bot
  const aiBot = detectAIBot(userAgent)

  // Detect traffic source
  const source = detectTrafficSource(referer, userAgent)

  // Store session ID in cookie if not present
  const sessionId = request.cookies.get('analytics_session')?.value || crypto.randomUUID()

  // Track analytics via API route (non-blocking)
  fetch(new URL('/api/analytics/track', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: pathname,
      date: today,
      aiBot,
      source,
      sessionId,
      userAgent
    })
  }).catch(() => {}) // Ignore errors in tracking

  // Set session cookie if new
  if (!request.cookies.get('analytics_session')) {
    response.cookies.set('analytics_session', sessionId, {
      maxAge: 30 * 60, // 30 minutes
      httpOnly: true,
      sameSite: 'lax'
    })
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
