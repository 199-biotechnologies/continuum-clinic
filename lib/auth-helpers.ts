import { cookies, headers } from 'next/headers'
import { jwtVerify } from 'jose'
import { getAdmin } from './redis'
import { redirect } from 'next/navigation'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '')
const CLIENT_JWT_SECRET = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET || '')

/**
 * Get the current locale from headers
 */
function getLocale(): string {
  try {
    const headersList = headers()
    const pathname = headersList.get('x-pathname') || ''
    const localeMatch = pathname.match(/^\/([a-z]{2})\//)
    return localeMatch ? localeMatch[1] : 'en'
  } catch {
    return 'en'
  }
}

/**
 * Server-side helper to require admin authentication
 * Use in Server Components or Server Actions
 * Redirects to login if not authenticated
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  const locale = getLocale()

  if (!token) {
    redirect(`/${locale}/admin`)
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (!payload.userId || payload.role !== 'admin') {
      redirect(`/${locale}/admin`)
    }

    // Verify admin still exists in Redis
    const admin = await getAdmin(payload.userId as string)
    if (!admin) {
      redirect(`/${locale}/admin`)
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'admin' as const
    }
  } catch (error) {
    redirect(`/${locale}/admin`)
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
  const locale = getLocale()

  if (!token) {
    redirect(`/${locale}/portal`)
  }

  try {
    const { payload } = await jwtVerify(token, CLIENT_JWT_SECRET)

    if (!payload.userId || payload.role !== 'client') {
      redirect(`/${locale}/portal`)
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: 'client' as const
    }
  } catch (error) {
    redirect(`/${locale}/portal`)
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
