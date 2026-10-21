import Link from 'next/link'
import {SiteIcon} from './SiteIcon'

export function SiteFooter() {
  return <footer className="vet-footer"><div className="shell vet-footer-row">
    <div><p className="font-serif text-lg font-bold text-[#fff1d2]">VIVE EN TUCSON <span className="font-sans text-xs font-normal text-[#fff1d2]/60">| Con Jorge</span></p><p className="mt-2 text-xs text-[#fff1d2]/60">© {new Date().getFullYear()} Vive en Tucson · Arizona</p></div>
    <nav aria-label="Enlaces del pie" className="flex flex-wrap items-center gap-5 text-xs"><Link href="/creditos">Créditos de fotografías</Link><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos de uso</Link><Link href="/contacto">Contacto</Link><a href="https://www.youtube.com/@vivetucson" aria-label="Vive Tucson en YouTube"><SiteIcon name="video"/></a></nav>
  </div></footer>
}
