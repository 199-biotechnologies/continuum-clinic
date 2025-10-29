import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('about_title')}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about_description')}
            </p>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
