import { kv } from '@vercel/kv'
import type { Post } from '@/types/content'
import type { ContactFormSubmission } from '@/types/communications'
import type { Client } from '@/types/client'

/**
 * Redis KV Client
 * Wrapper around @vercel/kv for type-safe operations
 */

export const redis = kv

/**
 * Session management
 */
export async function getSession(sessionId: string) {
  return await redis.get(`session:${sessionId}`)
}

export async function setSession(sessionId: string, data: any, expirySeconds: number) {
  return await redis.set(`session:${sessionId}`, data, { ex: expirySeconds })
}

export async function deleteSession(sessionId: string) {
  return await redis.del(`session:${sessionId}`)
}

/**
 * Client session management
 */
export async function getClientSession(sessionId: string) {
  return await redis.get(`session:client:${sessionId}`)
}

export async function setClientSession(sessionId: string, clientId: string, expirySeconds: number) {
  return await redis.set(`session:client:${sessionId}`, clientId, { ex: expirySeconds })
}

export async function deleteClientSession(sessionId: string) {
  return await redis.del(`session:client:${sessionId}`)
}

/**
 * Admin management
 */
export async function getAdmin(adminId: string) {
  const data = await redis.get(`admin:${adminId}`)
  return data || null
}

export async function setAdmin(adminId: string, adminData: any) {
  await redis.set(`admin:${adminId}`, adminData)
}

export async function getAdminByEmail(email: string) {
  const adminId = await redis.get(`admin:email:${email}`)
  if (!adminId) return null
  return await getAdmin(adminId as string)
}

export async function setAdminEmailMapping(email: string, adminId: string) {
  return await redis.set(`admin:email:${email}`, adminId)
}

export async function getAdminPasswordHash(adminId: string) {
  return await redis.get(`admin:${adminId}:password`)
}

export async function setAdminPasswordHash(adminId: string, passwordHash: string) {
  return await redis.set(`admin:${adminId}:password`, passwordHash)
}

/**
 * Client management
 */
export async function getClient(clientId: string): Promise<Client | null> {
  const data = await redis.get<Client>(`client:${clientId}`)
  return data || null
}

export async function setClient(clientId: string, clientData: any) {
  await redis.set(`client:${clientId}`, clientData)
  await redis.sadd('clients:index', clientId)
}

export async function getClientByEmail(email: string) {
  const clientId = await redis.get(`clients:email:${email}`)
  if (!clientId) return null
  return await getClient(clientId as string)
}

export async function setClientEmailMapping(email: string, clientId: string) {
  return await redis.set(`clients:email:${email}`, clientId)
}

export async function getClientPasswordHash(clientId: string) {
  return await redis.get(`client:${clientId}:password`)
}

export async function setClientPasswordHash(clientId: string, passwordHash: string) {
  return await redis.set(`client:${clientId}:password`, passwordHash)
}

export async function getAllClients() {
  const clientIds = await redis.smembers('clients:index')
  if (!clientIds || clientIds.length === 0) return []

  const clients = await Promise.all(
    (clientIds as string[]).map(id => getClient(id))
  )
  return clients.filter(Boolean)
}

/**
 * Pet management
 */
export async function getPet(petId: string) {
  const data = await redis.get(`pet:${petId}`)
  return data || null
}

export async function setPet(petId: string, petData: any) {
  await redis.set(`pet:${petId}`, petData)
  await redis.sadd('pets:index', petId)
  if (petData.clientId) {
    await redis.sadd(`pets:client:${petData.clientId}`, petId)
  }
}

export async function getClientPets(clientId: string) {
  const petIds = await redis.smembers(`pets:client:${clientId}`)
  const pets = await Promise.all(
    (petIds as string[]).map(id => getPet(id))
  )
  return pets.filter(Boolean)
}

export async function getAllPets() {
  const petIds = await redis.smembers('pets:index')
  const pets = await Promise.all(
    (petIds as string[]).map(id => getPet(id))
  )
  return pets.filter(Boolean)
}

export async function deletePet(petId: string) {
  const pet = await getPet(petId) as any
  if (pet?.clientId) {
    await redis.srem(`pets:client:${pet.clientId}`, petId)
  }
  await redis.srem('pets:index', petId)
  return await redis.del(`pet:${petId}`)
}

/**
 * Client deletion
 */
export async function deleteClient(clientId: string) {
  // Delete all pets associated with this client
  const petIds = await redis.smembers(`pets:client:${clientId}`) as string[]
  await Promise.all(petIds.map(petId => deletePet(petId)))

  // Delete client email mapping
  const client = await getClient(clientId) as any
  if (client?.email) {
    await redis.del(`clients:email:${client.email}`)
  }

  // Delete client password
  await redis.del(`client:${clientId}:password`)

  // Delete appointments
  await redis.del(`appointments:client:${clientId}`)

  // Delete from index
  await redis.srem('clients:index', clientId)

  // Delete client data
  return await redis.del(`client:${clientId}`)
}

/**
 * Health record management
 */
export async function getHealthRecord(recordId: string) {
  const data = await redis.get(`health-record:${recordId}`)
  return data || null
}

export async function setHealthRecord(recordId: string, recordData: any) {
  await redis.set(`health-record:${recordId}`, recordData)
  await redis.sadd('health-records:index', recordId)
  if (recordData.petId) {
    await redis.zadd(`health-records:pet:${recordData.petId}`, {
      score: recordData.date,
      member: recordId
    })
  }
}

export async function getPetHealthRecords(petId: string, limit: number = 50) {
  const recordIds = await redis.zrange(`health-records:pet:${petId}`, 0, limit - 1, { rev: true })
  const records = await Promise.all(
    (recordIds as string[]).map(id => getHealthRecord(id))
  )
  return records.filter(Boolean)
}

export async function getAllHealthRecords() {
  const recordIds = await redis.smembers('health-records:index')
  const records = await Promise.all(
    (recordIds as string[]).map(id => getHealthRecord(id))
  )
  return records.filter(Boolean)
}

export async function deleteHealthRecord(recordId: string) {
  const record = await getHealthRecord(recordId) as any
  if (record?.petId) {
    await redis.zrem(`health-records:pet:${record.petId}`, recordId)
  }
  await redis.srem('health-records:index', recordId)
  return await redis.del(`health-record:${recordId}`)
}

/**
 * Appointment management
 */
export async function getAppointment(appointmentId: string) {
  const data = await redis.get(`appointment:${appointmentId}`)
  return data || null
}

export async function setAppointment(appointmentId: string, appointmentData: any) {
  await redis.set(`appointment:${appointmentId}`, appointmentData)
  await redis.zadd('appointments:list', {
    score: new Date(appointmentData.date).getTime(),
    member: appointmentId
  })
}

export async function getRecentAppointments(limit: number = 20) {
  const appointmentIds = await redis.zrange('appointments:list', 0, limit - 1, { rev: true })
  const appointments = await Promise.all(
    (appointmentIds as string[]).map(id => getAppointment(id))
  )
  return appointments.filter(Boolean)
}

export async function getAllAppointments() {
  const appointmentIds = await redis.zrange('appointments:list', 0, -1, { rev: true })
  const appointments = await Promise.all(
    (appointmentIds as string[]).map(id => getAppointment(id))
  )
  return appointments.filter(Boolean)
}

export async function getClientAppointments(clientId: string) {
  const appointmentIds = await redis.smembers(`appointments:client:${clientId}`)
  const appointments = await Promise.all(
    (appointmentIds as string[]).map(id => getAppointment(id))
  )
  return appointments.filter(Boolean)
}

export async function deleteAppointment(appointmentId: string) {
  const appointment = await getAppointment(appointmentId) as any
  if (appointment?.clientId) {
    await redis.srem(`appointments:client:${appointment.clientId}`, appointmentId)
  }
  await redis.zrem('appointments:list', appointmentId)
  return await redis.del(`appointment:${appointmentId}`)
}

/**
 * Content management (Blog posts)
 */
export async function getPost(postId: string): Promise<Post | null> {
  const data = await redis.get(`post:${postId}`)
  return (data as Post) || null
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  const postId = await redis.get(`post:slug:${locale}:${slug}`)
  if (!postId) return null
  return await getPost(postId as string)
}

export async function setPost(postId: string, postData: any) {
  await redis.set(`post:${postId}`, postData)

  // Add to posts list sorted by published date
  const timestamp = postData.publishedAt ? new Date(postData.publishedAt).getTime() : Date.now()
  await redis.zadd('posts:list', { score: timestamp, member: postId })

  // Set slug mapping
  await redis.set(`post:slug:${postData.locale}:${postData.slug}`, postId)

  // Add to category index
  if (postData.category) {
    await redis.sadd(`posts:category:${postData.category}`, postId)
  }

  // Add to tag indexes
  if (postData.tags && Array.isArray(postData.tags)) {
    for (const tag of postData.tags) {
      await redis.sadd(`posts:tag:${tag}`, postId)
    }
  }

  // Add to locale index
  await redis.sadd(`posts:locale:${postData.locale}`, postId)

  // Add to status index
  await redis.sadd(`posts:status:${postData.status}`, postId)
}

export async function deletePost(postId: string) {
  const post = await getPost(postId)
  if (!post) return

  // Ensure post is properly typed
  const typedPost: Post = post

  // Remove from all indexes
  await redis.del(`post:${postId}`)
  await redis.del(`post:slug:${typedPost.locale}:${typedPost.slug}`)
  await redis.zrem('posts:list', postId)
  await redis.srem(`posts:locale:${typedPost.locale}`, postId)
  await redis.srem(`posts:status:${typedPost.status}`, postId)

  if (typedPost.category) {
    await redis.srem(`posts:category:${typedPost.category}`, postId)
  }

  if (typedPost.tags && Array.isArray(typedPost.tags)) {
    for (const tag of typedPost.tags) {
      await redis.srem(`posts:tag:${tag}`, postId)
    }
  }
}

export async function getAllPosts(limit: number = 50, offset: number = 0) {
  const postIds = await redis.zrange('posts:list', offset, offset + limit - 1, { rev: true })
  const posts = await Promise.all(
    (postIds as string[]).map(id => getPost(id))
  )
  return posts.filter(Boolean)
}

export async function getPostsByLocale(locale: string, limit: number = 50) {
  const postIds = await redis.smembers(`posts:locale:${locale}`)
  const posts = await Promise.all(
    (postIds as string[]).slice(0, limit).map(id => getPost(id))
  )
  return posts.filter(Boolean).sort((a: any, b: any) =>
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )
}

export async function getPostsByStatus(status: string, limit: number = 50) {
  const postIds = await redis.smembers(`posts:status:${status}`)
  const posts = await Promise.all(
    (postIds as string[]).slice(0, limit).map(id => getPost(id))
  )
  return posts.filter(Boolean).sort((a: any, b: any) =>
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )
}

export async function getPostsByCategory(category: string, limit: number = 50) {
  const postIds = await redis.smembers(`posts:category:${category}`)
  const posts = await Promise.all(
    (postIds as string[]).slice(0, limit).map(id => getPost(id))
  )
  return posts.filter(Boolean).sort((a: any, b: any) =>
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )
}

export async function getPostsByTag(tag: string, limit: number = 50) {
  const postIds = await redis.smembers(`posts:tag:${tag}`)
  const posts = await Promise.all(
    (postIds as string[]).slice(0, limit).map(id => getPost(id))
  )
  return posts.filter(Boolean).sort((a: any, b: any) =>
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )
}

export async function incrementPostViews(postId: string) {
  const post = await getPost(postId)
  if (!post) return

  const updatedPost = { ...post, views: (post.views || 0) + 1 }
  await redis.set(`post:${postId}`, updatedPost)
  return updatedPost.views
}

/**
 * Category management
 */
export async function getAllCategories() {
  const keys = await redis.keys('posts:category:*')
  const categories = (keys as string[]).map(key => key.replace('posts:category:', ''))
  return categories.sort()
}

export async function addCategory(category: string) {
  await redis.sadd('categories:list', category)
}

export async function deleteCategory(category: string) {
  await redis.srem('categories:list', category)
  await redis.del(`posts:category:${category}`)
}

export async function getCategoriesList() {
  const categories = await redis.smembers('categories:list')
  return (categories as string[]).sort()
}

/**
 * Tag management
 */
export async function getAllTags() {
  const keys = await redis.keys('posts:tag:*')
  const tags = (keys as string[]).map(key => key.replace('posts:tag:', ''))
  return tags.sort()
}

export async function addTag(tag: string) {
  await redis.sadd('tags:list', tag)
}

export async function deleteTag(tag: string) {
  await redis.srem('tags:list', tag)
  await redis.del(`posts:tag:${tag}`)
}

export async function getTagsList() {
  const tags = await redis.smembers('tags:list')
  return (tags as string[]).sort()
}

/**
 * Analytics tracking
 */
export async function incrementPageView(path: string, date: string) {
  return await redis.incr(`analytics:views:${date}:${path}`)
}

export async function incrementLLMVisit(bot: string, date: string) {
  return await redis.incr(`analytics:llm:${bot}:${date}`)
}

export async function incrementContact(date: string) {
  return await redis.incr(`analytics:contacts:${date}`)
}

export async function getAnalytics(date: string) {
  const pattern = `analytics:*:${date}*`
  const keys = await redis.keys(pattern)
  const values = await Promise.all(
    (keys as string[]).map(async key => ({
      key,
      value: await redis.get(key)
    }))
  )
  return values
}

/**
 * Cache management
 */
export async function cacheSet(key: string, value: any, ttlSeconds: number = 3600) {
  return await redis.set(`cache:${key}`, value, { ex: ttlSeconds })
}

export async function cacheGet(key: string) {
  const data = await redis.get(`cache:${key}`)
  return data || null
}

/**
 * Rate limiting
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const current = await redis.incr(`ratelimit:${key}`)
  if (current === 1) {
    await redis.expire(`ratelimit:${key}`, windowSeconds)
  }
  return (current as number) <= limit
}

/**
 * Contact Form Submissions
 */
export async function saveContactSubmission(contactId: string, data: any) {
  await redis.set(`contact:${contactId}`, data)
  await redis.zadd('contacts:list', {
    score: new Date(data.submittedAt).getTime(),
    member: contactId
  })
  await redis.sadd(`contacts:status:${data.status}`, contactId)
}

export async function getContactSubmission(contactId: string) {
  return await redis.get(`contact:${contactId}`)
}

export async function updateContactStatus(contactId: string, newStatus: string, oldStatus?: string) {
  const contact = await getContactSubmission(contactId)
  if (!contact || typeof contact !== 'object' || !('id' in contact)) return null

  const updated: ContactFormSubmission = { ...contact as ContactFormSubmission, status: newStatus as any }

  if (newStatus === 'read' && !updated.readAt) {
    updated.readAt = new Date().toISOString()
  }
  if (newStatus === 'replied' && !updated.repliedAt) {
    updated.repliedAt = new Date().toISOString()
  }

  await redis.set(`contact:${contactId}`, updated)

  if (oldStatus) {
    await redis.srem(`contacts:status:${oldStatus}`, contactId)
  }
  await redis.sadd(`contacts:status:${newStatus}`, contactId)

  return updated
}

export async function getContactsByStatus(status: string, limit: number = 50) {
  const contactIds = await redis.smembers(`contacts:status:${status}`)
  const contacts = await Promise.all(
    (contactIds as string[]).slice(0, limit).map(id => getContactSubmission(id))
  )
  return contacts.filter(Boolean)
}

export async function getAllContacts(limit: number = 100) {
  const contactIds = await redis.zrange('contacts:list', 0, limit - 1, { rev: true })
  const contacts = await Promise.all(
    (contactIds as string[]).map(id => getContactSubmission(id))
  )
  return contacts.filter(Boolean)
}

export async function deleteContactSubmission(contactId: string) {
  const contact = await getContactSubmission(contactId)
  if (!contact) return false

  await redis.del(`contact:${contactId}`)
  await redis.zrem('contacts:list', contactId)
  await redis.srem(`contacts:status:${(contact as any).status}`, contactId)

  return true
}

/**
 * Email Templates
 */
export async function saveTemplate(templateId: string, data: any) {
  await redis.set(`template:${templateId}`, data)
  await redis.sadd('templates:list', templateId)
}

export async function getTemplate(templateId: string) {
  return await redis.get(`template:${templateId}`)
}

export async function getAllTemplates() {
  const templateIds = await redis.smembers('templates:list')
  const templates = await Promise.all(
    (templateIds as string[]).map(id => getTemplate(id))
  )
  return templates.filter(Boolean)
}

export async function deleteTemplate(templateId: string) {
  const template = await getTemplate(templateId)
  if (!template || (template as any).isSystem) {
    return false
  }

  await redis.del(`template:${templateId}`)
  await redis.srem('templates:list', templateId)

  return true
}

/**
 * Notification Settings
 */
export async function getNotificationSettings() {
  const settings = await redis.get('notification:settings')
  return settings || {
    sendAppointmentConfirmation: true,
    sendReminders: true,
    sendWelcomeEmail: true,
    sendMonthlyNewsletter: false,
    replyToEmail: 'info@thecontinuumclinic.com',
    emailFooter: 'Continuum Clinic\n12 Upper Wimpole Street, London W1G 6LW\ninfo@thecontinuumclinic.com | +44 20 1234 5678'
  }
}

export async function saveNotificationSettings(settings: any) {
  return await redis.set('notification:settings', settings)
}

/**
 * SEO Page Management
 */
export async function getSEOPage(pageId: string) {
  return await redis.get(`seo:page:${pageId}`)
}

export async function setSEOPage(pageId: string, data: any) {
  await redis.set(`seo:page:${pageId}`, data)
  await redis.sadd('seo:pages:index', pageId)
}

export async function getAllSEOPages() {
  const pageIds = await redis.smembers('seo:pages:index')
  const pages = await Promise.all(
    (pageIds as string[]).map(id => getSEOPage(id))
  )
  return pages.filter(Boolean)
}

export async function deleteSEOPage(pageId: string) {
  await redis.srem('seo:pages:index', pageId)
  return await redis.del(`seo:page:${pageId}`)
}

/**
 * Redirects Management
 */
export async function getRedirect(redirectId: string) {
  return await redis.get(`redirect:${redirectId}`)
}

export async function setRedirect(redirectId: string, data: any) {
  await redis.set(`redirect:${redirectId}`, data)
  await redis.sadd('redirects:index', redirectId)
}

export async function getAllRedirects() {
  const redirectIds = await redis.smembers('redirects:index')
  const redirects = await Promise.all(
    (redirectIds as string[]).map(id => getRedirect(id))
  )
  return redirects.filter(Boolean)
}

export async function deleteRedirect(redirectId: string) {
  await redis.srem('redirects:index', redirectId)
  return await redis.del(`redirect:${redirectId}`)
}
