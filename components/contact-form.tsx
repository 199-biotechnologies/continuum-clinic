'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="mb-2">Message sent</h3>
        <p className="text-sm font-extralight text-muted-foreground mb-6">
          Thank you for contacting us. We'll respond within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-light transition-all hover:opacity-70"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-light mb-2">
          {t('contact_name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light mb-2">
          {t('contact_email')}
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

      <div>
        <label htmlFor="subject" className="block text-sm font-light mb-2">
          {t('contact_subject')}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-muted rounded-md bg-background font-extralight text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-light mb-2">
          {t('contact_message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
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
        {status === 'submitting' ? 'Sending...' : t('contact_send')}
      </button>
    </form>
  )
}
