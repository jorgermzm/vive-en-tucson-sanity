export type YouTubeVideo = {
  id:string; title:string; description:string; thumbnailUrl:string;
  publishedAt:string; duration:string; youtubeUrl:string;
}
export function videoId(url:string = ''):string | null {
  try {
    const parsed=new URL(url)
    if(parsed.protocol!=='https:')return null
    const id=parsed.hostname==='youtu.be'?parsed.pathname.slice(1):
      ['youtube.com','www.youtube.com','m.youtube.com'].includes(parsed.hostname)?
        (parsed.searchParams.get('v')||parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]):null
    return id && /^[\w-]{11}$/.test(id)?id:null
  } catch {return null}
}
export function durationLabel(duration:string) {
  const match=duration.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/)
  if(!match)return ''
  const hours=Number(match[1]||0)*24+Number(match[2]||0)
  const minutes=Number(match[3]||0), seconds=Math.floor(Number(match[4]||0))
  return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`:`${minutes}:${String(seconds).padStart(2,'0')}`
}
type ApiVideo={id:string; snippet?:{channelId?:string; title?:string; description?:string; publishedAt?:string; thumbnails?:Record<string,{url:string}>};contentDetails?:{duration?:string};status?:{privacyStatus?:string;uploadStatus?:string}}
export function normalizeVideo(item:ApiVideo,channelId:string):YouTubeVideo|null {
  const s=item.snippet
  if(!/^[\w-]{11}$/.test(item.id)||s?.channelId!==channelId||item.status?.privacyStatus!=='public'||item.status?.uploadStatus!=='processed'||!s.title||!s.publishedAt||!Number.isFinite(Date.parse(s.publishedAt)))return null
  const thumbnail=s.thumbnails?.maxres?.url||s.thumbnails?.standard?.url||s.thumbnails?.high?.url||s.thumbnails?.medium?.url
  if(!thumbnail||!/^https:\/\/i(?:\d)?\.ytimg\.com\//.test(thumbnail))return null
  return {id:item.id,title:s.title,description:s.description||'',publishedAt:s.publishedAt,thumbnailUrl:thumbnail,duration:item.contentDetails?.duration||'',youtubeUrl:`https://www.youtube.com/watch?v=${item.id}`}
}
