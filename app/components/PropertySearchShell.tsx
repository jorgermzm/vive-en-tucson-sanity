'use client'

import {useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {WhatsAppIcon} from './WhatsAppIcon'

type SearchFilters = {
  minPrice: string
  maxPrice: string
  beds: string
  baths: string
  minSqft: string
  maxSqft: string
  propertyType: string
}

type MapVideo = {
  id: string
  title: string
  youtubeUrl: string
  thumbnailUrl: string
  duration: string
  publishedAt: string
}

const DEFAULT_FILTERS: SearchFilters = {
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
  minSqft: '',
  maxSqft: '',
  propertyType: '',
}

const EXACT_VIDEO_LOCATIONS: Record<string,string> = {
  'uhymFx81PjY': 'University Boulevard / University of Arizona',
  'RyiSxB6fFE0': 'Arizona History Museum',
  'l-wW2DGqeLA': 'Amelia’s Mexican Kitchen',
  'fXrKgmOOHRw': 'Little Anthony’s Diner',
  'sydzQihBegE': 'Downtown Tucson',
  'cknwHOrGGTQ': 'Madera Canyon',
  'rpr1n1Qlzw0': 'Aspen Draw Trail, Mt. Lemmon',
  'm_5n7bjIeZY': 'El Corral',
  'wj7KHz-4bVQ': 'Downtown Tucson',
  '4uOmnfHG1M0': 'Downtown Tucson',
  'wtid4NjIkiI': 'Arizona-Sonora Desert Museum',
  'I4qWzPCZKLs': 'Titan Missile Museum',
  'piSl5jGFaQM': 'Marana Pumpkin Patch',
  '7o5Yz8UzA5M': 'Old Tucson',
  '00xlRaZcbbk': 'Tucson Games & Gadgets',
}

function durationSeconds(duration:string){
  const match=duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if(!match)return 0
  return Number(match[1]||0)*3600+Number(match[2]||0)*60+Number(match[3]||0)
}

function videoLocation(video:MapVideo){
  if(EXACT_VIDEO_LOCATIONS[video.id])return EXACT_VIDEO_LOCATIONS[video.id]
  if(/tucson/i.test(video.title))return 'Downtown Tucson'
  return null
}

export function PropertySearchShell({whatsappUrl = 'https://wa.me/15203359349'}: {whatsappUrl?: string}) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'split' | 'map'>('split')
  const [saved, setSaved] = useState(false)
  const [videosVisible, setVideosVisible] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [videos, setVideos] = useState<MapVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<MapVideo | null>(null)

  useEffect(()=>{
    let active=true
    fetch('/api/youtube')
      .then(response=>response.ok?response.json():null)
      .then(data=>{
        if(!active||!data?.videos)return
        const longForm=(data.videos as MapVideo[])
          .filter(video=>durationSeconds(video.duration)>=240)
          .filter(video=>videoLocation(video))
        setVideos(longForm)
        setSelectedVideo(longForm[0]||null)
      })
      .catch(()=>{})
    return()=>{active=false}
  },[])

  const whatsapp = useMemo(() => {
    const text = [
      'Hola Jorge, estoy buscando casa en Tucson desde tu página.',
      query ? `Zona o búsqueda: ${query}.` : '',
      filters.minPrice ? `Precio mínimo: $${filters.minPrice}.` : '',
      filters.maxPrice ? `Precio máximo: $${filters.maxPrice}.` : '',
      filters.beds ? `Recámaras: ${filters.beds}+.` : '',
      filters.baths ? `Baños: ${filters.baths}+.` : '',
      filters.minSqft ? `Sqft mínimo: ${filters.minSqft}.` : '',
      filters.maxSqft ? `Sqft máximo: ${filters.maxSqft}.` : '',
      filters.propertyType ? `Tipo: ${filters.propertyType}.` : '',
    ].filter(Boolean).join(' ')

    const separator = whatsappUrl.includes('?') ? '&' : '?'
    return `${whatsappUrl}${separator}text=${encodeURIComponent(text)}`
  }, [filters, query, whatsappUrl])

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters(current => ({...current, [key]: value}))
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS)
    setQuery('')
  }

  const activeFilters = Object.values(filters).filter(Boolean).length + (query ? 1 : 0)

  return <div className="min-h-screen bg-[#f5f1e8] text-slate-900">
    <section className="border-b border-slate-200 bg-white">
      <div className="shell py-6 md:py-8">
        <p className="vet-eyebrow">Búsqueda de propiedades</p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-4xl font-black tracking-tight md:text-5xl">Casas en venta en Tucson</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Explora Tucson en el mapa, filtra tu búsqueda y descubre también los lugares donde se grabaron videos de Vive en Tucson.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSaved(value => !value)} className="min-h-11 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold transition hover:border-slate-500">{saved ? 'Búsqueda guardada' : 'Guardar búsqueda'}</button>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white"><WhatsAppIcon width={18} height={18}/>Contactar a Jorge</a>
          </div>
        </div>
      </div>
    </section>

    <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="shell py-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,2fr)_repeat(3,minmax(130px,1fr))_auto_auto]">
          <label className="relative">
            <span className="sr-only">Dirección, zona o código postal</span>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Dirección, zona o ZIP" className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-[#b8792d] lg:text-sm"/>
          </label>
          <select value={filters.beds} onChange={event => updateFilter('beds', event.target.value)} className="hidden h-12 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d] lg:block"><option value="">Recámaras</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
          <select value={filters.baths} onChange={event => updateFilter('baths', event.target.value)} className="hidden h-12 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d] lg:block"><option value="">Baños</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select>
          <select value={filters.propertyType} onChange={event => updateFilter('propertyType', event.target.value)} className="hidden h-12 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d] lg:block"><option value="">Tipo de propiedad</option><option>Casa</option><option>Townhome</option><option>Condo</option><option>Manufacturada</option><option>Terreno</option></select>
          <button type="button" onClick={()=>setFiltersOpen(value=>!value)} className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-black hover:bg-slate-50">Filtros{activeFilters ? ` (${activeFilters})` : ''}</button>
          <button type="button" onClick={() => setVideosVisible(value => !value)} aria-pressed={videosVisible} className={`h-12 rounded-xl border px-4 text-sm font-black transition ${videosVisible ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-600 text-[10px] font-black text-white">▶</span>{videosVisible ? 'Videos ON' : 'Videos OFF'}
          </button>
        </div>

        {filtersOpen && <div className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-[#fffdf9] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input value={filters.minPrice} onChange={e=>updateFilter('minPrice',e.target.value)} inputMode="numeric" placeholder="Precio mínimo" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"/>
          <input value={filters.maxPrice} onChange={e=>updateFilter('maxPrice',e.target.value)} inputMode="numeric" placeholder="Precio máximo" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"/>
          <select value={filters.beds} onChange={e=>updateFilter('beds',e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"><option value="">Recámaras</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
          <select value={filters.baths} onChange={e=>updateFilter('baths',e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"><option value="">Baños</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select>
          <input value={filters.minSqft} onChange={e=>updateFilter('minSqft',e.target.value)} inputMode="numeric" placeholder="Sqft mínimo" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"/>
          <input value={filters.maxSqft} onChange={e=>updateFilter('maxSqft',e.target.value)} inputMode="numeric" placeholder="Sqft máximo" className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"/>
          <select value={filters.propertyType} onChange={e=>updateFilter('propertyType',e.target.value)} className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-base lg:text-sm"><option value="">Tipo de propiedad</option><option>Casa</option><option>Townhome</option><option>Condo</option><option>Manufacturada</option><option>Terreno</option></select>
          <button type="button" onClick={clearFilters} className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-black hover:bg-slate-50">Limpiar filtros</button>
        </div>}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Casas</span>
          <button type="button" onClick={()=>setVideosVisible(value=>!value)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black ${videosVisible?'border-red-200 bg-red-50 text-red-700':'border-slate-300 bg-white text-slate-500'}`}>Videos</button>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">Restaurantes</span>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">Atracciones</span>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">Zonas</span>
        </div>
      </div>
    </section>

    <div className="shell py-4 md:py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Tucson, Arizona</p>
          <p className="text-xs text-slate-500">Propiedades IDX pendientes · videos reales de Vive en Tucson</p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
          <button type="button" onClick={() => setView('split')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'split' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Lista + mapa</button>
          <button type="button" onClick={() => setView('map')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'map' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Solo mapa</button>
        </div>
      </div>

      <div className={`grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${view === 'split' ? 'lg:grid-cols-[minmax(330px,38%)_1fr]' : 'grid-cols-1'}`}>
        {view === 'split' && <aside className="order-2 border-t border-slate-200 p-4 lg:order-1 lg:max-h-[720px] lg:overflow-y-auto lg:border-r lg:border-t-0 lg:p-5">
          {videosVisible && selectedVideo ? <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={selectedVideo.thumbnailUrl} alt="" className="aspect-video w-full object-cover"/>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-xs font-black text-white">▶</span>
                  <span className="text-xs font-black uppercase tracking-[.14em] text-red-700">Grabado aquí</span>
                </div>
                <h2 className="display-serif text-2xl font-black leading-tight">{selectedVideo.title}</h2>
                <p className="mt-2 text-sm font-semibold text-[#8b5b24]">{videoLocation(selectedVideo)}</p>
                <a href={selectedVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white">Ver video en YouTube</a>
              </div>
            </div>

            {videos.length>1 && <div className="mt-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[.14em] text-slate-500">Más videos en el mapa</p>
              <div className="grid gap-2">
                {videos.slice(0,8).map(video=><button key={video.id} type="button" onClick={()=>setSelectedVideo(video)} className={`flex min-h-16 items-center gap-3 rounded-xl border p-2 text-left transition ${selectedVideo.id===video.id?'border-[#b8792d] bg-[#fffaf0]':'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <img src={video.thumbnailUrl} alt="" className="h-14 w-20 rounded-lg object-cover"/>
                  <span className="min-w-0"><span className="line-clamp-2 block text-sm font-black leading-5">{video.title}</span><span className="mt-1 block text-xs text-slate-500">{videoLocation(video)}</span></span>
                </button>)}
              </div>
            </div>}
          </div> : <div>
            <div className="rounded-2xl border border-dashed border-[#b8792d80] bg-[#fffaf0] p-5">
              <span className="inline-flex rounded-full bg-[#b8792d1a] px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-[#8b5b24]">IDX pendiente</span>
              <h2 className="display-serif mt-4 text-3xl font-black">Aquí aparecerán las propiedades en tiempo real</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">En cuanto conectemos tu proveedor IDX/MLS, este panel mostrará los listings activos que correspondan al mapa y a tus filtros.</p>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#e9ab32]">Mientras conectamos el IDX</p>
              <h3 className="mt-2 text-xl font-black">Dime qué estás buscando</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Tus filtros se incluyen automáticamente para que Jorge sepa qué tipo de casa buscas.</p>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><WhatsAppIcon width={18} height={18}/>Enviar búsqueda a Jorge</a>
            </div>
          </div>}
        </aside>}

        <div className="relative order-1 min-h-[480px] bg-slate-100 sm:min-h-[560px] lg:order-2 lg:min-h-[720px]">
          <iframe
            title="Mapa de Tucson, Arizona"
            src="https://www.google.com/maps?q=Tucson%2C%20Arizona&z=11&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:left-4 md:top-4">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#8b5b24]">Mapa Vive en Tucson</p>
            <p className="mt-1 max-w-[280px] text-xs leading-5 text-slate-600">{videosVisible ? `${videos.length || 'Tus'} videos horizontales están activos en la capa de contenido. Los pines geográficos personalizados se activarán con Maps JS.` : 'La capa de videos está oculta. Puedes volver a activarla desde los filtros.'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
        <div><p className="font-black">¿Quieres aprender primero cómo comprar?</p><p className="mt-1 text-sm text-slate-600">La guía de compra seguirá disponible como contenido educativo aparte del buscador.</p></div>
        <Link href="/comprar" className="text-sm font-black text-[#8b5b24] underline decoration-[#e9ab32] underline-offset-4">Ver guía para comprar casa</Link>
      </div>
    </div>
  </div>
}
