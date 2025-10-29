import { incrementPageView, incrementLLMVisit } from './redis'

/**
 * Track page view
 */
export async function trackPageView(path: string) {
  const today = new Date().toISOString().split('T')[0]
  await incrementPageView(path, today)
}

/**
 * Detect and track LLM traffic (ChatGPT, Claude, Perplexity, etc.)
 */
export function detectLLMBot(userAgent: string): string | null {
  const ua = userAgent.toLowerCase()

  // ChatGPT
  if (ua.includes('chatgpt') || ua.includes('gpt-')) {
    return 'chatgpt'
  }

  // Claude
  if (ua.includes('claude') || ua.includes('anthropic')) {
    return 'claude'
  }

  // Perplexity
  if (ua.includes('perplexity')) {
    return 'perplexity'
  }

  // Google Bard/Gemini
  if (ua.includes('bard') || ua.includes('gemini')) {
    return 'gemini'
  }

  // Other search crawlers
  if (ua.includes('googlebot')) return 'googlebot'
  if (ua.includes('bingbot')) return 'bingbot'

  return null
}

/**
 * Track LLM visit
 */
export async function trackLLMVisit(userAgent: string) {
  const bot = detectLLMBot(userAgent)
  if (!bot) return

  const today = new Date().toISOString().split('T')[0]
  await incrementLLMVisit(bot, today)
}

/**
 * Get web vitals score
 */
export interface WebVitals {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

export function analyzeWebVitals(metric: WebVitals): {
  isGood: boolean
  threshold: number
} {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    FID: { good: 100, poor: 300 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 }
  }

  const threshold = thresholds[metric.name]
  const isGood = metric.value <= threshold.good

  return {
    isGood,
    threshold: threshold.good
  }
}

/**
 * Format analytics data for dashboard
 */
export interface AnalyticsData {
  pageViews: Record<string, number>
  llmVisits: Record<string, number>
  totalViews: number
  topPages: Array<{ path: string; views: number }>
}

export function formatAnalyticsData(rawData: Array<{ key: string; value: any }>): AnalyticsData {
  const pageViews: Record<string, number> = {}
  const llmVisits: Record<string, number> = {}
  let totalViews = 0

  for (const item of rawData) {
    const value = typeof item.value === 'string' ? parseInt(item.value) : item.value

    if (item.key.startsWith('analytics:views:')) {
      const path = item.key.split(':').slice(3).join(':')
      pageViews[path] = (pageViews[path] || 0) + value
      totalViews += value
    } else if (item.key.startsWith('analytics:llm:')) {
      const bot = item.key.split(':')[2]
      llmVisits[bot] = (llmVisits[bot] || 0) + value
    }
  }

  const topPages = Object.entries(pageViews)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  return {
    pageViews,
    llmVisits,
    totalViews,
    topPages
  }
}
