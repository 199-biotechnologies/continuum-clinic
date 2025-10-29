import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function PrivacyPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container size="narrow">
            <h1 className="mb-12">{t('nav_privacy')}</h1>

            <div className="space-y-8 text-sm font-extralight text-muted-foreground leading-relaxed">
              <div>
                <h2 className="text-foreground mb-4">Data Collection</h2>
                <p>
                  We collect personal information you provide when booking consultations, including owner details, pet information, and communication preferences. This information is stored securely and used solely for veterinary care purposes.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Medical Records</h2>
                <p>
                  Pet health records, diagnostic results, and treatment protocols are maintained with strict confidentiality. Access is limited to authorised veterinary staff and the registered owner.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Communications</h2>
                <p>
                  We use your email and phone number to send appointment reminders, health updates, and clinic announcements. You may opt out of non-essential communications at any time.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Data Security</h2>
                <p>
                  All data is encrypted in transit and at rest. We use industry-standard security measures to protect your information from unauthorised access.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Data Retention</h2>
                <p>
                  Medical records are retained for 7 years as required by veterinary regulations. Personal data is deleted upon request, subject to legal requirements.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4">Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal data. Contact us at info@thecontinuumclinic.com for any privacy-related requests.
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
