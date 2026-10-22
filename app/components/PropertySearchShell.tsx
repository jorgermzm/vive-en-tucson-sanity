'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'
import {WhatsAppIcon} from './WhatsAppIcon'

type SearchFilters = {
  minPrice: string
  maxPrice: string
  beds: string
  baths: string
  propertyType: string
}

const DEFAULT_FILTERS: SearchFilters = {
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
  propertyType: '',
}

export function PropertySearchShell({whatsappUrl = 'https://wa.me/15203359349'}: {whatsappUrl?: string}) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'split' | 'map'>('split')
  const [saved, setSaved] = useState(false)

  const whatsapp = useMemo(() => {
    const text = [
      'Hola Jorge, estoy buscando casa en Tucson desde tu página.',
      query ? `Zona o búsqueda: ${query}.` : '',
      filters.minPrice ? `Precio mínimo: $${filters.minPrice}.` : '',
      filters.maxPrice ? `Precio máximo: $${filters.maxPrice}.` : '',
      filters.beds ? `Recámaras: ${filters.beds}+.` : '',
      filters.baths ? `Baños: ${filters.baths}+.` : '',
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

  return <div className="min-h-screen bg-[#f5f1e8] text-slate-900">
    <section className="border-b border-slate-200 bg-white">
      <div className="shell py-8">
        <p className="vet-eyebrow">Búsqueda de propiedades</p>
        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-4xl font-black tracking-tight md:text-5xl">Casas en venta en Tucson</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Explora Tucson en el mapa. La interfaz ya está preparada para mostrar propiedades activas, precio, fotos, características y estatus en tiempo real cuando conectemos tu IDX/MLS.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSaved(value => !value)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold transition hover:border-slate-500">{saved ? 'Búsqueda guardada' : 'Guardar búsqueda'}</button>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white"><WhatsAppIcon width={18} height={18}/>Contactar a Jorge</a>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-white">
      <div className="shell py-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(260px,2fr)_repeat(5,minmax(110px,1fr))_auto]">
          <label className="relative">
            <span className="sr-only">Ciudad, zona o código postal</span>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ciudad, zona o ZIP" className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#b8792d]"/>
          </label>
          <input value={filters.minPrice} onChange={event => updateFilter('minPrice', event.target.value)} inputMode="numeric" placeholder="Precio mín." className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#b8792d]"/>
          <input value={filters.maxPrice} onChange={event => updateFilter('maxPrice', event.target.value)} inputMode="numeric" placeholder="Precio máx." className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#b8792d]"/>
          <select value={filters.beds} onChange={event => updateFilter('beds', event.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d]"><option value="">Recámaras</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
          <select value={filters.baths} onChange={event => updateFilter('baths', event.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d]"><option value="">Baños</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select>
          <select value={filters.propertyType} onChange={event => updateFilter('propertyType', event.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#b8792d]"><option value="">Tipo</option><option>Casa</option><option>Townhome</option><option>Condo</option><option>Manufacturada</option><option>Terreno</option></select>
          <button type="button" onClick={clearFilters} className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold hover:bg-slate-50">Limpiar</button>
        </div>
      </div>
    </section>

    <div className="shell py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Tucson, Arizona</p>
          <p className="text-xs text-slate-500">Feed de propiedades: pendiente de conexión IDX/MLS</p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
          <button type="button" onClick={() => setView('split')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'split' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Lista + mapa</button>
          <button type="button" onClick={() => setView('map')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'map' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Solo mapa</button>
        </div>
      </div>

      <div className={`grid min-h-[680px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ${view === 'split' ? 'lg:grid-cols-[minmax(330px,40%)_1fr]' : 'grid-cols-1'}`}>
        {view === 'split' && <aside className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-dashed border-[#b8792d80] bg-[#fffaf0] p-6">
            <span className="inline-flex rounded-full bg-[#b8792d1a] px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-[#8b5b24]">IDX pendiente</span>
            <h2 className="display-serif mt-4 text-3xl font-black">Aquí aparecerán las propiedades en tiempo real</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">En cuanto conectemos tu proveedor IDX/MLS, este panel mostrará los listings activos que correspondan al mapa y a tus filtros, sin tener que rehacer esta pantalla.</p>
            <div className="mt-5 grid gap-3">
              {['Foto principal y precio', 'Dirección y MLS ID', 'Recámaras, baños y sqft', 'Estatus y fecha de actualización', 'Botón “Me interesa” con tu contacto'].map(item => <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">{item}</div>)}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#e9ab32]">Mientras conectamos el IDX</p>
            <h3 className="mt-2 text-xl font-black">Dime qué estás buscando</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Tus filtros se incluyen automáticamente en el mensaje para que Jorge sepa qué tipo de casa buscas.</p>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><WhatsAppIcon width={18} height={18}/>Enviar búsqueda a Jorge</a>
          </div>
        </aside>}

        <div className="relative min-h-[680px] bg-slate-100">
          <iframe
            title="Mapa de Tucson, Arizona"
            src="https://www.google.com/maps?q=Tucson%2C%20Arizona&z=11&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#8b5b24]">Mapa activo</p>
            <p className="mt-1 max-w-[250px] text-xs leading-5 text-slate-600">Los pines de propiedades se activarán al conectar el feed IDX.</p>
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
