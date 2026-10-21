'use client'

import {useRef, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {SiteIcon} from './SiteIcon'

export type SiteBrand = {phone?: string | null; whatsappUrl?: string | null; agentName?: string | null; logoUrl?: string | null}
const links = [['Inicio', '/'], ['Qué hacer', '/#inspirate'], ['Vivir en Tucson', '/#vivir'], ['Video del Mes', '/#video-del-mes'], ['Comprar', '/comprar'], ['Vender', '/vender'], ['Videos', '/videos'], ['Guías', '/#guias'], ['Sobre Jorge', '/#sobre-jorge'], ['Contacto', '/#contacto']]

export function SiteHeader({brand = {}}: {brand?: SiteBrand}) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const phone = brand.phone || '520-335-9349'
  const whatsapp = brand.whatsappUrl || 'https://wa.me/15203359349'
  return <header className="vet-header" onKeyDown={event => {if (event.key === 'Escape') {setOpen(false);menuButton.current?.focus()}}}>
    <div className="shell vet-header-row">
      <Link href="/" className="vet-brand" aria-label="Vive en Tucson, inicio" onClick={() => setOpen(false)}>
        <span className="vet-brand-mark">{brand.logoUrl ? <Image src={brand.logoUrl} alt="" fill sizes="48px" className="object-cover"/> : <SiteIcon name="mountain" width={30} height={30}/>}</span>
        <span><strong>VIVE EN TUCSON</strong><small>CON JORGE</small></span>
      </Link>
      <nav className="vet-desktop-nav" aria-label="Navegación principal">{links.map(([label, href]) => <Link href={href} key={label} prefetch={false} className={label === 'Video del Mes' ? 'vet-nav-feature' : undefined}>{label}</Link>)}</nav>
      <div className="vet-header-actions">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="vet-whatsapp"><SiteIcon name="chat"/><span>{phone}</span></a>
        <button ref={menuButton} type="button" className="vet-menu-button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls={open ? 'mobile-navigation' : undefined} onClick={() => setOpen(value => !value)}><SiteIcon name={open ? 'close' : 'menu'}/></button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="vet-mobile-nav shell" aria-label="Navegación móvil">{links.map(([label, href]) => <Link href={href} prefetch={false} key={label} onClick={() => setOpen(false)}>{label}</Link>)}</nav>}
  </header>
}
