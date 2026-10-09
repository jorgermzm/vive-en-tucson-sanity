import Link from 'next/link'
import Image from 'next/image'
import {HOME_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
import {ProfileFacts} from '@/app/components/ProfileFacts'
import {notFound} from 'next/navigation'
const pages:Record<string,{title:string;body:string}>={
  comprar:{title:'Comprar casa en Tucson',body:'Guías y recursos para entender el proceso de compra en Tucson. Esta sección queda lista para crecer desde Sanity.'},
  vender:{title:'Vender tu casa',body:'Estrategia, preparación, precio y promoción para vender una propiedad en el mercado de Tucson.'},
  videos:{title:'Videos de Tucson',body:'Aquí conectaremos tus recorridos de YouTube con zonas, artículos y propiedades relacionadas.'},
  'sobre-jorge':{title:'Sobre Jorge',body:'Una presentación personal enfocada en tu conocimiento de Tucson y en cómo ayudas a compradores y vendedores.'},
  contacto:{title:'Contacto',body:'Jorge Ramirez · 520-335-9349. Puedes llamar o usar WhatsApp para comenzar una conversación.'},
}
export default async function ContentPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const page=pages[slug]
  if(!page)notFound()
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:HOME_QUERY,perspective,stega})
  const settings=data?.settings
  const photo=settings?.agentPhoto?.asset?urlFor(settings.agentPhoto).width(800).url():null
  return <main className="min-h-screen bg-sand/50 py-20"><div className="shell max-w-3xl">
    <Link href="/" className="font-bold text-blue-600">← Inicio</Link><h1 className="mt-8 text-5xl font-black">{page.title}</h1><p className="mt-5 text-lg leading-8 text-slate-700">{slug==='sobre-jorge'?settings?.agentBio:page.body}</p>
    {slug==='sobre-jorge'&&<>{photo&&<div className="relative mt-8 aspect-[2/3] max-w-sm overflow-hidden rounded-2xl"><Image src={photo} alt={settings?.agentPhoto?.alt||'Jorge Ramirez'} fill sizes="384px" className="editorial-photo object-cover"/></div>}<ProfileFacts settings={settings}/></>}
    {slug==='contacto' && <a href="https://wa.me/15203359349" className="mt-8 inline-block rounded-xl bg-green px-6 py-3 font-extrabold text-white">WhatsApp 520-335-9349</a>}
  </div></main>
}
