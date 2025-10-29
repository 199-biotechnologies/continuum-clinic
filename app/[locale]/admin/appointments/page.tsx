'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'
import { Calendar, Search, Plus } from 'lucide-react'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(apt =>
    apt && (
      (statusFilter === 'all' || apt.status === statusFilter) &&
      (
        apt.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        apt.petName?.toLowerCase().includes(search.toLowerCase())
      )
    )
  )

  const actions = (
    <Link
      href="/admin/appointments/new"
      className="flex items-center gap-2 px-4 py-2 text-sm font-light bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
    >
      <Plus className="w-4 h-4" />
      New Appointment
    </Link>
  )

  return (
    <AdminLayout title="Appointments" actions={actions}>
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client or pet name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-lg font-extralight text-muted-foreground">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-extralight text-muted-foreground">No appointments found</p>
          <p className="text-sm font-extralight text-muted-foreground mt-2">
            {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first appointment'}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead className="bg-muted/5 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-light">Date & Time</th>
                <th className="text-left px-6 py-3 text-sm font-light">Client</th>
                <th className="text-left px-6 py-3 text-sm font-light">Pet</th>
                <th className="text-left px-6 py-3 text-sm font-light">Type</th>
                <th className="text-left px-6 py-3 text-sm font-light">Status</th>
                <th className="text-left px-6 py-3 text-sm font-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-extralight">
                    {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight">
                    {appointment.clientName}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight">
                    {appointment.petName}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight capitalize">
                    {appointment.type?.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      appointment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                      appointment.status === 'completed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/appointments/${appointment.id}`}
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
    </AdminLayout>
  )
}
