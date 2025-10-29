import Link from 'next/link'
import { Section } from './section'
import { Container } from './container'
import { useTranslations } from 'next-intl'
import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <Section gutter="xs" className="border-t">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Continuum Clinic</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer_description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{SITE_CONFIG.address.street}</p>
              <p>{SITE_CONFIG.address.city} {SITE_CONFIG.address.postcode}</p>
              <p>{SITE_CONFIG.email}</p>
              <p>{SITE_CONFIG.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav_privacy')}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav_terms')}
              </Link>
              <Link href="/portal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav_portal')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-sm text-center text-muted-foreground">
            {t('footer_copyright')}
          </p>
        </div>
      </Container>
    </Section>
  )
}
