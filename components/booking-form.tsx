'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function BookingForm() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    petName: '',
    petSpecies: 'dog',
    appointmentType: 'initial',
    preferredDate: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      setStatus('success')
      setFormData({
        ownerName: '',
        email: '',
        phone: '',
        petName: '',
        petSpecies: 'dog',
        appointmentType: 'initial',
        preferredDate: '',
        message: ''
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to book appointment')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2">Consultation requested</h3>
        <p className="text-sm font-extralight text-muted-foreground mb-6">
          Thank you. We'll contact you within 24 hours to confirm your appointment.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-light transition-all hover:opacity-70"
        >
          Book another consultation
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="ownerName" className="block text-sm font-light mb-2">
            Your name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-light mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-light mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
        </div>

        <div>
          <label htmlFor="petName" className="block text-sm font-light mb-2">
            Pet name
          </label>
          <input
            type="text"
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="petSpecies" className="block text-sm font-light mb-2">
            Species
          </label>
          <select
            id="petSpecies"
            name="petSpecies"
            value={formData.petSpecies}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          >
            <option value="dog">{t('species_dog')}</option>
            <option value="cat">{t('species_cat')}</option>
            <option value="other">{t('species_other')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="appointmentType" className="block text-sm font-light mb-2">
            Appointment type
          </label>
          <select
            id="appointmentType"
            name="appointmentType"
            value={formData.appointmentType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
          >
            <option value="initial">{t('appointment_type_initial')}</option>
            <option value="followup">{t('appointment_type_followup')}</option>
            <option value="diagnostic">{t('appointment_type_diagnostic')}</option>
            <option value="treatment">{t('appointment_type_treatment')}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-light mb-2">
          Preferred date
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-light mb-2">
          Additional notes
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Any specific concerns or questions..."
          className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="text-sm font-extralight text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-sm font-light transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Booking...' : 'Book consultation'}
      </button>
    </form>
  )
}
