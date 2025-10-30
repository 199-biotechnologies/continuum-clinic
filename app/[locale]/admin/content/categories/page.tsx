'use client'

import { useState, useEffect } from 'react'

interface Category {
  name: string
  count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    setAdding(true)
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() })
      })

      if (response.ok) {
        setNewCategory('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Error adding category:', error)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete category "${name}"? Posts with this category will remain but will lose the category.`)) return

    try {
      const response = await fetch(`/api/blog/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(categories.filter(c => c.name !== name))
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Categories</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Manage blog post categories</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-black/10 bg-transparent px-4 py-3 text-black focus:border-black focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={adding || !newCategory.trim()}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {adding ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-black/60 dark:text-white/60">
          No categories yet. Add your first category above.
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
              {categories.map((category) => (
                <tr key={category.name} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-black/60 dark:text-white/60">{category.count}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(category.name)}
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
