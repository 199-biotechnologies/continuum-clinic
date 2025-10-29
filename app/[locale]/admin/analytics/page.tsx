'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Tab = 'overview' | 'ai-bots' | 'conversions' | 'seo'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats?days=30')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg font-extralight">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-light">Analytics Dashboard</h1>
              <p className="text-sm font-extralight text-muted-foreground mt-1">Last 30 days</p>
            </div>
            <Link href="/admin/dashboard" className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors">
              Back
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ai-bots', label: 'AI Bots' },
              { id: 'conversions', label: 'Conversions' },
              { id: 'seo', label: 'SEO' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 text-sm font-light border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'ai-bots' && <AIBotsTab data={data} />}
        {activeTab === 'conversions' && <ConversionsTab data={data} />}
        {activeTab === 'seo' && <SEOTab />}
      </main>
    </div>
  )
}

function OverviewTab({ data }: { data: any }) {
  const totalVisitors = data?.totalPageViews || 0

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard title="Total Visitors" value={totalVisitors} />
        <MetricCard title="Pages" value={data?.topPages?.length || 0} />
        <MetricCard title="Sources" value={Object.keys(data?.sourceTotals || {}).length} />
        <MetricCard title="AI Bots" value={Object.keys(data?.aiBotTotals || {}).length} />
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-lg font-light mb-6">Top Pages</h2>
        {data?.topPages?.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-light">Page</th>
                <th className="text-right px-4 py-3 text-sm font-light">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.map((page: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm font-extralight">{page.path}</td>
                  <td className="px-4 py-3 text-sm font-extralight text-right">{page.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-8 text-sm text-muted-foreground">No data yet</p>
        )}
      </div>
    </div>
  )
}

function AIBotsTab({ data }: { data: any }) {
  const botData = data?.aiBotTotals || {}

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard title="ChatGPT" value={botData.ChatGPT || 0} />
        <MetricCard title="Claude" value={botData.Claude || 0} />
        <MetricCard title="Perplexity" value={botData.Perplexity || 0} />
        <MetricCard title="Gemini" value={botData.Gemini || 0} />
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-lg font-light mb-6">All Bot Traffic</h2>
        {Object.keys(botData).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(botData).map(([bot, count]: [string, any]) => (
              <div key={bot} className="flex justify-between p-3 rounded border border-border">
                <span className="text-sm font-light">{bot}</span>
                <span className="text-sm font-extralight">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-sm text-muted-foreground">No bot visits yet</p>
        )}
      </div>
    </div>
  )
}

function ConversionsTab({ data }: { data: any }) {
  const conversions = data?.conversionTotals || {}

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard title="Consultations" value={conversions.consultation || 0} />
        <MetricCard title="Contacts" value={conversions.contact || 0} />
        <MetricCard title="Newsletter" value={conversions.newsletter || 0} />
        <MetricCard title="Blog" value={conversions.blog || 0} />
      </div>
    </div>
  )
}

function SEOTab() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/sitemap.xml" target="_blank" className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5">
          <h3 className="text-lg font-light mb-2">Sitemap</h3>
          <p className="text-sm font-extralight text-muted-foreground">View XML sitemap</p>
        </Link>
        <Link href="/robots.txt" target="_blank" className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5">
          <h3 className="text-lg font-light mb-2">Robots.txt</h3>
          <p className="text-sm font-extralight text-muted-foreground">View crawling rules</p>
        </Link>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card">
      <p className="text-sm font-light text-muted-foreground">{title}</p>
      <p className="text-3xl font-extralight mt-2">{value}</p>
    </div>
  )
}
