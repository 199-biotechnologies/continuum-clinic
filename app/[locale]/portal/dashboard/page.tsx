import { requireClientAuth } from '@/lib/auth-helpers'
import { getClient } from '@/lib/redis'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalDashboardPage() {
  const user = await requireClientAuth()

  // Get full client data
  const clientData = await getClient(user.userId)

  if (!clientData) {
    redirect('/portal')
  }

  const client = clientData as any

  async function handleLogout() {
    'use server'
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('client-token')
    redirect('/portal')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light">Client Portal</h1>
            <p className="text-sm font-extralight text-muted-foreground mt-1">
              Welcome, {client.firstName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
            >
              Back to Website
            </Link>
            <form action={handleLogout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-extralight mb-4">
            Welcome to Continuum Clinic Portal
          </h2>
          <p className="text-lg font-extralight text-muted-foreground max-w-2xl">
            Manage your appointments, view your pets' health records, and stay connected with our veterinary longevity team.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">My Pets</p>
            <p className="text-3xl font-extralight mt-2">0</p>
            <Link
              href="/portal/pets/new"
              className="text-sm font-light text-foreground hover:opacity-70 transition-opacity mt-4 inline-block"
            >
              Add Pet →
            </Link>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">Upcoming Appointments</p>
            <p className="text-3xl font-extralight mt-2">0</p>
            <Link
              href="/book-consultation"
              className="text-sm font-light text-foreground hover:opacity-70 transition-opacity mt-4 inline-block"
            >
              Book Appointment →
            </Link>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm font-light text-muted-foreground">Health Records</p>
            <p className="text-3xl font-extralight mt-2">0</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Link
            href="/portal/pets"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">My Pets</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              View and manage your pets' profiles
            </p>
          </Link>

          <Link
            href="/portal/appointments"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">Appointments</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              View upcoming and past appointments
            </p>
          </Link>

          <Link
            href="/portal/health-records"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">Health Records</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              Access your pets' medical history
            </p>
          </Link>

          <Link
            href="/portal/profile"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">My Profile</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              Update your account details
            </p>
          </Link>

          <Link
            href="/contact"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">Contact Us</h3>
            <p className="text-sm font-extralight text-muted-foreground">
              Get in touch with our team
            </p>
          </Link>

          <Link
            href="/book-consultation"
            className="p-6 rounded-lg border-2 border-foreground bg-foreground text-background hover:opacity-90 transition-opacity group"
          >
            <div className="w-12 h-12 rounded-lg bg-background/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-light mb-2">Book Consultation</h3>
            <p className="text-sm font-extralight opacity-80">
              Schedule a new appointment with our team
            </p>
          </Link>
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-lg font-light mb-4">Account Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-light text-muted-foreground">Name</p>
              <p className="text-sm font-extralight mt-1">
                {client.firstName} {client.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-light text-muted-foreground">Email</p>
              <p className="text-sm font-extralight mt-1">{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-light text-muted-foreground">Phone</p>
              <p className="text-sm font-extralight mt-1">{client.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-light text-muted-foreground">Member Since</p>
              <p className="text-sm font-extralight mt-1">
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
