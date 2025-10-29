import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { SITE_CONFIG } from '@/lib/constants'

export default function ContactPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="text-center mb-12">{t('contact_title')}</h1>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <div>
                <h3 className="mb-4">Contact</h3>
                <div className="space-y-2 text-sm font-extralight text-muted-foreground">
                  <p>{SITE_CONFIG.address.street}</p>
                  <p>{SITE_CONFIG.address.city} {SITE_CONFIG.address.postcode}</p>
                  <p>{SITE_CONFIG.email}</p>
                  <p>{SITE_CONFIG.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Get in touch</h3>
                <p className="text-sm font-extralight text-muted-foreground">
                  Contact form coming soon. For now, please email us directly at {SITE_CONFIG.email}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
