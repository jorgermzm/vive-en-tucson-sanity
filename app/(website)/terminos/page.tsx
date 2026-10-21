import Link from 'next/link'

export const metadata = {title: 'Términos de uso | Vive en Tucson'}
export default function Page() {
  return <main className="shell max-w-3xl space-y-6 py-16 text-slate-700">
    <Link href="/" className="font-bold text-blue-700">← Inicio</Link>
    <h1 className="text-4xl font-black text-navy">Términos de uso</h1>
    <p>Vive en Tucson ofrece información para explorar la ciudad. Los datos y fotografías identificados como contenido de Google Maps se obtienen de Google Maps Platform. Su disponibilidad y exactitud pueden variar; confirma los detalles con el establecimiento antes de visitarlo.</p>
    <p>El uso de estas funciones está sujeto a los <a href="https://maps.google.com/help/terms_maps/" className="underline">Términos de Servicio de Google Maps/Google Earth</a> y a la <a href="https://policies.google.com/privacy" className="underline">Política de Privacidad de Google</a>, incorporados a estos términos para las funciones de Google Maps.</p>
    <p>Las fotografías pertenecen a sus respectivos autores. Se muestran los créditos y enlaces disponibles; su aparición aquí no concede permiso para descargarlas o reutilizarlas en otros medios.</p>
    <p>Para consultas sobre el sitio, utiliza nuestra <Link href="/contacto" className="underline">página de contacto</Link>.</p>
  </main>
}
