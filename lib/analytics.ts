import { redis } from './redis'

/**
 * Enhanced Analytics Functions
 * Full implementation of the analytics schema for tracking
 */

/**
 * Traffic Source Tracking
 */
export async function incrementTrafficSource(source: string, date: string) {
  return await redis.incr(`analytics:source:${source}:${date}`)
}

/**
 * Session Management
 */
export async function trackSession(sessionId: string, data: {
  startTime: string
  pages: string[]
  userAgent?: string
  lastActivity?: string
}) {
  return await redis.set(`analytics:sessions:${sessionId}`, data, { ex: 1800 }) // 30 min TTL
}

export async function getAnalyticsSession(sessionId: string) {
  return await redis.get(`analytics:sessions:${sessionId}`)
}

export async function updateSessionActivity(sessionId: string, page: string) {
  const session = await getAnalyticsSession(sessionId) as any
  if (session) {
    session.pages.push(page)
    session.lastActivity = new Date().toISOString()
    await trackSession(sessionId, session)
  }
  return session
}

/**
 * Conversion Tracking
 */
export async function incrementConversion(type: string, date: string) {
  return await redis.incr(`analytics:conversions:${type}:${date}`)
}

/**
 * Date Range Analytics
 */

// Helper to generate date range
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return dates
}

// Get page views for a date range
export async function getPageViewsRange(startDate: string, endDate: string) {
  const dates = getDateRange(startDate, endDate)
  const results: Record<string, Record<string, number>> = {}

  for (const date of dates) {
    const pattern = `analytics:views:${date}:*`
    const keys = await redis.keys(pattern)
    const dateViews: Record<string, number> = {}

    for (const key of keys as string[]) {
      const path = key.split(':').slice(3).join(':')
      const count = await redis.get(key) as number
      dateViews[path] = count || 0
    }

    results[date] = dateViews
  }

  return results
}

// Get AI bot traffic for date range
export async function getAIBotTrafficRange(startDate: string, endDate: string) {
  const dates = getDateRange(startDate, endDate)
  const results: Record<string, Record<string, number>> = {}

  for (const date of dates) {
    const pattern = `analytics:llm:*:${date}`
    const keys = await redis.keys(pattern)
    const dateBots: Record<string, number> = {}

    for (const key of keys as string[]) {
      const bot = key.split(':')[2]
      const count = await redis.get(key) as number
      dateBots[bot] = count || 0
    }

    results[date] = dateBots
  }

  return results
}

// Get traffic sources for date range
export async function getTrafficSourcesRange(startDate: string, endDate: string) {
  const dates = getDateRange(startDate, endDate)
  const results: Record<string, Record<string, number>> = {}

  for (const date of dates) {
    const pattern = `analytics:source:*:${date}`
    const keys = await redis.keys(pattern)
    const dateSources: Record<string, number> = {}

    for (const key of keys as string[]) {
      const source = key.split(':')[2]
      const count = await redis.get(key) as number
      dateSources[source] = count || 0
    }

    results[date] = dateSources
  }

  return results
}

// Get conversions for date range
export async function getConversionsRange(startDate: string, endDate: string) {
  const dates = getDateRange(startDate, endDate)
  const results: Record<string, Record<string, number>> = {}

  for (const date of dates) {
    const pattern = `analytics:conversions:*:${date}`
    const keys = await redis.keys(pattern)
    const dateConversions: Record<string, number> = {}

    for (const key of keys as string[]) {
      const type = key.split(':')[2]
      const count = await redis.get(key) as number
      dateConversions[type] = count || 0
    }

    results[date] = dateConversions
  }

  return results
}

/**
 * Analytics Summary for Dashboard
 */
export async function getAnalyticsSummary(days: number = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  const [pageViews, aiBots, sources, conversions] = await Promise.all([
    getPageViewsRange(startDateStr, endDateStr),
    getAIBotTrafficRange(startDateStr, endDateStr),
    getTrafficSourcesRange(startDateStr, endDateStr),
    getConversionsRange(startDateStr, endDateStr)
  ])

  // Calculate totals
  let totalPageViews = 0
  const topPages: Record<string, number> = {}

  Object.values(pageViews).forEach(dayData => {
    Object.entries(dayData).forEach(([path, count]) => {
      totalPageViews += count
      topPages[path] = (topPages[path] || 0) + count
    })
  })

  // AI bot totals
  const aiBotTotals: Record<string, number> = {}
  Object.values(aiBots).forEach(dayData => {
    Object.entries(dayData).forEach(([bot, count]) => {
      aiBotTotals[bot] = (aiBotTotals[bot] || 0) + count
    })
  })

  // Traffic source totals
  const sourceTotals: Record<string, number> = {}
  Object.values(sources).forEach(dayData => {
    Object.entries(dayData).forEach(([source, count]) => {
      sourceTotals[source] = (sourceTotals[source] || 0) + count
    })
  })

  // Conversion totals
  const conversionTotals: Record<string, number> = {}
  Object.values(conversions).forEach(dayData => {
    Object.entries(dayData).forEach(([type, count]) => {
      conversionTotals[type] = (conversionTotals[type] || 0) + count
    })
  })

  // Calculate daily traffic
  const dailyTraffic: { date: string; views: number }[] = []
  Object.entries(pageViews).forEach(([date, dayData]) => {
    const totalViews = Object.values(dayData).reduce((sum, count) => sum + count, 0)
    dailyTraffic.push({ date, views: totalViews })
  })

  // Sort top pages
  const topPagesSorted = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }))

  return {
    totalPageViews,
    topPages: topPagesSorted,
    aiBotTotals,
    sourceTotals,
    conversionTotals,
    dailyTraffic: dailyTraffic.sort((a, b) => a.date.localeCompare(b.date))
  }
}

/**
 * SEO Management
 */

// Store keyword data
export async function setKeywordData(keyword: string, data: {
  position?: number
  clicks: number
  impressions: number
  ctr: number
}) {
  return await redis.set(`seo:keywords:${keyword}`, data)
}

export async function getKeywordData(keyword: string) {
  return await redis.get(`seo:keywords:${keyword}`)
}

export async function getAllKeywords() {
  const pattern = 'seo:keywords:*'
  const keys = await redis.keys(pattern)
  const keywords = await Promise.all(
    (keys as string[]).map(async key => ({
      keyword: key.split(':')[2],
      data: await redis.get(key)
    }))
  )
  return keywords
}

// SEO issues tracking
export async function addSEOIssue(type: string, path: string) {
  return await redis.sadd(`seo:issues:${type}`, path)
}

export async function getSEOIssues(type: string) {
  return await redis.smembers(`seo:issues:${type}`)
}

export async function removeSEOIssue(type: string, path: string) {
  return await redis.srem(`seo:issues:${type}`, path)
}

// Backlinks count
export async function setBacklinksCount(count: number) {
  return await redis.set('seo:backlinks:count', count)
}

export async function getBacklinksCount() {
  return await redis.get('seo:backlinks:count') || 0
}

// Meta tags storage
export async function setPageMeta(path: string, meta: {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
}) {
  return await redis.set(`seo:meta:${path}`, meta)
}

export async function getPageMeta(path: string) {
  return await redis.get(`seo:meta:${path}`)
}

export async function getAllPageMeta() {
  const pattern = 'seo:meta:*'
  const keys = await redis.keys(pattern)
  const metaData = await Promise.all(
    (keys as string[]).map(async key => ({
      path: key.split(':').slice(2).join(':'),
      meta: await redis.get(key)
    }))
  )
  return metaData
}

// Robots.txt storage
export async function setRobotsTxt(content: string) {
  return await redis.set('seo:robots:txt', content)
}

export async function getRobotsTxt() {
  return await redis.get('seo:robots:txt') as string | null
}
