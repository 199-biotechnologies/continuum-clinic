'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConsentForm } from '@/components/consent-form'
import { getRequiredConsents } from '@/lib/consent-documents'
import { ConsentDocument } from '@/types/consent'
import { CheckCircle2 } from 'lucide-react'

export default function ConsentPage() {
  const router = useRouter()
  const [consents, setConsents] = useState<ConsentDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        // Get current session (client authentication)
        const sessionResponse = await fetch('/api/auth/client/session')

        if (!sessionResponse.ok) {
          router.push('/login')
          return
        }

        const sessionData = await sessionResponse.json()
        setClientId(sessionData.clientId)

        // Get consent status
        const statusResponse = await fetch(
          `/api/consent?clientId=${sessionData.clientId}&action=status`
        )
        const status = await statusResponse.json()

        if (status.allRequiredAccepted) {
          // Already completed
          setCompleted(true)
          setTimeout(() => {
            router.push('/portal')
          }, 2000)
        } else {
          // Show pending consents
          setConsents(status.pendingConsents)
        }
      } catch (error) {
        console.error('Session check error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  const handleComplete = () => {
    setCompleted(true)
    setTimeout(() => {
      router.push('/portal')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading consent documents...</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
          </div>
          <h1 className="text-2xl font-medium mb-4">
            All Consents Completed
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for reviewing and accepting the required consent
            documents. You will be redirected to your portal shortly.
          </p>
          <div className="animate-pulse text-sm text-muted-foreground">
            Redirecting...
          </div>
        </div>
      </div>
    )
  }

  if (consents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground">No pending consents</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-medium mb-4 text-center">
          Consent Documents
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Please review and accept the following legal and medical consent
          documents. These are required to proceed with treatment at The
          Continuum Clinic.
        </p>
      </div>

      {clientId && (
        <ConsentForm
          consents={consents}
          clientId={clientId}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
