import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Continuum Clinic | Veterinary Longevity Centre',
  description: 'London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://thecontinuumclinic.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
