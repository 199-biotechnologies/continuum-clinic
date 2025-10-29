import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'

export default function ClientPortalPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('nav_portal')}</h1>
            <p className="text-lg font-extralight text-muted-foreground leading-relaxed mb-8">
              Client portal under construction. Authentication system and pet management features coming soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-muted px-8 py-3 text-sm font-light transition-all hover:bg-muted/10"
              >
                Return home
              </Link>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
