import type {Metadata} from 'next'
import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const metadata:Metadata={
  title:'Restaurantes en Tucson, Arizona',
  description:'Guía en español de restaurantes en Tucson, Arizona. Descubre lugares para comer y abre la ficha de cada lugar para ver fotos, horarios y opiniones de Google.',
  alternates:{canonical:'/restaurantes'},
}
export default function Page(){return <PlacesPage category="restaurantes"/>}
