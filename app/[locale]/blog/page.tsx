import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function BlogPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('nav_blog')}</h1>
            <p className="text-lg font-extralight text-muted-foreground leading-relaxed">
              Content coming soon.
            </p>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
