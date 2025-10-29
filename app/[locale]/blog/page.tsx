import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getPostsByLocale, getAllCategories } from '@/lib/redis'
import { Post } from '@/types/content'
import { format } from 'date-fns'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface BlogPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    category?: string
    tag?: string
  }>
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params
  const { category, tag } = await searchParams

  const t = useTranslations()

  let allPosts = await getPostsByLocale(locale, 100)

  // Filter only published posts
  let posts: Post[] = allPosts.filter((post): post is Post => post !== null && (post as Post).status === 'published')

  // Apply filters
  if (category) {
    posts = posts.filter((post) => post.category === category)
  }

  if (tag) {
    posts = posts.filter((post) => post.tags.includes(tag))
  }

  const categories = await getAllCategories()

  // Featured posts (first 3)
  const featuredPosts: Post[] = posts.slice(0, 3)
  const otherPosts: Post[] = posts.slice(3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24">
        <Section gutter="md">
          <Container>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
                {t('blog_title') || 'Blog'}
              </h1>
              <p className="mt-4 text-lg text-black/60 dark:text-white/60">
                {t('blog_subtitle') || 'Latest news and insights about pet longevity'}
              </p>
            </div>

            {/* Category Filters */}
            <div className="mt-12 flex flex-wrap gap-2 justify-center">
              <Link
                href={`/${locale}/blog`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !category && !tag
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-black/10 text-black hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                }`}
              >
                All Posts
              </Link>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/blog?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-black/10 text-black hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && !category && !tag && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
                  {t('blog_featured') || 'Featured Posts'}
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {featuredPosts.map((post: Post) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group"
                    >
                      <article className="overflow-hidden rounded-lg border border-black/10 transition-all hover:border-black dark:border-white/10 dark:hover:border-white">
                        {post.coverImage && (
                          <div className="aspect-video overflow-hidden bg-black/5 dark:bg-white/5">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post.category && (
                            <span className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
                              {post.category}
                            </span>
                          )}
                          <h3 className="mt-2 text-xl font-bold text-black dark:text-white group-hover:underline">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-black/60 dark:text-white/60 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{post.readingTime} min read</span>
                            {post.publishedAt && (
                              <>
                                <span>•</span>
                                <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            {otherPosts.length > 0 && (
              <div className="mt-16">
                {!category && !tag && (
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
                    {t('blog_all_posts') || 'All Posts'}
                  </h2>
                )}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {otherPosts.map((post: Post) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group"
                    >
                      <article className="overflow-hidden rounded-lg border border-black/10 transition-all hover:border-black dark:border-white/10 dark:hover:border-white">
                        {post.coverImage && (
                          <div className="aspect-video overflow-hidden bg-black/5 dark:bg-white/5">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post.category && (
                            <span className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
                              {post.category}
                            </span>
                          )}
                          <h3 className="mt-2 text-lg font-bold text-black dark:text-white group-hover:underline">
                            {post.title}
                          </h3>
                          <p className="mt-2 text-sm text-black/60 dark:text-white/60 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs text-black/60 dark:text-white/60">
                            <span>{post.readingTime} min</span>
                            {post.publishedAt && (
                              <>
                                <span>•</span>
                                <span>{format(new Date(post.publishedAt), 'MMM d')}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {posts.length === 0 && (
              <div className="py-16 text-center text-black/60 dark:text-white/60">
                {t('blog_no_posts') || 'No posts found'}
              </div>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params

  return {
    title: 'Blog | Continuum Clinic',
    description: 'Latest news and insights about pet longevity, regenerative medicine, and advanced veterinary care.',
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        es: '/es/blog',
        fr: '/fr/blog',
        zh: '/zh/blog',
        ru: '/ru/blog',
        ar: '/ar/blog'
      }
    }
  }
}
