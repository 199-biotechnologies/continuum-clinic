import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    // Test 1: Basic set/get
    await kv.set('test-key', 'test-value')
    const value = await kv.get('test-key')

    // Test 2: Set with expiration
    await kv.set('test-expiry', 'test-value-with-expiry', { ex: 60 })
    const expiryValue = await kv.get('test-expiry')

    // Test 3: Check if setex exists
    const hasSetex = typeof (kv as any).setex === 'function'

    return NextResponse.json({
      success: true,
      tests: {
        basicSetGet: value === 'test-value',
        setWithExpiry: expiryValue === 'test-value-with-expiry',
        hasSetexMethod: hasSetex,
        kvAvailable: !!kv
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
