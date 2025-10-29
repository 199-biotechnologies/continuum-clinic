import { requireClientAuth } from '@/lib/auth-helpers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function PortalAppointmentsPage() {
  const user = await requireClientAuth()

  async function handleLogout() {
    'use server'
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('client-token')
    redirect('/portal')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-light">My Appointments</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10"
            >
              Back to Dashboard
            </Link>
            <form action={handleLogout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extralight mb-2">Appointments</h2>
          <p className="text-muted-foreground">View your upcoming and past appointments</p>
        </div>

        <div className="text-center py-16 border border-border rounded-lg bg-card">
          <p className="text-lg font-extralight text-muted-foreground mb-4">
            No appointments scheduled
          </p>
          <Link
            href="/book-consultation"
            className="inline-block px-6 py-3 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90"
          >
            Book Appointment
          </Link>
        </div>
      </main>
    </div>
  )
}
