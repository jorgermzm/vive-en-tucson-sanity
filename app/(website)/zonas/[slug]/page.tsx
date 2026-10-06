import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {AREA_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'

type CmsImageValue={asset?:unknown;alt?:string|null}
type AreaDetail={_id:string;title?:string|null;slug?:string|null;summary?:string|null;mainImage?:CmsImageValue|null;highlights?:string[]|null;housingTypes?:string[]|null}

function areaImage(image:CmsImageValue|null|undefined){
  if(!image?.asset)return null
  try{return urlFor(image).width(1800).height(900).fit('crop').url()}catch{return null}
}

export default async function AreaPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:AREA_QUERY,params:{slug},perspective,stega})
  const area=data as AreaDetail|null
  if(!area)notFound()
  const src=areaImage(area.mainImage)
  return <main className="min-h-screen bg-white">
    <div className="relative h-[420px] bg-slate-300">
      {src?<Image src={src} alt={area.mainImage?.alt||area.title||''} fill priority className="object-cover" sizes="100vw"/>:<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#cbdde1] to-[#d6c3ad] text-sm font-bold uppercase tracking-[.2em] text-navy/45">Sube la imagen principal en Sanity</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent"/>
      <div className="shell absolute inset-x-0 bottom-10 text-white"><Link href="/zonas" className="text-sm font-bold text-white/85">← Todas las zonas</Link><h1 className="mt-3 text-5xl font-black">{area.title}</h1><p className="mt-3 max-w-2xl text-lg text-white/90">{area.summary}</p></div>
    </div>
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1.3fr_.7fr]">
      <section><h2 className="text-3xl font-black">Conoce {area.title}</h2><p className="mt-4 leading-8 text-slate-700">{area.summary}</p><div className="mt-8 rounded-2xl bg-sand p-6"><h3 className="text-xl font-black">Puntos a explorar</h3><ul className="mt-4 space-y-3">{(area.highlights||['Agrega lugares, servicios y recorridos desde Sanity Studio']).map((item)=><li key={item}>✓ {item}</li>)}</ul></div></section>
      <aside className="rounded-2xl bg-blue-50 p-6"><h3 className="text-xl font-black">Tipos de vivienda</h3><ul className="mt-4 space-y-3 text-sm">{(area.housingTypes||['Casas unifamiliares']).map((item)=><li key={item}>⌂ {item}</li>)}</ul><Link href="/contacto" className="mt-7 inline-block rounded-xl bg-green px-5 py-3 font-extrabold text-white">Quiero conocer esta zona</Link></aside>
    </div>
  </main>
}
