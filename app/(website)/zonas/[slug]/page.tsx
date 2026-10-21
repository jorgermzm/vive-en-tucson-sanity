import type {Metadata} from 'next'
import Image from 'next/image'
import {PortableText, type PortableTextBlock} from 'next-sanity'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {AREA_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
import sources from '@/content/area-sources.json'
import {getSiteVideos} from '@/lib/videos'
import {VideoCard} from '@/app/components/VideoCard'
import {AREA_LINKS} from '@/lib/site-navigation'

type CmsImageValue={asset?:unknown;alt?:string|null}
type AreaDetail={description?:PortableTextBlock[];gallery?:Array<CmsImageValue & {_key:string}>;_id:string;title?:string|null;slug?:string|null;summary?:string|null;mainImage?:CmsImageValue|null;highlights?:string[]|null;housingTypes?:string[]|null}

function areaImage(image:CmsImageValue|null|undefined){
  if(!image?.asset)return null
  try{return urlFor(image).width(1800).height(900).fit('crop').url()}catch{return null}
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params
  const area=await client.fetch<AreaDetail|null>(AREA_QUERY,{slug}).catch(()=>null)
  if(!area){
    const destination=AREA_LINKS.find(item=>item.slug===slug)
    return destination?{title:`${destination.label} | Vivir en Tucson`,description:`Conversa con Jorge sobre tu búsqueda en ${destination.label}.`,alternates:{canonical:`/zonas/${slug}`}}:{}
  }
  const title=`${area.title}: vivir, qué hacer y vivienda en Tucson`
  const description=(area.summary||`Guía en español de ${area.title}, Tucson: estilo de vida, lugares para explorar, videos y tipos de vivienda.`).slice(0,160)
  const image=areaImage(area.mainImage)
  return {title,description,alternates:{canonical:`/zonas/${slug}`},openGraph:{title,description,type:'article',...(image?{images:[{url:image,alt:area.mainImage?.alt||area.title||''}]}:{})}}
}

export default async function AreaPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:AREA_QUERY,params:{slug},perspective,stega})
  const area=data as AreaDetail|null
  if(!area){
    const destination=AREA_LINKS.find(item=>item.slug===slug)
    if(!destination)notFound()
    return <main className="vet-catalog min-h-[70svh] py-16"><div className="shell">
      <Link href="/zonas" className="vet-text-link">← Todas las zonas</Link>
      <div className="vet-catalog-intro"><p className="vet-eyebrow">Vivir en Tucson</p><h1 className="display-serif mt-4 text-4xl font-bold sm:text-6xl">{destination.label}</h1><span className="vet-rule"/>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">¿Estás considerando {destination.label}? Cuéntame qué buscas en tu próxima zona y conversemos sobre tus opciones.</p>
        <Link href="/#contacto" className="vet-button vet-button-gold mt-8">Hablar con Jorge sobre esta zona</Link>
      </div>
    </div></main>
  }
  const {videos}=await getSiteVideos()
  const relatedVideos=videos.filter(video=>video.areas.some(item=>item.slug===slug))
  const src=areaImage(area.mainImage)
  const references=sources.find(item=>item.id===area._id)?.sources||[]
  const base='https://www.vive-tucson.com'
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'Place','@id':`${base}/zonas/${slug}#place`,name:area.title,description:area.summary,address:{'@type':'PostalAddress',addressLocality:'Tucson',addressRegion:'AZ',addressCountry:'US'}},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Inicio',item:base},
      {'@type':'ListItem',position:2,name:'Zonas de Tucson',item:`${base}/zonas`},
      {'@type':'ListItem',position:3,name:area.title,item:`${base}/zonas/${slug}`},
    ]}
  ]}
  return <main className="min-h-screen bg-white">
    <div className="relative h-[420px] bg-slate-300">
      {src?<Image src={src} alt={area.mainImage?.alt||area.title||''} fill priority className="editorial-photo object-cover" sizes="100vw"/>:<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#cbdde1] to-[#d6c3ad] text-sm font-bold uppercase tracking-[.2em] text-navy/45">Sube la imagen principal en Sanity</div>}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent"/>
      <div className="shell absolute inset-x-0 bottom-10 text-white"><Link href="/zonas" className="text-sm font-bold text-white/85">← Todas las zonas</Link><h1 className="mt-3 text-5xl font-black">{area.title}</h1><p className="mt-3 max-w-2xl text-lg text-white/90">{area.summary}</p></div>
    </div>
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1.3fr_.7fr]">
      <section><h2 className="text-3xl font-black">¿Cómo es {area.title}?</h2><div className="area-description mt-4 leading-8 text-slate-700">{area.description?.length?<PortableText value={area.description}/>:<p>{area.summary}</p>}</div><div className="mt-8 rounded-2xl bg-sand p-6"><h3 className="text-xl font-black">¿Qué puedes explorar en {area.title}?</h3><ul className="mt-4 space-y-3">{(area.highlights||['Consulta lugares, servicios y recorridos relacionados con esta zona.']).map((item)=><li key={item}>✓ {item}</li>)}</ul></div></section>
      <aside className="rounded-2xl bg-blue-50 p-6"><h3 className="text-xl font-black">¿Qué tipos de vivienda hay en {area.title}?</h3><ul className="mt-4 space-y-3 text-sm">{(area.housingTypes||['Casas unifamiliares']).map((item)=><li key={item}>⌂ {item}</li>)}</ul><p className="mt-5 text-sm leading-6 text-slate-600">La disponibilidad y los precios cambian con frecuencia. Si estás comparando zonas para comprar casa, revisa opciones actuales antes de tomar una decisión.</p><Link href="/contacto" className="mt-7 inline-block rounded-xl bg-green px-5 py-3 font-extrabold text-white">Quiero conocer esta zona</Link></aside>
    </div>
    <div className="shell pb-10"><div className="grid gap-4 sm:grid-cols-2">{area.gallery?.map(photo=>{const src=areaImage(photo);return src?<figure key={photo._key}><div className="relative aspect-[2/1] overflow-hidden rounded-xl"><Image src={src} alt={photo.alt||area.title||''} fill sizes="(max-width:640px) 100vw,50vw" className="editorial-photo object-cover"/></div><figcaption className="mt-2 text-xs text-slate-600">{photo.alt}</figcaption></figure>:null})}</div><div className="mt-4 flex flex-wrap gap-4 text-xs underline"><Link href="/creditos">Créditos de fotografías</Link>{references.map((url,index)=><a key={url} href={url}>Fuente local {index+1}</a>)}</div></div>
    {relatedVideos.length>0&&<section className="shell pb-12"><h2 className="display-serif mb-6 text-3xl font-black">Videos de {area.title}</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedVideos.map(video=><VideoCard key={video.id} video={video}/>)}</div></section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  </main>
}
