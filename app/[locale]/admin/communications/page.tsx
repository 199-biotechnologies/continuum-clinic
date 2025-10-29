import { requireAdminAuth } from '@/lib/auth-helpers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'
import Link from 'next/link'
import { Mail, FileText, Send, Settings } from 'lucide-react'

export default async function CommunicationsPage() {
  await requireAdminAuth()

  const sections = [
    {
      title: 'Contact Form Submissions',
      description: 'View and manage contact form submissions from website visitors',
      href: '/admin/communications/contact',
      icon: Mail,
      stats: 'View all submissions',
    },
    {
      title: 'Email Templates',
      description: 'Create and manage email templates for automated communications',
      href: '/admin/communications/templates',
      icon: FileText,
      stats: 'Manage templates',
    },
    {
      title: 'Send Bulk Email',
      description: 'Send emails to multiple clients with personalized content',
      href: '/admin/communications/send',
      icon: Send,
      stats: 'Compose email',
    },
    {
      title: 'Notification Settings',
      description: 'Configure automatic email notifications and preferences',
      href: '/admin/communications/settings',
      icon: Settings,
      stats: 'Configure settings',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container>
            <div className="mb-12">
              <Link
                href="/admin/dashboard"
                className="text-sm font-light text-muted-foreground hover:text-foreground"
              >
                ← Back to Admin Dashboard
              </Link>
              <h1 className="mt-4">Communications Center</h1>
              <p className="mt-4 text-lg font-light text-muted-foreground">
                Manage all client communications, email templates, and notification settings
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-foreground transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light mb-2">{section.title}</h3>
                        <p className="text-sm font-light text-muted-foreground mb-3">
                          {section.description}
                        </p>
                        <p className="text-sm font-medium">
                          {section.stats} →
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
