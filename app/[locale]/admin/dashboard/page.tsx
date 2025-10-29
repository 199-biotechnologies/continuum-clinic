import { requireAdminAuth } from '@/lib/auth-helpers'
import { getAllClients } from '@/lib/redis'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const admin = await requireAdminAuth()

  const clients = await getAllClients()

  async function handleLogout() {
    'use server'
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light">Continuum Clinic Admin</h1>
            <p className="text-sm font-extralight text-muted-foreground mt-1">
              {admin.email}
            </p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">Total Clients</p>
            <p className="text-3xl font-extralight mt-2">{clients.length}</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">Active Today</p>
            <p className="text-3xl font-extralight mt-2">0</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">New This Week</p>
            <p className="text-3xl font-extralight mt-2">
              {clients.filter(c => {
                const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
                return new Date(c.createdAt).getTime() > weekAgo
              }).length}
            </p>
          </div>
        </div>

        {/* Clients List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light">Clients</h2>
            <Link
              href="/admin/clients/new"
              className="px-4 py-2 text-sm font-light bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
            >
              Add Client
            </Link>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-lg">
              <p className="text-lg font-extralight text-muted-foreground">
                No clients yet
              </p>
              <p className="text-sm font-extralight text-muted-foreground mt-2">
                Clients will appear here when they register through the portal
              </p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/5 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-light">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-light">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-light">Phone</th>
                    <th className="text-left px-6 py-3 text-sm font-light">Registered</th>
                    <th className="text-left px-6 py-3 text-sm font-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-extralight">
                        {client.firstName} {client.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm font-extralight">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 text-sm font-extralight">
                        {client.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-extralight">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="text-sm font-light text-foreground hover:opacity-70 transition-opacity"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/appointments"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors"
          >
            <h3 className="text-lg font-light mb-2">Appointments</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              View and manage all appointments
            </p>
          </Link>
          <Link
            href="/admin/analytics"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors"
          >
            <h3 className="text-lg font-light mb-2">Analytics</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              View website analytics and metrics
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
