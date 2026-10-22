const {test} = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const {stripTypeScriptTypes} = require('node:module')
require.extensions['.ts'] = (module, filename) => {
  let source = stripTypeScriptTypes(fs.readFileSync(filename, 'utf8'))
  const names = [...source.matchAll(/export (?:async )?(?:function|const) (\w+)/g)].map(m => m[1])
  source = source.replace(/import \{([^}]+)\} from '([^']+)'/g, (_, names, path) => `const {${names}}=require('${path.startsWith('.') ? path+'.ts' : path}')`).replace(/export /g, '')
  module._compile(source+'\nmodule.exports={'+names.join(',')+'}', filename)
}
const {searchPlaces, fetchPlace, normalizePlace, fetchPhotoUri, fetchPlaceDetail, normalizePlaceDetail, sortPlacesByReviews} = require('../lib/places-client.ts')
const {signPhoto, verifyPhoto} = require('../lib/places-photo-token.ts')
const {isPlaceCategory} = require('../lib/place-categories.ts')
const key = 'test-only-placeholder'
const place = (id='ChIJ-test') => ({id, displayName: {text: 'Museo de prueba'}, formattedAddress: 'Tucson, AZ', photos: [{name: `places/${id}/photos/photo-token`, googleMapsUri: 'https://maps.google.com/photo', authorAttributions: [{displayName: 'Autor', uri: 'https://maps.google.com/author'}]}]})

test('accepts only the fixed categories, including prototype property rejection', () => {
  for (const category of ['que-hacer','restaurantes','atracciones','vida-nocturna','museos','hiking-outdoors']) assert.equal(isPlaceCategory(category), true)
  for (const category of ['__proto__','constructor','pizza','']) assert.equal(isPlaceCategory(category), false)
})

test('separates discovery searches for attractions, museums and outdoors', async () => {
  const queries = {}
  for (const category of ['atracciones','museos','hiking-outdoors']) {
    queries[category] = []
    const result = await searchPlaces(category, key, async (_url, options) => {
      queries[category].push(JSON.parse(options.body).textQuery)
      return Response.json({places: [place(category)]})
    })
    assert.equal(result.length, 1)
  }
  assert.deepEqual(queries.atracciones, ['tourist attractions in Tucson Arizona'])
  assert.deepEqual(queries.museos, ['museums in Tucson Arizona'])
  assert.deepEqual(queries['hiking-outdoors'], ['hiking trails in Tucson Arizona', 'outdoor parks in Tucson Arizona'])
})
test('queries Tucson with catalog fields, Spanish and a credential header; never caches Google content', async () => {
  const result = await searchPlaces('restaurantes', key, async (url, options) => {
    assert.equal(url, 'https://places.googleapis.com/v1/places:searchText')
    assert.equal(url.includes(key), false)
    assert.equal(options.headers['X-Goog-Api-Key'], key)
    assert.equal(options.cache, 'no-store')
    assert.equal(options.method, 'POST')
    const body = JSON.parse(options.body)
    assert.equal(body.textQuery, 'restaurants in Tucson Arizona')
    assert.equal(body.languageCode, 'es')
    assert.equal(body.pageSize, 20)
    assert.ok(body.locationRestriction.rectangle)
    assert.equal(options.headers['X-Goog-FieldMask'].includes('places.photos'), true)
    assert.equal(options.headers['X-Goog-FieldMask'].includes('places.rating'), true)
    assert.equal(options.headers['X-Goog-FieldMask'].includes('nextPageToken'), true)
    assert.equal(options.headers['X-Goog-FieldMask'].includes('reviews'), false)
    return Response.json({places: [place()]})
  })
  assert.equal(result[0].name, 'Museo de prueba')
  assert.equal(result[0].address, 'Tucson, AZ')
  assert.equal(result[0].photo.authors[0].displayName, 'Autor')
})
test('alternates categories, deduplicates IDs, excludes permanent closures and bounds output', async () => {
  let calls = 0
  const result = await searchPlaces('que-hacer', key, async () => {
    const prefix = ++calls === 1 ? 'museum' : 'attraction'
    return Response.json({places: [place('shared'), ...Array.from({length: 8}, (_, i) => place(`${prefix}-${i}`)), {...place('closed'), businessStatus: 'CLOSED_PERMANENTLY'}]})
  })
  assert.equal(calls, 2)
  assert.equal(result.length, 17)
  assert.equal(result.filter(p => p.id === 'shared').length, 1)
  assert.ok(result.some(p => p.id === 'museum-0'))
  assert.ok(result.some(p => p.id === 'attraction-0'))
  assert.equal(result.some(p => p.id === 'closed'), false)
})

test('retrieves three pages of 20, keeps the query stable and sorts all 60 before UI pagination', async () => {
  const bodies = []
  const result = await searchPlaces('restaurantes', key, async (_url, options) => {
    const body = JSON.parse(options.body)
    bodies.push(body)
    const page = bodies.length - 1
    return Response.json({places: Array.from({length: 20}, (_, i) => ({...place(`p-${page * 20 + i}`), rating: page === 2 ? 5 : 4, userRatingCount: page * 20 + i})), nextPageToken: `page-${page + 1}`})
  })
  assert.equal(bodies.length, 3)
  assert.equal(result.length, 60)
  assert.equal(result[0].id, 'p-59')
  assert.equal(result[19].rating, 5)
  assert.equal(result[20].rating, 4)
  assert.equal(bodies[0].pageToken, undefined)
  assert.equal(bodies[1].pageToken, 'page-1')
  assert.equal(bodies[2].pageToken, 'page-2')
  for (const {pageToken, ...body} of bodies) assert.deepEqual(body, bodies[0])
})

test('stops on exhausted or repeated tokens, deduplicates across pages and honors exclusions', async () => {
  let calls = 0
  const result = await searchPlaces('museos', key, async () => {
    calls++
    return Response.json({places: [place('same'), place('hidden'), {...place('closed'), businessStatus: 'CLOSED_PERMANENTLY'}], nextPageToken: 'repeat'})
  }, {excludeIds: ['hidden']})
  assert.equal(calls, 2)
  assert.deepEqual(result.map(p => p.id), ['same'])
  let limited = 0
  assert.equal((await searchPlaces('museos', key, async () => {limited++; return Response.json({places: Array.from({length: 20}, (_, i) => place(`p-${i}`)), nextPageToken: 'more'})}, {limit: 4})).length, 4)
  assert.equal(limited, 1)
})

test('orders highest rating first, then review count; missing ratings are last and input stays untouched', () => {
  const original = [normalizePlace({...place('missing')}), normalizePlace({...place('many'), rating: 4.8, userRatingCount: 120}), normalizePlace({...place('few'), rating: 4.8, userRatingCount: 2}), normalizePlace({...place('best'), rating: 5, userRatingCount: 1})]
  assert.deepEqual(sortPlacesByReviews(original).map(p => p.id), ['best', 'many', 'few', 'missing'])
  assert.equal(original[0].id, 'missing')
  assert.equal(normalizePlace({...place(), rating: 99, userRatingCount: -1}).rating, undefined)
})

test('details preserve real review content and authors, bound photos and ignore unsafe links', async () => {
  const item = {...place(), websiteUri: 'javascript:bad()', rating: 4.8, userRatingCount: 32,
    editorialSummary: {text: 'Descripción exacta de Google.'}, regularOpeningHours: {weekdayDescriptions: ['lunes: 09:00–17:00']},
    photos: Array.from({length: 8}, (_, i) => ({name: `places/ChIJ-test/photos/photo-${i}`})),
    reviews: [{text: {text: 'Una reseña real.', languageCode: 'es'}, originalText: {text: 'A real review.', languageCode: 'en'}, authorAttribution: {displayName: 'Ana', uri: 'https://maps.google.com/author'}, rating: 5, publishTime: '2026-10-01T00:00:00Z', googleMapsUri: 'https://maps.google.com/review'}, {text: {text: 'Sin autor'}, googleMapsUri: 'https://maps.google.com/review'}, {text: {text: 'URL insegura'}, authorAttribution: {displayName: 'Autor'}, googleMapsUri: 'javascript:bad()'}]}
  const detail = await fetchPlaceDetail('ChIJ-test', key, async (url, options) => {
    assert.equal(url.includes(key), false)
    assert.equal(options.cache, 'no-store')
    assert.ok(options.headers['X-Goog-FieldMask'].includes('reviews'))
    return Response.json(item)
  })
  assert.equal(detail.website, undefined)
  assert.equal(detail.summary, 'Descripción exacta de Google.')
  assert.equal(detail.photos.length, 4)
  assert.equal(detail.reviews.length, 1)
  assert.equal(detail.reviews[0].author.displayName, 'Ana')
  assert.equal(detail.reviews[0].originalText, 'A real review.')
  assert.equal(detail.reviewCount, 32)
  assert.equal(normalizePlaceDetail({}), null)
  assert.equal(await fetchPlaceDetail('missing', key, async () => new Response(null, {status: 404})), null)
  await assert.rejects(fetchPlaceDetail('../bad', key), /Invalid place ID/)
  await assert.rejects(fetchPlaceDetail('test', key, async () => new Response(key, {status: 403})), {message: 'Places request failed (403)'})
})
test('handles missing photos and malformed places without invented data or unsafe URLs', () => {
  assert.equal(normalizePlace({}), null)
  assert.equal(normalizePlace({...place(), id: '../other'}), null)
  const item = normalizePlace({...place(), photos: [], googleMapsUri: 'javascript:alert(1)'})
  assert.equal(item.photo, undefined)
  assert.ok(item.mapsUrl.startsWith('https://www.google.com/maps/'))
  assert.equal(normalizePlace({...place(), photos: [{name: 'places/other/photos/token'}]}).photo, undefined)
})
test('errors do not disclose upstream bodies, credentials or network messages', async () => {
  await assert.rejects(searchPlaces('restaurantes', key, async () => new Response(`sensitive ${key}`, {status: 403})), {message: 'Places request failed (403)'})
  await assert.rejects(searchPlaces('restaurantes', key, async () => { throw new Error(key) }), {message: 'Places connection unavailable'})
  await assert.rejects(searchPlaces('restaurantes', key, async () => Response.json({places: {}})), /Invalid Places response/)
  assert.deepEqual(await searchPlaces('restaurantes', key, async () => Response.json({})), [])
})
test('curated details validate IDs and keep the credential out of the URL', async () => {
  await assert.rejects(fetchPlace('../bad', key), /Invalid place ID/)
  const result = await fetchPlace('ChIJ-test', key, async (url, options) => {
    assert.equal(url, 'https://places.googleapis.com/v1/places/ChIJ-test?languageCode=es')
    assert.equal(options.headers['X-Goog-Api-Key'], key)
    assert.equal(options.cache, 'no-store')
    return Response.json(place())
  })
  assert.equal(result.id, 'ChIJ-test')
})
test('photo tokens reject tampering, expiry, wrong keys, unbounded lifetimes and arbitrary paths', () => {
  const name = 'places/ChIJ-test/photos/photo-token'
  const now = 1000000
  const token = signPhoto(name, key, now)
  assert.equal(verifyPhoto(token, key, now), name)
  assert.equal(verifyPhoto(token, key, now+3600000), null)
  assert.equal(verifyPhoto(token, 'wrong', now), null)
  assert.equal(verifyPhoto(token+'x', key, now), null)
  assert.equal(verifyPhoto(token+'.extra', key, now), null)
  assert.equal(verifyPhoto(token, key, now-1), null)
  assert.equal(verifyPhoto('bad', key, now), null)
  assert.throws(() => signPhoto('../bad', key), /Invalid photo name/)
})
test('photos request a redirect URL without sharing the API key with the browser or remote host', async () => {
  const uri = await fetchPhotoUri('places/ChIJ-test/photos/photo-token', key, async (url, options) => {
    assert.ok(url.includes('skipHttpRedirect=true'))
    assert.equal(url.includes(key), false)
    assert.equal(options.cache, 'no-store')
    assert.equal(options.headers['X-Goog-Api-Key'], key)
    return Response.json({photoUri: 'https://lh3.googleusercontent.com/places/photo'})
  })
  assert.equal(uri, 'https://lh3.googleusercontent.com/places/photo')
  for (const photoUri of ['http://lh3.googleusercontent.com/photo','https://googleusercontent.com.evil.test/photo','https://example.com/photo']) {
    await assert.rejects(fetchPhotoUri('places/ChIJ-test/photos/photo-token', key, async () => Response.json({photoUri})), /Invalid Places photo response/)
  }
})
