'use client'

import { useState, useEffect } from 'react'
import { ContactFormSubmission } from '@/types/communications'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

const statusColors = {
  new: 'bg-blue-500',
  read: 'bg-gray-500',
  replied: 'bg-green-500',
  archived: 'bg-gray-300',
}

const typeLabels = {
  general: 'General',
  consultation: 'Consultation',
  investment: 'Investment',
  media: 'Media',
  careers: 'Careers',
}

export function ContactSubmissionsClient() {
  const [contacts, setContacts] = useState<ContactFormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchContacts()
  }, [filter])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const url = filter === 'all'
        ? '/api/admin/contact'
        : `/api/admin/contact?status=${filter}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm font-light text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-light rounded-md transition-colors ${
              filter === status
                ? 'bg-foreground text-background'
                : 'border border-foreground/20 hover:border-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-sm font-light text-muted-foreground">
            No submissions found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="border rounded-lg p-6 hover:border-foreground transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[contact.status]}`} />
                    <span className="px-2 py-1 text-xs font-light border rounded">
                      {typeLabels[contact.type]}
                    </span>
                    <span className="text-xs font-light text-muted-foreground">
                      {formatDistanceToNow(new Date(contact.submittedAt), { addSuffix: true })}
                    </span>
                  </div>

                  <h3 className="font-light text-lg mb-1">{contact.subject}</h3>

                  <div className="text-sm font-light text-muted-foreground mb-3">
                    <span className="font-medium">{contact.name}</span>
                    {' · '}
                    <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <>
                        {' · '}
                        <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                          {contact.phone}
                        </a>
                      </>
                    )}
                  </div>

                  <p className="text-sm font-light text-muted-foreground line-clamp-2">
                    {contact.message}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/communications/contact/${contact.id}`}>
                    <button className="px-4 py-2 text-sm font-light border rounded-md hover:border-foreground transition-colors">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="px-4 py-2 text-sm font-light text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
