import './globals.css'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Vive en Tucson | Jorge Ramirez',
  description: 'Conoce Tucson antes de comprar casa: zonas, videos y recursos locales.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>
}
