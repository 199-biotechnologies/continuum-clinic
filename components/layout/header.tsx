'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../language-switcher'

export function Header() {
  const t = useTranslations()

  return (
    <>
      {/* Desktop Header - Floating Capsule with Glassmorphism (Tailwind v4) */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 lg:px-8">
        {/* Capsule Container with Tailwind v4 backdrop-blur */}
        <nav className="backdrop-blur-lg bg-white/70 rounded-full shadow-2xl shadow-black/10 ring-1 ring-white/40 ring-inset flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 gap-8 lg:gap-12">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-smooth-fast hover:opacity-70">
              <span className="text-base lg:text-lg tracking-tight whitespace-nowrap">
                <span className="font-light opacity-70">The </span>
                <span className="font-extralight">Continuum Clinic</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <Link
                href="/about"
                className="hidden lg:block text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group text-gray-900 hover:text-gray-700"
              >
                {t('nav_about')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900" />
              </Link>
              <Link
                href="/services"
                className="text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group whitespace-nowrap text-gray-900 hover:text-gray-700"
              >
                {t('nav_services')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900" />
              </Link>
              <Link
                href="/blog"
                className="hidden sm:block text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group whitespace-nowrap text-gray-900 hover:text-gray-700"
              >
                {t('nav_blog')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900" />
              </Link>
              <Link
                href="/contact"
                className="text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group whitespace-nowrap text-gray-900 hover:text-gray-700"
              >
                {t('nav_contact')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900" />
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* CTA Button */}
              <Link
                href="/book-consultation"
                className="px-4 lg:px-6 py-2 lg:py-2.5 text-xs font-light tracking-[0.1em] uppercase rounded-full transition-all duration-300 whitespace-nowrap bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25"
              >
                {t('nav_book')}
              </Link>
            </div>
        </nav>
      </div>
    </>
  )
}
