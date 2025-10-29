'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import {
  ContactFormSubmission,
  ContactStatus,
  ContactFormType,
  EmailTemplate
} from '@/types/communications'
import {
  Search,
  Filter,
  Mail,
  MailOpen,
  Send,
  Archive,
  X,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Eye,
  CheckCircle,
  ChevronDown,
  FileText
} from 'lucide-react'

export default function AdminCommunicationsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactFormSubmission[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactFormSubmission | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ContactFormType | 'all'>('all')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
    fetchTemplates()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/contact')
      if (!res.ok) throw new Error('Failed to fetch contacts')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/templates')
      if (!res.ok) throw new Error('Failed to fetch templates')
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (err) {
      console.error('Failed to load templates:', err)
    }
  }

  const handleViewContact = async (contact: ContactFormSubmission) => {
    setSelectedContact(contact)
    setReplyMessage('')

    // Mark as read if status is new
    if (contact.status === 'new') {
      try {
        const res = await fetch(`/api/admin/contact/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' })
        })
        if (res.ok) {
          const data = await res.json()
          setContacts(prev =>
            prev.map(c => c.id === contact.id ? data.contact : c)
          )
          setSelectedContact(data.contact)
        }
      } catch (err) {
        console.error('Failed to mark as read:', err)
      }
    }
  }

  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return

    try {
      setSendingReply(true)
      const res = await fetch(`/api/admin/contact/${selectedContact.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send reply')
      }

      // Update status locally
      setContacts(prev =>
        prev.map(c =>
          c.id === selectedContact.id
            ? { ...c, status: 'replied' as ContactStatus, repliedAt: new Date().toISOString() }
            : c
        )
      )
      setSelectedContact(prev =>
        prev ? { ...prev, status: 'replied', repliedAt: new Date().toISOString() } : null
      )
      setReplyMessage('')
      alert('Reply sent successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: ContactStatus) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update status')

      const data = await res.json()
      setContacts(prev => prev.map(c => c.id === id ? data.contact : c))
      if (selectedContact?.id === id) {
        setSelectedContact(data.contact)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleBulkArchive = async () => {
    if (selectedContacts.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedContacts).map(id =>
          handleUpdateStatus(id, 'archived')
        )
      )
      setSelectedContacts(new Set())
      alert(`Archived ${selectedContacts.size} contact(s)`)
    } catch (err) {
      alert('Failed to archive selected contacts')
    }
  }

  const handleBulkMarkRead = async () => {
    if (selectedContacts.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedContacts).map(id =>
          handleUpdateStatus(id, 'read')
        )
      )
      setSelectedContacts(new Set())
      alert(`Marked ${selectedContacts.size} contact(s) as read`)
    } catch (err) {
      alert('Failed to mark selected contacts as read')
    }
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedContacts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedContacts(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set())
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)))
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (
        !contact.name.toLowerCase().includes(term) &&
        !contact.email.toLowerCase().includes(term) &&
        !contact.subject.toLowerCase().includes(term)
      ) {
        return false
      }
    }

    // Status filter
    if (statusFilter !== 'all' && contact.status !== statusFilter) {
      return false
    }

    // Type filter
    if (typeFilter !== 'all' && contact.type !== typeFilter) {
      return false
    }

    // Date range filter
    if (dateRange.start) {
      const contactDate = new Date(contact.submittedAt)
      const startDate = new Date(dateRange.start)
      if (contactDate < startDate) return false
    }
    if (dateRange.end) {
      const contactDate = new Date(contact.submittedAt)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      if (contactDate > endDate) return false
    }

    return true
  })

  // Sort by date (newest first)
  const sortedContacts = [...filteredContacts].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )

  const getStatusBadge = (status: ContactStatus) => {
    const styles = {
      new: 'bg-green-500/10 text-green-600 dark:text-green-400',
      read: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      replied: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      archived: 'bg-gray-400/10 text-gray-500 dark:text-gray-500'
    }

    const icons = {
      new: Mail,
      read: MailOpen,
      replied: Send,
      archived: Archive
    }

    const Icon = icons[status]

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeLabel = (type: ContactFormType) => {
    const labels = {
      general: 'General',
      consultation: 'Consultation',
      investment: 'Investment',
      media: 'Media',
      careers: 'Careers'
    }
    return labels[type]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const stats = {
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    archived: contacts.filter(c => c.status === 'archived').length
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light mb-2">Communications</h1>
              <p className="text-sm text-muted-foreground">
                Manage contact form submissions and email templates
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">New</p>
                  <p className="text-2xl font-light mt-1">{stats.new}</p>
                </div>
                <Mail className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Read</p>
                  <p className="text-2xl font-light mt-1">{stats.read}</p>
                </div>
                <MailOpen className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Replied</p>
                  <p className="text-2xl font-light mt-1">{stats.replied}</p>
                </div>
                <Send className="w-8 h-8 text-gray-500 opacity-20" />
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">Archived</p>
                  <p className="text-2xl font-light mt-1">{stats.archived}</p>
                </div>
                <Archive className="w-8 h-8 text-gray-400 opacity-20" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="border rounded-lg p-4 bg-card mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-light mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ContactStatus | 'all')}
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as ContactFormType | 'all')}
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    >
                      <option value="all">All Types</option>
                      <option value="general">General</option>
                      <option value="consultation">Consultation</option>
                      <option value="investment">Investment</option>
                      <option value="media">Media</option>
                      <option value="careers">Careers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.size > 0 && (
            <div className="border rounded-lg p-4 bg-card mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light">
                  {selectedContacts.size} contact{selectedContacts.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkMarkRead}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Read
                  </button>
                  <button
                    onClick={handleBulkArchive}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-light hover:bg-muted/10 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact List */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg bg-card">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-light">Contact Submissions ({sortedContacts.length})</h2>
                  <button
                    onClick={handleSelectAll}
                    className="text-xs font-light text-muted-foreground hover:text-foreground"
                  >
                    {selectedContacts.size === filteredContacts.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Loading contacts...
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-sm text-red-500">
                    {error}
                  </div>
                ) : sortedContacts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No contact submissions found
                  </div>
                ) : (
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {sortedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 hover:bg-muted/5 transition-colors cursor-pointer ${
                          selectedContact?.id === contact.id ? 'bg-muted/10' : ''
                        }`}
                        onClick={() => handleViewContact(contact)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(contact.id)}
                            onChange={() => handleToggleSelect(contact.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {getStatusBadge(contact.status)}
                                <span className="text-xs text-muted-foreground">{getTypeLabel(contact.type)}</span>
                              </div>
                            </div>
                            <p className="text-sm font-light mb-2 truncate">{contact.subject}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(contact.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details / Templates */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="border rounded-lg bg-card">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-light">Contact Details</h2>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="p-1 hover:bg-muted/10 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="ml-2 font-light">{selectedContact.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <span className="ml-2 font-light">{selectedContact.email}</span>
                        </div>
                        {selectedContact.phone && (
                          <div>
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="ml-2 font-light">{selectedContact.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-2 font-light">{getTypeLabel(selectedContact.type)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="ml-2">{getStatusBadge(selectedContact.status)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Subject</h3>
                      <p className="text-sm font-light">{selectedContact.subject}</p>
                    </div>

                    {/* Message */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Message</h3>
                      <p className="text-sm font-light whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Submitted: {formatDate(selectedContact.submittedAt)}</span>
                      </div>
                      {selectedContact.readAt && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          <span>Read: {formatDate(selectedContact.readAt)}</span>
                        </div>
                      )}
                      {selectedContact.repliedAt && (
                        <div className="flex items-center gap-2">
                          <Send className="w-3 h-3" />
                          <span>Replied: {formatDate(selectedContact.repliedAt)}</span>
                        </div>
                      )}
                      {selectedContact.ipAddress && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>IP: {selectedContact.ipAddress}</span>
                        </div>
                      )}
                      {selectedContact.userAgent && (
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          <span className="truncate">{selectedContact.userAgent}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t space-y-2">
                      <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.status !== 'read' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedContact.id, 'read')}
                            className="px-3 py-1 border rounded-md text-xs font-light hover:bg-muted/10 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                        {selectedContact.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedContact.id, 'archived')}
                            className="px-3 py-1 border rounded-md text-xs font-light hover:bg-muted/10 transition-colors"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reply Section */}
                    {selectedContact.status !== 'archived' && (
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium mb-2">Send Reply</h3>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply here..."
                          rows={6}
                          className="w-full px-3 py-2 border rounded-md bg-background text-sm font-light focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={!replyMessage.trim() || sendingReply}
                          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                          <Send className="w-4 h-4" />
                          {sendingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <p className="text-xs text-muted-foreground mt-2">
                          This will send an email reply and mark the submission as "Replied"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Email Templates */
                <div className="border rounded-lg bg-card">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-light">Email Templates</h2>
                  </div>

                  {templates.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No templates found
                    </div>
                  ) : (
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                      {templates.map((template) => (
                        <div key={template.id} className="p-4 hover:bg-muted/5 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{template.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{template.subject}</p>
                            </div>
                            {template.isSystem && (
                              <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium">
                                System
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => router.push(`/admin/settings?template=${template.id}`)}
                              className="flex items-center gap-1 px-3 py-1 border rounded-md text-xs font-light hover:bg-muted/10 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </button>
                            {!template.isSystem && (
                              <button
                                onClick={() => router.push(`/admin/settings?template=${template.id}&edit=true`)}
                                className="flex items-center gap-1 px-3 py-1 border rounded-md text-xs font-light hover:bg-muted/10 transition-colors"
                              >
                                <FileText className="w-3 h-3" />
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4 border-t">
                    <button
                      onClick={() => router.push('/admin/settings')}
                      className="w-full px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
                    >
                      Manage Templates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
