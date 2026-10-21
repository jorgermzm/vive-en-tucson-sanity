import {PlacesPage} from '@/app/components/PlacesPage'

export const dynamic = 'force-dynamic'
export const metadata = {title: 'Museos en Tucson, Arizona', description: 'Descubre museos de Tucson con nombres, direcciones y fotos de Google Places.', alternates: {canonical: '/museos'}}
export default function Page() {return <PlacesPage category="museos"/>}
