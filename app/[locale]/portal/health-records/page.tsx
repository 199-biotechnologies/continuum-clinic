'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, FileText, Pill } from 'lucide-react'

interface Pet {
  id: string
  name: string
  species: string
  breed: string
}

interface HealthRecord {
  id: string
  petId: string
  type: string
  date: number
  veterinarian?: string
  diagnosis?: string
  notes?: string
  medications?: string[]
  followUpDate?: number
}

export default function PortalHealthRecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string>('all')

  useEffect(() => {
    loadHealthRecords()
  }, [])

  const loadHealthRecords = async () => {
    try {
      const sessionRes = await fetch('/api/auth/client/session')
      if (!sessionRes.ok) {
        router.push('/portal')
        return
      }

      const response = await fetch('/api/health-records')
      if (response.ok) {
        const data = await response.json()
        setRecords(data.healthRecords || [])
        setPets(data.pets || [])
      }
      setLoading(false)
    } catch (error) {
      router.push('/portal')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/client/logout', { method: 'POST' })
    router.push('/portal')
  }

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    return pet ? `${pet.name}` : 'Unknown Pet'
  }

  const filteredRecords =
    selectedPetId === 'all'
      ? records
      : records.filter((r) => r.petId === selectedPetId)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading health records...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-light">Health Records</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-extralight mb-2">Health Records</h2>
          <p className="text-muted-foreground">
            Access your pets&apos; medical history and records
          </p>
        </div>

        {/* Filter by Pet */}
        {pets.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-light mb-2">Filter by Pet</label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="px-4 py-2 rounded-md border border-border bg-background"
            >
              <option value="all">All Pets</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Health Records */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-card">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-extralight text-muted-foreground">
              No health records available yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-6 border border-border rounded-lg bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-light mb-1">{record.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getPetName(record.petId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {record.veterinarian && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">
                      Veterinarian: <span className="text-foreground">{record.veterinarian}</span>
                    </p>
                  </div>
                )}

                {record.diagnosis && (
                  <div className="mb-3">
                    <p className="text-sm font-light mb-1">Diagnosis</p>
                    <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                  </div>
                )}

                {record.medications && record.medications.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-light">Medications</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.medications.map((med, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-muted/20 border border-border rounded-full"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-light mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {record.notes}
                    </p>
                  </div>
                )}

                {record.followUpDate && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Follow-up:{' '}
                      <span className="text-foreground">
                        {new Date(record.followUpDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
