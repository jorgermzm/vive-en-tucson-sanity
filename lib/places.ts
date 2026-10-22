import 'server-only'
import {cache} from 'react'
import {createClient} from '@sanity/client'
import {projectId, dataset, apiVersion} from '@/sanity/lib/api'
import {type PlaceCategory} from './place-categories'
import {searchPlaces, fetchPlace, fetchPlaceDetail, sortPlacesByReviews, nearbyBounds, validPlaceId, PLACE_LIMIT, type Place, type PlaceDetail, type PlacePhoto} from './places-client'
import {signPhoto} from './places-photo-token'

export type SitePlace = Omit<Place, 'photo'> & {photo?: Omit<NonNullable<Place['photo']>, 'name'> & {url: string}}
export type SitePlaceDetail = Omit<PlaceDetail, 'photo' | 'photos'> & {photo?: SitePlace['photo']; photos: NonNullable<SitePlace['photo']>[]}
export type PlaceEditorial = {story?: string; recommendation?: string; category?: PlaceCategory; videoIds?: string[]; relatedPlaceIds?: string[]}
type Selection = {placeIds?: string[]; hiddenPlaceIds?: string[]}
const cms = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published', timeout: 3000, maxRetries: 0})
function sitePhoto(photo: PlacePhoto, key: string): NonNullable<SitePlace['photo']> {
  return {authors: photo.authors, googleMapsUri: photo.googleMapsUri, url: `/api/places/photo?token=${signPhoto(photo.name, key)}`}
}
function sitePlace({photo, ...place}: Place, key: string): SitePlace {return {...place, photo: photo ? sitePhoto(photo, key) : undefined}}
async function selectedPlaces(ids: string[], key: string) {
  const places: Place[] = []
  let succeeded = 0
  const unique = [...new Set(ids)].filter(validPlaceId).slice(0, PLACE_LIMIT)
  for (let start = 0; start < unique.length; start += 6) {
    const batch = await Promise.allSettled(unique.slice(start, start + 6).map(id => fetchPlace(id, key)))
    for (const result of batch) if (result.status === 'fulfilled') {succeeded++; if (result.value) places.push(result.value)}
  }
  if (unique.length && !succeeded) throw new Error('Places unavailable')
  return places
}

// React cache deduplicates within one render only. Google content is not persisted.
export const getPlaces = cache(async (category: PlaceCategory) => {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return {places: [] as SitePlace[], status: 'unconfigured' as const}
  let selection: Selection | null = null
  try {
    selection = await cms.fetch<Selection | null>('*[_type == "placeCollection" && category == $category][0]{placeIds,hiddenPlaceIds}', {category}, {cache: 'no-store'})
  } catch { /* Discovery still works if the optional editorial selection is unavailable. */ }
  try {
    let places: Place[]
    if (selection?.placeIds?.length) {
      places = await selectedPlaces(selection.placeIds, key)
    } else places = await searchPlaces(category, key, fetch, {excludeIds: selection?.hiddenPlaceIds})
    const hidden = new Set(selection?.hiddenPlaceIds || [])
    return {status: 'ready' as const, places: sortPlacesByReviews(places.filter(p => !hidden.has(p.id))).slice(0, PLACE_LIMIT).map(place => sitePlace(place, key))}
  } catch {
    console.warn('[places] Places unavailable; showing retry message.')
    return {places: [] as SitePlace[], status: 'unavailable' as const}
  }
})

export const getPlaceDetail = cache(async (id: string) => {
  if (!validPlaceId(id)) return {status: 'not-found' as const}
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return {status: 'unavailable' as const}
  try {
    const [place, content] = await Promise.all([
      fetchPlaceDetail(id, key),
      cms.fetch<{profile: PlaceEditorial | null; hidden: boolean}>(`{
        "profile": *[_type == "placeProfile" && placeId == $id] | order(_updatedAt desc)[0]{story,recommendation,category,"videoIds":videos[]->youtubeUrl,relatedPlaceIds},
        "hidden": count(*[_type == "placeCollection" && $id in hiddenPlaceIds]) > 0
      }`, {id}, {cache: 'no-store'}).catch(() => null),
    ])
    if (!place || content?.hidden) return {status: 'not-found' as const}
    const {photos, photo, ...rest} = place
    return {status: 'ready' as const, place: {...rest, photo: photo ? sitePhoto(photo, key) : undefined, photos: photos.map(p => sitePhoto(p, key))} as SitePlaceDetail,
      editorial: content?.profile || {} as PlaceEditorial}
  } catch {
    console.warn('[places] Place details unavailable; showing retry message.')
    return {status: 'unavailable' as const}
  }
})

export const getRelatedPlaces = cache(async (id: string, category: PlaceCategory) => {
  const detail = await getPlaceDetail(id)
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (detail.status !== 'ready' || !key) return [] as SitePlace[]
  try {
    const selection = await cms.fetch<Selection | null>('*[_type == "placeCollection" && category == $category][0]{hiddenPlaceIds}', {category}, {cache: 'no-store'}).catch(() => null)
    const hidden = new Set([id, ...(selection?.hiddenPlaceIds || [])])
    const ids = detail.editorial.relatedPlaceIds?.filter(p => !hidden.has(p)).slice(0, 4)
    const rectangle = detail.place.location ? nearbyBounds(detail.place.location) : undefined
    if (rectangle && (rectangle.low.latitude >= rectangle.high.latitude || rectangle.low.longitude >= rectangle.high.longitude)) return []
    const places = ids?.length ? await selectedPlaces(ids, key) : await searchPlaces(category, key, fetch, {limit: 8, excludeIds: [...hidden], rectangle})
    return sortPlacesByReviews(places.filter(p => !hidden.has(p.id))).slice(0, 4).map(p => sitePlace(p, key))
  } catch {return [] as SitePlace[]}
})
