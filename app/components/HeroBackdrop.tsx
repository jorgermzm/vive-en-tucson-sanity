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
      const progress = Math.min(1, Math.max(0, Math.round(headerHeight - bounds.top) / Math.max(1, bounds.height * 0.85)))
      const opacity = (1 - progress).toFixed(3)
      const filter = reducedMotion.matches ? 'none' : `blur(${(progress * 16).toFixed(2)}px)`
      const seamProgress = progress.toFixed(3)
      if (image.style.opacity !== opacity) image.style.opacity = opacity
      if (image.style.filter !== filter) image.style.filter = filter
      if (hero.style.getPropertyValue('--hero-scroll-progress') !== seamProgress) hero.style.setProperty('--hero-scroll-progress', seamProgress)
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
    }
  }, [])

  return <div ref={backdrop} className="vet-hero-image vet-hero-backdrop" aria-hidden="true">
    <Image src="/images/tucson-hero-atardecer.jpg" alt="" fill sizes="100vw" priority className="object-cover"/>
  </div>
}
