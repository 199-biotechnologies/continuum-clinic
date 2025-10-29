import { kv } from '@vercel/kv'

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
  return await redis.setex(`session:${sessionId}`, expirySeconds, JSON.stringify(data))
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
  return await redis.setex(`session:client:${sessionId}`, expirySeconds, clientId)
}

export async function deleteClientSession(sessionId: string) {
  return await redis.del(`session:client:${sessionId}`)
}

/**
 * Client management
 */
export async function getClient(clientId: string) {
  const data = await redis.get(`client:${clientId}`)
  return data ? JSON.parse(data as string) : null
}

export async function setClient(clientId: string, clientData: any) {
  await redis.set(`client:${clientId}`, JSON.stringify(clientData))
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

export async function getAllClients() {
  const clientIds = await redis.smembers('clients:index')
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
  return data ? JSON.parse(data as string) : null
}

export async function setPet(petId: string, petData: any) {
  await redis.set(`pet:${petId}`, JSON.stringify(petData))
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

/**
 * Health record management
 */
export async function getHealthRecord(recordId: string) {
  const data = await redis.get(`health-record:${recordId}`)
  return data ? JSON.parse(data as string) : null
}

export async function setHealthRecord(recordId: string, recordData: any) {
  await redis.set(`health-record:${recordId}`, JSON.stringify(recordData))
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

/**
 * Appointment management
 */
export async function getAppointment(appointmentId: string) {
  const data = await redis.get(`appointment:${appointmentId}`)
  return data ? JSON.parse(data as string) : null
}

export async function setAppointment(appointmentId: string, appointmentData: any) {
  await redis.set(`appointment:${appointmentId}`, JSON.stringify(appointmentData))
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

/**
 * Content management (Blog posts)
 */
export async function getPost(postId: string) {
  const data = await redis.get(`post:${postId}`)
  return data ? JSON.parse(data as string) : null
}

export async function setPost(postId: string, postData: any) {
  await redis.set(`post:${postId}`, JSON.stringify(postData))
  await redis.lpush('posts:list', postId)
}

export async function getAllPosts(limit: number = 50) {
  const postIds = await redis.lrange('posts:list', 0, limit - 1)
  const posts = await Promise.all(
    (postIds as string[]).map(id => getPost(id))
  )
  return posts.filter(Boolean)
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
  return await redis.setex(`cache:${key}`, ttlSeconds, JSON.stringify(value))
}

export async function cacheGet(key: string) {
  const data = await redis.get(`cache:${key}`)
  return data ? JSON.parse(data as string) : null
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
