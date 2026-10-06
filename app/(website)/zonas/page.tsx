import Image from 'next/image'
import Link from 'next/link'
import {AREAS_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'

type CmsImageValue={asset?:unknown;alt?:string|null}
type AreaCard={_id:string;title?:string|null;slug?:string|null;summary?:string|null;mainImage?:CmsImageValue|null}

function areaImage(image:CmsImageValue|null|undefined){
  if(!image?.asset)return null
  try{return urlFor(image).width(1200).height(760).fit('crop').url()}catch{return null}
}

export default async function AreasPage(){
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:AREAS_QUERY,perspective,stega})
  const areas=(Array.isArray(data)?data:[]) as AreaCard[]
  return <main className="min-h-screen bg-sand/40 py-12"><div className="shell">
    <Link href="/" className="font-bold text-blue-600">← Inicio</Link>
    <h1 className="mt-6 text-5xl font-black">Zonas de Tucson</h1>
    <p className="mt-3 max-w-2xl text-slate-600">Cada imagen de zona se administra directamente desde Sanity Studio.</p>
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map((area)=>{const src=areaImage(area.mainImage);return <Link key={area._id} href={`/zonas/${area.slug}`} className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="relative h-52 bg-slate-200">{src?<Image src={src} alt={area.mainImage?.alt||area.title||''} fill className="object-cover" sizes="420px"/>:<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#dbe7ea] to-[#e5d6c5] px-6 text-center text-xs font-bold uppercase tracking-[.15em] text-navy/45">Sube la imagen de esta zona en Sanity</div>}</div>
        <div className="p-5"><h2 className="text-2xl font-black">{area.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p></div>
      </Link>})}
    </div>
  </div></main>
}
