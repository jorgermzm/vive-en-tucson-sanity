import 'server-only'
import {cache} from 'react'
import {defineQuery} from 'next-sanity'
import {getSanityFetchOptions, sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
import type {SiteBrand} from '@/app/components/SiteHeader'

const BRAND_QUERY = defineQuery('*[_id == "siteSettings"][0]{phone,whatsappUrl,agentName,logo}')
export const getSiteBrand = cache(async (): Promise<SiteBrand> => {
  try {
    const options = await getSanityFetchOptions()
    const {data} = await sanityFetch({query: BRAND_QUERY, ...options})
    const settings = data as {phone?: string; whatsappUrl?: string; agentName?: string; logo?: {asset?: unknown}} | null
    return {phone: settings?.phone, whatsappUrl: settings?.whatsappUrl, agentName: settings?.agentName, logoUrl: settings?.logo?.asset ? urlFor(settings.logo).width(120).height(120).fit('crop').url() : null}
  } catch { return {} }
})
