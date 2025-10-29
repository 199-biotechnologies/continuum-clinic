import { requireAdminAuth } from '@/lib/auth-helpers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'

export default async function SettingsPage() {
  await requireAdminAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container>
            <div className="mb-8">
              <Link
                href="/admin/communications"
                className="text-sm font-light text-muted-foreground hover:text-foreground"
              >
                ← Back to Communications
              </Link>
              <h1 className="mt-4">Notification Settings</h1>
              <p className="mt-2 text-sm font-light text-muted-foreground">
                Configure automatic email notifications and preferences
              </p>
            </div>

            <div className="border rounded-lg p-12 text-center">
              <h3 className="font-light mb-2">Notification Settings</h3>
              <p className="text-sm font-light text-muted-foreground">
                Settings interface will be available soon.
                <br />
                API endpoint is ready at: <code className="bg-muted px-2 py-1 rounded text-xs">/api/admin/communications/settings</code>
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
