'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '../language-switcher'

export function Header() {
  const t = useTranslations()

  return (
    <>
      {/* SVG Filter Definition for Liquid Glass Effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="liquid-glass-filter" colorInterpolationFilters="sRGB">
            {/* Subtle turbulence for organic distortion */}
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="3" seed="2" result="noise"/>
            {/* Light displacement for glass refraction */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displace"/>
            {/* Gaussian blur for frosted effect */}
            <feGaussianBlur in="displace" stdDeviation="0.5" result="blur"/>
            {/* Enhanced color saturation */}
            <feColorMatrix in="blur" type="saturate" values="1.4" result="saturate"/>
            {/* Subtle chromatic aberration */}
            <feComponentTransfer in="saturate" result="chromatic">
              <feFuncR type="linear" slope="1.02" intercept="0.01"/>
              <feFuncG type="linear" slope="0.98" intercept="0"/>
              <feFuncB type="linear" slope="1.01" intercept="0.01"/>
            </feComponentTransfer>
            {/* Specular lighting for glass highlights */}
            <feSpecularLighting in="chromatic" surfaceScale="3" specularConstant="0.5" specularExponent="15" lightingColor="#ffffff" result="specular">
              <fePointLight x="-5000" y="-8000" z="15000"/>
            </feSpecularLighting>
            {/* Blend specular with source */}
            <feComposite in="chromatic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.15" k4="0" result="composite"/>
            <feBlend in="composite" in2="SourceGraphic" mode="normal"/>
          </filter>
        </defs>
      </svg>

      {/* Desktop Header - Floating Capsule */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 lg:px-8">
        {/* Capsule Container - overflow-hidden clips all internal effects to rounded boundary */}
        <div className="relative transition-all duration-300 overflow-hidden rounded-full shadow-2xl shadow-gray-900/10">
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 liquid-glass-header" />
          {/* Gradient overlay for enhanced frosted look */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />
          {/* Top highlight shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

          {/* Content */}
          <nav className="relative flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 gap-8 lg:gap-12">
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
      </div>
    </>
  )
}
