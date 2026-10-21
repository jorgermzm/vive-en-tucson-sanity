import './globals.css'
import type {Metadata} from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vive-tucson.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vive en Tucson en Español | Jorge Ramirez REALTOR®',
    template: '%s | Vive en Tucson',
  },
  description: 'Guía en español para vivir, visitar y comprar casa en Tucson, Arizona. Zonas, restaurantes, videos, vida local y bienes raíces con Jorge Ramirez.',
  keywords: [
    'Tucson Arizona en español',
    'vivir en Tucson',
    'comprar casa en Tucson',
    'Realtor en Tucson español',
    'casas en Tucson Arizona',
    'zonas de Tucson',
    'restaurantes en Tucson',
    'qué hacer en Tucson',
  ],
  authors: [{name: 'Jorge Ramirez'}],
  creator: 'Jorge Ramirez',
  publisher: 'Vive en Tucson',
  alternates: {canonical: '/'},
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    url: '/',
    siteName: 'Vive en Tucson',
    title: 'Vive en Tucson en Español | Jorge Ramirez',
    description: 'Descubre Tucson como alguien que vive aquí: zonas, gastronomía, videos, estilo de vida y bienes raíces en español.',
    images: [{url: '/opengraph-image', width: 1200, height: 630, alt: 'Vive en Tucson con Jorge Ramirez'}],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vive en Tucson en Español | Jorge Ramirez',
    description: 'Guía local en español para conocer, vivir y comprar casa en Tucson, Arizona.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Vive en Tucson',
      description: 'Guía en español sobre Tucson, Arizona: zonas, vida local, videos y bienes raíces.',
      inLanguage: 'es-US',
      publisher: {'@id': `${siteUrl}/#publisher`},
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#publisher`,
      name: 'Vive en Tucson',
      url: siteUrl,
      founder: {'@id': `${siteUrl}/#jorge-ramirez`},
      sameAs: ['https://www.youtube.com/@vivetucson'],
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#jorge-ramirez`,
      name: 'Jorge Ramirez',
      jobTitle: 'REALTOR®',
      url: `${siteUrl}/sobre-jorge`,
      telephone: '+1-520-335-9349',
      sameAs: ['https://www.youtube.com/@vivetucson'],
    },
  ],
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="es-US"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}/></body></html>
}
