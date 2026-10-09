import type {Metadata} from 'next'
import Link from 'next/link'
import {getSiteVideos} from '@/lib/videos'
import {CHANNEL_URL} from '@/lib/youtube'
import {VideoCard} from '@/app/components/VideoCard'

export const metadata:Metadata={title:'Videos de Tucson | Vive en Tucson',description:'Recorridos, lugares y consejos de Vive Tucson con Jorge. Explora los videos por categoría y zona.',...(process.env.VERCEL_PROJECT_PRODUCTION_URL?{alternates:{canonical:`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/videos`}}:{})}
export default async function VideosPage({searchParams}:{searchParams:Promise<{categoria?:string;zona?:string}>}){
  const [{videos,status},filters]=await Promise.all([getSiteVideos(),searchParams])
  const categories=[...new Set(videos.flatMap(v=>v.categories))].sort()
  const areas=[...new Map(videos.flatMap(v=>v.areas).map(area=>[area.slug,area])).values()]
  const filtered=videos.filter(v=>(!filters.categoria||v.categories.includes(filters.categoria))&&(!filters.zona||v.areas.some(a=>a.slug===filters.zona)))
  const schema={'@context':'https://schema.org','@type':'ItemList',itemListElement:filtered.map((v,index)=>({'@type':'ListItem',position:index+1,item:{'@type':'VideoObject',name:v.title,description:v.description||v.title,thumbnailUrl:v.thumbnailUrl,uploadDate:v.publishedAt,...(v.duration&&v.duration!=='P0D'?{duration:v.duration}:{}),url:v.youtubeUrl}}))}
  return <main className="min-h-screen bg-[#fffdf9] py-12 text-navy"><div className="shell">
    <Link href="/" className="font-bold text-blue-700">← Inicio</Link>
    <h1 className="display-serif mt-8 text-4xl font-black sm:text-5xl">Videos de Tucson</h1>
    <p className="mt-4 max-w-2xl text-lg text-slate-600">Conoce Tucson conmigo: recorridos, lugares y consejos para disfrutar la ciudad.</p>
    <a href={CHANNEL_URL} className="mt-5 inline-flex rounded-lg bg-navy px-5 py-3 font-bold text-white">Visita Vive Tucson en YouTube →</a>
    {videos.length>0&&<form action="/videos" className="my-8 flex flex-wrap items-end gap-4"><label className="grid gap-2 text-sm font-bold">Categoría<select name="categoria" defaultValue={filters.categoria||''} className="rounded-lg border border-slate-300 bg-white p-3"><option value="">Todas</option>{categories.map(category=><option key={category}>{category}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Zona<select name="zona" defaultValue={filters.zona||''} className="rounded-lg border border-slate-300 bg-white p-3"><option value="">Todas</option>{areas.map(area=><option key={area.slug} value={area.slug}>{area.title}</option>)}</select></label><button className="rounded-lg bg-navy px-5 py-3 font-bold text-white">Filtrar</button><Link href="/videos" className="py-3 text-sm underline">Ver todos</Link></form>}
    {filtered.length?<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(video=><VideoCard key={video.id} video={video}/>)}</div>:<p role="status" className="mt-8 rounded-xl bg-sand p-6">{status==='ready'?'No hay videos para esta selección. Puedes explorar el canal completo en YouTube.':'Puedes ver todos mis videos directamente en YouTube. El catálogo estará disponible aquí en cuanto se restablezca la conexión.'}</p>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  </div></main>
}
