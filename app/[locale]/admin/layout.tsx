import { ReactNode } from 'react'

// Force dynamic rendering for all localized admin pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LocalizedAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
