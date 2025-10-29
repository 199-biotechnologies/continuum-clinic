'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

interface AnalyticsData {
  totalViews: number
  llmTraffic: {
    chatgpt: number
    claude: number
    perplexity: number
  }
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData>({
    totalViews: 0,
    llmTraffic: { chatgpt: 0, claude: 0, perplexity: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/stats')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light mb-8">Analytics</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Total Page Views</p>
              <p className="text-3xl font-light">{loading ? '...' : data.totalViews}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">ChatGPT Traffic</p>
              <p className="text-3xl font-light">{loading ? '...' : data.llmTraffic.chatgpt}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Claude Traffic</p>
              <p className="text-3xl font-light">{loading ? '...' : data.llmTraffic.claude}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Perplexity Traffic</p>
              <p className="text-3xl font-light">{loading ? '...' : data.llmTraffic.perplexity}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-light mb-4">Traffic Sources</h2>
            <p className="text-sm text-muted-foreground">Traffic analytics will appear here</p>
          </div>
        </div>
      </main>
    </div>
  )
}
