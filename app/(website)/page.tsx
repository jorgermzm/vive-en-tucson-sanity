import Image from 'next/image'
import Link from 'next/link'
import {HOME_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'

const heroFallback='https://images.unsplash.com/photo-1697933804242-aa8278a54d08?auto=format&fit=crop&w=2200&q=85'
const downtownFallback='https://images.unsplash.com/photo-1572766862815-14bce94d081c?auto=format&fit=crop&w=1400&q=85'
const desertFallback='https://images.unsplash.com/photo-1584407593900-277920f8ee42?auto=format&fit=crop&w=1400&q=85'
const buildingFallback='https://images.unsplash.com/photo-1589399517000-0c8a5be8fcb4?auto=format&fit=crop&w=1400&q=85'
type AreaCard = {
  _key?: string
  _id?: string
  title?: string | null
  slug?: string | null
  summary?: string | null
  mainImage?: unknown
  housingTypes?: string[] | null
  highlights?: string[] | null
}

type FeaturedVideo = {
  _key?: string
  _id?: string
  title?: string | null
  slug?: string | null
  summary?: string | null
  youtubeUrl?: string | null
  thumbnail?: unknown
}

type HomePayload = {
  settings?: {
    agentName?: string | null
    phone?: string | null
    whatsappUrl?: string | null
  } | null
  home?: {
    heroTitle?: string | null
    heroSubtitle?: string | null
    heroDescription?: string | null
    heroImage?: unknown
    featuredAreas?: AreaCard[] | null
    featuredVideos?: FeaturedVideo[] | null
  } | null
}

const areaFallbacks:Record<string,string>={
  'downtown-tucson':downtownFallback,'oro-valley':desertFallback,'marana':heroFallback,
  'dove-mountain':desertFallback,'northwest-tucson':heroFallback,'sahuarita':desertFallback,
}
const demoProperties=[
  {price:'$275,000',type:'Condominio moderno',beds:2,baths:2,sqft:'1,050 sqft',image:buildingFallback},
  {price:'$349,000',type:'Loft estilo industrial',beds:1,baths:1,sqft:'1,200 sqft',image:downtownFallback},
  {price:'$425,000',type:'Casa histórica remodelada',beds:3,baths:2,sqft:'1,680 sqft',image:desertFallback},
  {price:'$510,000',type:'Townhome moderno',beds:3,baths:3,sqft:'1,950 sqft',image:heroFallback},
]
function sanityImage(image:unknown,fallback:string,width=1400){
  if(!image)return fallback
  try{return urlFor(image).width(width).height(Math.round(width*.65)).fit('crop').url()}catch{return fallback}
}

export default async function HomePage(){
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:HOME_QUERY,perspective,stega})
  const content=data as HomePayload | null
  const settings=content?.settings
  const home=content?.home
  const phone=settings?.phone || '520-335-9349'
  const whatsapp=settings?.whatsappUrl || 'https://wa.me/15203359349'
  const areas=home?.featuredAreas?.filter(Boolean) || []
  const heroImage=sanityImage(home?.heroImage,heroFallback,2200)
  const featuredArea=areas.find((a)=>a?.slug==='downtown-tucson') || areas[0]
  const featuredVideo=home?.featuredVideos?.[0]

  return <main className="min-h-screen bg-white">
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="shell flex h-[74px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-black text-navy">
          <span className="text-3xl text-green">♆</span>
          <span className="leading-none">
            <span className="block text-xl tracking-tight">VIVE EN TUCSON</span>
            <span className="mt-1 block text-[11px] font-semibold tracking-normal text-slate-600">Con {settings?.agentName || 'Jorge Ramirez'}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <Link href="/">Inicio</Link><Link href="#zonas">Zonas de Tucson</Link><Link href="/comprar">Comprar</Link>
          <Link href="/vender">Vender</Link><Link href="/videos">Videos</Link><Link href="/sobre-jorge">Sobre Jorge</Link><Link href="/contacto">Contacto</Link>
        </nav>
        <a href={whatsapp} className="rounded-xl bg-green px-4 py-3 text-sm font-extrabold text-white shadow-card">WhatsApp {phone}</a>
      </div>
    </header>

    <section className="relative isolate min-h-[480px] overflow-hidden">
      <Image src={heroImage} alt="Tucson, Arizona" fill priority className="object-cover" sizes="100vw"/>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/5"/>
      <div className="shell relative z-10 flex min-h-[480px] items-center py-16">
        <div className="max-w-3xl text-white">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.28em] text-sun">Vive Tucson con contexto local</p>
          <h1 className="text-5xl font-black leading-[.95] tracking-tight sm:text-6xl lg:text-7xl">
            {home?.heroTitle || 'CONOCE TUCSON'}<span className="mt-2 block text-sun">{home?.heroSubtitle || 'ANTES DE COMPRAR CASA'}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/90">
            {home?.heroDescription || 'Videos, zonas, precios y la experiencia local que necesitas para tomar una mejor decisión en Tucson, Arizona.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/videos" className="rounded-xl border border-white/80 bg-navy/80 px-6 py-3 font-extrabold text-white">▶ Ver Videos</Link>
            <Link href="#propiedades" className="rounded-xl bg-white px-6 py-3 font-extrabold text-navy">⌂ Buscar casas en Tucson</Link>
          </div>
        </div>
      </div>
    </section>

    <section id="zonas" className="shell py-8 sm:py-10">
      <div className="flex items-end justify-between gap-6">
        <div><h2 className="text-3xl font-black tracking-tight text-navy">Zonas Populares en Tucson</h2>
        <p className="mt-1 text-sm text-slate-600">Explora áreas para vivir en Tucson con información, videos y propiedades.</p></div>
        <Link href="/zonas" className="hidden text-sm font-bold text-blue-600 sm:block">Ver todas las zonas →</Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {areas.map((area,index)=>{
          if(!area?.slug)return null
          const img=sanityImage(area.mainImage,areaFallbacks[area.slug] || desertFallback,800)
          return <Link key={area._key || area._id || index} href={`/zonas/${area.slug}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1">
            <div className="relative h-28"><Image src={img} alt={area.title || 'Zona de Tucson'} fill className="object-cover" sizes="240px"/></div>
            <div className="p-4"><h3 className="font-black text-navy">{area.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{area.summary}</p></div>
          </Link>
        })}
      </div>
    </section>

    <section id="video-destacado" className="editorial-grid border-y border-slate-100 bg-sand/70 py-10">
      <div className="shell grid gap-8 lg:grid-cols-[1.35fr_.95fr] lg:items-center">
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl shadow-card">
          <Image src={sanityImage(featuredVideo?.thumbnail || featuredArea?.mainImage,downtownFallback,1400)} alt={featuredVideo?.title || 'Downtown Tucson'} fill className="object-cover" sizes="(max-width:1024px) 100vw,60vw"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
          <div className="absolute left-7 top-6 max-w-[70%] text-5xl font-black leading-none text-sun">Aquí empezó<br/>Tucson</div>
          <div className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-3xl text-white shadow-xl">▶</span></div>
        </div>
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">Zona destacada</span>
          <h2 className="mt-4 text-4xl font-black tracking-tight">{featuredArea?.title || 'Downtown Tucson'}</h2>
          <p className="mt-4 leading-7 text-slate-700">{featuredArea?.summary || 'Downtown Tucson es el corazón de la ciudad: cultura, historia, restaurantes, arte, vida nocturna y un ambiente urbano muy particular.'}</p>
          <p className="mt-4 leading-7 text-slate-700">En este espacio conectamos tus videos con información útil de cada zona para que la página funcione como una guía local, no solo como un portal inmobiliario.</p>
          <a href={featuredVideo?.youtubeUrl || '/videos'} className="mt-6 inline-flex rounded-xl bg-navy px-5 py-3 font-extrabold text-white">▶ Ver video completo</a>
        </div>
      </div>
    </section>

    <section id="propiedades" className="shell grid gap-6 py-8 lg:grid-cols-[.75fr_1.55fr]">
      <aside className="rounded-2xl bg-blue-50 p-6 shadow-card">
        <h3 className="text-xl font-black">⌂ ¿Qué tipo de casas encuentras en {featuredArea?.title || 'Downtown Tucson'}?</h3>
        <ul className="mt-5 space-y-3 text-sm text-slate-700">
          {(featuredArea?.housingTypes?.length ? featuredArea.housingTypes : ['Condominios modernos','Lofts con estilo urbano','Townhomes','Casas históricas remodeladas','Opciones para inversión']).map((item)=><li key={item} className="flex gap-3"><span className="font-black text-green">✓</span>{item}</li>)}
        </ul>
        <p className="mt-5 text-sm font-bold text-navy">Las propiedades mostradas a la derecha son ejemplos visuales hasta conectar IDX/MLS.</p>
      </aside>
      <div>
        <div className="flex items-center justify-between"><h3 className="text-xl font-black">⌂ Casas actualmente en venta en {featuredArea?.title || 'Downtown Tucson'}</h3><span className="text-xs font-bold uppercase tracking-wide text-amber-700">Demo · IDX pendiente</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {demoProperties.map((p)=><article key={p.price} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <div className="relative h-40"><Image src={p.image} alt={p.type} fill className="object-cover" sizes="320px"/></div>
            <div className="p-4"><p className="text-lg font-black">{p.price}</p><p className="mt-1 text-sm font-bold">{p.type}</p><p className="mt-3 text-xs text-slate-600">{p.beds} rec · {p.baths} baños · {p.sqft}</p><p className="mt-2 text-xs text-slate-500">Downtown Tucson, AZ</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-navy py-8 text-white">
      <div className="absolute inset-0 opacity-20"><Image src={heroFallback} alt="" fill className="object-cover" sizes="100vw"/></div>
      <div className="shell relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div><h3 className="text-2xl font-black">¿Te gustaría conocer Downtown Tucson en persona?</h3><p className="mt-2 max-w-2xl text-sm text-white/85">Ya sea que quieras hacer un recorrido, conocer opciones disponibles o resolver preguntas, aquí puedes contactarme.</p></div>
        <div className="flex flex-wrap gap-3"><a href={whatsapp} className="rounded-xl bg-green px-5 py-3 font-extrabold">WhatsApp {phone}</a><a href={`tel:${phone.replace(/[^0-9]/g,'')}`} className="rounded-xl bg-white px-5 py-3 font-extrabold text-navy">☎ Llámame {phone}</a></div>
      </div>
    </section>

    <section className="shell py-10">
      <h2 className="text-3xl font-black">Más formas de explorar Tucson</h2><p className="mt-1 text-sm text-slate-600">Recursos, videos y guías para ayudarte en cada paso.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          {title:'Más videos de Tucson',body:'Recorridos, consejos, zonas, estilo de vida y mucho más en mi canal.',href:'/videos',image:downtownFallback},
          {title:'Comprar casa en Tucson',body:'Guías, consejos y propiedades para encontrar la casa ideal en Tucson.',href:'/comprar',image:desertFallback},
          {title:'Vender tu casa',body:'Estrategia, análisis de mercado y promoción para obtener el mejor resultado.',href:'/vender',image:heroFallback},
        ].map((card)=><Link key={card.title} href={card.href} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="relative h-36"><Image src={card.image} alt={card.title} fill className="object-cover" sizes="400px"/></div>
          <div className="p-5"><h3 className="text-xl font-black">{card.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p><p className="mt-4 text-sm font-extrabold text-blue-600">Explorar →</p></div>
        </Link>)}
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-slate-50 py-8"><div className="shell flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"><p>© Vive en Tucson · {settings?.agentName || 'Jorge Ramirez'}</p><div className="flex gap-5"><Link href="/studio">Sanity Studio</Link><Link href="/contacto">Contacto</Link></div></div></footer>
  </main>
}
