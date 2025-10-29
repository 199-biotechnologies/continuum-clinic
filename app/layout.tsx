import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://thecontinuumclinic.com'),
  title: {
    default: 'Continuum Clinic | Veterinary Longevity Centre London',
    template: '%s | Continuum Clinic'
  },
  description: 'London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.',
  keywords: ['veterinary longevity', 'pet longevity', 'dog longevity', 'gene therapy pets', 'rapamycin dogs', 'veterinary regenerative medicine', 'pet health optimization', 'canine longevity', 'veterinary clinic London', 'advanced pet care'],
  authors: [{ name: 'Continuum Clinic' }],
  creator: 'Continuum Clinic',
  publisher: 'Continuum Clinic',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['es_ES', 'fr_FR', 'zh_CN', 'ru_RU', 'ar_SA'],
    url: 'https://thecontinuumclinic.com',
    title: 'Continuum Clinic | Veterinary Longevity Centre London',
    description: 'London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.',
    siteName: 'Continuum Clinic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Continuum Clinic | Veterinary Longevity Centre London',
    description: 'London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-GB': '/en',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'zh-CN': '/zh',
      'ru-RU': '/ru',
      'ar-SA': '/ar',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
