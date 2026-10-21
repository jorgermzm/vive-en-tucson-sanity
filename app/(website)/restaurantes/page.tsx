import type {Metadata} from 'next'
import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const metadata:Metadata={
  title:'Restaurantes en Tucson, Arizona',
  description:'Guía en español de restaurantes en Tucson, Arizona. Descubre lugares para comer y abre cada ficha en Google Maps para confirmar detalles actuales.',
  alternates:{canonical:'/restaurantes'},
}
export default function Page(){return <PlacesPage category="restaurantes"/>}
