'use client'

import { AdminSidebar } from './sidebar'
import { useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  actions?: React.ReactNode
}

export function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/admin/logout', {
        method: 'POST',
      })
      if (response.ok) {
        // Get current locale from pathname
        const locale = window.location.pathname.split('/')[1] || 'en'
        router.push(`/${locale}/admin`)
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-x-hidden">
        {title && (
          <header className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-light">{title}</h1>
              {actions && <div>{actions}</div>}
            </div>
          </header>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
