/**
 * Initialize admin account in Redis
 * Run with: npx tsx scripts/init-admin.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { hashPassword } from '../lib/auth'
import { setAdmin, setAdminEmailMapping, setAdminPasswordHash } from '../lib/redis'

async function initializeAdmin() {
  const ADMIN_EMAIL = 'dboris@gmail.com'
  const ADMIN_PASSWORD = 'Faith2025!'
  const adminId = 'admin-1'

  console.log('Initializing admin account...')
  console.log('Email:', ADMIN_EMAIL)

  try {
    // Hash password
    const passwordHash = await hashPassword(ADMIN_PASSWORD)
    console.log('Password hashed successfully')

    // Create admin data
    const adminData = {
      id: adminId,
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: new Date().toISOString()
    }

    // Store in Redis
    await setAdmin(adminId, adminData)
    console.log('Admin user created')

    await setAdminEmailMapping(ADMIN_EMAIL, adminId)
    console.log('Email mapping created')

    await setAdminPasswordHash(adminId, passwordHash)
    console.log('Password hash stored')

    console.log('\n✅ Admin account initialized successfully!')
    console.log('You can now login at /admin with:')
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password: Faith2025!')
  } catch (error) {
    console.error('❌ Error initializing admin:', error)
    process.exit(1)
  }
}

initializeAdmin()
