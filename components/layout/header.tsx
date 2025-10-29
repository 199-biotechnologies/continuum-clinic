import Link from 'next/link'
import { Container } from './container'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../language-switcher'

export function Header() {
  const t = useTranslations()

  return (
    <>
      {/* SVG Filters for Liquid Glass - Subtle Apple-style */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Main liquid glass filter - very subtle */}
          <filter id="liquid-glass" colorInterpolationFilters="sRGB">
            {/* Ultra-subtle turbulence for organic glass feel */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003"
              numOctaves="2"
              seed="1"
              result="turbulence"
            />

            {/* Very minimal displacement for subtle refraction */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warp"
            />

            {/* Micro chromatic aberration - red channel */}
            <feOffset in="SourceGraphic" dx="0.3" dy="0" result="red" />
            <feColorMatrix
              in="red"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.4 0"
              result="redChannel"
            />

            {/* Micro chromatic aberration - blue channel */}
            <feOffset in="SourceGraphic" dx="-0.3" dy="0" result="blue" />
            <feColorMatrix
              in="blue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 0.4 0"
              result="blueChannel"
            />

            {/* Combine aberration with original */}
            <feBlend in="redChannel" in2="blueChannel" mode="screen" result="chromatic" />
            <feBlend in="chromatic" in2="warp" mode="normal" result="combined" />

            {/* Subtle sharpening to maintain clarity */}
            <feConvolveMatrix
              in="combined"
              order="3"
              kernelMatrix="0 -0.3 0
                          -0.3 2.2 -0.3
                           0 -0.3 0"
              result="sharpened"
            />

            {/* Final subtle blur for frost */}
            <feGaussianBlur in="sharpened" stdDeviation="0.3" result="frosted" />

            {/* Blend back with source for subtlety */}
            <feBlend in="frosted" in2="SourceGraphic" mode="normal" opacity="0.7" />
          </filter>

          {/* Noise texture for frosting */}
          <filter id="frost-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.015 0"
            />
          </filter>
        </defs>
      </svg>

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
