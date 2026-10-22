import type {Metadata} from 'next'
import {PropertySearchShell} from '@/app/components/PropertySearchShell'
import {getSiteBrand} from '@/lib/site-brand'

export const metadata: Metadata = {
  title: 'Casas en venta en Tucson | Buscar propiedades',
  description: 'Busca casas en Tucson, Arizona, con mapa, filtros por precio, recámaras, baños y tipo de propiedad. El buscador está preparado para conectarse a IDX/MLS.',
  alternates: {canonical: '/casas-tucson'},
  openGraph: {
    title: 'Casas en venta en Tucson | Vive en Tucson',
    description: 'Explora casas en Tucson con mapa y filtros. Próximamente conectado al feed IDX/MLS en tiempo real.',
    url: '/casas-tucson',
    type: 'website',
  },
}

export default async function CasasTucsonPage() {
  const brand = await getSiteBrand()
  return <PropertySearchShell whatsappUrl={brand.whatsappUrl || undefined}/>
}
