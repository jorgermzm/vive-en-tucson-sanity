import {PLACE_CATEGORIES, type PlaceCategory} from './place-categories'

export type PlaceAuthor = {displayName: string; uri?: string; photoUri?: string}
export type PlacePhoto = {name: string; authors: PlaceAuthor[]; googleMapsUri?: string}
export type Place = {
  id: string; name: string; address: string; mapsUrl: string;
  photo?: PlacePhoto; attributions: {provider: string; providerUri?: string}[]
}
type ApiPlace = {
  id?: string; displayName?: {text?: string}; formattedAddress?: string;
  googleMapsUri?: string; businessStatus?: string;
  photos?: {name?: string; authorAttributions?: PlaceAuthor[]; googleMapsUri?: string}[];
  attributions?: {provider?: string; providerUri?: string}[]
}
const FIELDS = 'id,displayName,formattedAddress,googleMapsUri,businessStatus,photos,attributions'
export function safeHttps(value?: string): string | undefined {
  try { return value && new URL(value).protocol === 'https:' ? value : undefined } catch { return undefined }
}
export function validPlaceId(value: string) { return /^[A-Za-z0-9_-]{1,200}$/.test(value) }
export function validPhotoName(value: string) { return /^places\/[A-Za-z0-9_-]{1,200}\/photos\/[A-Za-z0-9_-]{1,2000}$/.test(value) }

export function normalizePlace(item: ApiPlace): Place | null {
  if (!item.id || !validPlaceId(item.id) || !item.displayName?.text || !item.formattedAddress || item.businessStatus === 'CLOSED_PERMANENTLY') return null
  const image = item.photos?.find(photo => photo.name?.startsWith(`places/${item.id}/photos/`) && validPhotoName(photo.name))
  return {
    id: item.id, name: item.displayName.text, address: item.formattedAddress,
    mapsUrl: safeHttps(item.googleMapsUri) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.displayName.text)}&query_place_id=${encodeURIComponent(item.id)}`,
    photo: image?.name ? {
      name: image.name, googleMapsUri: safeHttps(image.googleMapsUri),
      authors: (image.authorAttributions || []).filter(author => author.displayName).map(author => ({displayName: author.displayName, uri: safeHttps(author.uri), photoUri: safeHttps(author.photoUri)})),
    } : undefined,
    attributions: (item.attributions || []).filter(a => a.provider).map(a => ({provider: a.provider!, providerUri: safeHttps(a.providerUri)})),
  }
}

async function request(url: string, key: string, fetcher: typeof fetch, options: Omit<RequestInit, 'headers'> & {headers?: Record<string, string>} = {}) {
  let response: Response
  try {
    response = await fetcher(url, {...options, headers: {...options.headers, 'X-Goog-Api-Key': key}, cache: 'no-store', signal: AbortSignal.timeout(10000)})
  } catch { throw new Error('Places connection unavailable') }
  // Never include Google's response body, request options or credential in errors.
  if (!response.ok) throw new Error(`Places request failed (${response.status})`)
  try { return await response.json() } catch { throw new Error('Invalid Places response') }
}

export async function searchPlaces(category: PlaceCategory, key: string, fetcher: typeof fetch = fetch): Promise<Place[]> {
  const results = await Promise.all(PLACE_CATEGORIES[category].queries.map(async textQuery => {
    const body = await request('https://places.googleapis.com/v1/places:searchText', key, fetcher, {
      method: 'POST', headers: {'Content-Type': 'application/json', 'X-Goog-FieldMask': FIELDS.split(',').map(f => `places.${f}`).join(',')},
      body: JSON.stringify({textQuery, pageSize: 8, languageCode: 'es', regionCode: 'US', locationRestriction: {rectangle: {low: {latitude: 32.0, longitude: -111.2}, high: {latitude: 32.55, longitude: -110.65}}}}),
    })
    if (body.places !== undefined && !Array.isArray(body.places)) throw new Error('Invalid Places response')
    return (body.places || []).map(normalizePlace).filter((place: Place | null): place is Place => place !== null) as Place[]
  }))
  // Interleave searches so museums and attractions (or bars and clubs) both appear.
  const places = new Map<string, Place>()
  for (let i = 0; i < 8; i++) for (const result of results) if (result[i]) places.set(result[i].id, result[i])
  return [...places.values()].slice(0, 12)
}

export async function fetchPlace(id: string, key: string, fetcher: typeof fetch = fetch): Promise<Place | null> {
  if (!validPlaceId(id)) throw new Error('Invalid place ID')
  const body = await request(`https://places.googleapis.com/v1/places/${id}?languageCode=es`, key, fetcher, {headers: {'X-Goog-FieldMask': FIELDS}})
  return normalizePlace(body)
}

export async function fetchPhotoUri(name: string, key: string, fetcher: typeof fetch = fetch): Promise<string> {
  if (!validPhotoName(name)) throw new Error('Invalid photo name')
  const body = await request(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=800&skipHttpRedirect=true`, key, fetcher)
  const uri = safeHttps(body.photoUri)
  if (!uri || !new URL(uri).hostname.endsWith('.googleusercontent.com')) throw new Error('Invalid Places photo response')
  return uri
}
