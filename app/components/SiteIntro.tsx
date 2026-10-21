'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'

export function SiteIntro({logoUrl}: {logoUrl?: string | null}) {
  const [dismissed, setDismissed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const dismiss = () => setDismissed(true)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {dismiss();return}
    const fallback = window.setTimeout(dismiss, 2500)
    window.addEventListener('pointerdown', dismiss, {capture: true, passive: true})
    window.addEventListener('wheel', dismiss, {passive: true})
    window.addEventListener('keydown', dismiss)
    reducedMotion.addEventListener('change', dismiss)
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener('pointerdown', dismiss, true)
      window.removeEventListener('wheel', dismiss)
      window.removeEventListener('keydown', dismiss)
      reducedMotion.removeEventListener('change', dismiss)
    }
  }, [dismissed])

  if (dismissed) return null
  return <div className="vet-intro" aria-hidden="true" onAnimationEnd={event => {if (event.target === event.currentTarget) setDismissed(true)}}>
    <div className="vet-intro-brand">
      {logoUrl && !logoFailed && <div className="vet-intro-mark"><Image src={logoUrl} alt="" width={280} height={280} priority sizes="(max-width:767px) 180px,280px" onError={() => setLogoFailed(true)}/></div>}
      <div className="vet-intro-name">VIVE EN TUCSON</div>
      <div className="vet-intro-caption">CON JORGE</div>
    </div>
  </div>
}
