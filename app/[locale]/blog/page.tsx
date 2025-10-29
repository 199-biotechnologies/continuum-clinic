import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Section } from '@/components/layout/section'
import { Container } from '@/components/layout/container'

export default function BlogPage() {
  const t = useTranslations()

  // Blog posts would be fetched from Redis in production
  const posts: any[] = []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section>
          <Container>
            <h1 className="text-center mb-16">{t('nav_blog')}</h1>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-extralight text-muted-foreground leading-relaxed mb-8">
                  No blog posts published yet. Check back soon for updates on veterinary longevity research, clinical insights, and treatment protocols.
                </p>
                <p className="text-sm font-extralight text-muted-foreground">
                  For immediate questions, please <a href="/contact" className="underline hover:text-foreground">contact us directly</a>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <div key={post.id} className="p-6 border rounded-lg bg-background">
                    <h3 className="mb-3">{post.title}</h3>
                    <p className="text-muted-foreground font-extralight">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
