'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { presentationSlides, type Slide } from '@/lib/presentation-data'
import { useRouter } from 'next/navigation'

export function PresentationViewer() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const totalSlides = presentationSlides.length

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
  }, [totalSlides])

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToFirst = useCallback(() => {
    setCurrentSlide(0)
  }, [])

  const goToLast = useCallback(() => {
    setCurrentSlide(totalSlides - 1)
  }, [totalSlides])

  const handleExit = useCallback(() => {
    router.push('/')
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          goToNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          goToPrevious()
          break
        case 'Home':
          e.preventDefault()
          goToFirst()
          break
        case 'End':
          e.preventDefault()
          goToLast()
          break
        case 'Escape':
          e.preventDefault()
          handleExit()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious, goToFirst, goToLast, handleExit])

  // Touch/swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - next slide
      goToNext()
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right - previous slide
      goToPrevious()
    }
  }

  const slide = presentationSlides[currentSlide]

  return (
    <div
      className="fixed inset-0 bg-black text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Exit Button */}
      <button
        onClick={handleExit}
        className="fixed top-6 right-6 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Exit presentation"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Slide Content */}
      <div className="h-full flex items-center justify-center px-8 md:px-16 lg:px-24">
        {slide.type === 'title' && <TitleSlide slide={slide} />}
        {slide.type === 'content' && <ContentSlide slide={slide} />}
        {slide.type === 'split' && <SplitSlide slide={slide} />}
        {slide.type === 'quote' && <QuoteSlide slide={slide} />}
        {slide.type === 'stats' && <StatsSlide slide={slide} />}
        {slide.type === 'closing' && <ClosingSlide slide={slide} />}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={goToPrevious}
          className="fixed left-6 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/10 transition-colors z-40"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          onClick={goToNext}
          className="fixed right-6 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/10 transition-colors z-40"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
        <span className="text-sm text-white/60">
          {currentSlide + 1} / {totalSlides}
        </span>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard Hints (show on first slide) */}
      {currentSlide === 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/40 text-center">
          Use arrow keys, space, or swipe to navigate
        </div>
      )}
    </div>
  )
}

// Slide Layout Components

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="text-center max-w-4xl animate-fade-in">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 leading-tight">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-xl md:text-2xl lg:text-3xl text-white/70 font-extralight">
          {slide.subtitle}
        </p>
      )}
    </div>
  )
}

function ContentSlide({ slide }: { slide: Slide }) {
  return (
    <div className="max-w-4xl animate-fade-in">
      {slide.title && (
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-12">
          {slide.title}
        </h2>
      )}
      {slide.content && (
        <ul className="space-y-6 text-lg md:text-xl lg:text-2xl font-extralight leading-relaxed">
          {slide.content.map((line, idx) => {
            // Handle markdown bold
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            const isBullet = line.startsWith('—') || line.startsWith('-')

            return (
              <li
                key={idx}
                className={`${
                  isBullet ? 'ml-8' : ''
                } ${
                  line === '' ? 'h-4' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}

function SplitSlide({ slide }: { slide: Slide }) {
  return (
    <div className="max-w-6xl w-full animate-fade-in">
      {slide.title && (
        <h2 className="text-4xl md:text-5xl font-extralight mb-16 text-center">
          {slide.title}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {slide.content?.map((section, idx) => {
          const [title, ...content] = section.split('\n')
          const formattedTitle = title.replace(/\*\*(.*?)\*\*/g, '$1')

          return (
            <div
              key={idx}
              className="p-8 border border-white/20 rounded-lg bg-white/5"
            >
              <h3 className="text-2xl md:text-3xl font-light mb-6">
                {formattedTitle}
              </h3>
              <p className="text-lg md:text-xl font-extralight text-white/80 whitespace-pre-line">
                {content.join('\n')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuoteSlide({ slide }: { slide: Slide }) {
  return (
    <div className="max-w-4xl text-center animate-fade-in">
      <div className="mb-8">
        <svg
          className="w-16 h-16 mx-auto text-white/20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      </div>
      <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight italic leading-relaxed mb-8">
        "{slide.quote}"
      </blockquote>
      {slide.author && (
        <p className="text-lg md:text-xl text-white/60 font-extralight">
          — {slide.author}
        </p>
      )}
    </div>
  )
}

function StatsSlide({ slide }: { slide: Slide }) {
  return (
    <div className="max-w-6xl w-full animate-fade-in">
      {slide.title && (
        <h2 className="text-4xl md:text-5xl font-extralight mb-16 text-center">
          {slide.title}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {slide.stats?.map((stat, idx) => (
          <div
            key={idx}
            className="text-center p-8 border border-white/20 rounded-lg bg-white/5"
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-extralight mb-4">
              {stat.value}
            </div>
            <div className="text-lg md:text-xl text-white/70 font-extralight">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClosingSlide({ slide }: { slide: Slide }) {
  return (
    <div className="text-center max-w-3xl animate-fade-in">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight mb-6">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-2xl md:text-3xl text-white/70 font-extralight mb-12">
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-4 text-lg md:text-xl font-extralight text-white/80">
          {slide.content.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}
