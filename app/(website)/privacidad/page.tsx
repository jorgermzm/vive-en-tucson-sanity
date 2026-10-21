import Link from 'next/link'

export const metadata = {title: 'Privacidad | Vive en Tucson'}
export default function Page() {
  return <main className="shell max-w-3xl space-y-6 py-16 text-slate-700">
    <Link href="/" className="font-bold text-blue-700">← Inicio</Link>
    <h1 className="text-4xl font-black text-navy">Privacidad</h1>
    <p>Las secciones de lugares utilizan Google Maps Platform para mostrar información y fotografías de establecimientos de Tucson. Las consultas se realizan desde nuestro servidor; no solicitamos tu ubicación precisa para mostrar estos lugares.</p>
    <p>Al cargar las fotografías o abrir los enlaces de Google Maps, tu navegador se conecta con Google. Google puede recibir datos técnicos de esa conexión, como tu dirección IP. Consulta la <a href="https://policies.google.com/privacy" className="underline">Política de Privacidad de Google</a>, que se incorpora a esta política para estos servicios.</p>
    <p>Sanity administra el contenido editorial y Vercel aloja el sitio. Si utilizas un enlace a WhatsApp u otro servicio externo, se aplicarán también las políticas de ese servicio.</p>
    <p>Para preguntas sobre privacidad, utiliza nuestra <Link href="/contacto" className="underline">página de contacto</Link>.</p>
  </main>
}
