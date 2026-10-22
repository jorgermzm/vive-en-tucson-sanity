'use client'

import {useRef, useState} from 'react'
import type {SitePlace} from '@/lib/places'
import type {PlaceCategory} from '@/lib/place-categories'
import {PlaceCard} from './PlaceCard'

const PAGE_SIZE = 20
export function PlacesGrid({places, category}: {places: SitePlace[]; category: PlaceCategory}) {
  const [page, setPage] = useState(1)
  const title = useRef<HTMLHeadingElement>(null)
  const pages = Math.ceil(places.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  function goTo(next: number) {
    setPage(next)
    title.current?.scrollIntoView({block: 'start'})
    title.current?.focus({preventScroll: true})
  }
  return <section aria-label="Lugares" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div><h2 ref={title} tabIndex={-1} className="scroll-mt-28 text-lg font-bold">{places.length} lugares para explorar</h2><p className="mt-1 text-sm text-slate-600">De mayor a menor calificación. En empate, más reseñas primero.</p></div>
      <p className="text-sm text-[#5e5e5e]">Información de <span translate="no" className="whitespace-nowrap font-normal">Google Maps</span></p>
    </div>
    <p aria-live="polite" className="mb-5 text-sm text-slate-600">Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, places.length)} de {places.length}{places.length < 60 ? ' lugares disponibles en esta consulta.' : ' lugares.'}</p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{places.slice(start, start + PAGE_SIZE).map(place => <PlaceCard key={place.id} place={place} category={category}/>)}</div>
    {pages > 1 && <nav aria-label="Páginas de lugares" className="mt-10 flex flex-wrap items-center justify-center gap-5">
      <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1} className="rounded-full border border-slate-300 px-5 py-3 font-bold disabled:opacity-40">← Anterior</button>
      <span className="text-sm">Página {page} de {pages}</span>
      <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages} className="rounded-full border border-slate-300 px-5 py-3 font-bold disabled:opacity-40">Siguiente →</button>
    </nav>}
  </section>
}
