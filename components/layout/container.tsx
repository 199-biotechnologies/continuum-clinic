import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
}

/**
 * Container component with responsive padding following 8pt grid
 * Padding: 24px → 32px → 48px (mobile → tablet → desktop)
 */
export function Container({
  children,
  className,
  size = 'default'
}: ContainerProps) {
  const sizes = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
  } as const

  return (
    <div
      className={cn(
        'mx-auto px-6 md:px-8 lg:px-12',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
