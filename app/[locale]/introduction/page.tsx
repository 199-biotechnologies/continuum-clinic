import { PresentationViewer } from '@/components/presentation-viewer'

// This page has no layout (no header/footer)
// Full-screen presentation with keyboard navigation

export const metadata = {
  title: 'Introduction - The Continuum Clinic',
  description: 'World\'s First Veterinary Longevity Centre',
  robots: 'noindex' // Optional: keep presentation private
}

export default function IntroductionPage() {
  return <PresentationViewer />
}
