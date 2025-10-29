import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getPostBySlug, incrementPostViews, getPostsByCategory } from '@/lib/redis'
import { Post } from '@/types/content'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface BlogPostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params

  const post = await getPostBySlug(slug, locale) as Post | null

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementPostViews(post.id).catch(console.error)

  // Get related posts
  const relatedPosts = post.category
    ? (await getPostsByCategory(post.category, 4))
        .filter((p): p is Post => p !== null && (p as Post).id !== post.id && (p as Post).status === 'published')
        .slice(0, 3)
    : []

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Continuum Clinic',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thecontinuumclinic.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thecontinuumclinic.com/${locale}/blog/${post.slug}`
    },
    keywords: post.seo?.keywords?.join(', ')
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 pt-24">
          <Section gutter="md">
            <Container size="narrow">
              {/* Breadcrumbs */}
              <nav className="mb-8 flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                <Link href={`/${locale}/blog`} className="hover:text-black dark:hover:text-white">
                  Blog
                </Link>
                {post.category && (
                  <>
                    <span>/</span>
                    <Link
                      href={`/${locale}/blog?category=${encodeURIComponent(post.category)}`}
                      className="hover:text-black dark:hover:text-white"
                    >
                      {post.category}
                    </Link>
                  </>
                )}
                <span>/</span>
                <span className="text-black dark:text-white">{post.title}</span>
              </nav>

              {/* Article Header */}
              <article>
                <header className="mb-12">
                  {post.category && (
                    <span className="text-sm font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
                      {post.category}
                    </span>
                  )}
                  <h1 className="mt-4 text-4xl font-bold text-black dark:text-white md:text-5xl">
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className="mt-6 text-xl text-black/60 dark:text-white/60">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-8 flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
                    <span className="font-medium text-black dark:text-white">{post.author}</span>
                    <span>•</span>
                    <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM d, yyyy')}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                    <span>•</span>
                    <span>{post.views} views</span>
                  </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="mb-12 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed text-black dark:text-white">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 flex flex-wrap gap-2 border-t border-black/10 pt-8 dark:border-white/10">
                    <span className="text-sm font-medium text-black/60 dark:text-white/60">Tags:</span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                        className="rounded-full bg-black/10 px-3 py-1 text-sm text-black hover:bg-black hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </article>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 border-t border-black/10 pt-16 dark:border-white/10">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
                    Related Posts
                  </h2>
                  <div className="grid gap-8 md:grid-cols-3">
                    {relatedPosts.map((relatedPost: Post) => (
                      <Link
                        key={relatedPost.id}
                        href={`/${locale}/blog/${relatedPost.slug}`}
                        className="group"
                      >
                        <article className="overflow-hidden rounded-lg border border-black/10 transition-all hover:border-black dark:border-white/10 dark:hover:border-white">
                          {relatedPost.coverImage && (
                            <div className="aspect-video overflow-hidden bg-black/5 dark:bg-white/5">
                              <img
                                src={relatedPost.coverImage}
                                alt={relatedPost.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-black dark:text-white group-hover:underline">
                              {relatedPost.title}
                            </h3>
                            <p className="mt-2 text-sm text-black/60 dark:text-white/60 line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Container>
          </Section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale) as Post | null

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const metaTitle = post.seo?.metaTitle || post.title
  const metaDescription = post.seo?.metaDescription || post.excerpt
  const url = `https://thecontinuumclinic.com/${locale}/blog/${post.slug}`

  return {
    title: `${metaTitle} | Continuum Clinic`,
    description: metaDescription,
    keywords: post.seo?.keywords?.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      authors: [post.author]
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: post.coverImage ? [post.coverImage] : []
    },
    alternates: {
      canonical: url,
      languages: {
        en: `/en/blog/${post.slug}`,
        es: `/es/blog/${post.slug}`,
        fr: `/fr/blog/${post.slug}`,
        zh: `/zh/blog/${post.slug}`,
        ru: `/ru/blog/${post.slug}`,
        ar: `/ar/blog/${post.slug}`
      }
    }
  }
}
