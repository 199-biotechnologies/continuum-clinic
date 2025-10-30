'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MedicalHistory,
  Medication,
  ChronicCondition,
  Allergy,
  Surgery,
  Vaccination,
  Illness,
  DietInformation,
  ExerciseInformation,
  VeterinarianInfo,
  InsuranceInfo,
  EmergencyContact,
  COMMON_CONDITIONS,
  COMMON_ALLERGIES,
  COMMON_VACCINES
} from '@/types/medical-history'

interface PageProps {
  params: Promise<{ petId: string; locale: string }>
}

export default function MedicalHistoryOnboarding({ params }: PageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [petId, setPetId] = useState<string>('')
  const [petName, setPetName] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState<Partial<MedicalHistory>>({
    currentMedications: [],
    chronicConditions: [],
    allergies: [],
    previousSurgeries: [],
    vaccinationHistory: [],
    previousIllnesses: [],
    diet: {
      currentFood: '',
      feedingSchedule: '',
      treats: '',
      supplements: '',
      dietaryRestrictions: '',
      waterIntake: 'normal'
    },
    exercise: {
      frequency: '',
      duration: '',
      intensity: 'moderate',
      activityTypes: []
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      alternatePhone: '',
      email: '',
      canAuthorize: false
    },
    behavioralIssues: '',
    additionalNotes: ''
  })

  // Unwrap params
  useEffect(() => {
    params.then(({ petId }) => {
      setPetId(petId)
      // Fetch pet name for display
      fetchPetName(petId)
    })
  }, [params])

  const fetchPetName = async (id: string) => {
    try {
      const response = await fetch(`/api/pets/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPetName(data.name || 'Your Pet')
      }
    } catch (err) {
      console.error('Failed to fetch pet name:', err)
    }
  }

  const totalSteps = 7

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Medications optional, always valid
        return true
      case 2:
        // Conditions and allergies optional, always valid
        return true
      case 3:
        // Medical history optional, always valid
        return true
      case 4:
        // Lifestyle - require basic diet and exercise info
        return !!(
          formData.diet?.currentFood &&
          formData.diet?.feedingSchedule &&
          formData.exercise?.frequency &&
          formData.exercise?.duration
        )
      case 5:
        // Previous vet optional, always valid
        return true
      case 6:
        // Insurance optional, always valid
        return true
      case 7:
        // Emergency contact required
        return !!(
          formData.emergencyContact?.name &&
          formData.emergencyContact?.relationship &&
          formData.emergencyContact?.phone &&
          validatePhone(formData.emergencyContact?.phone)
        )
      default:
        return true
    }
  }

  const validatePhone = (phone: string): boolean => {
    return /^\+?[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setError('Please complete all required fields before continuing')
      return
    }
    setError(null)
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(7)) {
      setError('Please complete all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get clientId from session
      const sessionResponse = await fetch('/api/auth/client/session')
      if (!sessionResponse.ok) {
        throw new Error('Session expired')
      }
      const session = await sessionResponse.json()

      const payload: MedicalHistory = {
        petId,
        clientId: session.userId,
        currentMedications: formData.currentMedications || [],
        chronicConditions: formData.chronicConditions || [],
        allergies: formData.allergies || [],
        previousSurgeries: formData.previousSurgeries || [],
        vaccinationHistory: formData.vaccinationHistory || [],
        previousIllnesses: formData.previousIllnesses || [],
        diet: formData.diet!,
        exercise: formData.exercise!,
        emergencyContact: formData.emergencyContact!,
        behavioralIssues: formData.behavioralIssues,
        additionalNotes: formData.additionalNotes
      }

      if (formData.previousVeterinarian?.name) {
        payload.previousVeterinarian = formData.previousVeterinarian
      }

      if (formData.insurance?.provider) {
        payload.insurance = formData.insurance
      }

      const response = await fetch('/api/medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save medical history')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/portal/pets')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to save medical history')
      setLoading(false)
    }
  }

  // Helper functions for array fields
  const addMedication = () => {
    setFormData({
      ...formData,
      currentMedications: [
        ...(formData.currentMedications || []),
        { name: '', dosage: '', frequency: '', startDate: '', reason: '' }
      ]
    })
  }

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications?.filter((_, i) => i !== index)
    })
  }

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    const updated = [...(formData.currentMedications || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, currentMedications: updated })
  }

  const addCondition = () => {
    setFormData({
      ...formData,
      chronicConditions: [
        ...(formData.chronicConditions || []),
        { condition: '', diagnosedDate: '', currentlyManaged: false }
      ]
    })
  }

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      chronicConditions: formData.chronicConditions?.filter((_, i) => i !== index)
    })
  }

  const updateCondition = (index: number, field: keyof ChronicCondition, value: any) => {
    const updated = [...(formData.chronicConditions || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, chronicConditions: updated })
  }

  const addAllergy = () => {
    setFormData({
      ...formData,
      allergies: [
        ...(formData.allergies || []),
        { allergen: '', reaction: '', severity: 'mild' }
      ]
    })
  }

  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies?.filter((_, i) => i !== index)
    })
  }

  const updateAllergy = (index: number, field: keyof Allergy, value: any) => {
    const updated = [...(formData.allergies || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, allergies: updated })
  }

  const addSurgery = () => {
    setFormData({
      ...formData,
      previousSurgeries: [
        ...(formData.previousSurgeries || []),
        { procedure: '', date: '' }
      ]
    })
  }

  const removeSurgery = (index: number) => {
    setFormData({
      ...formData,
      previousSurgeries: formData.previousSurgeries?.filter((_, i) => i !== index)
    })
  }

  const updateSurgery = (index: number, field: keyof Surgery, value: any) => {
    const updated = [...(formData.previousSurgeries || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, previousSurgeries: updated })
  }

  const addVaccination = () => {
    setFormData({
      ...formData,
      vaccinationHistory: [
        ...(formData.vaccinationHistory || []),
        { vaccine: '', date: '' }
      ]
    })
  }

  const removeVaccination = (index: number) => {
    setFormData({
      ...formData,
      vaccinationHistory: formData.vaccinationHistory?.filter((_, i) => i !== index)
    })
  }

  const updateVaccination = (index: number, field: keyof Vaccination, value: any) => {
    const updated = [...(formData.vaccinationHistory || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, vaccinationHistory: updated })
  }

  const addIllness = () => {
    setFormData({
      ...formData,
      previousIllnesses: [
        ...(formData.previousIllnesses || []),
        { illness: '', diagnosedDate: '' }
      ]
    })
  }

  const removeIllness = (index: number) => {
    setFormData({
      ...formData,
      previousIllnesses: formData.previousIllnesses?.filter((_, i) => i !== index)
    })
  }

  const updateIllness = (index: number, field: keyof Illness, value: any) => {
    const updated = [...(formData.previousIllnesses || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, previousIllnesses: updated })
  }

  const toggleActivityType = (activity: string) => {
    const current = formData.exercise?.activityTypes || []
    const updated = current.includes(activity)
      ? current.filter(a => a !== activity)
      : [...current, activity]
    setFormData({
      ...formData,
      exercise: { ...formData.exercise!, activityTypes: updated }
    })
  }

  if (!petId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6 text-green-600 text-6xl">✓</div>
          <h1 className="text-3xl font-extralight mb-4">Medical History Saved</h1>
          <p className="text-muted-foreground mb-6">
            {petName}'s medical history has been successfully saved. Redirecting to your pets...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-light">Medical History Onboarding</h1>
              <p className="text-sm text-muted-foreground mt-1">{petName}</p>
            </div>
            <Link
              href="/portal/pets"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-light text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-light text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div
              className="bg-foreground h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Step 1: Current Medications */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Current Medications</h2>
              <p className="text-sm text-muted-foreground">
                List all medications your pet is currently taking. Leave empty if none.
              </p>
            </div>

            {formData.currentMedications?.map((med, index) => (
              <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-light">Medication {index + 1}</h3>
                  <button
                    onClick={() => removeMedication(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2">
                      Medication Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      placeholder="e.g., Carprofen"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">
                      Dosage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      placeholder="e.g., 50mg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      placeholder="e.g., Twice daily"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={med.startDate}
                      onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">End Date (if applicable)</label>
                    <input
                      type="date"
                      value={med.endDate || ''}
                      onChange={(e) => updateMedication(index, 'endDate', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Prescribed By</label>
                    <input
                      type="text"
                      value={med.prescribedBy || ''}
                      onChange={(e) => updateMedication(index, 'prescribedBy', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      placeholder="Veterinarian name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-light mb-2">
                      Reason for Medication <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={med.reason}
                      onChange={(e) => updateMedication(index, 'reason', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      rows={2}
                      placeholder="What is this medication treating?"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addMedication}
              className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
            >
              + Add Medication
            </button>
          </div>
        )}

        {/* Step 2: Chronic Conditions & Allergies */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Chronic Conditions & Allergies</h2>
              <p className="text-sm text-muted-foreground">
                List any ongoing health conditions and known allergies.
              </p>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Chronic Conditions</h3>

              {formData.chronicConditions?.map((condition, index) => (
                <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-light">Condition {index + 1}</h4>
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Condition <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={condition.condition}
                        onChange={(e) => updateCondition(index, 'condition', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Select condition</option>
                        {COMMON_CONDITIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Diagnosed Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={condition.diagnosedDate}
                        onChange={(e) => updateCondition(index, 'diagnosedDate', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Diagnosed By</label>
                      <input
                        type="text"
                        value={condition.diagnosedBy || ''}
                        onChange={(e) => updateCondition(index, 'diagnosedBy', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        placeholder="Veterinarian name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={condition.currentlyManaged}
                          onChange={(e) => updateCondition(index, 'currentlyManaged', e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm font-light">Currently being managed</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Treatment Plan</label>
                      <textarea
                        value={condition.treatment || ''}
                        onChange={(e) => updateCondition(index, 'treatment', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        rows={2}
                        placeholder="Current treatment or management plan"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addCondition}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
              >
                + Add Chronic Condition
              </button>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Allergies</h3>

              {formData.allergies?.map((allergy, index) => (
                <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-light">Allergy {index + 1}</h4>
                    <button
                      onClick={() => removeAllergy(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Allergen Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={allergy.allergen}
                        onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Select allergen</option>
                        {COMMON_ALLERGIES.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Reaction <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={allergy.reaction}
                        onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        placeholder="e.g., Itching, swelling, difficulty breathing"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Severity <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={allergy.severity}
                        onChange={(e) => updateAllergy(index, 'severity', e.target.value as any)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="life-threatening">Life-Threatening</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Diagnosed Date</label>
                      <input
                        type="date"
                        value={allergy.diagnosedDate || ''}
                        onChange={(e) => updateAllergy(index, 'diagnosedDate', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addAllergy}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
              >
                + Add Allergy
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Medical History */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Medical History</h2>
              <p className="text-sm text-muted-foreground">
                Previous surgeries, vaccinations, and illnesses.
              </p>
            </div>

            {/* Surgeries */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Previous Surgeries</h3>

              {formData.previousSurgeries?.map((surgery, index) => (
                <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-light">Surgery {index + 1}</h4>
                    <button
                      onClick={() => removeSurgery(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Procedure <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={surgery.procedure}
                        onChange={(e) => updateSurgery(index, 'procedure', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        placeholder="e.g., Spay/Neuter, ACL repair"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={surgery.date}
                        onChange={(e) => updateSurgery(index, 'date', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Veterinarian</label>
                      <input
                        type="text"
                        value={surgery.veterinarian || ''}
                        onChange={(e) => updateSurgery(index, 'veterinarian', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Clinic/Hospital</label>
                      <input
                        type="text"
                        value={surgery.clinic || ''}
                        onChange={(e) => updateSurgery(index, 'clinic', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Complications</label>
                      <textarea
                        value={surgery.complications || ''}
                        onChange={(e) => updateSurgery(index, 'complications', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        rows={2}
                        placeholder="Any complications during or after surgery"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Additional Notes</label>
                      <textarea
                        value={surgery.notes || ''}
                        onChange={(e) => updateSurgery(index, 'notes', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addSurgery}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
              >
                + Add Surgery
              </button>
            </div>

            {/* Vaccinations */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Vaccination History</h3>

              {formData.vaccinationHistory?.map((vaccination, index) => (
                <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-light">Vaccination {index + 1}</h4>
                    <button
                      onClick={() => removeVaccination(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Vaccine <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={vaccination.vaccine}
                        onChange={(e) => updateVaccination(index, 'vaccine', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="">Select vaccine</option>
                        {COMMON_VACCINES.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Date Given <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={vaccination.date}
                        onChange={(e) => updateVaccination(index, 'date', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Next Due Date</label>
                      <input
                        type="date"
                        value={vaccination.nextDue || ''}
                        onChange={(e) => updateVaccination(index, 'nextDue', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Administered By</label>
                      <input
                        type="text"
                        value={vaccination.administeredBy || ''}
                        onChange={(e) => updateVaccination(index, 'administeredBy', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Batch Number</label>
                      <input
                        type="text"
                        value={vaccination.batchNumber || ''}
                        onChange={(e) => updateVaccination(index, 'batchNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addVaccination}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
              >
                + Add Vaccination
              </button>
            </div>

            {/* Previous Illnesses */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Previous Illnesses</h3>

              {formData.previousIllnesses?.map((illness, index) => (
                <div key={index} className="p-6 border border-border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-light">Illness {index + 1}</h4>
                    <button
                      onClick={() => removeIllness(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">
                        Illness <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={illness.illness}
                        onChange={(e) => updateIllness(index, 'illness', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        placeholder="e.g., Parvovirus, Kennel Cough"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Diagnosed Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={illness.diagnosedDate}
                        onChange={(e) => updateIllness(index, 'diagnosedDate', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">Resolved Date</label>
                      <input
                        type="date"
                        value={illness.resolvedDate || ''}
                        onChange={(e) => updateIllness(index, 'resolvedDate', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Treatment</label>
                      <textarea
                        value={illness.treatment || ''}
                        onChange={(e) => updateIllness(index, 'treatment', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        rows={2}
                        placeholder="How was this treated?"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-light mb-2">Additional Notes</label>
                      <textarea
                        value={illness.notes || ''}
                        onChange={(e) => updateIllness(index, 'notes', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addIllness}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground/50 transition-colors text-sm font-light"
              >
                + Add Previous Illness
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Lifestyle */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Lifestyle & Diet</h2>
              <p className="text-sm text-muted-foreground">
                Information about your pet's daily routine, diet, and exercise.
              </p>
            </div>

            {/* Diet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Diet Information</h3>

              <div className="p-6 border border-border rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-light mb-2">
                    Current Food <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.diet?.currentFood || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, currentFood: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="Brand and type of food"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Feeding Schedule <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.diet?.feedingSchedule || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, feedingSchedule: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., Twice daily, morning and evening"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Treats</label>
                  <input
                    type="text"
                    value={formData.diet?.treats || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, treats: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="Types of treats given"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Supplements</label>
                  <input
                    type="text"
                    value={formData.diet?.supplements || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, supplements: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="Any supplements or vitamins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Dietary Restrictions</label>
                  <textarea
                    value={formData.diet?.dietaryRestrictions || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, dietaryRestrictions: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    rows={2}
                    placeholder="Any foods to avoid or restrictions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Water Intake <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.diet?.waterIntake || 'normal'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet: { ...formData.diet!, waterIntake: e.target.value as any }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Exercise Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Exercise Information</h3>

              <div className="p-6 border border-border rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-light mb-2">
                    Frequency <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.exercise?.frequency || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exercise: { ...formData.exercise!, frequency: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., Daily, 3-4 times per week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.exercise?.duration || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exercise: { ...formData.exercise!, duration: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., 30 minutes, 1 hour"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Intensity <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.exercise?.intensity || 'moderate'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exercise: { ...formData.exercise!, intensity: e.target.value as any }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Activity Types</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Walking', 'Running', 'Swimming', 'Playing fetch', 'Agility training', 'Dog park'].map(
                      (activity) => (
                        <label key={activity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.exercise?.activityTypes?.includes(activity)}
                            onChange={() => toggleActivityType(activity)}
                            className="rounded border-border"
                          />
                          <span className="text-sm font-light">{activity}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Previous Veterinary Care */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Previous Veterinary Care</h2>
              <p className="text-sm text-muted-foreground">
                Information about your previous veterinarian (optional).
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">Veterinarian Name</label>
                  <input
                    type="text"
                    value={formData.previousVeterinarian?.name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian,
                          name: e.target.value,
                          clinicName: formData.previousVeterinarian?.clinicName || '',
                          phone: formData.previousVeterinarian?.phone || ''
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Clinic Name</label>
                  <input
                    type="text"
                    value={formData.previousVeterinarian?.clinicName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian,
                          name: formData.previousVeterinarian?.name || '',
                          clinicName: e.target.value,
                          phone: formData.previousVeterinarian?.phone || ''
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.previousVeterinarian?.phone || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian,
                          name: formData.previousVeterinarian?.name || '',
                          clinicName: formData.previousVeterinarian?.clinicName || '',
                          phone: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.previousVeterinarian?.email || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian!,
                          email: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-light mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.previousVeterinarian?.address || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian!,
                          address: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Years with Veterinarian</label>
                  <input
                    type="number"
                    value={formData.previousVeterinarian?.yearsWithVet || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian!,
                          yearsWithVet: parseInt(e.target.value) || undefined
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-light mb-2">Reason for Change</label>
                  <textarea
                    value={formData.previousVeterinarian?.reasonForChange || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previousVeterinarian: {
                          ...formData.previousVeterinarian!,
                          reasonForChange: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    rows={3}
                    placeholder="Why are you switching to Continuum Clinic?"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Insurance Information */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Insurance Information</h2>
              <p className="text-sm text-muted-foreground">
                Pet insurance details (optional).
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">Insurance Provider</label>
                  <input
                    type="text"
                    value={formData.insurance?.provider || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          provider: e.target.value,
                          policyNumber: formData.insurance?.policyNumber || '',
                          coverageType: formData.insurance?.coverageType || ''
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., Trupanion, Healthy Paws"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Policy Number</label>
                  <input
                    type="text"
                    value={formData.insurance?.policyNumber || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          provider: formData.insurance?.provider || '',
                          policyNumber: e.target.value,
                          coverageType: formData.insurance?.coverageType || ''
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Coverage Type</label>
                  <input
                    type="text"
                    value={formData.insurance?.coverageType || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          provider: formData.insurance?.provider || '',
                          policyNumber: formData.insurance?.policyNumber || '',
                          coverageType: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., Comprehensive, Accident Only"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.insurance?.expiryDate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance!,
                          expiryDate: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Annual Limit</label>
                  <input
                    type="number"
                    value={formData.insurance?.annualLimit || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance!,
                          annualLimit: parseInt(e.target.value) || undefined
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="Maximum annual coverage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Deductible</label>
                  <input
                    type="number"
                    value={formData.insurance?.deductible || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance!,
                          deductible: parseInt(e.target.value) || undefined
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="Annual deductible amount"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Emergency Contact */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extralight mb-2">Emergency Contact</h2>
              <p className="text-sm text-muted-foreground">
                Someone we can reach in case of emergency. Required.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact!,
                          name: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact!,
                          relationship: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                    placeholder="e.g., Spouse, Family member, Friend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact!,
                          phone: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                  {formData.emergencyContact?.phone &&
                    !validatePhone(formData.emergencyContact.phone) && (
                      <p className="text-sm text-red-600 mt-1">Please enter a valid phone number</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Alternate Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact?.alternatePhone || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact!,
                          alternatePhone: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-light mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.emergencyContact?.email || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact!,
                          email: e.target.value
                        }
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                  {formData.emergencyContact?.email &&
                    !validateEmail(formData.emergencyContact.email) && (
                      <p className="text-sm text-red-600 mt-1">Please enter a valid email address</p>
                    )}
                </div>

                <div className="md:col-span-2 pt-4 border-t border-border">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.emergencyContact?.canAuthorize || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact!,
                            canAuthorize: e.target.checked
                          }
                        })
                      }
                      className="mt-1 rounded border-border"
                    />
                    <span className="text-sm font-light">
                      This person is authorized to make medical decisions and approve emergency
                      treatment on my behalf
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-light">Additional Information</h3>

              <div>
                <label className="block text-sm font-light mb-2">Behavioral Issues</label>
                <textarea
                  value={formData.behavioralIssues || ''}
                  onChange={(e) => setFormData({ ...formData, behavioralIssues: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  rows={3}
                  placeholder="Any behavioral concerns we should be aware of (aggression, anxiety, fear, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">Additional Notes</label>
                <textarea
                  value={formData.additionalNotes || ''}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  rows={3}
                  placeholder="Any other information you'd like us to know about your pet"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-border">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-border rounded-md text-sm font-light hover:bg-muted/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                  Saving...
                </>
              ) : (
                'Complete Onboarding'
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
