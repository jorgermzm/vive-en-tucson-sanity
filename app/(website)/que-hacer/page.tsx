import type {Metadata} from 'next'
import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const metadata:Metadata={
  title:'Qué hacer en Tucson, Arizona',
  description:'Guía en español de museos, atracciones y lugares para conocer Tucson, Arizona, con opciones para visitantes y residentes.',
  alternates:{canonical:'/que-hacer'},
}
export default function Page(){return <PlacesPage category="que-hacer"/>}
