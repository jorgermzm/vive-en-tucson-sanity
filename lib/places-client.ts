import {PLACE_CATEGORIES, type PlaceCategory} from './place-categories'

export type PlaceAuthor = {displayName: string; uri?: string; photoUri?: string}
export type PlacePhoto = {name: string; authors: PlaceAuthor[]; googleMapsUri?: string}
export type Place = {
  id: string; name: string; address: string; mapsUrl: string;
  photo?: PlacePhoto; rating?: number; reviewCount?: number; attributions: {provider: string; providerUri?: string}[]
}
export type PlaceReview = {
  text: string; languageCode?: string; originalText?: string; originalLanguageCode?: string;
  author: PlaceAuthor; rating?: number; publishedAt?: string; relativeDate?: string; url: string
}
export type PlaceDetail = Place & {
  photos: PlacePhoto[]; website?: string; phone?: string; typeLabel?: string; summary?: string;
  hours: string[]; rating?: number; reviewCount?: number; reviews: PlaceReview[];
  location?: {latitude: number; longitude: number}; temporarilyClosed: boolean
}
type ApiPlace = {
  id?: string; displayName?: {text?: string}; formattedAddress?: string;
  googleMapsUri?: string; businessStatus?: string;
  photos?: {name?: string; authorAttributions?: PlaceAuthor[]; googleMapsUri?: string}[];
  attributions?: {provider?: string; providerUri?: string}[];
  websiteUri?: string; nationalPhoneNumber?: string; primaryTypeDisplayName?: {text?: string}; editorialSummary?: {text?: string};
  regularOpeningHours?: {weekdayDescriptions?: string[]}; rating?: number; userRatingCount?: number;
  location?: {latitude: number; longitude: number};
  reviews?: {text?: {text?: string; languageCode?: string}; originalText?: {text?: string; languageCode?: string}; authorAttribution?: PlaceAuthor; rating?: number; publishTime?: string; relativePublishTimeDescription?: string; googleMapsUri?: string}[]
}
const FIELDS = 'id,displayName,formattedAddress,googleMapsUri,businessStatus,photos,attributions,rating,userRatingCount'
const DETAIL_FIELDS = `${FIELDS},websiteUri,nationalPhoneNumber,primaryTypeDisplayName,editorialSummary,regularOpeningHours,reviews,location`
export const PLACE_LIMIT = 60
const TUCSON_BOUNDS = {low: {latitude: 32.0, longitude: -111.2}, high: {latitude: 32.55, longitude: -110.65}}
type Rectangle = typeof TUCSON_BOUNDS
type SearchOptions = {limit?: number; excludeIds?: string[]; rectangle?: Rectangle}
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
    rating: validRating(item.rating), reviewCount: Number.isInteger(item.userRatingCount) && item.userRatingCount! >= 0 ? item.userRatingCount : undefined,
    mapsUrl: safeHttps(item.googleMapsUri) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.displayName.text)}&query_place_id=${encodeURIComponent(item.id)}`,
    photo: image?.name ? {
      name: image.name, googleMapsUri: safeHttps(image.googleMapsUri),
      authors: (image.authorAttributions || []).filter(author => author.displayName).map(author => ({displayName: author.displayName, uri: safeHttps(author.uri), photoUri: safeHttps(author.photoUri)})),
    } : undefined,
    attributions: (item.attributions || []).filter(a => a.provider).map(a => ({provider: a.provider!, providerUri: safeHttps(a.providerUri)})),
  }
}

export function normalizePlaceDetail(item: ApiPlace): PlaceDetail | null {
  const place = normalizePlace(item)
  if (!place) return null
  const photos = (item.photos || []).slice(0, 4).flatMap(photo => {
    const normalized = normalizePlace({...item, photos: [photo]})?.photo
    return normalized ? [normalized] : []
  })
  const reviews = (item.reviews || []).slice(0, 5).flatMap(review => {
    const url = safeHttps(review.googleMapsUri)
    if (!review.text?.text || !review.authorAttribution?.displayName || !url) return []
    return [{text: review.text.text, languageCode: review.text.languageCode, originalText: review.originalText?.text,
      originalLanguageCode: review.originalText?.languageCode,
      author: {displayName: review.authorAttribution.displayName, uri: safeHttps(review.authorAttribution.uri), photoUri: safeHttps(review.authorAttribution.photoUri)},
      rating: validRating(review.rating), publishedAt: review.publishTime && Number.isFinite(Date.parse(review.publishTime)) ? review.publishTime : undefined,
      relativeDate: review.relativePublishTimeDescription, url}]
  })
  return {...place, photos, website: safeHttps(item.websiteUri), phone: item.nationalPhoneNumber,
    typeLabel: item.primaryTypeDisplayName?.text, summary: item.editorialSummary?.text,
    hours: (item.regularOpeningHours?.weekdayDescriptions || []).filter(day => typeof day === 'string'),
    rating: validRating(item.rating), reviewCount: Number.isInteger(item.userRatingCount) && item.userRatingCount! >= 0 ? item.userRatingCount : undefined,
    reviews, temporarilyClosed: item.businessStatus === 'CLOSED_TEMPORARILY',
    location: item.location && Number.isFinite(item.location.latitude) && Number.isFinite(item.location.longitude) ? item.location : undefined}
}
function validRating(value?: number) {return typeof value === 'number' && value >= 1 && value <= 5 ? value : undefined}
export function sortPlacesByReviews<T extends Place>(places: T[]): T[] {
  return [...places].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0) || a.name.localeCompare(b.name, 'es') || a.id.localeCompare(b.id))
}

export function nearbyBounds(location: {latitude: number; longitude: number}): Rectangle {
  return {low: {latitude: Math.max(TUCSON_BOUNDS.low.latitude, location.latitude - .06), longitude: Math.max(TUCSON_BOUNDS.low.longitude, location.longitude - .07)},
    high: {latitude: Math.min(TUCSON_BOUNDS.high.latitude, location.latitude + .06), longitude: Math.min(TUCSON_BOUNDS.high.longitude, location.longitude + .07)}}
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

export async function searchPlaces(category: PlaceCategory, key: string, fetcher: typeof fetch = fetch, options: SearchOptions = {}): Promise<Place[]> {
  const limit = Math.min(PLACE_LIMIT, Math.max(1, options.limit || PLACE_LIMIT))
  const streams = PLACE_CATEGORIES[category].queries.map(textQuery => ({textQuery, token: '', done: false, seen: new Set<string>()}))
  const places = new Map<string, Place>()
  const excluded = new Set(options.excludeIds || [])
  // Google allows up to three pages of 20 per query. Tokens stay on the server.
  for (let page = 0; page < 3 && places.size < limit; page++) {
    const active = streams.filter(stream => !stream.done)
    if (!active.length) break
    const results = await Promise.all(active.map(async stream => {
      const body = await request('https://places.googleapis.com/v1/places:searchText', key, fetcher, {
        method: 'POST', headers: {'Content-Type': 'application/json', 'X-Goog-FieldMask': `${FIELDS.split(',').map(f => `places.${f}`).join(',')},nextPageToken`},
        body: JSON.stringify({textQuery: stream.textQuery, pageSize: 20, languageCode: 'es', regionCode: 'US',
          locationRestriction: {rectangle: options.rectangle || TUCSON_BOUNDS}, ...(stream.token ? {pageToken: stream.token} : {})}),
      })
      if (body.places !== undefined && !Array.isArray(body.places)) throw new Error('Invalid Places response')
      const token = typeof body.nextPageToken === 'string' && body.nextPageToken.length <= 10000 ? body.nextPageToken : ''
      stream.done = !token || stream.seen.has(token)
      stream.seen.add(token)
      stream.token = token
      return (body.places || []).map(normalizePlace).filter((place: Place | null): place is Place => place !== null) as Place[]
    }))
    // Interleave subcategories and remove duplicates and editorial exclusions.
    for (let i = 0; i < 20; i++) for (const result of results) {
      const place = result[i]
      if (place && !excluded.has(place.id) && places.size < limit) places.set(place.id, place)
    }
  }
  return sortPlacesByReviews([...places.values()])
}

export async function fetchPlace(id: string, key: string, fetcher: typeof fetch = fetch): Promise<Place | null> {
  if (!validPlaceId(id)) throw new Error('Invalid place ID')
  const body = await request(`https://places.googleapis.com/v1/places/${id}?languageCode=es`, key, fetcher, {headers: {'X-Goog-FieldMask': FIELDS}})
  return normalizePlace(body)
}

export async function fetchPlaceDetail(id: string, key: string, fetcher: typeof fetch = fetch): Promise<PlaceDetail | null> {
  if (!validPlaceId(id)) throw new Error('Invalid place ID')
  try {
    const body = await request(`https://places.googleapis.com/v1/places/${id}?languageCode=es`, key, fetcher, {headers: {'X-Goog-FieldMask': DETAIL_FIELDS}})
    return normalizePlaceDetail(body)
  } catch (error) {
    if (error instanceof Error && error.message === 'Places request failed (404)') return null
    throw error
  }
}

export async function fetchPhotoUri(name: string, key: string, fetcher: typeof fetch = fetch): Promise<string> {
  if (!validPhotoName(name)) throw new Error('Invalid photo name')
  const body = await request(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=800&skipHttpRedirect=true`, key, fetcher)
  const uri = safeHttps(body.photoUri)
  if (!uri || !new URL(uri).hostname.endsWith('.googleusercontent.com')) throw new Error('Invalid Places photo response')
  return uri
}
