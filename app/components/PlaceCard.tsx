import Link from 'next/link'
import type {SitePlace} from '@/lib/places'
import type {PlaceCategory} from '@/lib/place-categories'
import {PlacePhoto} from './PlacePhoto'

export function PlaceCard({place, category}: {place: SitePlace; category: PlaceCategory}) {
  const href = `/lugares/${encodeURIComponent(place.id)}?categoria=${category}`
  return <article className="vet-place-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <PlacePhoto place={place} href={href}/>
    <div className="p-5">
      <h2 className="font-serif text-2xl font-bold"><Link href={href} prefetch={false} className="hover:underline">{place.name}</Link></h2>
      <p className="mt-3 text-sm font-bold text-[#764315]">{place.rating ? <><span aria-label={`Calificación ${place.rating} de 5`}>★ {place.rating.toFixed(1)}</span>{place.reviewCount !== undefined && <span className="font-normal text-slate-600"> · {place.reviewCount.toLocaleString('es-MX')} reseñas</span>}</> : <span className="font-normal text-slate-600">Sin calificación disponible</span>}</p>
      <address className="mt-3 text-sm not-italic leading-6 text-slate-600">{place.address}</address>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3"><Link href={href} prefetch={false} className="vet-text-link text-sm">Ver ficha →</Link><a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 underline">Google Maps ↗<span className="sr-only">: {place.name}</span></a></div>
      {place.attributions.map((a, i) => <p key={i} className="mt-2 text-xs text-slate-600">{a.providerUri ? <a href={a.providerUri} target="_blank" rel="noopener noreferrer" className="underline">{a.provider}</a> : a.provider}</p>)}
    </div>
  </article>
}
