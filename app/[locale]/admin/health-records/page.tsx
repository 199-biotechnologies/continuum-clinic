'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Plus, Search, Trash2, Edit, X } from 'lucide-react'

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  clientId: string
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
  labResults?: any[]
  biomarkers?: any[]
  followUpDate?: number
  createdAt: string
  updatedAt: string
}

export default function AdminHealthRecordsPage() {
  const t = useTranslations()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null)
  const [formData, setFormData] = useState({
    petId: '',
    type: '',
    date: '',
    veterinarian: '',
    diagnosis: '',
    notes: '',
    medications: '',
    followUpDate: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadRecords()
    loadPets()
  }, [])

  const loadRecords = async () => {
    try {
      const response = await fetch('/api/admin/health-records')
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load health records:', error)
      setLoading(false)
    }
  }

  const loadPets = async () => {
    try {
      const response = await fetch('/api/admin/pets')
      if (response.ok) {
        const data = await response.json()
        setPets(data.pets || [])
      }
    } catch (error) {
      console.error('Failed to load pets:', error)
    }
  }

  const openCreateModal = () => {
    setFormData({
      petId: '',
      type: '',
      date: '',
      veterinarian: '',
      diagnosis: '',
      notes: '',
      medications: '',
      followUpDate: '',
    })
    setShowCreateModal(true)
  }

  const openEditModal = (record: HealthRecord) => {
    setSelectedRecord(record)
    setFormData({
      petId: record.petId,
      type: record.type,
      date: new Date(record.date).toISOString().split('T')[0],
      veterinarian: record.veterinarian || '',
      diagnosis: record.diagnosis || '',
      notes: record.notes || '',
      medications: record.medications?.join(', ') || '',
      followUpDate: record.followUpDate
        ? new Date(record.followUpDate).toISOString().split('T')[0]
        : '',
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (record: HealthRecord) => {
    setSelectedRecord(record)
    setShowDeleteModal(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const medications = formData.medications
        ? formData.medications.split(',').map(m => m.trim()).filter(Boolean)
        : []

      const response = await fetch('/api/admin/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId: formData.petId,
          type: formData.type,
          date: new Date(formData.date).getTime(),
          veterinarian: formData.veterinarian,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          medications,
          followUpDate: formData.followUpDate
            ? new Date(formData.followUpDate).getTime()
            : undefined,
        }),
      })

      if (response.ok) {
        await loadRecords()
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Failed to create health record:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecord) return
    setIsSaving(true)

    try {
      const medications = formData.medications
        ? formData.medications.split(',').map(m => m.trim()).filter(Boolean)
        : []

      const response = await fetch(`/api/admin/health-records/${selectedRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId: formData.petId,
          type: formData.type,
          date: new Date(formData.date).getTime(),
          veterinarian: formData.veterinarian,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          medications,
          followUpDate: formData.followUpDate
            ? new Date(formData.followUpDate).getTime()
            : undefined,
        }),
      })

      if (response.ok) {
        await loadRecords()
        setShowEditModal(false)
        setSelectedRecord(null)
      }
    } catch (error) {
      console.error('Failed to update health record:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRecord) return
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/health-records/${selectedRecord.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadRecords()
        setShowDeleteModal(false)
        setSelectedRecord(null)
      }
    } catch (error) {
      console.error('Failed to delete health record:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const pet = pets.find(p => p.id === record.petId)
    return (
      pet?.name.toLowerCase().includes(query) ||
      record.type.toLowerCase().includes(query) ||
      record.diagnosis?.toLowerCase().includes(query) ||
      record.veterinarian?.toLowerCase().includes(query)
    )
  })

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet ? `${pet.name} (${pet.species})` : 'Unknown Pet'
  }

  const actions = (
    <button
      onClick={openCreateModal}
      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
    >
      <Plus className="w-4 h-4" />
      {t('admin_add_new')}
    </button>
  )

  if (loading) {
    return (
      <AdminLayout title={t('admin_health_records_title')} actions={actions}>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{t('admin_loading')}</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={t('admin_health_records_title')} actions={actions}>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search health records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background"
          />
        </div>
      </div>

      {/* Health Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-card">
          <p className="text-lg font-extralight text-muted-foreground mb-4">
            {t('admin_no_results')}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              {t('admin_add_new')}
            </button>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/5">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-light">{t('admin_record_pet')}</th>
                <th className="px-4 py-3 text-left text-sm font-light">{t('admin_record_type')}</th>
                <th className="px-4 py-3 text-left text-sm font-light">{t('admin_record_date')}</th>
                <th className="px-4 py-3 text-left text-sm font-light">{t('admin_record_veterinarian')}</th>
                <th className="px-4 py-3 text-left text-sm font-light">{t('admin_record_diagnosis')}</th>
                <th className="px-4 py-3 text-right text-sm font-light">{t('common_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm">{getPetName(record.petId)}</td>
                  <td className="px-4 py-3 text-sm">{record.type}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{record.veterinarian || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    {record.diagnosis ? (
                      <span className="line-clamp-1">{record.diagnosis}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(record)}
                        className="p-1 hover:bg-muted/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(record)}
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
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-light">{t('admin_create_record')}</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_pet')} *</label>
                <select
                  required
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                >
                  <option value="">Select a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">{t('admin_record_type')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g. Checkup, Vaccination, Surgery"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light mb-2">{t('admin_record_date')} *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_veterinarian')}</label>
                <input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_diagnosis')}</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_medications')}</label>
                <input
                  type="text"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="e.g. Aspirin, Antibiotics"
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_notes')}</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_followup')}</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  {t('admin_cancel_action')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? t('admin_creating') : t('admin_create_record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-light">{t('admin_edit_record')}</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_pet')} *</label>
                <select
                  required
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                >
                  <option value="">Select a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">{t('admin_record_type')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light mb-2">{t('admin_record_date')} *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_veterinarian')}</label>
                <input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_diagnosis')}</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_medications')}</label>
                <input
                  type="text"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_notes')}</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">{t('admin_record_followup')}</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  {t('admin_cancel_action')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? t('admin_saving') : t('admin_edit_record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-light mb-4">{t('admin_delete_record')}</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this health record for{' '}
                <strong>{getPetName(selectedRecord.petId)}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  {t('admin_cancel_action')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-light hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? t('admin_deleting') : t('admin_delete_record')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
