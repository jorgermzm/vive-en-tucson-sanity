import Image from 'next/image'
import Link from 'next/link'
import {AREAS_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
const fallback='https://images.unsplash.com/photo-1584407593900-277920f8ee42?auto=format&fit=crop&w=1400&q=85'

export default async function AreasPage(){
  const {perspective,stega}=await getSanityFetchOptions()
  const {data:areas}=await sanityFetch({query:AREAS_QUERY,perspective,stega})
  return <main className="min-h-screen bg-sand/40 py-12"><div className="shell">
    <Link href="/" className="font-bold text-blue-600">← Inicio</Link>
    <h1 className="mt-6 text-5xl font-black">Zonas de Tucson</h1>
    <p className="mt-3 max-w-2xl text-slate-600">Explora cada zona y usa Sanity Studio para editar sus textos, imágenes, videos y relaciones.</p>
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {areas?.map((area)=>{
        const src=area.mainImage ? urlFor(area.mainImage).width(1000).height(650).fit('crop').url() : fallback
        return <Link key={area._id} href={`/zonas/${area.slug}`} className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="relative h-52"><Image src={src} alt={area.title || ''} fill className="object-cover" sizes="420px"/></div>
          <div className="p-5"><h2 className="text-2xl font-black">{area.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p></div>
        </Link>
      })}
    </div>
  </div></main>
}
