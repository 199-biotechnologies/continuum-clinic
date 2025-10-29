'use client'

import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default function AdminSettingsPage() {
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
          <h1 className="text-3xl font-light mb-8">Settings</h1>

          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-4">General Settings</h2>
              <p className="text-sm text-muted-foreground">Configure general system settings</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-4">Email Settings</h2>
              <p className="text-sm text-muted-foreground">Manage email templates and SMTP configuration</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-light mb-4">User Management</h2>
              <p className="text-sm text-muted-foreground">Manage admin users and permissions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
