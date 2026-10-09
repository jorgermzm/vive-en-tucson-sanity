import Link from 'next/link'
import credits from '@/content/photo-credits.json'

export default function PhotoCredits(){
  return <main className="shell max-w-4xl py-12">
    <Link href="/" className="font-bold underline">← Inicio</Link>
    <h1 className="mt-8 text-4xl font-black">Créditos de fotografías</h1>
    <p className="mt-4 leading-7">Fotografías reales de Tucson y sus alrededores. Se redimensionan y pueden recortarse para adaptarse al diseño. Las adaptaciones de imágenes CC BY-SA se ofrecen bajo la misma licencia indicada para cada original. Las fotografías residenciales son referencias del entorno, no anuncios de venta ni indicaciones de disponibilidad.</p>
    <ul className="mt-8 space-y-6">{Object.entries(credits).map(([key,item])=><li key={key} className="border-b border-slate-200 pb-5">
      <h2 className="font-bold">{item.title}</h2>
      <p className="mt-1 text-sm">{item.author.replaceAll('&amp;','&')} · <a href={item.licenseUrl} className="underline">{item.license}</a></p>
      <a href={item.source} className="mt-2 inline-block text-sm underline">Fuente y archivo original en Wikimedia Commons</a>
    </li>)}</ul>
    <p className="mt-6 text-sm">Foto de Jorge y logo: archivos proporcionados por Jorge Ramirez para Vive en Tucson.</p>
  </main>
}
