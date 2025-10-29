'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types/content'
import { format } from 'date-fns'

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = filter !== 'all'
        ? `/api/blog?status=${filter}`
        : '/api/blog'
      const response = await fetch(url)
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Blog Posts</h1>
          <p className="mt-2 text-black/60 dark:text-white/60">Manage your blog content</p>
        </div>
        <Link
          href="/admin/content/blog/new"
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          New Post
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-black/5 text-black hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-black/10 bg-transparent px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">
          No posts found. {filter !== 'all' && 'Try changing the filter.'}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full">
            <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Views</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Author</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-black dark:text-white">{post.title}</div>
                    <div className="text-sm text-black/60 dark:text-white/60 truncate max-w-md">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">{post.views || 0}</td>
                  <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">
                    {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/content/blog/edit/${post.id}`}
                        className="text-sm text-black hover:underline dark:text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
