import { requireAdminAuth } from '@/lib/auth-helpers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import { ContactDetailClient } from '@/components/admin/contact-detail-client'

export default async function ContactDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminAuth()
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container>
            <div className="mb-8">
              <Link
                href="/admin/communications/contact"
                className="text-sm font-light text-muted-foreground hover:text-foreground"
              >
                ← Back to Submissions
              </Link>
            </div>

            <ContactDetailClient contactId={id} />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
