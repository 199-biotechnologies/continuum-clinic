import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function TermsPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="mb-12">{t('nav_terms')}</h1>

            <div className="space-y-8 text-sm font-extralight text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-foreground mb-4">Services</h2>
                <p>
                  Continuum Clinic provides veterinary longevity medicine, including clinical assessments, diagnostic testing, pharmaceutical protocols, and advanced therapeutics. All treatments are evidence-guided and personalised to individual patients.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Appointments</h2>
                <p>
                  Appointments require 48-hour advance notice for cancellation. Late cancellations may incur a fee. Consultations are conducted in person at our London location or via telemedicine where appropriate.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Payment</h2>
                <p>
                  Payment is due at time of service. We accept major credit cards and bank transfers. Detailed invoices are provided for all services and may be submitted to pet insurance providers.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Informed Consent</h2>
                <p>
                  Advanced therapeutics including gene therapy and cell therapy require informed consent. We provide comprehensive information on risks, benefits, and alternatives for all interventions.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Medical Records</h2>
                <p>
                  Clients have access to complete medical records through the client portal. Records may be transferred to other veterinary providers upon written request.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Limitations</h2>
                <p>
                  We do not provide emergency veterinary services. For urgent cases, contact your nearest 24-hour emergency clinic. Longevity protocols are adjunctive and do not replace standard veterinary care.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Modifications</h2>
                <p>
                  These terms may be updated periodically. Continued use of our services constitutes acceptance of modified terms.
                </p>
              </div>

              <div className="pt-8 text-xs">
                <p>Last updated: January 2025</p>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
