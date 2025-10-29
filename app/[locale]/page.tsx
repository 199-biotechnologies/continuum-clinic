import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import Image from 'next/image'
import { SERVICES } from '@/lib/constants'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-dachshund-faith.jpg"
              alt="Dachshund patient at Continuum Clinic"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
            {/* Subtle vignette for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />

            {/* Subtle Particle Effect - Pure CSS */}
            <div className="absolute inset-0 opacity-20">
              <div className="particle particle-1" />
              <div className="particle particle-2" />
              <div className="particle particle-3" />
              <div className="particle particle-4" />
              <div className="particle particle-5" />
            </div>
          </div>

          {/* Content - Centered */}
          <Container className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {t('hero_title')}
              </h1>
              <p className="text-xl mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/book-consultation"
                  className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-sm font-medium transition-all hover:bg-foreground/90 hover:scale-105 shadow-lg"
                >
                  {t('hero_cta')}
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-foreground backdrop-blur-sm bg-background/30 px-8 py-3 text-sm font-medium transition-all hover:bg-foreground hover:text-background shadow-lg"
                >
                  {t('hero_learn_more')}
                </Link>
              </div>
            </div>
          </Container>
        </section>

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
