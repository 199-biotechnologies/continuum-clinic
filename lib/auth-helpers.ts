import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getAdmin } from './redis'
import { redirect } from 'next/navigation'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')
const CLIENT_JWT_SECRET = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET || '')

/**
 * Server-side helper to require admin authentication
 * Use in Server Components or Server Actions
 * Redirects to login if not authenticated
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) {
    redirect('/admin')
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.userId || payload.role !== 'admin') {
      redirect('/admin')
    }

    // Verify admin still exists in Redis
    const admin = await getAdmin(payload.userId as string)
    if (!admin) {
      redirect('/admin')
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'admin' as const
    }
  } catch (error) {
    redirect('/admin')
  }
}

/**
 * Server-side helper to require client authentication
 * Use in Server Components or Server Actions
 * Redirects to portal login if not authenticated
 */
export async function requireClientAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('client-token')?.value

  if (!token) {
    redirect('/portal')
  }

  try {
    const { payload } = await jwtVerify(token, CLIENT_JWT_SECRET)

    if (!payload.userId || payload.role !== 'client') {
      redirect('/portal')
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'client' as const
    }
  } catch (error) {
    redirect('/portal')
  }
}

/**
 * Get admin user if authenticated (doesn't redirect)
 * Returns null if not authenticated
 */
export async function getAdminUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.userId || payload.role !== 'admin') {
      return null
    }

    const admin = await getAdmin(payload.userId as string)
    if (!admin) return null

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'admin' as const
    }
  } catch {
    return null
  }
}

/**
 * Get client user if authenticated (doesn't redirect)
 * Returns null if not authenticated
 */
export async function getClientUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('client-token')?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, CLIENT_JWT_SECRET)

    if (!payload.userId || payload.role !== 'client') {
      return null
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'client' as const
    }
  } catch {
    return null
  }
}
