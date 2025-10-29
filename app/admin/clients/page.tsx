'use client'

import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default function AdminClientsPage() {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Clients</h1>
            <button className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light">
              Add New Client
            </button>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <p className="text-sm text-muted-foreground">No clients yet. Add your first client to get started.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
