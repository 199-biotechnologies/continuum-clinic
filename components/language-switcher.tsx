'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n/config'

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  zh: '中',
  ru: 'РУ',
  ar: 'ع',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
    const newPath = `/${newLocale}${pathnameWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 text-sm font-light transition-all hover:opacity-70 px-3 py-1.5 rounded-full border border-white/20 bg-white/5"
        aria-label="Select language"
      >
        <span>{LOCALE_LABELS[locale]}</span>
        <svg
          className="w-3 h-3 transition-transform group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute top-full mt-2 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="liquid-glass-dropdown rounded-2xl border border-white/20 overflow-hidden min-w-[80px]">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full px-4 py-2 text-sm font-extralight text-left transition-all hover:bg-white/10 ${
                loc === locale ? 'bg-white/5 font-light' : ''
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
