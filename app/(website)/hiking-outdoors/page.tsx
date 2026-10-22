import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const metadata = {title: 'Hiking y Outdoors en Tucson, Arizona', description: 'Explora senderos y lugares al aire libre en Tucson con datos de Google Places.', alternates: {canonical: '/hiking-outdoors'}}
export default function Page() {return <PlacesPage category="hiking-outdoors"/>}
