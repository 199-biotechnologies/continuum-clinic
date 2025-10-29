'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function AdminPage() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    // Admin authentication functionality will be implemented when Redis/auth system is ready
    // For now, show informative message
    setTimeout(() => {
      setStatus('error')
      setMessage('Admin authentication system is currently being configured. Please contact Boris at boris@199.clinic for access.')
    }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="text-center mb-12">{t('admin_dashboard')}</h1>

            <div className="max-w-md mx-auto">
              <div className="mb-8 p-4 rounded-md bg-muted/10 border border-muted">
                <p className="text-sm font-extralight text-center">
                  Staff and administrator access only
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="admin@thecontinuumclinic.com"
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
                  {status === 'submitting' ? 'Authenticating...' : 'Login'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm font-extralight text-muted-foreground">
                Need admin access? Contact{' '}
                <a href="mailto:boris@199.clinic" className="underline hover:text-foreground">
                  boris@199.clinic
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
