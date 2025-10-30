'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/image-upload'
import { RichTextEditor } from '@/components/rich-text-editor'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const [formData, setFormData] = useState({
    locale: 'en',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Boris Djordjevic',
    coverImage: '',
    tags: [] as string[],
    category: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    publishedAt: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  })

  useEffect(() => {
    fetchCategoriesAndTags()
  }, [])

  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const fetchCategoriesAndTags = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch('/api/blog/categories'),
        fetch('/api/blog/tags')
      ])
      const catData = await catRes.json()
      const tagData = await tagRes.json()
      setCategories(catData.categories?.map((c: any) => c.name) || [])
      setTags(tagData.tags?.map((t: any) => t.name) || [])
    } catch (error) {
      console.error('Error fetching categories/tags:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/content/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Create New Post</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Add a new blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">URL-friendly version of the title</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Write your post content here..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Locale
              </label>
              <select
                value={formData.locale}
                onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="zh">Chinese</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>

          <div>
            <ImageUpload
              label="Cover Image"
              value={formData.coverImage}
              onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-black/10 text-black hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Publish Date/Time
              </label>
              <input
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-black/10 pt-8 dark:border-white/10">
          <h2 className="text-xl font-semibold text-black dark:text-white">SEO Settings</h2>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.seo.metaTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              placeholder="Leave empty to use post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.seo.metaDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
              rows={3}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              placeholder="Brief description for search engines"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-black/10 pt-8 dark:border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-black/10 px-6 py-3 text-sm font-medium text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
