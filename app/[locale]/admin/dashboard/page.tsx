import { requireAdminAuth } from '@/lib/auth-helpers'
import { getAllClients, getAllPets, getRecentAppointments } from '@/lib/redis'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'
import { Users, Dog, Calendar, TrendingUp, FileText, MessageSquare } from 'lucide-react'

export default async function AdminDashboardPage() {
  const admin = await requireAdminAuth()
  const clients = await getAllClients()
  const pets = await getAllPets()
  const appointments = await getRecentAppointments(10)

  // Calculate metrics
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  const newClientsThisWeek = clients.filter((c: any) => {
    if (!c || !c.createdAt) return false
    return new Date(c.createdAt).getTime() > weekAgo
  }).length

  const newClientsThisMonth = clients.filter((c: any) => {
    if (!c || !c.createdAt) return false
    return new Date(c.createdAt).getTime() > monthAgo
  }).length

  const appointmentsThisWeek = appointments.filter((a: any) => {
    if (!a || !a.date) return false
    const appointmentDate = new Date(a.date).getTime()
    const now = Date.now()
    return appointmentDate > now && appointmentDate < now + 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          trend={`+${newClientsThisMonth} this month`}
        />
        <MetricCard
          title="Active Pets"
          value={pets.length}
          icon={Dog}
          trend="All registered"
        />
        <MetricCard
          title="Appointments This Week"
          value={appointmentsThisWeek}
          icon={Calendar}
          trend="Upcoming"
        />
        <MetricCard
          title="New Clients This Month"
          value={newClientsThisMonth}
          icon={TrendingUp}
          trend={`${newClientsThisWeek} this week`}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <div className="border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light">Recent Appointments</h2>
            <Link
              href="/admin/appointments"
              className="text-sm font-light text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-sm font-extralight text-muted-foreground">
                No appointments yet
              </p>
            ) : (
              appointments.slice(0, 5).map((appointment: any) => (
                <div key={appointment.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light truncate">
                      {appointment.clientName} - {appointment.petName}
                    </p>
                    <p className="text-xs font-extralight text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    appointment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                    appointment.status === 'completed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Clients */}
        <div className="border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light">New Clients</h2>
            <Link
              href="/admin/clients"
              className="text-sm font-light text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {clients.length === 0 ? (
              <p className="text-sm font-extralight text-muted-foreground">
                No clients yet
              </p>
            ) : (
              clients
                .filter((c: any) => c && c.createdAt)
                .sort((a: any, b: any) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((client: any) => (
                  <div key={client.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light truncate">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-xs font-extralight text-muted-foreground truncate">
                        {client.email}
                      </p>
                    </div>
                    <p className="text-xs font-extralight text-muted-foreground">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-lg font-light mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/content/posts/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/5 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-light">Create Blog Post</span>
          </Link>
          <Link
            href="/admin/clients/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/5 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-light">Add Client</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/5 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-light">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend }: {
  title: string
  value: number
  icon: any
  trend: string
}) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-light text-muted-foreground">{title}</p>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-extralight mb-1">{value}</p>
      <p className="text-xs font-extralight text-muted-foreground">{trend}</p>
    </div>
  )
}
