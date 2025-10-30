'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../language-switcher'
import { useState, useEffect } from 'react'

export function Header() {
  const t = useTranslations()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Desktop Header - Floating Capsule with Glassmorphism (Tailwind v4) */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 lg:px-8">
        {/* Capsule Container with Tailwind v4 backdrop-blur */}
        <nav className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-full shadow-2xl shadow-black/10 ring-1 ring-white/40 dark:ring-gray-700/40 ring-inset flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 gap-4 lg:gap-12 w-full max-w-5xl">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-smooth-fast hover:opacity-70">
              <span className="text-base lg:text-lg tracking-tight whitespace-nowrap">
                <span className="font-light opacity-70">The </span>
                <span className="font-extralight">Continuum Clinic</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/about"
                className="text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('nav_about')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900 dark:bg-gray-100" />
              </Link>
              <Link
                href="/science"
                className="text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('nav_science')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900 dark:bg-gray-100" />
              </Link>
              <Link
                href="/contact"
                className="text-xs font-light tracking-[0.1em] uppercase transition-all duration-300 relative group whitespace-nowrap text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('nav_contact')}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 transition-smooth group-hover:opacity-100 bg-gray-900 dark:bg-gray-100" />
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* CTA Button */}
              <Link
                href="/book-consultation"
                className="px-6 py-2.5 text-xs font-light tracking-[0.1em] uppercase rounded-full transition-all duration-300 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-900/25"
              >
                {t('nav_book')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 transition-smooth hover:opacity-70"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-md bg-white/90 dark:bg-gray-900/90"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col items-center justify-center transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          <nav className="flex flex-col items-center space-y-8">
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-light tracking-[0.1em] uppercase transition-all duration-300 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t('nav_about')}
            </Link>
            <Link
              href="/science"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-light tracking-[0.1em] uppercase transition-all duration-300 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t('nav_science')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-light tracking-[0.1em] uppercase transition-all duration-300 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {t('nav_contact')}
            </Link>

            {/* Language Switcher */}
            <div className="pt-4">
              <LanguageSwitcher />
            </div>

            {/* CTA Button */}
            <Link
              href="/book-consultation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-8 py-3 text-sm font-light tracking-[0.1em] uppercase rounded-full transition-all duration-300 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg"
            >
              {t('nav_book')}
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
