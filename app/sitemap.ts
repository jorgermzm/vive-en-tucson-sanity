import type {MetadataRoute} from 'next'
import {client} from '@/sanity/lib/client'
import {AREAS_QUERY} from '@/sanity/lib/queries'
import {AREA_LINKS} from '@/lib/site-navigation'

const base=process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vive-tucson.com'

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const staticRoutes=[
    '', '/zonas','/restaurantes','/que-hacer','/atracciones','/museos','/hiking-outdoors','/vida-nocturna','/videos',
    '/comprar','/vender','/sobre-jorge','/contacto',
  ]
  const areas=await client.fetch<Array<{slug?:string|null}>>(AREAS_QUERY).catch(()=>[])
  return [
    ...staticRoutes.map((path,index)=>({
      url:`${base}${path||'/'}`,
      lastModified:new Date(),
      changeFrequency:(path===''?'weekly':'monthly') as 'weekly'|'monthly',
      priority:path===''?1:index<=5?0.8:0.7,
    })),
    ...[...new Set([...areas.flatMap(area=>area.slug?[area.slug]:[]),...AREA_LINKS.map(area=>area.slug)])].map(slug=>({
      url:`${base}/zonas/${slug}`,
      lastModified:new Date(),
      changeFrequency:'monthly' as const,
      priority:0.75,
    })),
  ]
}
