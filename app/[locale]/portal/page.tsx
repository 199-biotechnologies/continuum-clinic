'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function ClientPortalPage() {
  const t = useTranslations()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const endpoint = mode === 'login'
        ? '/api/auth/client/login'
        : '/api/auth/client/register'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      setStatus('success')
      setMessage(mode === 'login' ? 'Login successful! Redirecting...' : 'Account created! Redirecting...')

      // Redirect to portal dashboard
      setTimeout(() => {
        window.location.href = '/portal/dashboard'
      }, 1000)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Authentication failed')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="text-center mb-12">{t('nav_portal')}</h1>

            <div className="max-w-md mx-auto">
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 rounded-md text-sm font-light transition-all ${
                    mode === 'login'
                      ? 'bg-foreground text-background'
                      : 'bg-muted/10 hover:bg-muted/20'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-3 rounded-md text-sm font-light transition-all ${
                    mode === 'register'
                      ? 'bg-foreground text-background'
                      : 'bg-muted/10 hover:bg-muted/20'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'register' && (
                  <>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-light mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 rounded-md border border-muted bg-background text-sm font-extralight focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 rounded-md border border-muted bg-background text-sm font-extralight focus:outline-none focus:ring-1 focus:ring-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-md border border-muted bg-background text-sm font-extralight focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-light mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-sm font-extralight focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-muted bg-background text-sm font-extralight focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-md text-sm font-extralight ${
                    status === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full px-8 py-3 rounded-md bg-foreground text-background text-sm font-light transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm font-extralight text-muted-foreground">
                Need help? Contact us at{' '}
                <a href="mailto:info@thecontinuumclinic.com" className="underline hover:text-foreground">
                  info@thecontinuumclinic.com
                </a>
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
