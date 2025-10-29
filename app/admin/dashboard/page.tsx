'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalClients: number
  totalPets: number
  appointmentsThisWeek: number
  newClientsThisMonth: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalPets: 0,
    appointmentsThisWeek: 0,
    newClientsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with actual API calls
    setTimeout(() => {
      setStats({
        totalClients: 0,
        totalPets: 0,
        appointmentsThisWeek: 0,
        newClientsThisMonth: 0
      })
      setLoading(false)
    }, 500)
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
          <h1 className="text-3xl font-light mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Total Clients</p>
              <p className="text-3xl font-light">{loading ? '...' : stats.totalClients}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Total Pets</p>
              <p className="text-3xl font-light">{loading ? '...' : stats.totalPets}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">Appointments This Week</p>
              <p className="text-3xl font-light">{loading ? '...' : stats.appointmentsThisWeek}</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <p className="text-sm font-light text-muted-foreground mb-2">New Clients This Month</p>
              <p className="text-3xl font-light">{loading ? '...' : stats.newClientsThisMonth}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-light mb-4">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  )
}
