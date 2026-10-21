'use client'

import Image from 'next/image'
import {useEffect, useRef} from 'react'

export function HeroBackdrop() {
  const backdrop = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const image = backdrop.current
    const hero = image?.closest<HTMLElement>('.vet-hero')
    if (!image || !hero) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function update() {
      frame = 0
      if (!image || !hero) return
      const headerHeight = document.querySelector<HTMLElement>('.vet-header')?.offsetHeight || 0
      const bounds = hero.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, Math.round(headerHeight - bounds.top) / Math.max(1, bounds.height * 0.65)))
      const opacity = (1 - progress).toFixed(3)
      const filter = reducedMotion.matches ? 'none' : `blur(${(progress * 8).toFixed(2)}px)`
      if (hero.style.opacity !== opacity) hero.style.opacity = opacity
      if (image.style.filter !== filter) image.style.filter = filter
      const hidden = progress >= 0.98
      if (hero.inert !== hidden) hero.inert = hidden
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)
    reducedMotion.addEventListener('change', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
      hero.inert = false
    }
  }, [])

  return <div ref={backdrop} className="vet-hero-image vet-hero-backdrop" aria-hidden="true">
    <Image src="/images/tucson-hero-atardecer.jpg" alt="" fill sizes="100vw" priority className="object-cover"/>
  </div>
}
