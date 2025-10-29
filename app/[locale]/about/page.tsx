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
    title: t('about_meta_title'),
    description: t('about_meta_description'),
  }
}

export default function AboutPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Mission Statement */}
        <Section gutter="md">
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('about_mission_title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('about_mission_statement')}
            </p>
          </Container>
        </Section>

        {/* Vision */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-6 text-center">{t('about_vision_title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
                {t('about_vision_statement')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-3">{t('about_vision_goal1_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('about_vision_goal1_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-3">{t('about_vision_goal2_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('about_vision_goal2_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-3">{t('about_vision_goal3_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('about_vision_goal3_desc')}</p>
                </div>
                <div className="border rounded-lg p-6 bg-background">
                  <h3 className="mb-3">{t('about_vision_goal4_title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('about_vision_goal4_desc')}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Our Approach */}
        <Section>
          <Container>
            <h2 className="mb-12 text-center">{t('about_approach_title')}</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="border-l-2 border-foreground pl-6">
                <h3 className="mb-3">{t('about_approach_principle1_title')}</h3>
                <p className="text-muted-foreground">{t('about_approach_principle1_desc')}</p>
              </div>
              <div className="border-l-2 border-foreground pl-6">
                <h3 className="mb-3">{t('about_approach_principle2_title')}</h3>
                <p className="text-muted-foreground">{t('about_approach_principle2_desc')}</p>
              </div>
              <div className="border-l-2 border-foreground pl-6">
                <h3 className="mb-3">{t('about_approach_principle3_title')}</h3>
                <p className="text-muted-foreground">{t('about_approach_principle3_desc')}</p>
              </div>
              <div className="border-l-2 border-foreground pl-6">
                <h3 className="mb-3">{t('about_approach_principle4_title')}</h3>
                <p className="text-muted-foreground">{t('about_approach_principle4_desc')}</p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section className="bg-muted/10">
          <Container>
            <h2 className="mb-12 text-center">{t('about_team_title')}</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border rounded-lg p-8 bg-background">
                <h3 className="mb-2">{t('about_team_member1_name')}</h3>
                <div className="text-sm text-muted-foreground mb-4">{t('about_team_member1_role')}</div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('about_team_member1_bio')}
                </p>
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-2">{t('about_team_qualifications')}</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('about_team_member1_qual1')}</li>
                    <li>{t('about_team_member1_qual2')}</li>
                    <li>{t('about_team_member1_qual3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Facilities & Accreditations */}
        <Section>
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">{t('about_facilities_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-4">{t('about_facilities_clinic_title')}</h3>
                  <p className="text-muted-foreground mb-4">{t('about_facilities_clinic_desc')}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_clinic_feature1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_clinic_feature2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_clinic_feature3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_clinic_feature4')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4">{t('about_facilities_accreditations_title')}</h3>
                  <p className="text-muted-foreground mb-4">{t('about_facilities_accreditations_desc')}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_accred1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_accred2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_accred3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{t('about_facilities_accred4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Location */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-6">{t('about_location_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t('about_location_description')}</p>
              <div className="border rounded-lg p-6 bg-background">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>{t('about_location_address')}</div>
                  <div>{t('about_location_hours')}</div>
                  <div>{t('about_location_phone')}</div>
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
