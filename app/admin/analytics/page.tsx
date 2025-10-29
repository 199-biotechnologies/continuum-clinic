'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

interface AnalyticsData {
  totalPageViews: number
  topPages: Array<{ path: string; views: number }>
  aiBotTotals: Record<string, number>
  sourceTotals: Record<string, number>
  conversionTotals: Record<string, number>
  dailyTraffic: Array<{ date: string; views: number }>
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<7 | 30>(30)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/analytics/stats?days=${timeRange}`)

      if (!res.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const jsonData = await res.json()
      setData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Calculate AI bot percentages
  const totalAITraffic = data ? Object.values(data.aiBotTotals).reduce((sum, count) => sum + count, 0) : 0
  const aiBotPercentages = data
    ? Object.entries(data.aiBotTotals)
        .map(([bot, count]) => ({
          bot,
          count,
          percentage: totalAITraffic > 0 ? (count / totalAITraffic) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count)
    : []

  // Calculate traffic source percentages
  const totalSourceTraffic = data ? Object.values(data.sourceTotals).reduce((sum, count) => sum + count, 0) : 0
  const sourcePercentages = data
    ? Object.entries(data.sourceTotals)
        .map(([source, count]) => ({
          source,
          count,
          percentage: totalSourceTraffic > 0 ? (count / totalSourceTraffic) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count)
    : []

  // Calculate max views for chart scaling
  const maxDailyViews = data ? Math.max(...data.dailyTraffic.map(d => d.views), 1) : 1

  if (loading && !data) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <p className="text-red-500">Error loading analytics: {error}</p>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-light">Analytics Dashboard</h1>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  timeRange === 7
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border hover:bg-muted'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  timeRange === 30
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border hover:bg-muted'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Total Page Views</p>
              <p className="text-3xl font-light">{data?.totalPageViews.toLocaleString() || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Last {timeRange} days</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">ChatGPT Traffic</p>
              <p className="text-3xl font-light">{(data?.aiBotTotals.chatgpt || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalAITraffic > 0 ? ((data!.aiBotTotals.chatgpt || 0) / totalAITraffic * 100).toFixed(1) : 0}% of AI traffic
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Claude Traffic</p>
              <p className="text-3xl font-light">{(data?.aiBotTotals.claude || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalAITraffic > 0 ? ((data!.aiBotTotals.claude || 0) / totalAITraffic * 100).toFixed(1) : 0}% of AI traffic
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Perplexity Traffic</p>
              <p className="text-3xl font-light">{(data?.aiBotTotals.perplexity || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalAITraffic > 0 ? ((data!.aiBotTotals.perplexity || 0) / totalAITraffic * 100).toFixed(1) : 0}% of AI traffic
              </p>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Gemini Traffic</p>
              <p className="text-3xl font-light">{(data?.aiBotTotals.gemini || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalAITraffic > 0 ? ((data!.aiBotTotals.gemini || 0) / totalAITraffic * 100).toFixed(1) : 0}% of AI traffic
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Total AI Bot Traffic</p>
              <p className="text-3xl font-light">{totalAITraffic.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {data?.totalPageViews ? ((totalAITraffic / data.totalPageViews) * 100).toFixed(1) : 0}% of all traffic
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Contact Forms</p>
              <p className="text-3xl font-light">{(data?.conversionTotals.contact || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Total submissions</p>
            </div>
          </div>

          {/* Page Views Over Time */}
          <div className="border rounded-lg p-6 bg-card mb-8">
            <h2 className="text-xl font-light mb-6">Page Views Over Time</h2>

            {data && data.dailyTraffic.length > 0 ? (
              <div className="space-y-4">
                {/* Chart */}
                <div className="relative h-64 flex items-end justify-between gap-1">
                  {data.dailyTraffic.map((day, index) => {
                    const height = (day.views / maxDailyViews) * 100
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center group relative">
                        <div
                          className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm cursor-pointer"
                          style={{ height: `${height}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-xs whitespace-nowrap z-10">
                            <div className="font-medium">{new Date(day.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</div>
                            <div>{day.views} views</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(data.dailyTraffic[0].date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                  <span>{new Date(data.dailyTraffic[Math.floor(data.dailyTraffic.length / 2)].date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                  <span>{new Date(data.dailyTraffic[data.dailyTraffic.length - 1].date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No traffic data available</p>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Traffic Sources */}
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-6">Traffic Sources</h2>

              {sourcePercentages.length > 0 ? (
                <div className="space-y-4">
                  {sourcePercentages.map(({ source, count, percentage }) => (
                    <div key={source} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-light">{source}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No traffic source data available</p>
              )}
            </div>

            {/* AI Bot Traffic Details */}
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-6">AI Bot Traffic Breakdown</h2>

              {aiBotPercentages.length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b">
                        <th className="pb-2 font-light">Bot Name</th>
                        <th className="pb-2 font-light text-right">Visits</th>
                        <th className="pb-2 font-light text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {aiBotPercentages.map(({ bot, count, percentage }) => (
                        <tr key={bot} className="border-b last:border-0">
                          <td className="py-3 capitalize font-light">{bot}</td>
                          <td className="py-3 text-right">{count.toLocaleString()}</td>
                          <td className="py-3 text-right text-muted-foreground">{percentage.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pie Chart Visualization */}
                  <div className="mt-6 flex justify-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {aiBotPercentages.reduce((acc, { bot, percentage }, index) => {
                          const colors = ['#000000', '#666666', '#999999', '#CCCCCC', '#E5E5E5']
                          const startAngle = acc.cumulative
                          const angle = (percentage / 100) * 360
                          const endAngle = startAngle + angle

                          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180)
                          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180)
                          const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180)
                          const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180)
                          const largeArc = angle > 180 ? 1 : 0

                          acc.elements.push(
                            <path
                              key={bot}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={colors[index % colors.length]}
                              opacity={0.8}
                            />
                          )

                          acc.cumulative = endAngle
                          return acc
                        }, { elements: [] as React.ReactElement[], cumulative: 0 }).elements}
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No AI bot data available</p>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-light mb-6">Top Pages</h2>

            {data && data.topPages.length > 0 ? (
              <div className="space-y-3">
                {data.topPages.map(({ path, views }, index) => (
                  <div key={path} className="flex items-center gap-4">
                    <span className="text-sm font-light text-muted-foreground w-6">#{index + 1}</span>
                    <div className="flex-1 flex items-center justify-between gap-4">
                      <span className="text-sm font-light truncate">{path}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(views / data.topPages[0].views) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">{views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No page view data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
