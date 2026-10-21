import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const metadata = {title: 'Atracciones en Tucson, Arizona', description: 'Explora atracciones de Tucson con nombres, direcciones y fotos de Google Places.', alternates: {canonical: '/atracciones'}}
export default function Page() {return <PlacesPage category="atracciones"/>}
