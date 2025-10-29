import { requireClientAuth } from '@/lib/auth-helpers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function PortalPetsPage() {
  const user = await requireClientAuth()

  // Fetch client's pets
  const petsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/pets`, {
    headers: {
      'Cookie': `client-token=${user.userId}` // This won't work server-side - need to fix
    },
    cache: 'no-store'
  }).catch(() => null)

  const petsData = petsResponse?.ok ? await petsResponse.json() : { pets: [] }
  const pets = petsData.pets || []

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
            <h1 className="text-xl font-light">My Pets</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="px-4 py-2 text-sm font-light border border-border rounded-md hover:bg-muted/10 transition-colors"
            >
              Back to Dashboard
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extralight mb-2">My Pets</h2>
            <p className="text-muted-foreground">Manage your pets' profiles</p>
          </div>
          <Link
            href="/portal/pets/new"
            className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
          >
            Add New Pet
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-card">
            <p className="text-lg font-extralight text-muted-foreground mb-4">
              No pets registered yet
            </p>
            <Link
              href="/portal/pets/new"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
            >
              Add Your First Pet
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet: any) => (
              <Link
                key={pet.id}
                href={`/portal/pets/${pet.id}`}
                className="p-6 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors"
              >
                <h3 className="text-xl font-light mb-2">{pet.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} · {pet.breed}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} years old
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
