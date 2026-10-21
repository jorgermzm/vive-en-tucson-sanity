import 'server-only'
import {cache} from 'react'
import {createClient} from '@sanity/client'
import {projectId, dataset, apiVersion} from '@/sanity/lib/api'
import {type PlaceCategory} from './place-categories'
import {searchPlaces, fetchPlace, type Place} from './places-client'
import {signPhoto} from './places-photo-token'

export type SitePlace = Omit<Place, 'photo'> & {photo?: Omit<NonNullable<Place['photo']>, 'name'> & {url: string}}
type Selection = {placeIds?: string[]; hiddenPlaceIds?: string[]}
const cms = createClient({projectId, dataset, apiVersion, useCdn: false, perspective: 'published', timeout: 3000, maxRetries: 0})

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
      const results = await Promise.allSettled([...new Set(selection.placeIds)].slice(0, 12).map(id => fetchPlace(id, key)))
      places = results.flatMap(result => result.status === 'fulfilled' && result.value ? [result.value] : [])
      if (results.length && results.every(result => result.status === 'rejected')) throw new Error('Places unavailable')
    } else places = await searchPlaces(category, key)
    const hidden = new Set(selection?.hiddenPlaceIds || [])
    return {status: 'ready' as const, places: places.filter(p => !hidden.has(p.id)).map(({photo, ...place}): SitePlace => ({
      ...place, photo: photo ? {authors: photo.authors, googleMapsUri: photo.googleMapsUri, url: `/api/places/photo?token=${signPhoto(photo.name, key)}`} : undefined,
    }))}
  } catch {
    console.warn('[places] Places unavailable; showing retry message.')
    return {places: [] as SitePlace[], status: 'unavailable' as const}
  }
})
