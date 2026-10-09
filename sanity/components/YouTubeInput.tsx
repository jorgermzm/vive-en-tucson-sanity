'use client'
import {useEffect,useState} from 'react'
import {set,type UrlInputProps} from 'sanity'
export function YouTubeInput(props:UrlInputProps){
  const [videos,setVideos]=useState<Array<{id:string;title:string;youtubeUrl:string}>>([])
  const [message,setMessage]=useState('Cargando videos del canal…')
  useEffect(()=>{
    const controller=new AbortController()
    fetch('/api/youtube',{signal:controller.signal}).then(r=>r.json()).then(data=>{
      setVideos(data.videos||[])
      setMessage(data.status==='ready'?'Selecciona un video de @vivetucson o pega su enlace.':'Catálogo no disponible. Configura YOUTUBE_API_KEY en Vercel; también puedes pegar el enlace del video.')
    }).catch(()=>{if(!controller.signal.aborted)setMessage('No se pudo cargar el catálogo. Puedes pegar el enlace.')})
    return ()=>controller.abort()
  },[])
  return <div><p style={{fontSize:13,marginBottom:12}}>{message}</p>{videos.length>0&&<select aria-label="Seleccionar video de Vive Tucson" disabled={props.readOnly} value={videos.some(v=>v.youtubeUrl===props.value)?props.value:''} onChange={event=>{if(event.target.value)props.onChange(set(event.target.value))}} style={{width:'100%',padding:12,marginBottom:12,color:'inherit',background:'transparent'}}><option value="">Selecciona un video…</option>{videos.map(video=><option key={video.id} value={video.youtubeUrl}>{video.title}</option>)}</select>}{props.renderDefault(props)}</div>
}
