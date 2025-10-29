/**
 * Analytics types
 */

export interface PageView {
  path: string
  count: number
  date: string
}

export interface LLMVisit {
  bot: string
  count: number
  date: string
}

export interface AnalyticsSummary {
  totalPageViews: number
  totalLLMVisits: number
  topPages: Array<{ path: string; views: number }>
  llmBreakdown: Array<{ bot: string; visits: number }>
  contactSubmissions: number
  appointmentRequests: number
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}
