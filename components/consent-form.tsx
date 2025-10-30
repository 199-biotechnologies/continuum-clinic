'use client'

import { useState, useEffect, useRef } from 'react'
import { ConsentDocument } from '@/types/consent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ConsentFormProps {
  consents: ConsentDocument[]
  clientId: string
  petId?: string
  onComplete: () => void
}

export function ConsentForm({
  consents,
  clientId,
  petId,
  onComplete
}: ConsentFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [acceptedConsents, setAcceptedConsents] = useState<Set<string>>(
    new Set()
  )
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [signatureMethod, setSignatureMethod] = useState<
    'checkbox' | 'typed-name'
  >('checkbox')
  const [typedName, setTypedName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contentRef = useRef<HTMLDivElement>(null)

  const currentConsent = consents[currentIndex]
  const isLastConsent = currentIndex === consents.length - 1
  const progress = Math.round(
    ((acceptedConsents.size + 1) / consents.length) * 100
  )

  // Check if user has scrolled to bottom of consent document
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      // Check initial scroll position
      handleScroll()
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentIndex, hasScrolledToBottom])

  // Reset scroll state when moving to next consent
  useEffect(() => {
    setHasScrolledToBottom(false)
    setTypedName('')
    setSignatureMethod('checkbox')
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentIndex])

  const handleAccept = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Capture IP address (client-side approximation - ideally server-side)
      let ipAddress: string | undefined
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        ipAddress = ipData.ip
      } catch {
        // IP capture failed, continue without it
      }

      const acceptanceData = {
        id: `consent-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        clientId,
        petId,
        documentId: currentConsent.id,
        documentType: currentConsent.type,
        documentVersion: currentConsent.version,
        acceptedAt: new Date().toISOString(),
        ipAddress,
        userAgent: navigator.userAgent,
        signature: {
          method: signatureMethod,
          value:
            signatureMethod === 'typed-name' ? typedName : 'Accepted via checkbox',
          timestamp: new Date().toISOString()
        }
      }

      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptanceData)
      })

      if (!response.ok) {
        throw new Error('Failed to record consent')
      }

      // Mark as accepted
      setAcceptedConsents((prev) => new Set([...prev, currentConsent.id]))

      // Move to next consent or complete
      if (isLastConsent) {
        onComplete()
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to record consent'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const canAccept =
    hasScrolledToBottom &&
    (signatureMethod === 'checkbox' || typedName.trim().length > 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            Consent {acceptedConsents.size + 1} of {consents.length}
          </p>
          <p className="text-sm text-muted-foreground">{progress}% Complete</p>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Consent Document */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted/10 px-6 py-4 border-b">
          <h2 className="text-xl font-medium">{currentConsent.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Version {currentConsent.version} • Effective{' '}
            {new Date(currentConsent.effectiveDate).toLocaleDateString()}
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className="p-6 h-96 overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
        >
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(currentConsent.content) }}
          />
        </div>

        {!hasScrolledToBottom && (
          <div className="px-6 py-3 bg-muted/10 border-t">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Please scroll to the bottom to review the entire document
            </p>
          </div>
        )}
      </div>

      {/* Signature Section */}
      {hasScrolledToBottom && (
        <div className="mt-6 border rounded-lg p-6 bg-card">
          <h3 className="font-medium mb-4">Acceptance & Signature</h3>

          {/* Signature Method */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="signature"
                value="checkbox"
                checked={signatureMethod === 'checkbox'}
                onChange={() => setSignatureMethod('checkbox')}
                className="w-4 h-4"
              />
              <span className="text-sm">
                I have read and accept this consent document
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="signature"
                value="typed-name"
                checked={signatureMethod === 'typed-name'}
                onChange={() => setSignatureMethod('typed-name')}
                className="w-4 h-4"
              />
              <span className="text-sm">Sign with typed name</span>
            </label>
          </div>

          {signatureMethod === 'typed-name' && (
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Type your full name"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground mt-2">
                By typing your name, you are providing a legal signature
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="w-4 h-4" />
          <div className="ml-3">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || isSubmitting}
        >
          Previous
        </Button>

        <Button
          onClick={handleAccept}
          disabled={!canAccept || isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            'Saving...'
          ) : isLastConsent ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept & Complete
            </>
          ) : (
            'Accept & Continue'
          )}
        </Button>
      </div>

      {/* Legal Notice */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        By accepting these documents, you acknowledge that you have read and
        understood the terms. These agreements are legally binding.
      </p>
    </div>
  )
}

// Simple markdown formatter (converts markdown to HTML)
function formatMarkdown(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>')

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`

  return html
}
