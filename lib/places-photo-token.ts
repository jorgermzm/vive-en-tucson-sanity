import {createHmac, timingSafeEqual} from 'node:crypto'
import {validPhotoName} from './places-client'

// Signed short-lived references prevent the image route becoming an arbitrary paid proxy.
export function signPhoto(name: string, key: string, now = Date.now()) {
  if (!validPhotoName(name)) throw new Error('Invalid photo name')
  const payload = Buffer.from(JSON.stringify({name, expires: now + 60 * 60 * 1000})).toString('base64url')
  const signature = createHmac('sha256', key).update(`places-photo-v1:${payload}`).digest('base64url')
  return `${payload}.${signature}`
}
export function verifyPhoto(token: string, key: string, now = Date.now()): string | null {
  if (token.length > 5000) return null
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra || !/^[\w-]+$/.test(signature)) return null
  const expected = createHmac('sha256', key).update(`places-photo-v1:${payload}`).digest()
  const actual = Buffer.from(signature, 'base64url')
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof data.name === 'string' && validPhotoName(data.name) && Number.isFinite(data.expires) && data.expires > now && data.expires <= now + 60 * 60 * 1000 ? data.name : null
  } catch { return null }
}
