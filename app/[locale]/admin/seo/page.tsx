'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Link as LinkIcon, FileText, Globe, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface SEOPage {
  id: string
  path: string
  locale: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  noindex?: boolean
  lastUpdated?: string
}

export default function AdminSEOPage() {
  const [pages, setPages] = useState<SEOPage[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPages: 0,
    pagesWithMeta: 0,
    pagesWithOG: 0,
    noindexPages: 0,
  })

  useEffect(() => {
    loadSEOData()
  }, [])

  const loadSEOData = async () => {
    try {
      const response = await fetch('/api/admin/seo/pages')
      if (response.ok) {
        const data = await response.json()
        const seoPages = data.pages || []
        setPages(seoPages)

        // Calculate stats
        setStats({
          totalPages: seoPages.length,
          pagesWithMeta: seoPages.filter(
            (p: SEOPage) => p.metaTitle && p.metaDescription
          ).length,
          pagesWithOG: seoPages.filter((p: SEOPage) => p.ogImage).length,
          noindexPages: seoPages.filter((p: SEOPage) => p.noindex).length,
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load SEO data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="SEO Management">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading SEO data...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="SEO Management">
      {/* SEO Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-light text-muted-foreground">Total Pages</h3>
          </div>
          <p className="text-3xl font-extralight">{stats.totalPages}</p>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-light text-muted-foreground">With Meta Tags</h3>
          </div>
          <p className="text-3xl font-extralight">{stats.pagesWithMeta}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalPages > 0
              ? Math.round((stats.pagesWithMeta / stats.totalPages) * 100)
              : 0}
            % coverage
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-light text-muted-foreground">With OG Images</h3>
          </div>
          <p className="text-3xl font-extralight">{stats.pagesWithOG}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalPages > 0
              ? Math.round((stats.pagesWithOG / stats.totalPages) * 100)
              : 0}
            % coverage
          </p>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-light text-muted-foreground">No-Index Pages</h3>
          </div>
          <p className="text-3xl font-extralight">{stats.noindexPages}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/seo/pages"
          className="p-6 border border-border rounded-lg bg-card hover:bg-muted/5 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="font-light">Manage Pages</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Edit meta tags, descriptions, and keywords for all pages
              </p>
            </div>
            <LinkIcon className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin/seo/redirects"
          className="p-6 border border-border rounded-lg bg-card hover:bg-muted/5 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LinkIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="font-light">Redirects</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage 301/302 redirects and URL mappings
              </p>
            </div>
            <LinkIcon className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>

      {/* Recent Pages */}
      <div className="mb-6">
        <h2 className="text-xl font-light mb-4">Recent Pages</h2>
        {pages.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-extralight text-muted-foreground mb-4">
              No SEO pages configured yet
            </p>
            <Link
              href="/admin/seo/pages"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-md text-sm font-light hover:opacity-90 transition-opacity"
            >
              Configure SEO Pages
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-light">Path</th>
                  <th className="px-4 py-3 text-left text-sm font-light">Locale</th>
                  <th className="px-4 py-3 text-left text-sm font-light">Meta Title</th>
                  <th className="px-4 py-3 text-left text-sm font-light">Status</th>
                </tr>
              </thead>
              <tbody>
                {pages.slice(0, 10).map((page) => (
                  <tr key={page.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm font-mono">{page.path}</td>
                    <td className="px-4 py-3 text-sm">{page.locale}</td>
                    <td className="px-4 py-3 text-sm">
                      {page.metaTitle ? (
                        <span className="line-clamp-1">{page.metaTitle}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {page.noindex && (
                          <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded">
                            No-Index
                          </span>
                        )}
                        {page.metaTitle && page.metaDescription && (
                          <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 border border-green-500/20 rounded">
                            Optimized
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO Tips */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h3 className="font-light mb-4">SEO Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Meta titles should be 50-60 characters for optimal display in search results</li>
          <li>• Meta descriptions should be 150-160 characters to avoid truncation</li>
          <li>• Use unique titles and descriptions for each page</li>
          <li>• Include target keywords naturally in titles and descriptions</li>
          <li>• Add Open Graph images (1200×630px) for better social sharing</li>
          <li>• Use canonical URLs to prevent duplicate content issues</li>
          <li>• Review and update no-index pages regularly</li>
        </ul>
      </div>
    </AdminLayout>
  )
}
