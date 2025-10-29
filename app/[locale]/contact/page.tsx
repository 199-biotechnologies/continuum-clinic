import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import { ContactForm } from '@/components/contact-form'
import { SITE_CONFIG } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('contact_meta_title'),
    description: t('contact_meta_description'),
  }
}

export default function ContactPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <Section>
          <Container size="narrow" className="text-center">
            <h1 className="mb-6">{t('contact_title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('contact_subtitle')}
            </p>
          </Container>
        </Section>

        {/* Contact Information & Form */}
        <Section className="bg-muted/10">
          <Container>
            <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4">{t('contact_info_address_title')}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{SITE_CONFIG.address.street}</p>
                    <p>{SITE_CONFIG.address.city} {SITE_CONFIG.address.postcode}</p>
                    <p className="mt-4">{t('contact_info_hours')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4">{t('contact_info_details_title')}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>{t('contact_email')}:</strong> {SITE_CONFIG.email}</p>
                    <p><strong>{t('contact_phone')}:</strong> {SITE_CONFIG.phone}</p>
                    <p className="mt-4 text-xs">{t('contact_info_response_time')}</p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="border rounded-lg bg-muted/20 aspect-video flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">{t('contact_map_placeholder')}</p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="mb-4">{t('contact_form_title')}</h3>
                <ContactForm />
              </div>
            </div>
          </Container>
        </Section>

        {/* Multiple Contact Types */}
        <Section>
          <Container>
            <h2 className="mb-12 text-center">{t('contact_types_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('contact_type_consultation_title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('contact_type_consultation_desc')}</p>
                <a
                  href="/book-consultation"
                  className="text-sm font-medium hover:underline"
                >
                  {t('contact_type_consultation_cta')}
                </a>
              </div>
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('contact_type_general_title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('contact_type_general_desc')}</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm font-medium hover:underline"
                >
                  {t('contact_type_general_cta')}
                </a>
              </div>
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('contact_type_investment_title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('contact_type_investment_desc')}</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Investment Inquiry`}
                  className="text-sm font-medium hover:underline"
                >
                  {t('contact_type_investment_cta')}
                </a>
              </div>
              <div className="border rounded-lg p-6 bg-background">
                <h3 className="mb-3">{t('contact_type_media_title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('contact_type_media_desc')}</p>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Media Inquiry`}
                  className="text-sm font-medium hover:underline"
                >
                  {t('contact_type_media_cta')}
                </a>
              </div>
            </div>
          </Container>
        </Section>

        {/* FAQ Section */}
        <Section className="bg-muted/10">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="mb-12 text-center">{t('contact_faq_title')}</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('contact_faq_q1')}</h3>
                  <p className="text-muted-foreground">{t('contact_faq_a1')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('contact_faq_q2')}</h3>
                  <p className="text-muted-foreground">{t('contact_faq_a2')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('contact_faq_q3')}</h3>
                  <p className="text-muted-foreground">{t('contact_faq_a3')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('contact_faq_q4')}</h3>
                  <p className="text-muted-foreground">{t('contact_faq_a4')}</p>
                </div>
                <div className="border-l-2 border-foreground pl-6">
                  <h3 className="mb-2">{t('contact_faq_q5')}</h3>
                  <p className="text-muted-foreground">{t('contact_faq_a5')}</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Emergency Contact */}
        <Section>
          <Container>
            <div className="max-w-2xl mx-auto text-center border-2 border-foreground rounded-lg p-8">
              <h2 className="mb-4">{t('contact_emergency_title')}</h2>
              <p className="text-muted-foreground mb-4">{t('contact_emergency_description')}</p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{t('contact_emergency_hours')}</p>
                <p className="text-muted-foreground">{t('contact_emergency_referrals')}</p>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
