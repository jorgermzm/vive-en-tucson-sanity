import Link from 'next/link'
import {PLACE_CATEGORIES, type PlaceCategory} from '@/lib/place-categories'
import {getPlaces} from '@/lib/places'
import {PlacesGrid} from './PlacesGrid'

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
      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">¿Cómo usar esta guía?</h2><p className="mt-3 leading-7 text-slate-600">Explora hasta 60 lugares por categoría, ordenados por calificación de Google. Abre la foto o el nombre para ver su ficha con dirección, fotos, horarios y opiniones.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">¿La información está pensada para visitantes y residentes?</h2><p className="mt-3 leading-7 text-slate-600">Sí. La selección ayuda tanto a quienes visitan Tucson como a quienes están considerando vivir aquí y quieren entender mejor cada zona a través de sus lugares y experiencias.</p></article>
      </section>
      {status !== 'ready' ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-bold">No pudimos cargar los lugares en este momento.</h2>
        <p className="mt-3 text-slate-600">Inténtalo de nuevo en unos minutos.</p>
        <a href={`/${category}`} className="mt-5 inline-block font-bold text-blue-700 underline">Volver a intentar</a>
      </div> : places.length === 0 ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-8">No hay lugares disponibles en esta sección por el momento.</p> : <PlacesGrid key={category} places={places} category={category}/>}
    </div>
  </main>
}
