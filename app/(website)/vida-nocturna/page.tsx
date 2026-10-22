import type {Metadata} from 'next'
import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const metadata:Metadata={
  title:'Bares y vida nocturna en Tucson',
  description:'Guía en español de bares y vida nocturna en Tucson, Arizona. Explora lugares reales y confirma información actual en Google Maps.',
  alternates:{canonical:'/vida-nocturna'},
}
export default function Page(){return <PlacesPage category="vida-nocturna"/>}
