'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/content'
import { ImageUpload } from '@/components/image-upload'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPost()
    fetchCategoriesAndTags()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${resolvedParams.id}`)
      const data = await response.json()
      setPost(data.post)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

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
    if (!post) return

    setSaving(true)
    try {
      const response = await fetch(`/api/blog/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })

      if (response.ok) {
        router.push('/admin/content/blog')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tag: string) => {
    if (!post) return
    setPost({
      ...post,
      tags: post.tags.includes(tag)
        ? post.tags.filter(t => t !== tag)
        : [...post.tags, tag]
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-black/60 dark:text-white/60">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-black/60 dark:text-white/60">Post not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Edit Post</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Update blog post</p>
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
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
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
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Excerpt
            </label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows={15}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Author
              </label>
              <input
                type="text"
                value={post.author}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Views
              </label>
              <input
                type="number"
                value={post.views}
                readOnly
                className="w-full rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-black dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Cover Image"
              value={post.coverImage || ''}
              onChange={(url) => setPost({ ...post, coverImage: url })}
              onRemove={() => setPost({ ...post, coverImage: '' })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Category
            </label>
            <select
              value={post.category || ''}
              onChange={(e) => setPost({ ...post, category: e.target.value })}
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
                    post.tags.includes(tag)
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
                value={post.status}
                onChange={(e) => setPost({ ...post, status: e.target.value as any })}
                className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Reading Time
              </label>
              <input
                type="text"
                value={`${post.readingTime} min`}
                readOnly
                className="w-full rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-black dark:border-white/10 dark:bg-white/5 dark:text-white"
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
              value={post.seo?.metaTitle || ''}
              onChange={(e) => setPost({ ...post, seo: { ...post.seo, metaTitle: e.target.value } })}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Meta Description
            </label>
            <textarea
              value={post.seo?.metaDescription || ''}
              onChange={(e) => setPost({ ...post, seo: { ...post.seo, metaDescription: e.target.value } })}
              rows={3}
              className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
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
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
