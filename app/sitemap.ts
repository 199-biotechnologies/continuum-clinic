import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thecontinuumclinic.com'
  const locales = ['en', 'es', 'fr', 'zh', 'ru', 'ar']

  const routes = [
    '/',
    '/services',
    '/about',
    '/contact',
    '/blog'
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add all routes for all locales
  routes.forEach(route => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/blog' ? 'weekly' : 'monthly',
        priority: route === '/' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}${route}`])
          )
        }
      })
    })
  })

  return sitemapEntries
}
