import 'server-only'
import {unstable_cache} from 'next/cache'
import {cache} from 'react'
import type {YouTubeVideo} from './youtube-data'
import {fetchChannelCatalog} from './youtube-client'

export const CHANNEL_URL='https://www.youtube.com/@vivetucson'
const fetchCatalog=unstable_cache(()=>fetchChannelCatalog(process.env.YOUTUBE_API_KEY!),['youtube-vivetucson-v1'],{revalidate:3600,tags:['youtube']})

export const getYouTubeCatalog=cache(async()=>{
  if(!process.env.YOUTUBE_API_KEY)return {videos:[] as YouTubeVideo[],status:'unconfigured' as const}
  try {
    const result=await fetchCatalog()
    // Never expose an indefinitely stale cache after a prolonged API outage.
    if(Date.now()-result.fetchedAt>86400000)return {videos:[] as YouTubeVideo[],status:'unavailable' as const}
    return {...result,status:'ready' as const}
  }catch{
    console.warn('[youtube] Catalog unavailable; showing channel link.')
    return {videos:[] as YouTubeVideo[],status:'unavailable' as const}
  }
})
