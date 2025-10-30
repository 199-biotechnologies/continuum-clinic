'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. No token provided.')
        return
      }

      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${token}`
        )

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage(
            'Your email has been verified successfully! You can now log in to your account.'
          )

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(
            data.error || 'Verification failed. The link may have expired.'
          )
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification. Please try again.')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-muted-foreground" />
            <h1 className="text-2xl font-medium mb-4">
              Verifying Your Email
            </h1>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
            </div>
            <h1 className="text-2xl font-medium mb-4">Email Verified!</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="animate-pulse text-sm text-muted-foreground">
              Redirecting to login...
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <XCircle className="w-16 h-16 mx-auto text-red-600" />
            </div>
            <h1 className="text-2xl font-medium mb-4">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>

            <div className="space-y-3">
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Go to Login
              </Button>

              <Button
                onClick={() => router.push('/register')}
                variant="outline"
                className="w-full"
              >
                Create New Account
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              If you need assistance, please contact{' '}
              <a
                href="mailto:info@thecontinuumclinic.com"
                className="underline"
              >
                info@thecontinuumclinic.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
