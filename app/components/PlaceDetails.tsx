import Image from 'next/image'
import Link from 'next/link'
import {PLACE_CATEGORIES, type PlaceCategory} from '@/lib/place-categories'
import {getRelatedPlaces, type SitePlaceDetail, type PlaceEditorial} from '@/lib/places'
import {getSiteVideos} from '@/lib/videos'
import {videoId} from '@/lib/youtube-data'
import {PlacePhoto} from './PlacePhoto'
import {PlaceCard} from './PlaceCard'
import {PlaceReviewText} from './PlaceReviewText'

export function PlaceInformation({place, editorial}: {place: SitePlaceDetail; editorial: PlaceEditorial}) {
  return <article className="vet-place-information">
    <div className="vet-place-summary">
      <PlacePhoto place={place}/>
      <div className="vet-place-summary-copy">
        <p className="vet-eyebrow">{place.typeLabel || 'Descubre Tucson'}</p>
        <h1>{place.name}</h1>
        <address className="not-italic leading-7 text-slate-600">{place.address}</address>
        <p className="mt-3 text-sm font-bold text-[#764315]">{place.rating ? <><span aria-label={`Calificación ${place.rating} de 5`}>★ {place.rating.toFixed(1)} / 5</span>{place.reviewCount !== undefined && <span className="font-normal text-slate-600"> · {place.reviewCount.toLocaleString('es-MX')} reseñas</span>}</> : 'Sin calificación disponible'}</p>
        {place.temporarilyClosed && <p className="mt-3 font-bold text-amber-800">Google indica que está cerrado temporalmente. Confirma antes de ir.</p>}
        <div className="mt-6 flex flex-wrap gap-3">{place.website && <a className="vet-place-action" href={place.website} target="_blank" rel="noopener noreferrer">Web oficial ↗</a>}<a className="vet-place-action vet-place-action-secondary" href={place.mapsUrl} target="_blank" rel="noopener noreferrer">Mapa y cómo llegar ↗</a></div>
      </div>
    </div>
    <div className="vet-place-information-body">
      <h2>Información y experiencia</h2>
      {place.summary && <section className="mt-7"><h3 className="font-bold">Acerca del lugar</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{place.summary}</p><p className="mt-2 text-xs text-[#5e5e5e]">Descripción de <span translate="no" className="whitespace-nowrap font-normal">Google Maps</span></p></section>}
      {editorial.story && <section className="mt-7"><h3 className="font-bold">Historia</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{editorial.story}</p><p className="mt-2 text-xs text-slate-500">Vive en Tucson</p></section>}
      {editorial.recommendation && <section className="mt-7 rounded-xl bg-[#f5f0e6] p-5"><h3 className="font-bold">La selección de Jorge</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{editorial.recommendation}</p></section>}
      <section className="mt-7"><h3 className="font-bold">Planea tu visita</h3><dl className="vet-place-facts"><div><dt>Dirección</dt><dd>{place.address}</dd></div>{place.phone && <div><dt>Teléfono</dt><dd><a href={`tel:${place.phone.replace(/[^+0-9]/g, '')}`} className="underline">{place.phone}</a></dd></div>}<div><dt>Horarios</dt><dd>{place.hours.length ? <ul className="space-y-2">{place.hours.map((day, i) => <li key={i}>{day}</li>)}</ul> : 'Consulta los horarios en Google Maps o en la web oficial.'}</dd></div></dl><p className="mt-5 text-sm leading-6 text-slate-500">Los horarios, precios y servicios pueden cambiar. Confirma los detalles antes de ir.</p></section>
      {place.photos.length > 1 && <details className="mt-8 border-t border-slate-200 pt-6"><summary className="cursor-pointer font-bold">Más fotos del lugar</summary><div className="mt-5 grid gap-5 sm:grid-cols-2">{place.photos.slice(1).map(photo => <PlacePhoto key={photo.url} place={{...place, photo}}/>)}</div></details>}
      <div className="mt-8 border-t border-slate-200 pt-5 text-xs leading-6 text-[#5e5e5e]">Datos, fotos y calificación: <span translate="no" className="whitespace-nowrap font-normal">Google Maps</span>.{place.attributions.map((a, i) => <p key={i}>{a.providerUri ? <a href={a.providerUri} target="_blank" rel="noopener noreferrer" className="underline">{a.provider}</a> : a.provider}</p>)}</div>
    </div>
  </article>
}

const videoCategory: Record<PlaceCategory, string[]> = {
  restaurantes: ['Restaurantes'], museos: ['Museos'], 'hiking-outdoors': ['Hiking y Outdoors'],
  atracciones: ['Atracciones', 'Recorridos de Tucson'], 'vida-nocturna': ['Bares y vida nocturna', 'Vida nocturna'], 'que-hacer': ['Museos', 'Eventos', 'Hiking y Outdoors', 'Atracciones'],
}
export async function PlaceVideos({category, editorial}: {category: PlaceCategory; editorial: PlaceEditorial}) {
  const {videos} = await getSiteVideos()
  const selected = new Set((editorial.videoIds || []).flatMap(url => {const id = videoId(url); return id ? [id] : []}))
  const linked = videos.filter(video => selected.has(video.id)).slice(0, 3)
  const matches = linked.length ? linked : videos.filter(video => video.categories.some(tag => videoCategory[category].includes(tag))).slice(0, 3)
  return <section className="vet-place-panel vet-place-videos">
    <h2>Videos de Jorge</h2>
    {matches.length ? <><p className="mt-2 text-sm leading-6 text-slate-600">{linked.length ? 'Videos seleccionados para este lugar.' : `Más ideas de ${PLACE_CATEGORIES[category].label.toLowerCase()} en Tucson. Estos videos son de la categoría y no necesariamente de este lugar.`}</p><div className="vet-place-video-grid">{matches.map(video => <a key={video.id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block"><div className="relative aspect-video overflow-hidden rounded-xl bg-[#1b140d]"><Image src={video.thumbnailUrl} alt={video.thumbnailAlt} fill sizes="(max-width:767px) 90vw, (max-width:1279px) 30vw, 150px" className="object-cover"/><span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white"><span className="rounded-full bg-black/70 px-3 py-2" aria-hidden="true">▶</span></span></div><p className="mt-3 line-clamp-3 text-sm font-bold leading-5 group-hover:underline">{video.title}</p></a>)}</div></> : <p className="mt-4 leading-7 text-slate-600">Todavía no hay videos publicados de esta categoría.</p>}
    <Link href={`/videos?categoria=${encodeURIComponent(PLACE_CATEGORIES[category].label)}`} className="vet-text-link mt-5 text-sm">Explorar videos →</Link>
  </section>
}

export function PlaceReviews({place}: {place: SitePlaceDetail}) {
  return <section className="vet-place-panel vet-place-reviews">
    <h2>Opiniones de la gente</h2>
    <p className="mt-3 text-sm text-[#5e5e5e]"><span translate="no" className="whitespace-nowrap font-normal">Google Maps</span> · Reseñas ordenadas por relevancia por Google.</p>
    <div className="mt-5 space-y-4">{place.reviews.length ? place.reviews.map((review, i) => <article key={`${review.url}-${i}`} className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">{review.author.photoUri && <img src={review.author.photoUri} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full"/>}<div><p className="text-sm font-bold">{review.author.uri ? <a href={review.author.uri} target="_blank" rel="noopener noreferrer" className="underline">{review.author.displayName}</a> : review.author.displayName}</p><p className="mt-1 text-xs text-slate-500">{review.relativeDate || (review.publishedAt ? new Intl.DateTimeFormat('es-MX', {dateStyle: 'long', timeZone: 'America/Phoenix'}).format(new Date(review.publishedAt)) : '')}{review.rating ? ` · ${review.rating} / 5` : ''}</p></div></div>
      <PlaceReviewText text={review.text}/>
      {review.originalLanguageCode && review.languageCode && review.originalLanguageCode !== review.languageCode && <details className="mt-3 text-xs text-slate-500"><summary className="cursor-pointer">Traducida por Google · Ver original</summary><p className="mt-3 whitespace-pre-line leading-6">{review.originalText}</p></details>}
      <a href={review.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-[#764315] underline">Ver reseña en Google Maps ↗</a>
    </article>) : <p className="leading-7 text-slate-600">Google no proporcionó reseñas para mostrar aquí. Puedes consultar las opiniones en su ficha de Google Maps.</p>}</div>
    <p className="mt-5 text-xs leading-6 text-slate-500">Google proporciona una selección de hasta 5 reseñas, que puede incluir traducciones. Google no verifica las reseñas, pero busca y elimina contenido falso cuando lo identifica. <a className="underline" href="https://support.google.com/contributionpolicy/answer/7400114" target="_blank" rel="noopener noreferrer">Política de reseñas</a>.</p>
    <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="vet-text-link mt-4 text-sm">Ver todas en Google Maps ↗</a>
  </section>
}

export async function RelatedPlaces({id, category}: {id: string; category: PlaceCategory}) {
  const places = await getRelatedPlaces(id, category)
  if (!places.length) return null
  return <section className="mt-14"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="font-serif text-3xl font-bold">Otros lugares para explorar</h2><Link href={`/${category}`} className="vet-text-link text-sm">Ver {PLACE_CATEGORIES[category].label.toLowerCase()} →</Link></div><p className="mb-6 text-sm text-[#5e5e5e]">Información de <span translate="no" className="whitespace-nowrap font-normal">Google Maps</span></p><div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{places.map(place => <PlaceCard key={place.id} place={place} category={category}/>)}</div></section>
}
