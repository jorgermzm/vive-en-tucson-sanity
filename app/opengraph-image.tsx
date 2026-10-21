import {ImageResponse} from 'next/og'
import {getSiteBrand} from '@/lib/site-brand'

export const alt = 'Vive en Tucson con Jorge Ramirez'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const brand = await getSiteBrand()
  const agentName = brand.agentName || 'Jorge Ramirez'

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1b140d 0%, #2a2119 58%, #6f421e 100%)',
        color: '#fff1d2',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: 210,
          background: 'rgba(233,171,50,.18)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -160,
          left: -120,
          width: 480,
          height: 480,
          borderRadius: 240,
          background: 'rgba(20,155,98,.12)',
          display: 'flex',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '70px 76px',
          width: 900,
          height: 630,
        }}
      >
        <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:30}}>
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              width={92}
              height={92}
              style={{borderRadius:46,objectFit:'cover',border:'2px solid #e9ab32'}}
            />
          ) : (
            <div
              style={{
                width:82,
                height:82,
                borderRadius:41,
                border:'2px solid #e9ab32',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:38,
              }}
            >
              🌵
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',fontSize:24,fontWeight:800,letterSpacing:2,color:'#e9ab32'}}>
              VIVE EN TUCSON
            </div>
            <div style={{display:'flex',fontSize:18,marginTop:6,color:'#fff1d2cc'}}>
              {`Con ${agentName}`}
            </div>
          </div>
        </div>

        <div
          style={{
            display:'flex',
            fontFamily:'Georgia, serif',
            fontSize:76,
            lineHeight:1.02,
            fontWeight:700,
            letterSpacing:-2,
          }}
        >
          Descubre Tucson
        </div>

        <div
          style={{
            display:'flex',
            fontFamily:'Georgia, serif',
            fontSize:48,
            lineHeight:1.08,
            fontWeight:700,
            color:'#e9ab32',
            marginTop:8,
          }}
        >
          como alguien que vive aquí
        </div>

        <div
          style={{
            display:'flex',
            fontSize:25,
            lineHeight:1.45,
            maxWidth:760,
            marginTop:28,
            color:'#fff1d2e8',
          }}
        >
          Zonas, videos, gastronomía, estilo de vida y bienes raíces en Tucson, Arizona.
        </div>
      </div>

      <div
        style={{
          position:'absolute',
          right:62,
          bottom:56,
          display:'flex',
          alignItems:'center',
          gap:12,
          padding:'12px 18px',
          border:'1px solid rgba(233,171,50,.45)',
          borderRadius:999,
          background:'rgba(27,20,13,.72)',
          fontSize:18,
        }}
      >
        <span style={{color:'#e9ab32'}}>TUCSON</span>
        <span style={{opacity:.65}}>•</span>
        <span>ARIZONA</span>
      </div>
    </div>,
    size,
  )
}
