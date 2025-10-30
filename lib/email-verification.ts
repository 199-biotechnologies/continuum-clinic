import { kv } from '@vercel/kv'
import crypto from 'crypto'

// Redis Keys
const VERIFICATION_TOKEN_KEY = (token: string) => `email-verify:${token}`
const CLIENT_VERIFICATION_STATUS = (clientId: string) =>
  `client-verified:${clientId}`

export interface VerificationToken {
  token: string
  clientId: string
  email: string
  createdAt: string
  expiresAt: string
}

// Generate verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create verification token for client
export async function createVerificationToken(
  clientId: string,
  email: string
): Promise<VerificationToken> {
  const token = generateVerificationToken()
  const createdAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

  const verificationToken: VerificationToken = {
    token,
    clientId,
    email,
    createdAt,
    expiresAt
  }

  // Store token in Redis with 24-hour expiry
  await kv.set(VERIFICATION_TOKEN_KEY(token), JSON.stringify(verificationToken), {
    ex: 24 * 60 * 60 // 24 hours in seconds
  })

  return verificationToken
}

// Get verification token
export async function getVerificationToken(
  token: string
): Promise<VerificationToken | null> {
  const data = await kv.get<string>(VERIFICATION_TOKEN_KEY(token))

  if (!data) return null

  const verificationToken = JSON.parse(data) as VerificationToken

  // Check if expired
  if (new Date(verificationToken.expiresAt) < new Date()) {
    await kv.del(VERIFICATION_TOKEN_KEY(token))
    return null
  }

  return verificationToken
}

// Verify email (mark client as verified)
export async function verifyClientEmail(
  token: string
): Promise<{ success: boolean; clientId?: string; error?: string }> {
  const verificationToken = await getVerificationToken(token)

  if (!verificationToken) {
    return {
      success: false,
      error: 'Invalid or expired verification token'
    }
  }

  // Mark client as verified
  await kv.set(CLIENT_VERIFICATION_STATUS(verificationToken.clientId), 'true')

  // Delete the verification token (one-time use)
  await kv.del(VERIFICATION_TOKEN_KEY(token))

  return {
    success: true,
    clientId: verificationToken.clientId
  }
}

// Check if client email is verified
export async function isEmailVerified(clientId: string): Promise<boolean> {
  const verified = await kv.get<string>(CLIENT_VERIFICATION_STATUS(clientId))
  return verified === 'true'
}

// Resend verification email (generate new token)
export async function resendVerificationToken(
  clientId: string,
  email: string
): Promise<VerificationToken> {
  // Note: This allows generating a new token even if one exists
  // Old tokens will automatically expire
  return await createVerificationToken(clientId, email)
}
