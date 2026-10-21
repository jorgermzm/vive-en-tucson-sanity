import {ImageResponse} from 'next/og'
import {getSiteBrand} from '@/lib/site-brand'

export const alt = 'Vive en Tucson con Jorge Ramirez'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const brand = await getSiteBrand()

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg,#1b140d 0%,#2a2119 52%,#6f421e 100%)',
        color: '#fff1d2',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 78% 18%, rgba(233,171,50,.32), transparent 28%), radial-gradient(circle at 18% 82%, rgba(20,155,98,.18), transparent 28%)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:210,background:'linear-gradient(to top,rgba(0,0,0,.32),transparent)'}}/>

      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'70px 76px',width:'860px',zIndex:2}}>
        <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:30}}>
          {brand.logoUrl ? <img src={brand.logoUrl} width="92" height="92" style={{borderRadius:46,objectFit:'cover',border:'2px solid #e9ab32'}}/> : <div style={{width:82,height:82,borderRadius:41,border:'2px solid #e9ab32',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38}}>🌵</div>}
          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{fontSize:24,fontWeight:800,letterSpacing:2,color:'#e9ab32'}}>VIVE EN TUCSON</div>
            <div style={{fontSize:18,marginTop:6,color:'#fff1d2cc'}}>Con {brand.agentName || 'Jorge Ramirez'}</div>
          </div>
        </div>

        <div style={{fontFamily:'Georgia, serif',fontSize:76,lineHeight:1.02,fontWeight:700,letterSpacing:-2}}>
          Descubre Tucson
        </div>
        <div style={{fontFamily:'Georgia, serif',fontSize:48,lineHeight:1.08,fontWeight:700,color:'#e9ab32',marginTop:8}}>
          como alguien que vive aquí
        </div>
        <div style={{fontSize:25,lineHeight:1.45,maxWidth:760,marginTop:28,color:'#fff1d2e8'}}>
          Zonas, videos, gastronomía, estilo de vida y bienes raíces en Tucson, Arizona.
        </div>
      </div>

      <div style={{position:'absolute',right:62,bottom:56,display:'flex',alignItems:'center',gap:12,zIndex:2,padding:'12px 18px',border:'1px solid rgba(233,171,50,.45)',borderRadius:999,background:'rgba(27,20,13,.72)',fontSize:18}}>
        <span style={{color:'#e9ab32'}}>TUCSON</span>
        <span style={{opacity:.65}}>•</span>
        <span>ARIZONA</span>
      </div>
    </div>,
    size,
  )
}
