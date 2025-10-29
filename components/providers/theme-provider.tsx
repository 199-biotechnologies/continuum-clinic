'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

/**
 * Theme Provider Component
 *
 * Wraps the application with next-themes provider for dark/light mode support.
 * Supports three modes:
 * - light: Force light mode
 * - dark: Force dark mode
 * - system: Follow user's system preference (default)
 *
 * @see https://github.com/pacocoursey/next-themes
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
