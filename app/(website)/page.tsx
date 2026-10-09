import Image from 'next/image'
import {ProfileFacts} from '@/app/components/ProfileFacts'
import Link from 'next/link'
import {HOME_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'

type CmsImageValue={
  asset?:unknown
  alt?:string|null
  crop?:unknown
  hotspot?:unknown
}

type AreaCard={
  _key?:string
  _id?:string
  title?:string|null
  slug?:string|null
  summary?:string|null
  mainImage?:CmsImageValue|null
  housingTypes?:string[]|null
  highlights?:string[]|null
}

type FeaturedVideo={
  isDemo?:boolean
  _key?:string
  _id?:string
  title?:string|null
  slug?:string|null
  summary?:string|null
  youtubeUrl?:string|null
  thumbnail?:CmsImageValue|null
}

type InspirationItem={
  _key:string
  title?:string|null
  subtitle?:string|null
  icon?:string|null
  href?:string|null
  image?:CmsImageValue|null
}

type PropertyItem={
  _key:string
  price?:string|null
  propertyType?:string|null
  bedrooms?:number|null
  bathrooms?:number|null
  size?:string|null
  location?:string|null
  image?:CmsImageValue|null
}

type StoryItem={
  _key:string
  title?:string|null
  tag?:string|null
  href?:string|null
  image?:CmsImageValue|null
}

type HomePayload={
  settings?:{
    agentBio?:string|null
    areasServed?:string|null
    languages?:string|null
    specialties?:string|null
    responseTime?:string|null
    agentName?:string|null
    phone?:string|null
    whatsappUrl?:string|null
    logo?:CmsImageValue|null
    agentPhoto?:CmsImageValue|null
  }|null
  home?:{
    heroTitle?:string|null
    heroSubtitle?:string|null
    heroDescription?:string|null
    heroImage?:CmsImageValue|null
    inspirationItems?:InspirationItem[]|null
    featuredAreas?:AreaCard[]|null
    featuredVideos?:FeaturedVideo[]|null
    videoGallery?:Array<CmsImageValue&{_key:string}>|null
    propertyShowcase?:PropertyItem[]|null
    contactBackgroundImage?:CmsImageValue|null
    storyCards?:StoryItem[]|null
    aboutImage?:CmsImageValue|null
  }|null
}

const defaultInspiration=[
  {title:'Restaurantes',subtitle:'Sabores únicos',icon:'🍴',href:'/videos'},
  {title:'Hiking y Outdoors',subtitle:'Naturaleza increíble',icon:'△',href:'/zonas'},
  {title:'Familia',subtitle:'Planes para todos',icon:'◉',href:'/zonas'},
  {title:'Museos',subtitle:'Historia y cultura',icon:'⌂',href:'/videos'},
  {title:'Nightlife',subtitle:'Bares y vida nocturna',icon:'♫',href:'/videos'},
  {title:'Eventos',subtitle:'Festivales y conciertos',icon:'▣',href:'/videos'},
  {title:'Shopping',subtitle:'Tiendas y mercados',icon:'▢',href:'/zonas'},
]

const defaultStories=[
  {title:'Las 10 mejores rutas de hiking en Tucson',tag:'OUTDOORS',href:'/zonas'},
  {title:'Dónde comer en Tucson: lugares que no te puedes perder',tag:'GASTRONOMÍA',href:'/videos'},
  {title:'Tucson vs Phoenix: ¿Cuál es mejor para ti?',tag:'VIVIR EN TUCSON',href:'/comprar'},
  {title:'Guía para comprar tu primera casa en Tucson',tag:'REAL ESTATE',href:'/comprar'},
  {title:'Eventos imperdibles en Tucson este año',tag:'EVENTOS',href:'/videos'},
]


const living=[
  ['⌂','Costo de vida'],['☀','Clima'],['▱','Escuelas'],['▰','Transporte'],['▦','Trabajo y economía'],
  ['◇','Mejores zonas'],['◈','Seguridad'],['⊕','Salud'],['⇄','Tucson vs Phoenix'],['✈','Mudarse a Tucson'],
]

function imageUrl(image:CmsImageValue|null|undefined,width:number,height:number){
  if(!image?.asset)return null
  try{return urlFor(image).width(width).height(height).fit('crop').url()}catch{return null}
}

function CmsImage({
  value,
  alt,
  sizes,
  className='object-cover',
  priority=false,
  placeholder='Sube una imagen en Sanity',
}:{
  value?:CmsImageValue|null
  alt:string
  sizes:string
  className?:string
  priority?:boolean
  placeholder?:string
}){
  const src=imageUrl(value,1800,1100)
  if(!src){
    return <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#dbe7ea] via-[#f5eee5] to-[#d8cab7] px-5 text-center text-xs font-bold uppercase tracking-[.18em] text-navy/45">{placeholder}</div>
  }
  return <Image src={src} alt={value?.alt||alt} fill priority={priority} className={`editorial-photo ${className}`} sizes={sizes}/>
}

export default async function HomePage(){
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:HOME_QUERY,perspective,stega})
  const content=data as HomePayload|null
  const settings=content?.settings
  const home=content?.home
  const phone=settings?.phone||'520-335-9349'
  const whatsapp=settings?.whatsappUrl||'https://wa.me/15203359349'
  const areas=(home?.featuredAreas||[]).filter((area):area is AreaCard=>Boolean(area?.slug))
  const inspiration=(home?.inspirationItems?.length?home.inspirationItems:defaultInspiration.map((item,i)=>({...item,_key:`default-inspiration-${i}`}))) as InspirationItem[]
  const properties=home?.propertyShowcase||[]
  const stories=(home?.storyCards?.length?home.storyCards:defaultStories.map((item,i)=>({...item,_key:`default-story-${i}`}))) as StoryItem[]
  const featuredArea=areas.find((a)=>a.slug==='downtown-tucson')||areas[0]
  const featuredVideo=home?.featuredVideos?.find(video=>!video.isDemo && /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(video.youtubeUrl||''))
  const logoSrc=settings?.logo?.asset?urlFor(settings.logo).width(160).fit('max').url():null

  return <main className="min-h-screen bg-[#fffdf9] text-navy">
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="shell flex h-[72px] items-center justify-between gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {logoSrc?<div className="relative h-14 w-14"><Image src={logoSrc} alt={settings?.logo?.alt||'Vive en Tucson'} fill className="object-contain object-left" sizes="56px"/></div>:<>
            <span className="text-[30px] font-black text-green">♆</span>
            <span className="leading-none"><span className="block text-lg font-black tracking-tight">VIVE EN TUCSON</span><span className="mt-1 block text-[10px] font-semibold text-slate-600">Con {settings?.agentName||'Jorge Ramirez'}</span></span>
          </>}
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] font-semibold xl:flex">
          <Link href="/" className="border-b-2 border-navy pb-2">Inicio</Link><Link href="#zonas">Zonas</Link><Link href="#inspirate">Qué hacer⌄</Link><Link href="#vivir">Vivir en Tucson⌄</Link><Link href="/comprar">Comprar⌄</Link><Link href="/vender">Vender⌄</Link><Link href="/videos">Videos</Link><Link href="#historias">Guías</Link><Link href="/sobre-jorge">Sobre Jorge</Link><Link href="/contacto">Contacto</Link>
        </nav>
        <a href={whatsapp} className="rounded-lg bg-[#149b62] px-4 py-2.5 text-sm font-extrabold text-white shadow-card">◉ {phone}</a>
      </div>
    </header>

    <section className="relative isolate min-h-[500px] overflow-hidden bg-navy">
      <CmsImage value={home?.heroImage} alt="Tucson, Arizona" sizes="100vw" priority placeholder="Hero · sube la imagen en Página de inicio"/>
      <div className="absolute inset-0 bg-gradient-to-r from-[#071a34]/90 via-[#0d2344]/55 to-transparent"/>
      <div className="shell relative z-10 flex min-h-[500px] items-center py-16">
        <div className="max-w-[760px] text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[.5em]">Descubre</p>
          <h1 className="display-serif text-[66px] font-black leading-[.92] tracking-[-.03em] sm:text-[82px]">Tucson</h1>
          <h2 className="display-serif mt-1 text-4xl font-bold leading-tight sm:text-5xl">como alguien que vive aquí</h2>
          <p className="mt-5 max-w-2xl text-base leading-6 text-white/95">{home?.heroDescription||'Explora zonas, conoce qué hacer, mira videos, descubre tu próximo vecindario y encuentra la casa ideal en Tucson, Arizona.'}</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/videos" className="rounded-lg border border-white/80 bg-navy/85 px-6 py-3 font-extrabold text-white">▶ Ver Videos</Link><Link href="#propiedades" className="rounded-lg bg-white px-6 py-3 font-extrabold text-navy shadow-lg">⌂ Buscar Casas en Tucson</Link></div>
        </div>
      </div>
    </section>

    <section id="inspirate" className="shell py-8">
      <div className="flex items-end justify-between gap-4"><div><h2 className="display-serif text-3xl font-black">Inspírate en Tucson</h2><p className="text-sm text-slate-600">Explora todo lo que hace especial a esta ciudad.</p></div><Link href="/videos" className="hidden text-xs font-bold text-blue-700 md:block">Ver todas las categorías →</Link></div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {inspiration.map((item)=><Link key={item._key} href={item.href||'/videos'} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-24 overflow-hidden"><CmsImage value={item.image} alt={item.title||'Categoría'} sizes="220px" className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.025]" placeholder="Imagen editable"/></div>
          <div className="relative px-3 pb-3 pt-5"><span className="absolute -top-4 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow">{item.icon||'•'}</span><h3 className="text-sm font-extrabold">{item.title}</h3><p className="mt-1 text-[11px] text-slate-500">{item.subtitle}</p></div>
        </Link>)}
      </div>
    </section>

    <section id="zonas" className="border-y border-slate-100 bg-[#fbf7f1] py-9">
      <div className="shell">
        <div className="flex items-end justify-between gap-4"><div><h2 className="display-serif text-3xl font-black">Explora Tucson por Zona</h2><p className="text-sm text-slate-600">Conoce cada zona, mira videos, descubre qué hacer y explora casas en venta.</p></div><Link href="/zonas" className="hidden text-xs font-bold text-blue-700 md:block">Ver todas las zonas →</Link></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((area,index)=>{const slug=area.slug as string;return <Link key={area._key||area._id||index} href={`/zonas/${slug}`} className="area-tile group relative min-h-[310px] overflow-hidden rounded-2xl bg-slate-200 shadow-card">
            <CmsImage value={area.mainImage} alt={area.title||'Zona de Tucson'} sizes="(max-width:768px) 100vw,50vw" className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.025]" placeholder="Imagen de zona · edítala en Sanity"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white"><h3 className="display-serif text-3xl font-black leading-none">{area.title}</h3><p className="mt-2 line-clamp-2 max-w-md text-sm text-white/85">{area.summary}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/95"><span>▶ Videos</span><span>⌖ Qué hacer</span><span>⌂ Casas en venta</span></div><span className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-black text-navy">›</span></div>
          </Link>})}
        </div>
      </div>
    </section>

    <section id="video-destacado" className="editorial-grid py-10">
      <div className="shell grid gap-8 lg:grid-cols-[1.25fr_.95fr] lg:items-center">
        <div className="relative min-h-[390px] overflow-hidden rounded-2xl bg-slate-200 shadow-card">
          <CmsImage value={featuredVideo?.thumbnail||featuredArea?.mainImage} alt={featuredVideo?.title||'Video destacado'} sizes="(max-width:1024px) 100vw,60vw" placeholder="Miniatura del video · edítala en Sanity"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"/><div className="absolute bottom-6 left-7 display-serif text-5xl font-black leading-[.9] text-white">{featuredVideo?'Recorre Tucson':'Descubre Downtown'}</div>{featuredVideo&&<a aria-label={`Ver ${featuredVideo.title}`} href={featuredVideo.youtubeUrl||'/videos'} className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-navy shadow-xl">▶</span></a>}
        </div>
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">{featuredVideo?'Video destacado':'Zona destacada'}</span><h2 className="display-serif mt-4 text-4xl font-black">{featuredArea?.title||'Downtown Tucson'}</h2><p className="mt-4 text-base leading-7 text-slate-700">{featuredArea?.summary||'Historia, cultura, arte, gastronomía y una vibra urbana incomparable.'}</p><a href={featuredVideo?.youtubeUrl||`/zonas/${featuredArea?.slug||'downtown-tucson'}`} className="mt-6 inline-flex rounded-lg bg-navy px-5 py-3 text-sm font-extrabold text-white">{featuredVideo?'▶ Ver video completo en YouTube →':'Explora Downtown Tucson →'}</a>
          <div className="mt-5 grid grid-cols-4 gap-2">{(home?.videoGallery||[]).slice(0,4).map((img)=><div key={img._key} className="relative aspect-[1.45] overflow-hidden rounded-lg bg-slate-200"><CmsImage value={img} alt={img.alt||'Galería'} sizes="56px" placeholder="Sube foto"/></div>)}</div>
        </div>
      </div>
    </section>

    <section id="vivir" className="shell grid gap-7 py-8 lg:grid-cols-[.8fr_1.2fr]">
      <aside className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-6 shadow-sm"><h2 className="display-serif text-3xl font-black">Vivir en Tucson</h2><p className="mt-1 text-sm text-slate-600">Todo lo que necesitas saber para tomar una mejor decisión.</p><div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">{living.map(([icon,label])=><div key={label} className="flex items-center gap-3 text-sm"><span className="w-5 text-center font-black">{icon}</span><span>{label}</span></div>)}</div><Link href="/comprar" className="mt-6 inline-flex rounded-lg bg-navy px-5 py-3 text-sm font-extrabold text-white">Ver guía completa →</Link></aside>
      <div id="propiedades">
        <div className="flex items-end justify-between gap-4"><div><h2 className="display-serif text-3xl font-black">Casas en Venta en Tucson</h2><p className="text-sm text-slate-600">Conoce el entorno y consulta conmigo las opciones disponibles.</p></div><span className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Referencias visuales · No son anuncios</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{properties.map((p)=><article key={p._key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="relative h-36 bg-slate-200"><CmsImage value={p.image} alt={p.propertyType||'Propiedad'} sizes="300px" placeholder="Foto editable en Sanity"/></div><div className="p-4"><p className="text-xs font-bold text-amber-800">Referencia visual · No está anunciada</p><p className="mt-1 text-xs font-bold">{p.propertyType}</p><p className="mt-3 text-[11px] text-slate-600">Consulta disponibilidad y precios actuales.</p><p className="mt-2 text-[11px] text-slate-500">⌖ {p.location}</p></div></article>)}</div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-navy py-7 text-white">
      {Boolean(home?.contactBackgroundImage?.asset)&&<div className="absolute inset-0 opacity-25"><CmsImage value={home?.contactBackgroundImage} alt="Tucson" sizes="100vw"/></div>}
      <div className="shell relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><h2 className="display-serif text-3xl font-black">¿Te gustaría conocer Tucson en persona?</h2><p className="mt-1 max-w-2xl text-sm text-white/90">Ya sea que quieras hacer un recorrido, conocer opciones disponibles o simplemente resolver tus preguntas, estoy aquí para ayudarte.</p></div><div className="flex flex-wrap gap-3"><a href={whatsapp} className="rounded-xl bg-green px-6 py-3 text-sm font-extrabold">◉ Envíame un WhatsApp<br/><span className="text-base">{phone}</span></a><a href={`tel:${phone.replace(/[^0-9]/g,'')}`} className="rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-navy">☎ Llámame<br/><span className="text-base">{phone}</span></a></div></div>
    </section>

    <section id="historias" className="shell py-9">
      <div className="flex items-end justify-between gap-4"><div><h2 className="display-serif text-3xl font-black">Historias, Guías y Consejos</h2><p className="text-sm text-slate-600">Artículos, videos y recursos para que conozcas más de Tucson.</p></div><Link href="/videos" className="hidden text-xs font-bold text-blue-700 md:block">Ver todas las guías →</Link></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{stories.map((story)=><Link key={story._key} href={story.href||'/videos'} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="relative h-32 overflow-hidden bg-slate-200"><CmsImage value={story.image} alt={story.title||'Guía'} sizes="300px" className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.025]" placeholder="Portada editable"/></div><div className="p-4"><h3 className="text-sm font-extrabold leading-5">{story.title}</h3><p className="mt-3 text-[10px] font-extrabold text-blue-700">{story.tag} →</p></div></Link>)}</div>
    </section>

    <section className="border-t border-slate-200 bg-[#f8f4ed] py-9">
      <div className="shell grid gap-7 lg:grid-cols-[1.05fr_1.4fr] lg:items-center">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-slate-200"><CmsImage value={settings?.agentPhoto||home?.aboutImage} alt={settings?.agentName||'Jorge Ramirez'} sizes="600px" placeholder="Foto de Jorge · edítala en Sanity"/></div>
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-slate-500">Hola, soy</p><h2 className="display-serif mt-1 text-4xl font-black">Jorge Ramírez</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">{settings?.agentBio}</p><ProfileFacts settings={settings}/><div className="mt-6 flex flex-wrap gap-3"><Link href="/sobre-jorge" className="rounded-lg bg-navy px-5 py-3 text-sm font-extrabold text-white">Conoce más sobre mí →</Link><Link href="/contacto" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold">Contáctame →</Link></div></div>
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-white py-6"><div className="shell flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© Vive en Tucson · {settings?.agentName||'Jorge Ramirez'}</p><div className="flex gap-5"><Link href="/creditos">Créditos de fotografías</Link><Link href="/studio">Sanity Studio</Link><Link href="/contacto">Contacto</Link></div></div></footer>
  </main>
}
