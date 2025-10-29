'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import type { Appointment, AppointmentType, AppointmentStatus } from '@/types/appointment'
import type { Client } from '@/types/client'
import type { Pet } from '@/types/pet'

interface GroupedAppointments {
  today: Appointment[]
  tomorrow: Appointment[]
  thisWeek: Appointment[]
  later: Appointment[]
}

export default function AdminAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedPetId, setSelectedPetId] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formType, setFormType] = useState<AppointmentType>('initial-consultation')
  const [formNotes, setFormNotes] = useState('')
  const [formInternalNotes, setFormInternalNotes] = useState('')
  const [formStatus, setFormStatus] = useState<AppointmentStatus>('pending')
  const [submitting, setSubmitting] = useState(false)

  // Filter state
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all')
  const [filterClient, setFilterClient] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, clientsRes, petsRes] = await Promise.all([
        fetch('/api/admin/appointments'),
        fetch('/api/admin/clients'),
        fetch('/api/admin/pets')
      ])

      if (!appointmentsRes.ok || !clientsRes.ok || !petsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [appointmentsData, clientsData, petsData] = await Promise.all([
        appointmentsRes.json(),
        clientsRes.json(),
        petsRes.json()
      ])

      setAppointments(appointmentsData.appointments || [])
      setClients(clientsData.clients || [])
      setPets(petsData.pets || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Filter pets by selected client
  const availablePets = useMemo(() => {
    if (!selectedClientId) return []
    return pets.filter(pet => pet.clientId === selectedClientId)
  }, [selectedClientId, pets])

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
      const matchesClient = !filterClient || appointment.clientId === filterClient
      const matchesSearch = !searchQuery ||
        appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.petName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesClient && matchesSearch
    })
  }, [appointments, filterStatus, filterClient, searchQuery])

  // Group appointments by time
  const groupedAppointments = useMemo((): GroupedAppointments => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const sorted = [...filteredAppointments].sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time)
      const dateB = new Date(b.date + ' ' + b.time)
      return dateA.getTime() - dateB.getTime()
    })

    return sorted.reduce((groups, appointment) => {
      const appointmentDate = new Date(appointment.date)
      appointmentDate.setHours(0, 0, 0, 0)

      if (appointmentDate.getTime() === today.getTime()) {
        groups.today.push(appointment)
      } else if (appointmentDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(appointment)
      } else if (appointmentDate < nextWeek) {
        groups.thisWeek.push(appointment)
      } else {
        groups.later.push(appointment)
      }

      return groups
    }, { today: [], tomorrow: [], thisWeek: [], later: [] } as GroupedAppointments)
  }, [filteredAppointments])

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          petId: selectedPetId,
          type: formType,
          date: formDate,
          time: formTime,
          notes: formNotes,
          internalNotes: formInternalNotes,
          status: formStatus
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create appointment')
      }

      await fetchData()
      resetForm()
      setShowCreateForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || !editingId) return

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`/api/admin/appointments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formDate,
          time: formTime,
          status: formStatus,
          notes: formNotes,
          internalNotes: formInternalNotes
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update appointment')
      }

      await fetchData()
      resetForm()
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingId(appointment.id)
    setFormDate(appointment.date)
    setFormTime(appointment.time)
    setFormStatus(appointment.status)
    setFormNotes(appointment.notes || '')
    setFormInternalNotes(appointment.internalNotes || '')
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setSelectedClientId('')
    setSelectedPetId('')
    setFormDate('')
    setFormTime('')
    setFormType('initial-consultation')
    setFormNotes('')
    setFormInternalNotes('')
    setFormStatus('pending')
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatAppointmentType = (type: AppointmentType) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div className="border rounded-lg p-6 bg-card hover:border-foreground/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium">{appointment.clientName}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Pet: {appointment.petName}</p>
        </div>
        <button
          onClick={() => handleEditAppointment(appointment)}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground">Date</p>
          <p className="font-light">{formatDate(appointment.date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Time</p>
          <p className="font-light">{appointment.time}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Type</p>
          <p className="font-light">{formatAppointmentType(appointment.type)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-light text-xs">{appointment.clientEmail}</p>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-4 p-3 bg-muted/50 rounded text-sm">
          <p className="text-muted-foreground mb-1">Client Notes:</p>
          <p className="font-light">{appointment.notes}</p>
        </div>
      )}

      {appointment.internalNotes && (
        <div className="mb-4 p-3 bg-muted/50 rounded text-sm">
          <p className="text-muted-foreground mb-1">Internal Notes:</p>
          <p className="font-light">{appointment.internalNotes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        {appointment.status === 'pending' && (
          <button
            onClick={() => handleQuickStatusChange(appointment.id, 'confirmed')}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        )}
        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
          <button
            onClick={() => handleQuickStatusChange(appointment.id, 'completed')}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
          >
            Complete
          </button>
        )}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <button
            onClick={() => handleQuickStatusChange(appointment.id, 'cancelled')}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )

  const AppointmentGroup = ({ title, appointments }: { title: string, appointments: Appointment[] }) => {
    if (appointments.length === 0) return null

    return (
      <div className="mb-8">
        <h2 className="text-xl font-light mb-4">{title}</h2>
        <div className="grid gap-4">
          {appointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Appointments</h1>
            <button
              onClick={() => {
                resetForm()
                setEditingId(null)
                setShowCreateForm(!showCreateForm)
              }}
              className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light"
            >
              {showCreateForm ? 'Cancel' : 'Schedule Appointment'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {showCreateForm && (
            <div className="border rounded-lg p-6 bg-card mb-8">
              <h2 className="text-xl font-light mb-6">
                {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              <form onSubmit={editingId ? handleUpdateAppointment : handleCreateAppointment}>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {!editingId && (
                    <>
                      <div>
                        <label className="block text-sm mb-2">Client</label>
                        <select
                          value={selectedClientId}
                          onChange={(e) => {
                            setSelectedClientId(e.target.value)
                            setSelectedPetId('')
                          }}
                          required
                          className="w-full px-4 py-2 border rounded-md bg-background"
                        >
                          <option value="">Select client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.firstName} {client.lastName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Pet</label>
                        <select
                          value={selectedPetId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          required
                          disabled={!selectedClientId}
                          className="w-full px-4 py-2 border rounded-md bg-background disabled:opacity-50"
                        >
                          <option value="">Select pet</option>
                          {availablePets.map(pet => (
                            <option key={pet.id} value={pet.id}>
                              {pet.name} ({pet.species})
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm mb-2">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Time</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-md bg-background"
                    />
                  </div>

                  {!editingId && (
                    <div>
                      <label className="block text-sm mb-2">Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as AppointmentType)}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-background"
                      >
                        <option value="initial-consultation">Initial Consultation</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="diagnostic">Diagnostic</option>
                        <option value="treatment">Treatment</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as AppointmentStatus)}
                      className="w-full px-4 py-2 border rounded-md bg-background"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Client Notes</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md bg-background"
                    placeholder="Reason for visit, symptoms, etc."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Internal Notes</label>
                  <textarea
                    value={formInternalNotes}
                    onChange={(e) => setFormInternalNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md bg-background"
                    placeholder="Staff notes, preparation needed, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Appointment' : 'Create Appointment'}
                </button>
              </form>
            </div>
          )}

          <div className="mb-6 flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by client or pet name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-background text-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus | 'all')}
              className="px-4 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="px-4 py-2 border rounded-md bg-background text-sm"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="border rounded-lg p-12 bg-card text-center">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="border rounded-lg p-12 bg-card text-center">
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' || filterClient
                  ? 'No appointments match your filters.'
                  : 'No appointments scheduled. Create your first appointment to get started.'}
              </p>
            </div>
          ) : (
            <>
              <AppointmentGroup title="Today" appointments={groupedAppointments.today} />
              <AppointmentGroup title="Tomorrow" appointments={groupedAppointments.tomorrow} />
              <AppointmentGroup title="This Week" appointments={groupedAppointments.thisWeek} />
              <AppointmentGroup title="Later" appointments={groupedAppointments.later} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
