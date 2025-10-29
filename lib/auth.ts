import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { SESSION_EXPIRY } from './constants'
import { getSession, setSession, deleteSession, getClientSession, setClientSession, deleteClientSession } from './redis'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const CLIENT_JWT_SECRET = new TextEncoder().encode(
  process.env.CLIENT_JWT_SECRET || 'fallback-client-secret-change-in-production'
)

export interface AdminSession {
  userId: string
  email: string
  role: 'admin'
  createdAt: number
}

export interface ClientSession {
  clientId: string
  email: string
  role: 'client'
  createdAt: number
}

/**
 * Admin Authentication
 */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminSession
  } catch (error) {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) return null

  const session = await verifyAdminToken(token)
  if (!session) return null

  // Verify session still exists in Redis
  const storedSession = await getSession(session.userId)
  if (!storedSession) return null

  return session
}

export async function setAdminSession(session: AdminSession): Promise<void> {
  const token = await createAdminToken(session)
  const cookieStore = await cookies()

  // Store session in Redis
  await setSession(session.userId, session, SESSION_EXPIRY.admin)

  // Set HTTP-only cookie
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY.admin
  })
}

export async function clearAdminSession(): Promise<void> {
  const session = await getAdminSession()
  if (session) {
    await deleteSession(session.userId)
  }

  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}

/**
 * Client Authentication
 */

export async function createClientToken(session: ClientSession): Promise<string> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(CLIENT_JWT_SECRET)

  return token
}

export async function verifyClientToken(token: string): Promise<ClientSession | null> {
  try {
    const { payload } = await jwtVerify(token, CLIENT_JWT_SECRET)
    return payload as unknown as ClientSession
  } catch (error) {
    return null
  }
}

export async function getClientSessionData(): Promise<ClientSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('client-token')?.value

  if (!token) return null

  const session = await verifyClientToken(token)
  if (!session) return null

  // Verify session still exists in Redis
  const storedClientId = await getClientSession(session.clientId)
  if (!storedClientId) return null

  return session
}

export async function setClientSessionData(session: ClientSession): Promise<void> {
  const token = await createClientToken(session)
  const cookieStore = await cookies()

  // Store session in Redis
  await setClientSession(session.clientId, session.clientId, SESSION_EXPIRY.client)

  // Set HTTP-only cookie
  cookieStore.set('client-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY.client
  })
}

export async function clearClientSession(): Promise<void> {
  const session = await getClientSessionData()
  if (session) {
    await deleteClientSession(session.clientId)
  }

  const cookieStore = await cookies()
  cookieStore.delete('client-token')
}

/**
 * Permission checks
 */

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}

export async function requireClientAuth(): Promise<ClientSession> {
  const session = await getClientSessionData()
  if (!session) {
    throw new Error('Unauthorized: Client access required')
  }
  return session
}

/**
 * Check if client owns the pet
 */
export async function checkPetOwnership(petId: string, clientId: string): Promise<boolean> {
  const { getPet } = await import('./redis')
  const pet = await getPet(petId)
  return pet?.clientId === clientId
}
