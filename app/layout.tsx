import './globals.css'
import type {Metadata} from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vive-tucson.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vive en Tucson | Jorge Ramirez',
    template: '%s | Vive en Tucson',
  },
  description: 'Conoce Tucson antes de comprar casa: zonas, videos, gastronomía, estilo de vida y recursos locales con Jorge Ramirez.',
  openGraph: {
    type: 'website',
    locale: 'es_US',
    url: '/',
    siteName: 'Vive en Tucson',
    title: 'Vive en Tucson | Jorge Ramirez',
    description: 'Descubre Tucson como alguien que vive aquí: zonas, videos, gastronomía, estilo de vida y bienes raíces.',
    images: [{url: '/opengraph-image', width: 1200, height: 630, alt: 'Vive en Tucson con Jorge Ramirez'}],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vive en Tucson | Jorge Ramirez',
    description: 'Descubre Tucson como alguien que vive aquí.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>
}
