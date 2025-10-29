import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function BookConsultationPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="text-center mb-12">{t('booking_title')}</h1>
            <p className="text-center text-lg font-extralight text-muted-foreground leading-relaxed">
              Booking system coming soon. Please contact us directly to schedule a consultation.
            </p>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
