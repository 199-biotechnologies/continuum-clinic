'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'
import { Dog, Search, Plus } from 'lucide-react'

export default function AdminPetsPage() {
  const [pets, setPets] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [petsRes, clientsRes] = await Promise.all([
        fetch('/api/admin/pets'),
        fetch('/api/admin/clients')
      ])

      if (petsRes.ok) {
        const petsData = await petsRes.json()
        setPets(petsData.pets || [])
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        setClients(clientsData.clients || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown'
  }

  const getAge = (dateOfBirth: string) => {
    const years = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return years
  }

  const filteredPets = pets.filter(pet =>
    pet && (
      pet.name?.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(pet.clientId).toLowerCase().includes(search.toLowerCase())
    )
  )

  const actions = (
    <Link
      href="/admin/pets/new"
      className="flex items-center gap-2 px-4 py-2 text-sm font-light bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
    >
      <Plus className="w-4 h-4" />
      Add Pet
    </Link>
  )

  return (
    <AdminLayout title="Pets" actions={actions}>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, breed, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      </div>

      {/* Pets Table */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-lg font-extralight text-muted-foreground">Loading pets...</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <Dog className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-extralight text-muted-foreground">No pets found</p>
          <p className="text-sm font-extralight text-muted-foreground mt-2">
            {search ? 'Try adjusting your search' : 'Add your first pet to get started'}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead className="bg-muted/5 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-light">Name</th>
                <th className="text-left px-6 py-3 text-sm font-light">Species</th>
                <th className="text-left px-6 py-3 text-sm font-light">Breed</th>
                <th className="text-left px-6 py-3 text-sm font-light">Owner</th>
                <th className="text-left px-6 py-3 text-sm font-light">Age</th>
                <th className="text-left px-6 py-3 text-sm font-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.map((pet) => (
                <tr key={pet.id} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-extralight">
                    {pet.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight capitalize">
                    {pet.species}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight">
                    {pet.breed}
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight">
                    <Link
                      href={`/admin/clients/${pet.clientId}`}
                      className="hover:underline"
                    >
                      {getClientName(pet.clientId)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-extralight">
                    {getAge(pet.dateOfBirth)}y
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/pets/${pet.id}`}
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
