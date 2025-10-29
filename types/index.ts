/**
 * Shared type definitions
 */

export type Locale = 'en' | 'es' | 'fr' | 'zh' | 'ru' | 'ar'

export interface Translation {
  [key: string]: string
}

export interface NavItem {
  href: string
  labelKey: string
  icon?: string
}

export interface SiteConfig {
  name: string
  description: string
  domain: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    postcode: string
    country: string
  }
  social: {
    twitter: string
    linkedin: string
    instagram: string
  }
}
