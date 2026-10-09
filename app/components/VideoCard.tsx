import Image from 'next/image'
import Link from 'next/link'
import type {SiteVideo} from '@/lib/videos'
import {durationLabel} from '@/lib/youtube-data'

export function VideoCard({video}:{video:SiteVideo}) {
  const duration=durationLabel(video.duration)
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <a href={video.youtubeUrl} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700" aria-label={`Ver ${video.title} en YouTube`}>
      <div className="relative aspect-video overflow-hidden bg-slate-200"><Image src={video.thumbnailUrl} alt={video.thumbnailAlt} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" className="object-cover motion-safe:transition-transform motion-safe:group-hover:scale-[1.025]"/>{duration&&<span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{duration}</span>}</div>
      <h3 className="px-5 pt-5 text-lg font-extrabold text-navy">{video.title}</h3>
    </a>
    <div className="p-5 pt-3"><time dateTime={video.publishedAt} className="text-xs text-slate-500">{new Intl.DateTimeFormat('es-MX',{dateStyle:'long',timeZone:'America/Phoenix'}).format(new Date(video.publishedAt))}</time><p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">{video.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">{video.categories.map(category=><Link key={category} href={`/videos?categoria=${encodeURIComponent(category)}`} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-800">{category}</Link>)}{video.areas.map(area=><Link key={area.slug} href={`/zonas/${area.slug}`} className="rounded-full bg-sand px-3 py-1 text-xs text-navy">{area.title}</Link>)}</div>
      <a href={video.youtubeUrl} className="mt-4 inline-block text-sm font-bold text-blue-700">Ver en YouTube →</a>
    </div>
  </article>
}
