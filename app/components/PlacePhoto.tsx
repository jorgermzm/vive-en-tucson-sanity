'use client'

import {useState} from 'react'
import Link from 'next/link'
import type {SitePlace} from '@/lib/places'

export function PlacePhoto({place, href}: {place: SitePlace; href?: string}) {
  const [failed, setFailed] = useState(false)
  const photo = place.photo
  const image = <div className="aspect-[3/2] overflow-hidden bg-sand">
      {photo && !failed
        // Google photos must bypass the Next image optimizer and its persistent cache.
        ? <img src={photo.url} alt={place.name} width={800} height={533} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-cover"/>
        : <div className="flex h-full items-center justify-center text-sm text-slate-600">Foto no disponible</div>}
    </div>
  return <figure>
    {href ? <Link href={href} prefetch={false} aria-label={`Ver ficha de ${place.name}`} className="block">{image}</Link> : image}
    {photo && !failed && <figcaption className="space-y-1 px-5 pt-3 text-xs text-slate-600">
      {photo.authors.map((author, index) => <div key={`${author.displayName}-${index}`} className="flex items-center gap-2">
        {author.photoUri && <img src={author.photoUri} alt="" width={20} height={20} loading="lazy" referrerPolicy="no-referrer" className="h-5 w-5 rounded-full"/>}
        <span>Foto: {author.uri ? <a className="underline" href={author.uri} target="_blank" rel="noopener noreferrer">{author.displayName}</a> : author.displayName}</span>
      </div>)}
      <a className="inline-block underline" href={photo.googleMapsUri || place.mapsUrl} target="_blank" rel="noopener noreferrer">Ver foto en Google Maps</a>
    </figcaption>}
  </figure>
}
