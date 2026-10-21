import Link from 'next/link'
import {PLACE_CATEGORIES, type PlaceCategory} from '@/lib/place-categories'
import {getPlaces} from '@/lib/places'
import {PlacePhoto} from './PlacePhoto'

export async function PlacesPage({category}: {category: PlaceCategory}) {
  const section = PLACE_CATEGORIES[category]
  const {places, status} = await getPlaces(category)
  return <main className="vet-catalog min-h-screen py-12 text-navy">
    <div className="shell">
      <Link href="/" className="vet-text-link text-sm">← Inicio</Link>
      <div className="vet-catalog-intro"><p className="vet-eyebrow">Estilo de vida local</p><h1 className="display-serif mt-3 text-4xl font-bold sm:text-5xl">{section.title}</h1><span className="vet-rule"/><p className="mt-4 text-lg text-slate-600">{section.description}</p></div>
      <nav aria-label="Explora Tucson" className="mb-12 flex flex-wrap justify-center gap-3">
        {Object.entries(PLACE_CATEGORIES).map(([slug, item]) => <Link key={slug} href={`/${slug}`} prefetch={false} aria-current={slug === category ? 'page' : undefined} className={`vet-category-tab ${slug === category ? 'vet-category-tab-active' : ''}`}>{item.label}</Link>)}
      </nav>
      {status !== 'ready' ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-bold">No pudimos cargar los lugares en este momento.</h2>
        <p className="mt-3 text-slate-600">Inténtalo de nuevo en unos minutos.</p>
        <a href={`/${category}`} className="mt-5 inline-block font-bold text-blue-700 underline">Volver a intentar</a>
      </div> : places.length === 0 ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-8">No hay lugares disponibles en esta sección por el momento.</p> : <section aria-label="Lugares" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <p className="mb-5 text-sm text-[#5e5e5e]">Información de <span translate="no" className="whitespace-nowrap font-normal">Google Maps</span></p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map(place => <article key={place.id} className="vet-place-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <PlacePhoto place={place}/>
            <div className="p-5">
              <h2 className="font-serif text-2xl font-bold">{place.name}</h2>
              <address className="mt-3 text-sm not-italic leading-6 text-slate-600">{place.address}</address>
              <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="vet-text-link mt-5 text-sm">Ver en Google Maps<span className="sr-only">: {place.name}</span> ↗</a>
              {place.attributions.map((a, i) => <p key={i} className="mt-2 text-xs text-slate-600">{a.providerUri ? <a href={a.providerUri} target="_blank" rel="noopener noreferrer" className="underline">{a.provider}</a> : a.provider}</p>)}
            </div>
          </article>)}
        </div>
      </section>}
    </div>
  </main>
}
