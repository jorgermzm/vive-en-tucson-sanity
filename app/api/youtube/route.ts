import {getYouTubeCatalog} from '@/lib/youtube'
export async function GET(){
  const catalog=await getYouTubeCatalog()
  return Response.json({status:catalog.status,videos:catalog.videos.map(({id,title,youtubeUrl})=>({id,title,youtubeUrl}))},{headers:{'Cache-Control':catalog.status==='ready'?'public, s-maxage=300, stale-while-revalidate=60':'no-store'}})
}
