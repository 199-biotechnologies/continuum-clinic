'use client'

import { useState, useEffect } from 'react'
import { ContactFormSubmission } from '@/types/communications'
import { format } from 'date-fns'
import { toast } from 'sonner'

const statusColors = {
  new: 'bg-blue-500',
  read: 'bg-gray-500',
  replied: 'bg-green-500',
  archived: 'bg-gray-300',
}

const typeLabels = {
  general: 'General Inquiry',
  consultation: 'Book Consultation',
  investment: 'Investment/Partnership',
  media: 'Media Request',
  careers: 'Careers',
}

export function ContactDetailClient({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState<ContactFormSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchContact()
  }, [contactId])

  const fetchContact = async () => {
    try {
      const res = await fetch(`/api/admin/contact/${contactId}`)
      if (res.ok) {
        const data = await res.json()
        setContact(data.contact)
      }
    } catch (error) {
      console.error('Failed to fetch contact:', error)
      toast.error('Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    try {
      setSending(true)
      const res = await fetch(`/api/admin/contact/${contactId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (res.ok) {
        toast.success('Reply sent successfully')
        setReplyMessage('')
        fetchContact() // Refresh to show updated status
      } else {
        toast.error('Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const handleArchive = async () => {
    try {
      const res = await fetch(`/api/admin/contact/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      })

      if (res.ok) {
        toast.success('Submission archived')
        fetchContact()
      }
    } catch (error) {
      console.error('Failed to archive:', error)
      toast.error('Failed to archive submission')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm font-light text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-light text-muted-foreground">Submission not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[contact.status]}`} />
              <Badge variant="outline" className="font-light">
                {typeLabels[contact.type]}
              </Badge>
              <Badge variant="secondary" className="font-light capitalize">
                {contact.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-light">{contact.subject}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            className="font-light"
          >
            Archive
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">From</p>
            <p className="font-medium">{contact.name}</p>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-light text-muted-foreground hover:text-foreground"
            >
              {contact.email}
            </a>
            {contact.phone && (
              <p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-sm font-light text-muted-foreground hover:text-foreground"
                >
                  {contact.phone}
                </a>
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">Details</p>
            <p className="text-sm font-light">
              Preferred contact: <span className="font-medium capitalize">{contact.preferredContact}</span>
            </p>
            <p className="text-sm font-light">
              Submitted: {format(new Date(contact.submittedAt), 'PPpp')}
            </p>
            {contact.readAt && (
              <p className="text-sm font-light">
                Read: {format(new Date(contact.readAt), 'PPpp')}
              </p>
            )}
            {contact.repliedAt && (
              <p className="text-sm font-light">
                Replied: {format(new Date(contact.repliedAt), 'PPpp')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <h3 className="font-light mb-4">Message</h3>
        <div className="bg-muted rounded-lg p-6">
          <p className="font-light whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>

      {/* Reply Form */}
      <div>
        <h3 className="font-light mb-4">Send Reply</h3>
        <div className="space-y-4">
          <Textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply..."
            rows={8}
            className="font-light"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleReply}
              disabled={sending || !replyMessage.trim()}
              className="font-light"
            >
              {sending ? 'Sending...' : 'Send Reply'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setReplyMessage('')}
              className="font-light"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
