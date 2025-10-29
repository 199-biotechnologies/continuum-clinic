import Link from 'next/link'
import { Container } from './container'
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations()

  return (
    <>
      {/* SVG Filters for Liquid Glass Effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-glass">
            {/* Turbulence for organic distortion */}
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />

            {/* Displacement for refraction effect */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />

            {/* Chromatic Aberration - Red Channel */}
            <feOffset in="SourceGraphic" dx="1" dy="0" result="red" />
            <feComponentTransfer in="red" result="red">
              <feFuncR type="identity" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>

            {/* Chromatic Aberration - Blue Channel */}
            <feOffset in="SourceGraphic" dx="-1" dy="0" result="blue" />
            <feComponentTransfer in="blue" result="blue">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="identity" />
            </feComponentTransfer>

            {/* Combine channels */}
            <feBlend in="red" in2="blue" mode="screen" result="chroma" />
            <feBlend in="chroma" in2="displaced" mode="normal" />
          </filter>
        </defs>
      </svg>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="liquid-glass-nav flex items-center justify-between px-6 py-3 rounded-full border border-white/20">
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
