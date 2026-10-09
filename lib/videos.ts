import 'server-only'
import {cache} from 'react'
import {defineQuery} from 'next-sanity'
import {sanityFetch,getSanityFetchOptions} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
import {getYouTubeCatalog} from './youtube'
import {videoId,type YouTubeVideo} from './youtube-data'

type EditorialVideo={_id:string;title?:string;summary?:string;youtubeUrl?:string;hiddenFromSite?:boolean;featured?:boolean;sortOrder?:number;categories?:string[];disableAutoAssociation?:boolean;areas?:Array<{slug:string;title:string}>;thumbnail?:{asset?:unknown;alt?:string}}
export type SiteVideo=YouTubeVideo & {editorialId?:string;categories:string[];areas:Array<{slug:string;title:string}>;featured:boolean;sortOrder:number;thumbnailAlt:string}
type EditorialData={videos:EditorialVideo[];featuredIds:string[];areas:Array<{slug:string;title:string;relatedIds:string[]}>}
const EDITORIAL_QUERY=defineQuery(`{
  "videos": *[_type == "video" && isDemo != true] | order(_updatedAt desc){_id,title,summary,youtubeUrl,hiddenFromSite,featured,sortOrder,categories,disableAutoAssociation,thumbnail, "areas": areas[]->{title,"slug":slug.current}},
  "featuredIds": *[_id == "homepage"][0].featuredVideos[]._ref,
  "areas": *[_type == "area" && isDemo != true && defined(slug.current)]{title,"slug":slug.current,"relatedIds":relatedVideos[]._ref}
}`)
const categoryRules:Record<string,RegExp>={
  Restaurantes:/\b(restaurante?s?|comida|gastronomia|restaurant|food)\b/,
  'Hiking y Outdoors':/\b(hiking|senderismo|senderos?|outdoors?)\b/,
  Museos:/\b(museos?|museums?)\b/,
  Eventos:/\b(eventos?|festivales?|events?|festivals?)\b/,
  'Bienes raíces':/\b(casas?|vivienda|bienes raices|real estate|home tour)\b/,
}
const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
function mentions(text:string,phrase:string){return (` ${text.replace(/[^a-z0-9]+/g,' ')} `).includes(` ${normalize(phrase).replace(/[^a-z0-9]+/g,' ')} `)}
export const getSiteVideos=cache(async()=>{
  const options=await getSanityFetchOptions()
  const [catalog,editorial]=await Promise.all([
    getYouTubeCatalog(),
    sanityFetch({query:EDITORIAL_QUERY,...options}).then(result=>result.data as EditorialData|null).catch(()=>null),
  ])
  const edits=new Map<string,EditorialVideo>()
  for(const edit of editorial?.videos||[]){const id=videoId(edit.youtubeUrl);if(id&&!edits.has(id))edits.set(id,edit)}
  const featuredIds=editorial?.featuredIds||[]
  const videos:SiteVideo[]=catalog.videos.flatMap(video=>{
    const edit=edits.get(video.id)
    if(edit?.hiddenFromSite)return []
    // Match titles only: descriptions often repeat links to unrelated neighborhoods.
    const text=normalize(video.title)
    const areas=(edit?.areas||[]).filter(area=>area?.slug)
    for(const area of editorial?.areas||[]){
      if((edit&&area.relatedIds?.includes(edit._id))||(!edit?.disableAutoAssociation&&(mentions(text,area.title)||mentions(text,area.slug.replace(/-/g,' '))))){
        if(!areas.some(a=>a.slug===area.slug))areas.push({slug:area.slug,title:area.title})
      }
    }
    let thumbnailUrl=video.thumbnailUrl
    if(edit?.thumbnail?.asset){try{thumbnailUrl=urlFor(edit.thumbnail).width(960).height(540).fit('crop').url()}catch{/* Retain YouTube thumbnail. */}}
    const featuredIndex=edit?featuredIds.indexOf(edit._id):-1
    return [{...video,title:edit?.title||video.title,description:edit?.summary||video.description,thumbnailUrl,thumbnailAlt:edit?.thumbnail?.alt||edit?.title||video.title,
      editorialId:edit?._id,areas,categories:edit?.categories?.length?edit.categories:edit?.disableAutoAssociation?[]:Object.entries(categoryRules).filter(([,rule])=>rule.test(text)).map(([name])=>name),
      featured:featuredIndex>=0||edit?.featured===true,sortOrder:featuredIndex>=0?featuredIndex:edit?.sortOrder??1000}]
  }).sort((a,b)=>a.sortOrder-b.sortOrder||b.publishedAt.localeCompare(a.publishedAt))
  return {videos,status:catalog.status}
})
