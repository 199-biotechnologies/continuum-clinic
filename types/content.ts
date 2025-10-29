/**
 * Blog post and content types
 */

export type PostStatus = 'draft' | 'published' | 'archived'

export interface Post {
  id: string
  locale: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  coverImage?: string
  tags: string[]
  category?: string
  status: PostStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
  views: number
  readingTime: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export interface PostCreateData {
  locale: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  coverImage?: string
  tags: string[]
  category?: string
  status: PostStatus
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export interface PostUpdateData {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  coverImage?: string
  tags?: string[]
  category?: string
  status?: PostStatus
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}
