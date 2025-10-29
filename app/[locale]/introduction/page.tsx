import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('intro_meta_title'),
    description: t('intro_meta_description'),
  }
}

export default function IntroductionPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <Section gutter="md">
          <Container className="text-center">
            <h1 className="mb-6">{t('intro_hero_title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              {t('intro_hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-consultation"
                className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-sm font-medium transition-all hover:opacity-90"
              >
                {t('intro_hero_cta_primary')}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border-2 border-foreground px-8 py-3 text-sm font-medium transition-all hover:bg-foreground hover:text-background"
              >
                {t('intro_hero_cta_secondary')}
              </Link>
            </div>
          </Container>
        </Section>

        {/* Problem Statement */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center">{t('intro_problem_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-light mb-3">{t('intro_problem_stat1_number')}</div>
                  <p className="text-sm text-muted-foreground">{t('intro_problem_stat1_text')}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light mb-3">{t('intro_problem_stat2_number')}</div>
                  <p className="text-sm text-muted-foreground">{t('intro_problem_stat2_text')}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light mb-3">{t('intro_problem_stat3_number')}</div>
                  <p className="text-sm text-muted-foreground">{t('intro_problem_stat3_text')}</p>
                </div>
              </div>
              <p className="mt-8 text-center text-lg text-muted-foreground leading-relaxed">
                {t('intro_problem_description')}
              </p>
            </div>
          </Container>
        </Section>

        {/* Our Solution */}
        <Section>
          <Container>
            <h2 className="mb-12 text-center">{t('intro_solution_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('intro_solution_1_title')}</h3>
                <p className="text-muted-foreground">{t('intro_solution_1_desc')}</p>
              </div>
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('intro_solution_2_title')}</h3>
                <p className="text-muted-foreground">{t('intro_solution_2_desc')}</p>
              </div>
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('intro_solution_3_title')}</h3>
                <p className="text-muted-foreground">{t('intro_solution_3_desc')}</p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Traction */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="mb-6">{t('intro_traction_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t('intro_traction_description')}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 border rounded-lg bg-background">
                  <div className="text-3xl font-light mb-2">{t('intro_traction_metric1_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('intro_traction_metric1_label')}</div>
                </div>
                <div className="p-6 border rounded-lg bg-background">
                  <div className="text-3xl font-light mb-2">{t('intro_traction_metric2_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('intro_traction_metric2_label')}</div>
                </div>
                <div className="p-6 border rounded-lg bg-background">
                  <div className="text-3xl font-light mb-2">{t('intro_traction_metric3_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('intro_traction_metric3_label')}</div>
                </div>
                <div className="p-6 border rounded-lg bg-background">
                  <div className="text-3xl font-light mb-2">{t('intro_traction_metric4_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('intro_traction_metric4_label')}</div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section>
          <Container>
            <h2 className="mb-12 text-center">{t('intro_team_title')}</h2>
            <div className="max-w-3xl mx-auto">
              <div className="border rounded-lg p-8 bg-background">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <h3 className="mb-2">{t('intro_team_founder_name')}</h3>
                    <div className="text-sm text-muted-foreground mb-4">{t('intro_team_founder_title')}</div>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('intro_team_founder_bio')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Investment Opportunity */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="mb-6">{t('intro_investment_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('intro_investment_description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('intro_investment_use1_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro_investment_use1_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('intro_investment_use2_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro_investment_use2_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('intro_investment_use3_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro_investment_use3_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('intro_investment_use4_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('intro_investment_use4_desc')}</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-8 py-3 text-sm font-medium transition-all hover:opacity-90"
              >
                {t('intro_investment_cta')}
              </Link>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
