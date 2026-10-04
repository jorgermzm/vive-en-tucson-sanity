import Link from 'next/link'
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
  return <main className="min-h-screen bg-sand/50 py-20"><div className="shell max-w-3xl">
    <Link href="/" className="font-bold text-blue-600">← Inicio</Link><h1 className="mt-8 text-5xl font-black">{page.title}</h1><p className="mt-5 text-lg leading-8 text-slate-700">{page.body}</p>
    {slug==='contacto' && <a href="https://wa.me/15203359349" className="mt-8 inline-block rounded-xl bg-green px-6 py-3 font-extrabold text-white">WhatsApp 520-335-9349</a>}
  </div></main>
}
