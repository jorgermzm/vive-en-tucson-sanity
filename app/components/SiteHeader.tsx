'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {SiteIcon} from './SiteIcon'
import {WhatsAppIcon} from './WhatsAppIcon'
import {SITE_NAVIGATION} from '@/lib/site-navigation'

export type SiteBrand = {phone?: string | null; whatsappUrl?: string | null; agentName?: string | null; logoUrl?: string | null}
function NavigationLinks({onNavigate}: {onNavigate: () => void}) {
  return SITE_NAVIGATION.map(item => item.children ? <details key={item.label} className="vet-nav-dropdown" onToggle={event => {
    const current = event.currentTarget
    if (current.open) current.closest('nav')?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(other => {if (other !== current) other.open = false})
  }} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false}}>
    <summary>{item.label}<span className="vet-nav-chevron" aria-hidden="true"/></summary>
    <div className="vet-nav-submenu">{item.children.map(child => <Link key={child.href} href={child.href} prefetch={false} onClick={onNavigate}>{child.label}</Link>)}</div>
  </details> : <Link href={item.href} key={item.label} prefetch={false} onClick={onNavigate} className={item.label === 'Video del Mes' ? 'vet-nav-feature' : undefined}>{item.label}</Link>)
}

export function SiteHeader({brand = {}}: {brand?: SiteBrand}) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  function closeDropdowns() {header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => {details.open = false})}
  function closeNavigation() {setOpen(false);closeDropdowns()}
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (header.current && !header.current.contains(event.target as Node)) {
        setOpen(false)
        header.current.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => {details.open = false})
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])
  const phone = brand.phone || '520-335-9349'
  const whatsapp = brand.whatsappUrl || 'https://wa.me/15203359349'
  return <header ref={header} className="vet-header" onKeyDown={event => {
    if (event.key !== 'Escape') return
    const details = (event.target as HTMLElement).closest<HTMLDetailsElement>('details[open]')
    if (details) {details.open = false;details.querySelector('summary')?.focus()}
    else {closeNavigation();if (open) menuButton.current?.focus()}
  }}>
    <div className="shell vet-header-row">
      <Link href="/#inicio" className="vet-brand" aria-label="Vive en Tucson, inicio" onClick={closeNavigation}>
        <span className="vet-brand-mark">{brand.logoUrl ? <Image src={brand.logoUrl} alt="" fill sizes="48px" className="object-cover"/> : <SiteIcon name="mountain" width={30} height={30}/>}</span>
        <span><strong>VIVE EN TUCSON</strong><small>CON JORGE</small></span>
      </Link>
      <nav className="vet-desktop-nav" aria-label="Navegación principal"><NavigationLinks onNavigate={closeNavigation}/></nav>
      <div className="vet-header-actions">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="vet-whatsapp" aria-label={`WhatsApp ${phone}`}><WhatsAppIcon width={22} height={22}/><span>{phone}</span></a>
        <button ref={menuButton} type="button" className="vet-menu-button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls={open ? 'mobile-navigation' : undefined} onClick={() => {closeDropdowns();setOpen(value => !value)}}><SiteIcon name={open ? 'close' : 'menu'}/></button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="vet-mobile-nav shell" aria-label="Navegación móvil"><NavigationLinks onNavigate={closeNavigation}/></nav>}
  </header>
}
