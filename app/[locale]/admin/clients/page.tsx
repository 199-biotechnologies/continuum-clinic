'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'
import { Users, Search, Plus } from 'lucide-react'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client && (
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase()) ||
      client.phone?.includes(search)
    )
  )

  const actions = (
    <Link
      href="/admin/clients/new"
      className="flex items-center gap-2 px-4 py-2 text-sm font-light bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
    >
      <Plus className="w-4 h-4" />
      Add Client
    </Link>
  )

  return (
    <AdminLayout title="Clients" actions={actions}>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-lg font-extralight text-muted-foreground">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-extralight text-muted-foreground">No clients found</p>
          <p className="text-sm font-extralight text-muted-foreground mt-2">
            {search ? 'Try adjusting your search' : 'Create your first client to get started'}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
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
              {filteredClients.map((client) => (
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
    </AdminLayout>
  )
}
