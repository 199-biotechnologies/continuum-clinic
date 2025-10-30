'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Plus, Search, Edit, Trash2, Eye, X, Check, AlertCircle, Dog } from 'lucide-react'

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Pet {
  id: string
  clientId: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string
  dateOfBirth: string
  weight: number
  sex: 'male' | 'female' | 'neutered' | 'spayed'
  microchipId?: string
  insuranceDetails?: {
    provider?: string
    policyNumber?: string
    expiryDate?: string
  }
  photoUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PetWithClient extends Pet {
  clientName: string
  clientEmail: string
}

type ModalMode = 'create' | 'edit' | 'view' | null

export default function AdminPetsPage() {
  const t = useTranslations()
  const router = useRouter()
  const [pets, setPets] = useState<PetWithClient[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<string>('all')
  const [filterClient, setFilterClient] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'other',
    breed: '',
    dateOfBirth: '',
    weight: '',
    sex: 'male' as 'male' | 'female' | 'neutered' | 'spayed',
    clientId: '',
    microchipId: '',
    notes: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [petsRes, clientsRes] = await Promise.all([
        fetch('/api/admin/pets'),
        fetch('/api/admin/clients')
      ])

      if (!petsRes.ok || !clientsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const petsData = await petsRes.json()
      const clientsData = await clientsRes.json()

      setClients(clientsData.clients || [])

      // Enrich pets with client information
      const enrichedPets = (petsData.pets || []).map((pet: Pet) => {
        const client = clientsData.clients.find((c: Client) => c.id === pet.clientId)
        return {
          ...pet,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
          clientEmail: client?.email || ''
        }
      })

      setPets(enrichedPets)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const openModal = (mode: ModalMode, pet?: Pet) => {
    setModalMode(mode)
    setError(null)
    setSuccess(null)

    if (mode === 'create') {
      setFormData({
        name: '',
        species: 'dog',
        breed: '',
        dateOfBirth: '',
        weight: '',
        sex: 'male',
        clientId: '',
        microchipId: '',
        notes: '',
        insuranceProvider: '',
        insurancePolicyNumber: '',
        insuranceExpiryDate: '',
      })
      setSelectedPet(null)
    } else if ((mode === 'edit' || mode === 'view') && pet) {
      setSelectedPet(pet)
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        weight: pet.weight.toString(),
        sex: pet.sex,
        clientId: pet.clientId,
        microchipId: pet.microchipId || '',
        notes: pet.notes || '',
        insuranceProvider: pet.insuranceDetails?.provider || '',
        insurancePolicyNumber: pet.insuranceDetails?.policyNumber || '',
        insuranceExpiryDate: pet.insuranceDetails?.expiryDate || '',
      })
    }
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedPet(null)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!formData.name || !formData.species || !formData.breed || !formData.dateOfBirth || !formData.weight || !formData.clientId) {
      setError('Please fill in all required fields')
      return
    }

    const weight = parseFloat(formData.weight)
    if (isNaN(weight) || weight <= 0) {
      setError('Weight must be a positive number')
      return
    }

    try {
      const payload = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        dateOfBirth: formData.dateOfBirth,
        weight,
        sex: formData.sex,
        clientId: formData.clientId,
        microchipId: formData.microchipId || undefined,
        notes: formData.notes || undefined,
        insuranceDetails: {
          provider: formData.insuranceProvider || undefined,
          policyNumber: formData.insurancePolicyNumber || undefined,
          expiryDate: formData.insuranceExpiryDate || undefined,
        }
      }

      let res
      if (modalMode === 'create') {
        res = await fetch('/api/admin/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else if (modalMode === 'edit' && selectedPet) {
        res = await fetch(`/api/admin/pets/${selectedPet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!res?.ok) {
        const data = await res?.json()
        throw new Error(data.error || 'Failed to save pet')
      }

      setSuccess(modalMode === 'create' ? 'Pet created successfully!' : 'Pet updated successfully!')
      setTimeout(() => {
        closeModal()
        fetchData()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (petId: string) => {
    try {
      const res = await fetch(`/api/admin/pets/${petId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete pet')
      }

      setSuccess('Pet deleted successfully!')
      setDeleteConfirm(null)
      setTimeout(() => {
        setSuccess(null)
        fetchData()
      }, 1500)
    } catch (err) {
      setError('Failed to delete pet')
    }
  }

  const calculateAge = (dateOfBirth: string): string => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()

    if (months < 0) {
      years--
      months += 12
    }

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`
    } else {
      return `${years}y ${months}m`
    }
  }

  const getHealthStatus = (pet: Pet): { status: string; color: string } => {
    // Simple health status based on age and recent updates
    const age = new Date().getTime() - new Date(pet.dateOfBirth).getTime()
    const ageYears = age / (1000 * 60 * 60 * 24 * 365)

    if (ageYears > 10) {
      return { status: 'Senior', color: 'text-yellow-600' }
    } else if (ageYears > 7) {
      return { status: 'Adult', color: 'text-green-600' }
    } else {
      return { status: 'Young', color: 'text-blue-600' }
    }
  }

  // Filter pets
  const filteredPets = pets.filter(pet => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecies = filterSpecies === 'all' || pet.species === filterSpecies
    const matchesClient = filterClient === 'all' || pet.clientId === filterClient

    return matchesSearch && matchesSpecies && matchesClient
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-light">{t('admin_pets_title')}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage pet profiles and medical records
              </p>
            </div>
            <button
              onClick={() => openModal('create')}
              className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light flex items-center gap-2 hover:bg-foreground/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('admin_pets_add')}
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}
          {error && !modalMode && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-card border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('admin_pets_search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                />
              </div>

              {/* Species Filter */}
              <select
                value={filterSpecies}
                onChange={(e) => setFilterSpecies(e.target.value)}
                className="px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
              >
                <option value="all">All Species</option>
                <option value="dog">{t('admin_pets_dogs')}</option>
                <option value="cat">{t('admin_pets_cats')}</option>
                <option value="other">{t('species_other')}</option>
              </select>

              {/* Client Filter */}
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
              >
                <option value="all">All Owners</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pets Table */}
          {loading ? (
            <div className="border rounded-lg p-12 bg-card text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              <p className="mt-4 text-sm text-muted-foreground">{t('admin_loading')}</p>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="border rounded-lg p-12 bg-card text-center">
              <Dog className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                {pets.length === 0 ? t('admin_pets_none') : t('admin_pets_none_search')}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/5 border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_name')}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_species')}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_breed')}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_age')}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_owner')}
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-light text-muted-foreground uppercase tracking-wider">
                        {t('admin_pets_actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPets.map((pet) => {
                      const healthStatus = getHealthStatus(pet)
                      return (
                        <tr key={pet.id} className="hover:bg-muted/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {pet.photoUrl ? (
                                <img
                                  src={pet.photoUrl}
                                  alt={pet.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  <Dog className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <div className="font-normal text-sm">{pet.name}</div>
                                <div className="text-xs text-muted-foreground">{pet.sex}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light capitalize">{pet.species}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light">{pet.breed}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light">{calculateAge(pet.dateOfBirth)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-light">{pet.clientName}</div>
                              <div className="text-xs text-muted-foreground">{pet.clientEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-light ${healthStatus.color}`}>
                              {healthStatus.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openModal('view', pet)}
                                className="p-2 hover:bg-muted/20 rounded-md transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openModal('edit', pet)}
                                className="p-2 hover:bg-muted/20 rounded-md transition-colors"
                                title="Edit pet"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(pet.id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                                title="Delete pet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-light">
                {modalMode === 'create' ? t('admin_pets_add') : t('admin_pets_edit')}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-muted/20 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800 text-sm">
                  <Check className="w-4 h-4" />
                  {success}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Pet Name */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_species')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  >
                    <option value="dog">{t('species_dog')}</option>
                    <option value="cat">{t('species_cat')}</option>
                    <option value="other">{t('species_other')}</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_breed')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_date_of_birth')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_weight')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_sex')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  >
                    <option value="male">{t('admin_pets_sex_male')}</option>
                    <option value="female">{t('admin_pets_sex_female')}</option>
                    <option value="neutered">{t('admin_pets_sex_neutered')}</option>
                    <option value="spayed">{t('admin_pets_sex_spayed')}</option>
                  </select>
                </div>

                {/* Owner */}
                <div className="col-span-2">
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_owner')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    required
                  >
                    <option value="">{t('admin_pets_select_client')}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.firstName} {client.lastName} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Microchip ID */}
                <div className="col-span-2">
                  <label className="block text-sm font-light mb-2">
                    {t('admin_pets_microchip_id')}
                  </label>
                  <input
                    type="text"
                    value={formData.microchipId}
                    onChange={(e) => setFormData({ ...formData, microchipId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                  />
                </div>
              </div>

              {/* Insurance Details */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-light mb-4">Insurance Details (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2">Provider</label>
                    <input
                      type="text"
                      value={formData.insuranceProvider}
                      onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Policy Number</label>
                    <input
                      type="text"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.insuranceExpiryDate}
                      onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-light mb-2">{t('admin_pets_notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-md text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground bg-background resize-none"
                  placeholder="Any additional information about the pet..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  {t('common_cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:bg-foreground/90 transition-colors"
                >
                  {modalMode === 'create' ? t('admin_modal_create') : t('admin_modal_update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-light">Pet Details</h2>
              <button onClick={closeModal} className="p-2 hover:bg-muted/20 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Pet Photo */}
              {selectedPet.photoUrl && (
                <div className="flex justify-center">
                  <img
                    src={selectedPet.photoUrl}
                    alt={selectedPet.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_name')}</label>
                  <p className="text-base font-light mt-1">{selectedPet.name}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_species')}</label>
                  <p className="text-base font-light mt-1 capitalize">{selectedPet.species}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_breed')}</label>
                  <p className="text-base font-light mt-1">{selectedPet.breed}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_age')}</label>
                  <p className="text-base font-light mt-1">{calculateAge(selectedPet.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_date_of_birth')}</label>
                  <p className="text-base font-light mt-1">
                    {new Date(selectedPet.dateOfBirth).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_weight')}</label>
                  <p className="text-base font-light mt-1">{selectedPet.weight} kg</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_sex')}</label>
                  <p className="text-base font-light mt-1 capitalize">{selectedPet.sex}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Status</label>
                  <p className={`text-base font-light mt-1 ${getHealthStatus(selectedPet).color}`}>
                    {getHealthStatus(selectedPet).status}
                  </p>
                </div>
              </div>

              {/* Owner */}
              <div className="border-t border-border pt-6">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_owner')}</label>
                <div className="mt-2">
                  <p className="text-base font-light">
                    {pets.find(p => p.id === selectedPet.id)?.clientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pets.find(p => p.id === selectedPet.id)?.clientEmail}
                  </p>
                </div>
              </div>

              {/* Microchip */}
              {selectedPet.microchipId && (
                <div className="border-t border-border pt-6">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_microchip_id')}</label>
                  <p className="text-base font-light mt-2">{selectedPet.microchipId}</p>
                </div>
              )}

              {/* Insurance */}
              {selectedPet.insuranceDetails && (selectedPet.insuranceDetails.provider || selectedPet.insuranceDetails.policyNumber) && (
                <div className="border-t border-border pt-6">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Insurance Details</label>
                  <div className="mt-2 space-y-2">
                    {selectedPet.insuranceDetails.provider && (
                      <p className="text-sm font-light">
                        <span className="text-muted-foreground">Provider:</span> {selectedPet.insuranceDetails.provider}
                      </p>
                    )}
                    {selectedPet.insuranceDetails.policyNumber && (
                      <p className="text-sm font-light">
                        <span className="text-muted-foreground">Policy:</span> {selectedPet.insuranceDetails.policyNumber}
                      </p>
                    )}
                    {selectedPet.insuranceDetails.expiryDate && (
                      <p className="text-sm font-light">
                        <span className="text-muted-foreground">Expires:</span>{' '}
                        {new Date(selectedPet.insuranceDetails.expiryDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedPet.notes && (
                <div className="border-t border-border pt-6">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_pets_notes')}</label>
                  <p className="text-base font-light mt-2 whitespace-pre-wrap">{selectedPet.notes}</p>
                </div>
              )}

              {/* Health Records Placeholder */}
              <div className="border-t border-border pt-6">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">{t('admin_health_records')}</label>
                <div className="mt-4 p-4 border border-dashed border-border rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    Health records feature coming soon
                  </p>
                </div>
              </div>

              {/* Appointments Placeholder */}
              <div className="border-t border-border pt-6">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Recent Appointments</label>
                <div className="mt-4 p-4 border border-dashed border-border rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    No recent appointments
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  {t('admin_modal_close')}
                </button>
                <button
                  onClick={() => openModal('edit', selectedPet)}
                  className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:bg-foreground/90 transition-colors"
                >
                  {t('common_edit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light mb-2">{t('admin_pets_delete')}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t('admin_pets_confirm_delete')} {t('admin_pets_confirm_delete_warning')}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                  >
                    {t('common_cancel')}
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-light hover:bg-red-700 transition-colors"
                  >
                    {t('common_delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
