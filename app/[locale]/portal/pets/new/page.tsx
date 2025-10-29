'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPetPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    dateOfBirth: '',
    weight: '',
    sex: 'male',
    microchipId: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: parseFloat(formData.weight)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add pet')
      }

      router.push('/portal/pets')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to add pet')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-light">Add New Pet</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-light mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light mb-2">Species *</label>
              <select
                required
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light mb-2">Breed *</label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light mb-2">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light mb-2">Sex *</label>
            <select
              required
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="neutered">Neutered</option>
              <option value="spayed">Spayed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-light mb-2">Microchip ID</label>
            <input
              type="text"
              value={formData.microchipId}
              onChange={(e) => setFormData({ ...formData, microchipId: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-light mb-2">Notes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/portal/pets"
              className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Pet'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
