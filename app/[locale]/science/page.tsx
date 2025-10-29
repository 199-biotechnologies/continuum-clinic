import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('science_meta_title'),
    description: t('science_meta_description'),
  }
}

export default function SciencePage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <Section gutter="md">
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('science_hero_title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('science_hero_subtitle')}
            </p>
          </Container>
        </Section>

        {/* Research Areas */}
        <Section className="bg-muted/10">
          <Container>
            <h2 className="mb-12 text-center">{t('science_research_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Rapamycin */}
              <div className="border rounded-lg p-8 bg-background">
                <h3 className="mb-3">{t('science_research_area1_title')}</h3>
                <p className="text-muted-foreground mb-4">{t('science_research_area1_desc')}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="font-medium">{t('science_research_focus')}</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('science_research_area1_focus1')}</li>
                    <li>{t('science_research_area1_focus2')}</li>
                    <li>{t('science_research_area1_focus3')}</li>
                  </ul>
                </div>
              </div>

              {/* AAV Gene Therapy */}
              <div className="border rounded-lg p-8 bg-background">
                <h3 className="mb-3">{t('science_research_area2_title')}</h3>
                <p className="text-muted-foreground mb-4">{t('science_research_area2_desc')}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="font-medium">{t('science_research_focus')}</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('science_research_area2_focus1')}</li>
                    <li>{t('science_research_area2_focus2')}</li>
                    <li>{t('science_research_area2_focus3')}</li>
                  </ul>
                </div>
              </div>

              {/* Stem Cells */}
              <div className="border rounded-lg p-8 bg-background">
                <h3 className="mb-3">{t('science_research_area3_title')}</h3>
                <p className="text-muted-foreground mb-4">{t('science_research_area3_desc')}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="font-medium">{t('science_research_focus')}</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('science_research_area3_focus1')}</li>
                    <li>{t('science_research_area3_focus2')}</li>
                    <li>{t('science_research_area3_focus3')}</li>
                  </ul>
                </div>
              </div>

              {/* Biomarkers */}
              <div className="border rounded-lg p-8 bg-background">
                <h3 className="mb-3">{t('science_research_area4_title')}</h3>
                <p className="text-muted-foreground mb-4">{t('science_research_area4_desc')}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="font-medium">{t('science_research_focus')}</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('science_research_area4_focus1')}</li>
                    <li>{t('science_research_area4_focus2')}</li>
                    <li>{t('science_research_area4_focus3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Evidence Base */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">{t('science_evidence_title')}</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('science_evidence_principle1_title')}</h3>
                  <p className="text-muted-foreground">{t('science_evidence_principle1_desc')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('science_evidence_principle2_title')}</h3>
                  <p className="text-muted-foreground">{t('science_evidence_principle2_desc')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('science_evidence_principle3_title')}</h3>
                  <p className="text-muted-foreground">{t('science_evidence_principle3_desc')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('science_evidence_principle4_title')}</h3>
                  <p className="text-muted-foreground">{t('science_evidence_principle4_desc')}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Publications & Case Studies */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">{t('science_publications_title')}</h2>
              <p className="text-center text-lg text-muted-foreground mb-12">
                {t('science_publications_description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 bg-background text-center">
                  <div className="text-3xl font-light mb-2">{t('science_publications_stat1_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('science_publications_stat1_label')}</div>
                </div>
                <div className="border rounded-lg p-6 bg-background text-center">
                  <div className="text-3xl font-light mb-2">{t('science_publications_stat2_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('science_publications_stat2_label')}</div>
                </div>
                <div className="border rounded-lg p-6 bg-background text-center">
                  <div className="text-3xl font-light mb-2">{t('science_publications_stat3_number')}</div>
                  <div className="text-sm text-muted-foreground">{t('science_publications_stat3_label')}</div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Scientific Advisory Board */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center">{t('science_advisory_title')}</h2>
              <p className="text-center text-lg text-muted-foreground mb-12">
                {t('science_advisory_description')}
              </p>
              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-2">{t('science_advisory_member1_name')}</h3>
                  <div className="text-sm text-muted-foreground mb-3">{t('science_advisory_member1_title')}</div>
                  <p className="text-sm text-muted-foreground">{t('science_advisory_member1_expertise')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-2">{t('science_advisory_member2_name')}</h3>
                  <div className="text-sm text-muted-foreground mb-3">{t('science_advisory_member2_title')}</div>
                  <p className="text-sm text-muted-foreground">{t('science_advisory_member2_expertise')}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Data Transparency */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-6">{t('science_transparency_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('science_transparency_description')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('science_transparency_commitment1_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('science_transparency_commitment1_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('science_transparency_commitment2_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('science_transparency_commitment2_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('science_transparency_commitment3_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('science_transparency_commitment3_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background text-left">
                  <h3 className="mb-3">{t('science_transparency_commitment4_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('science_transparency_commitment4_desc')}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
