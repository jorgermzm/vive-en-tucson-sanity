'use client'

import {useId, useState} from 'react'

export function PlaceReviewText({text}: {text: string}) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()
  const long = text.length > 240
  return <div className="mt-4">
    <p id={id} className={`whitespace-pre-line text-sm leading-7 text-slate-600 ${long && !expanded ? 'line-clamp-4' : ''}`}>{text}</p>
    {long && <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)} className="mt-2 text-xs font-bold text-[#764315] underline">{expanded ? 'Leer menos' : 'Leer reseña completa'}</button>}
  </div>
}
