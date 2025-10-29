'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postcode: '',
      country: 'United Kingdom',
    },
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Client created successfully')
        if (data.defaultPassword) {
          toast.info(`Default password: ${data.defaultPassword}`)
        }
        router.push(`/admin/clients/${data.client.id}`)
      } else {
        toast.error(data.error || 'Failed to create client')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add New Client">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h3 className="text-lg font-light mb-4">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-light mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-light mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-light mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-light mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          {/* Address */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h3 className="text-lg font-light mb-4">Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-light mb-2">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light mb-2">Postcode</label>
                  <input
                    type="text"
                    value={formData.address.postcode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postcode: e.target.value } })}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-light mb-2">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h3 className="text-lg font-light mb-4">Notes</h3>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-border bg-background text-sm font-light focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Any additional notes about the client..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-light bg-foreground text-background rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
