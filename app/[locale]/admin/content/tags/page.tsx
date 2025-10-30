'use client'

import { useState, useEffect } from 'react'

interface Tag {
  name: string
  count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/tags')
      const data = await response.json()
      setTags(data.tags || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return

    setAdding(true)
    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() })
      })

      if (response.ok) {
        setNewTag('')
        fetchTags()
      }
    } catch (error) {
      console.error('Error adding tag:', error)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete tag "${name}"? Posts with this tag will remain but will lose the tag.`)) return

    try {
      const response = await fetch(`/api/blog/tags/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTags(tags.filter(t => t.name !== name))
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Tags</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Manage blog post tags</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-4">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag name"
          className="flex-1 rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={adding || !newTag.trim()}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {adding ? 'Adding...' : 'Add Tag'}
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">Loading...</div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">
          No tags yet. Add your first tag above.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full">
            <thead className="border-b border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">Posts</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {tags.map((tag) => (
                <tr key={tag.name} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-black/10 px-3 py-1 text-sm font-medium text-black dark:bg-white/10 dark:text-white">
                      {tag.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">{tag.count}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(tag.name)}
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
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
