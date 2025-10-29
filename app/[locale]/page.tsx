import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import { SERVICES } from '@/lib/constants'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section gutter="md" className="relative">
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-consultation"
                className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-sm font-medium transition-colors hover:bg-foreground/90"
              >
                {t('hero_cta')}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-foreground px-8 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                {t('hero_learn_more')}
              </Link>
            </div>
          </Container>
        </Section>

        {/* Services Section */}
        <Section className="bg-muted/10">
          <Container>
            <h2 className="text-center mb-12">{t('services_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="p-6 border rounded-lg bg-background">
                  <h3 className="mb-3">{t(service.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(service.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* About Section */}
        <Section>
          <Container size="narrow" className="text-center">
            <h2 className="mb-6">{t('about_title')}</h2>
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
