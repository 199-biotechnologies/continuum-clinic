import { ReactNode } from 'react'

export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {children}
      </div>
    </div>
  )
}
