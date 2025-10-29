import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { BookingForm } from '@/components/booking-form'

export default function BookConsultationPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="text-center mb-6">{t('booking_title')}</h1>
            <p className="text-center text-lg font-extralight text-muted-foreground leading-relaxed mb-12">
              Schedule a consultation for longitudinal assessment and personalised protocols.
            </p>
            <BookingForm />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
