import {NextRequest, NextResponse} from 'next/server'
import {verifyPhoto} from '@/lib/places-photo-token'
import {fetchPhotoUri} from '@/lib/places-client'

export const dynamic = 'force-dynamic'
const headers = {'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer'}
export async function GET(request: NextRequest) {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return new NextResponse(null, {status: 503, headers})
  const name = verifyPhoto(request.nextUrl.searchParams.get('token') || '', key)
  if (!name) return new NextResponse(null, {status: 400, headers})
  try {
    return new NextResponse(null, {status: 302, headers: {...headers, Location: await fetchPhotoUri(name, key)}})
  } catch { return new NextResponse(null, {status: 502, headers}) }
}
