import type {MetadataRoute} from 'next'
import {client} from '@/sanity/lib/client'
import {AREAS_QUERY} from '@/sanity/lib/queries'

const base=process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vive-tucson.com'

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const staticRoutes=[
    '', '/zonas','/restaurantes','/que-hacer','/vida-nocturna','/videos',
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
    ...areas.filter(area=>area.slug).map(area=>({
      url:`${base}/zonas/${area.slug}`,
      lastModified:new Date(),
      changeFrequency:'monthly' as const,
      priority:0.75,
    })),
  ]
}
