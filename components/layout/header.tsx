import Link from 'next/link'
import { Container } from './container'
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl tracking-tight">
              <span className="font-light opacity-60">The </span>
              <span className="font-extralight">Continuum Clinic</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-muted">
              {t('nav_about')}
            </Link>
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-muted">
              {t('nav_services')}
            </Link>
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-muted">
              {t('nav_blog')}
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-muted">
              {t('nav_contact')}
            </Link>
            <Link
              href="/book-consultation"
              className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/90"
            >
              {t('nav_book')}
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
