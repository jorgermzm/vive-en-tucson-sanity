import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import {getPlaceDetail} from '@/lib/places'
import {isPlaceCategory, PLACE_CATEGORIES} from '@/lib/place-categories'
import {PlaceInformation, PlaceReviews, PlaceVideos, RelatedPlaces} from '@/app/components/PlaceDetails'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
type Props = {params: Promise<{id: string}>; searchParams: Promise<{categoria?: string | string[]}>}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id} = await params
  const result = await getPlaceDetail(id)
  if (result.status !== 'ready') return {title: 'Lugar no disponible', robots: {index: false, follow: false}}
  return {title: `${result.place.name} en Tucson`, description: `Fotos, dirección, horarios y opiniones de ${result.place.name}. Explora Tucson con Jorge.`, alternates: {canonical: `/lugares/${encodeURIComponent(id)}`}}
}
export default async function PlacePage({params, searchParams}: Props) {
  const [{id}, query] = await Promise.all([params, searchParams])
  const result = await getPlaceDetail(id)
  if (result.status === 'not-found') notFound()
  const requested = typeof query.categoria === 'string' ? query.categoria : ''
  const category = isPlaceCategory(requested) ? requested : result.status === 'ready' && result.editorial.category && isPlaceCategory(result.editorial.category) ? result.editorial.category : 'que-hacer'
  return <main className="vet-catalog vet-place-page min-h-screen py-10 sm:py-14"><div className="shell">
    <nav aria-label="Ruta de navegación" className="vet-place-breadcrumbs mb-8 flex flex-wrap gap-3 text-sm text-slate-600"><Link href="/" className="underline">Inicio</Link><span aria-hidden="true">/</span><Link href={`/${category}`} className="underline">{PLACE_CATEGORIES[category].label}</Link>{result.status === 'ready' && <><span aria-hidden="true">/</span><span aria-current="page">{result.place.name}</span></>}</nav>
    {result.status === 'ready' ? <><div className="vet-place-detail-layout"><PlaceInformation place={result.place} editorial={result.editorial}/><aside className="space-y-6"><Suspense fallback={<div role="status" className="vet-place-panel">Cargando videos de Jorge…</div>}><PlaceVideos category={category} editorial={result.editorial}/></Suspense><PlaceReviews place={result.place}/></aside></div><Suspense fallback={<p role="status" className="mt-10 text-slate-600">Buscando otros lugares…</p>}><RelatedPlaces id={id} category={category}/></Suspense></> : <section role="status" className="rounded-2xl border border-slate-200 bg-white p-8"><h1 className="font-serif text-3xl font-bold">No pudimos cargar esta ficha.</h1><p className="mt-4 text-slate-600">Inténtalo de nuevo en unos minutos.</p><a href={`/lugares/${encodeURIComponent(id)}?categoria=${category}`} className="vet-text-link mt-5">Volver a intentar</a></section>}
  </div></main>
}
