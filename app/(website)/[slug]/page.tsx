import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {HOME_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions,sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
import {ProfileFacts} from '@/app/components/ProfileFacts'
import {notFound} from 'next/navigation'

const pages={
  comprar:{
    title:'Comprar casa en Tucson, Arizona',
    description:'Guía en español para comprar casa en Tucson: cómo prepararte, comparar zonas, entender el preapproval y avanzar con mayor claridad.',
    intro:'Comprar casa en Tucson empieza mucho antes de visitar propiedades. Primero conviene definir presupuesto, financiamiento y las zonas que realmente encajan con tu estilo de vida.',
    questions:[
      ['¿Cuál es el primer paso para comprar casa en Tucson?','Definir tu presupuesto y hablar con un profesional de financiamiento para saber qué rango de compra es realista. Después puedes comparar zonas y propiedades con criterios claros.'],
      ['¿Qué es un preapproval?','Es una evaluación preliminar de financiamiento que ayuda a estimar cuánto podrías pedir prestado. Los requisitos dependen del prestamista y de tu situación financiera.'],
      ['¿Cómo elijo una zona de Tucson?','Compara trayectos, tipo de vivienda, servicios cercanos, estilo de vida y presupuesto. En Vive en Tucson puedes explorar cada zona con descripciones y videos.'],
      ['¿Necesito hablar inglés para empezar?','No. Esta guía está pensada para explicar el proceso en español y ayudarte a llegar mejor preparado a las conversaciones con prestamistas, title y otros profesionales.'],
    ],
  },
  vender:{
    title:'Vender casa en Tucson, Arizona',
    description:'Guía en español para vender una casa en Tucson: preparación, precio, presentación, promoción y próximos pasos.',
    intro:'Una buena venta empieza con una estrategia clara: condición de la propiedad, precio, presentación, exposición y un plan para evaluar ofertas.',
    questions:[
      ['¿Qué debo hacer antes de poner mi casa a la venta?','Revisa reparaciones necesarias, limpieza, presentación, fotografías y la información que los compradores necesitarán para evaluar la propiedad.'],
      ['¿Cómo se determina el precio de una casa?','Normalmente se comparan propiedades similares, condición, ubicación, características y actividad reciente del mercado. El objetivo es posicionar la propiedad de forma competitiva.'],
      ['¿Qué conviene arreglar antes de vender?','Prioriza problemas que puedan afectar seguridad, funcionamiento o percepción del comprador. No toda mejora recupera su costo, por eso conviene evaluar cada reparación antes de gastar.'],
      ['¿Cómo puedo atraer más compradores?','Una presentación cuidada, buenas fotografías, información clara y una estrategia de distribución ayudan a que más compradores entiendan el valor de la propiedad.'],
    ],
  },
  'sobre-jorge':{
    title:'Sobre Jorge Ramirez',
    description:'Conoce a Jorge Ramirez, REALTOR® y creador de Vive en Tucson.',
    intro:'Una guía local sobre Tucson, bienes raíces, comida, viajes y todo lo que vale la pena conocer de la ciudad.',
    questions:[],
  },
  contacto:{
    title:'Contacto | Jorge Ramirez REALTOR®',
    description:'Contacta a Jorge Ramirez para conversar sobre comprar, vender o conocer mejor Tucson, Arizona.',
    intro:'Cuéntame qué estás buscando en Tucson y te ayudo a organizar el siguiente paso.',
    questions:[],
  },
} as const

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params
  const page=pages[slug as keyof typeof pages]
  if(!page)return {}
  return {title:page.title,description:page.description,alternates:{canonical:`/${slug}`}}
}

export default async function ContentPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const page=pages[slug as keyof typeof pages]
  if(!page)notFound()
  const {perspective,stega}=await getSanityFetchOptions()
  const {data}=await sanityFetch({query:HOME_QUERY,perspective,stega})
  const settings=data?.settings
  const photo=settings?.agentPhoto?.asset?urlFor(settings.agentPhoto).width(800).url():null
  const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Inicio',item:'https://www.vive-tucson.com/'},
    {'@type':'ListItem',position:2,name:page.title,item:`https://www.vive-tucson.com/${slug}`},
  ]}
  return <main className="min-h-screen bg-sand/50 py-20"><div className="shell max-w-4xl">
    <Link href="/" className="font-bold text-blue-600">← Inicio</Link>
    <h1 className="mt-8 text-5xl font-black">{page.title}</h1>
    <p className="mt-5 text-lg leading-8 text-slate-700">{slug==='sobre-jorge'?settings?.agentBio:page.intro}</p>
    {page.questions.length>0&&<section className="mt-12"><h2 className="display-serif text-3xl font-black">Preguntas frecuentes, respondidas de forma directa</h2><div className="mt-6 grid gap-5">{page.questions.map(([question,answer])=><article key={question} className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-xl font-black">{question}</h3><p className="mt-3 leading-7 text-slate-600">{answer}</p></article>)}</div></section>}
    {slug==='comprar'&&<div className="mt-10 flex flex-wrap gap-4"><Link href="/zonas" className="rounded-xl bg-navy px-6 py-3 font-bold text-white">Comparar zonas de Tucson</Link><Link href="/videos" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold">Ver videos de Tucson</Link></div>}
    {slug==='vender'&&<div className="mt-10"><Link href="/contacto" className="rounded-xl bg-navy px-6 py-3 font-bold text-white">Hablar sobre vender mi casa</Link></div>}
    {slug==='sobre-jorge'&&<>{photo&&<div className="relative mt-8 aspect-[2/3] max-w-sm overflow-hidden rounded-2xl"><Image src={photo} alt={settings?.agentPhoto?.alt||'Jorge Ramirez'} fill sizes="384px" className="editorial-photo object-cover"/></div>}<ProfileFacts settings={settings}/></>}
    {slug==='contacto'&&<a href="https://wa.me/15203359349" className="mt-8 inline-block rounded-xl bg-green px-6 py-3 font-extrabold text-white">WhatsApp 520-335-9349</a>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  </div></main>
}
