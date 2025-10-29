import { requireAdminAuth } from '@/lib/auth-helpers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import { ContactSubmissionsClient } from '@/components/admin/contact-submissions-client'

export default async function ContactSubmissionsPage() {
  await requireAdminAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="wide">
            <div className="mb-8">
              <Link
                href="/admin/communications"
                className="text-sm font-light text-muted-foreground hover:text-foreground"
              >
                ← Back to Communications
              </Link>
              <h1 className="mt-4">Contact Form Submissions</h1>
              <p className="mt-2 text-sm font-light text-muted-foreground">
                View and manage all contact form submissions from the website
              </p>
            </div>

            <ContactSubmissionsClient />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
