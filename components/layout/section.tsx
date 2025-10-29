import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  gutter?: 'xs' | 'sm' | 'md'
  id?: string
}

/**
 * Section component with enforced 8pt spacing grid
 * Three gutter sizes only:
 * - xs: 48px (py-12) - Footer & utility sections
 * - sm: 64px (py-16) - Standard sections (default)
 * - md: 96px (py-24) - Hero & dramatic breaks
 */
export function Section({
  children,
  className,
  gutter = 'sm',
  id
}: SectionProps) {
  const gutters = {
    xs: 'py-12',
    sm: 'py-16',
    md: 'py-24',
  } as const

  return (
    <section
      id={id}
      className={cn(gutters[gutter], className)}
    >
      {children}
    </section>
  )
}
