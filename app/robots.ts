import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: ['ChatGPT-User', 'GPTBot', 'Claude-Web', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/admin/', '/api/', '/portal/'],
      }
    ],
    sitemap: 'https://thecontinuumclinic.com/sitemap.xml',
  }
}
