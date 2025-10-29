'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Plus, Search, Trash2, Edit, X, ArrowRight } from 'lucide-react'

interface Redirect {
  id: string
  from: string
  to: string
  type: '301' | '302'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRedirect, setSelectedRedirect] = useState<Redirect | null>(null)
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    type: '301' as '301' | '302',
    status: 'active' as 'active' | 'inactive',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadRedirects()
  }, [])

  const loadRedirects = async () => {
    try {
      const response = await fetch('/api/admin/seo/redirects')
      if (response.ok) {
        const data = await response.json()
        setRedirects(data.redirects || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load redirects:', error)
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setFormData({
      from: '',
      to: '',
      type: '301',
      status: 'active',
    })
    setShowCreateModal(true)
  }

  const openEditModal = (redirect: Redirect) => {
    setSelectedRedirect(redirect)
    setFormData({
      from: redirect.from,
      to: redirect.to,
      type: redirect.type,
      status: redirect.status,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (redirect: Redirect) => {
    setSelectedRedirect(redirect)
    setShowDeleteModal(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/admin/seo/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadRedirects()
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Failed to create redirect:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRedirect) return
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/seo/redirects/${selectedRedirect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadRedirects()
        setShowEditModal(false)
        setSelectedRedirect(null)
      }
    } catch (error) {
      console.error('Failed to update redirect:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRedirect) return
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/seo/redirects/${selectedRedirect.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadRedirects()
        setShowDeleteModal(false)
        setSelectedRedirect(null)
      }
    } catch (error) {
      console.error('Failed to delete redirect:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const filteredRedirects = redirects.filter(redirect => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      redirect.from.toLowerCase().includes(query) ||
      redirect.to.toLowerCase().includes(query)
    )
  })

  const activeRedirects = redirects.filter(r => r.status === 'active').length
  const redirect301Count = redirects.filter(r => r.type === '301').length

  const actions = (
    <button
      onClick={openCreateModal}
      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
    >
      <Plus className="w-4 h-4" />
      Add Redirect
    </button>
  )

  if (loading) {
    return (
      <AdminLayout title="Redirects" actions={actions}>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading redirects...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Redirects" actions={actions}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="text-sm font-light text-muted-foreground mb-2">Total Redirects</h3>
          <p className="text-3xl font-extralight">{redirects.length}</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="text-sm font-light text-muted-foreground mb-2">Active</h3>
          <p className="text-3xl font-extralight">{activeRedirects}</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="text-sm font-light text-muted-foreground mb-2">Permanent (301)</h3>
          <p className="text-3xl font-extralight">{redirect301Count}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search redirects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background"
          />
        </div>
      </div>

      {/* Redirects Table */}
      {filteredRedirects.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <ArrowRight className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg font-extralight text-muted-foreground mb-4">
            {searchQuery ? 'No redirects match your search' : 'No redirects configured yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add First Redirect
            </button>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/5">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-light">From</th>
                <th className="px-4 py-3 text-left text-sm font-light">To</th>
                <th className="px-4 py-3 text-left text-sm font-light">Type</th>
                <th className="px-4 py-3 text-left text-sm font-light">Status</th>
                <th className="px-4 py-3 text-right text-sm font-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRedirects.map((redirect) => (
                <tr key={redirect.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm font-mono">{redirect.from}</td>
                  <td className="px-4 py-3 text-sm font-mono">{redirect.to}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        redirect.type === '301'
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                          : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }`}
                    >
                      {redirect.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        redirect.status === 'active'
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                          : 'bg-gray-500/10 text-gray-600 border border-gray-500/20'
                      }`}
                    >
                      {redirect.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(redirect)}
                        className="p-1 hover:bg-muted/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(redirect)}
                        className="p-1 hover:bg-red-500/10 text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-light">Add Redirect</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">From Path *</label>
                <input
                  type="text"
                  required
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="/old-page"
                  className="w-full px-4 py-2 rounded-md border border-border bg-background font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">To Path *</label>
                <input
                  type="text"
                  required
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="/new-page"
                  className="w-full px-4 py-2 rounded-md border border-border bg-background font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as '301' | '302' })
                    }
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  >
                    <option value="301">301 (Permanent)</option>
                    <option value="302">302 (Temporary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRedirect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-light">Edit Redirect</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">From Path *</label>
                <input
                  type="text"
                  required
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">To Path *</label>
                <input
                  type="text"
                  required
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as '301' | '302' })
                    }
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  >
                    <option value="301">301 (Permanent)</option>
                    <option value="302">302 (Temporary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRedirect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-light mb-4">Delete Redirect</h2>
              <p className="text-muted-foreground mb-2">
                Are you sure you want to delete this redirect?
              </p>
              <div className="p-3 bg-muted/10 rounded-md border border-border mb-6 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{selectedRedirect.from}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{selectedRedirect.to}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-light hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Deleting...' : 'Delete Redirect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
