import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { SERVICES } from '@/lib/constants'

export default function ServicesPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container>
            <h1 className="text-center mb-16">{t('services_title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="p-6 border rounded-lg bg-background">
                  <h3 className="mb-3">{t(service.titleKey)}</h3>
                  <p className="text-muted-foreground font-extralight">{t(service.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
