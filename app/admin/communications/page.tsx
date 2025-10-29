'use client'

import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default function AdminCommunicationsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light mb-8">Communications</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-4">Contact Form Submissions</h2>
              <p className="text-sm text-muted-foreground mb-4">No new submissions</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-4">Email Templates</h2>
              <button className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light">
                Manage Templates
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
