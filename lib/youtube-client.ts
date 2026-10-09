import {normalizeVideo,type YouTubeVideo} from './youtube-data'
type Channel={id:string;contentDetails?:{relatedPlaylists?:{uploads?:string}}}
type PlaylistItem={contentDetails?:{videoId?:string}}
async function request<T>(resource:string,params:Record<string,string>,key:string,fetcher:typeof fetch):Promise<{items:T[];nextPageToken?:string}> {
  // Keep credentials out of URLs, client bundles and diagnostic messages.
  const response=await fetcher(`https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams(params)}`,{
    headers:{'X-Goog-Api-Key':key},cache:'no-store',signal:AbortSignal.timeout(10000),
  })
  if(!response.ok)throw new Error(`YouTube request failed (${response.status})`)
  const body=await response.json()
  if(!Array.isArray(body.items))throw new Error('Invalid YouTube response')
  return body
}
export async function fetchChannelCatalog(key:string,fetcher:typeof fetch=fetch){
  const channel=(await request<Channel>('channels',{part:'contentDetails',forHandle:'@vivetucson'},key,fetcher)).items[0]
  const uploads=channel?.contentDetails?.relatedPlaylists?.uploads
  if(!uploads)throw new Error('YouTube channel unavailable')
  const videos:YouTubeVideo[]=[]
  let pageToken=''
  // Bounded to 500 latest uploads: at most 21 quota units per hourly refresh.
  for(let page=0;page<10;page++) {
    const playlist=await request<PlaylistItem>('playlistItems',{part:'contentDetails',playlistId:uploads,maxResults:'50',...(pageToken?{pageToken}:{})},key,fetcher)
    const ids=playlist.items.map(item=>item.contentDetails?.videoId).filter((id):id is string=>Boolean(id&&/^[\w-]{11}$/.test(id)))
    if(ids.length){
      const details=await request<Parameters<typeof normalizeVideo>[0]>('videos',{part:'snippet,contentDetails,status',id:ids.join(',')},key,fetcher)
      for(const item of details.items){const video=normalizeVideo(item,channel.id);if(video)videos.push(video)}
    }
    pageToken=playlist.nextPageToken||''
    if(!pageToken)break
  }
  return {videos:[...new Map(videos.map(v=>[v.id,v])).values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),fetchedAt:Date.now(),channelId:channel.id}
}

