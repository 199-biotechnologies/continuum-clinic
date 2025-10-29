import Link from 'next/link'
import { Container } from './container'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../language-switcher'

export function Header() {
  const t = useTranslations()

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="liquid-glass-nav flex items-center justify-between px-6 py-3 rounded-full">
          <Link href="/" className="flex items-center">
            <span className="text-lg tracking-tight">
              <span className="font-light opacity-70">The </span>
              <span className="font-extralight">Continuum Clinic</span>
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-sm font-light transition-all hover:opacity-70">
              {t('nav_about')}
            </Link>
            <Link href="/services" className="text-sm font-light transition-all hover:opacity-70">
              {t('nav_services')}
            </Link>
            <Link href="/blog" className="text-sm font-light transition-all hover:opacity-70">
              {t('nav_blog')}
            </Link>
            <Link href="/contact" className="text-sm font-light transition-all hover:opacity-70">
              {t('nav_contact')}
            </Link>
            <LanguageSwitcher />
            <Link
              href="/book-consultation"
              className="inline-flex items-center justify-center rounded-full bg-white/90 text-black px-5 py-2 text-sm font-normal transition-all hover:bg-white hover:scale-105"
            >
              {t('nav_book')}
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}
