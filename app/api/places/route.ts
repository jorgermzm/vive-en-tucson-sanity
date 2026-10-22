import {NextRequest, NextResponse} from 'next/server'
import {isPlaceCategory} from '@/lib/place-categories'
import {getPlaces} from '@/lib/places'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') || ''
  if (!isPlaceCategory(category)) return NextResponse.json({error: 'Categoría inválida'}, {status: 400, headers: {'Cache-Control': 'no-store'}})
  const result = await getPlaces(category)
  return NextResponse.json(result, {status: result.status === 'ready' ? 200 : 503, headers: {'Cache-Control': 'private, no-store'}})
}
