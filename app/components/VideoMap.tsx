'use client'

import {useEffect, useRef} from 'react'

type MapVideo = {
  id: string
  title: string
  youtubeUrl: string
  thumbnailUrl: string
  duration: string
  publishedAt: string
}

type Props = {
  videos: MapVideo[]
  videosVisible: boolean
  selectedVideoId?: string
  onSelect: (video: MapVideo) => void
}

type LeafletMap = any
type LeafletLayerGroup = any

const DOWNTOWN: [number, number] = [32.2226, -110.9747]

const VIDEO_COORDINATES: Record<string, [number, number]> = {
  'uhymFx81PjY': [32.2319, -110.9583],
  'RyiSxB6fFE0': [32.2323, -110.9572],
  'l-wW2DGqeLA': [32.2507, -110.8732],
  'fXrKgmOOHRw': [32.2215, -110.8412],
  'sydzQihBegE': DOWNTOWN,
  'cknwHOrGGTQ': [31.7406, -110.9418],
  'rpr1n1Qlzw0': [32.44455, -110.77739],
  'm_5n7bjIeZY': [32.2844, -110.9412],
  'wj7KHz-4bVQ': DOWNTOWN,
  '4uOmnfHG1M0': DOWNTOWN,
  'wtid4NjIkiI': [32.2429, -111.1666],
  'I4qWzPCZKLs': [31.9035, -111.0000],
  'piSl5jGFaQM': [32.4810, -111.3080],
  '7o5Yz8UzA5M': [32.2199, -111.1280],
  '00xlRaZcbbk': [32.2887, -110.9785],
}

function coordinatesFor(video: MapVideo): [number, number] | null {
  if (VIDEO_COORDINATES[video.id]) return VIDEO_COORDINATES[video.id]
  if (/tucson/i.test(video.title)) return DOWNTOWN
  return null
}

function loadLeaflet(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Leaflet only runs in the browser'))
  const existing = (window as any).L
  if (existing) return Promise.resolve(existing)

  if (!document.querySelector('link[data-vet-leaflet]')) {
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    stylesheet.setAttribute('data-vet-leaflet', 'true')
    document.head.appendChild(stylesheet)
  }

  return new Promise((resolve, reject) => {
    const current = document.querySelector('script[data-vet-leaflet]') as HTMLScriptElement | null
    if (current) {
      current.addEventListener('load', () => resolve((window as any).L), {once: true})
      current.addEventListener('error', reject, {once: true})
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.setAttribute('data-vet-leaflet', 'true')
    script.onload = () => resolve((window as any).L)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function markerHtml(count: number, selected = false) {
  const ring = selected ? 'box-shadow:0 0 0 4px rgba(255,255,255,.96),0 0 0 7px rgba(220,38,38,.38);' : 'box-shadow:0 4px 12px rgba(15,23,42,.28);'
  if (count > 1) {
    return '<div style="width:42px;height:42px;border-radius:9999px;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;font:900 13px/1 system-ui;border:3px solid #fff;'+ring+'"><span style="margin-right:2px;font-size:11px">▶</span>'+count+'</div>'
  }
  return '<div style="position:relative;width:38px;height:38px;border-radius:12px 12px 12px 3px;transform:rotate(-45deg);background:#dc2626;border:3px solid #fff;'+ring+'"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:white;font:900 14px/1 system-ui;transform:rotate(45deg)">▶</span></div>'
}

export function VideoMap({videos, videosVisible, selectedVideoId, onSelect}: Props) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const layerRef = useRef<LeafletLayerGroup | null>(null)
  const leafletRef = useRef<any>(null)
  const fittedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    loadLeaflet().then(L => {
      if (cancelled || !elementRef.current || mapRef.current) return
      leafletRef.current = L
      const map = L.map(elementRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        tap: true,
      }).setView(DOWNTOWN, 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      layerRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      setTimeout(() => map.invalidateSize(), 0)
    }).catch(() => {
      // Keep the surrounding page usable if the map CDN is temporarily unavailable.
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      layerRef.current = null
      leafletRef.current = null
    }
  }, [])

  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    const layer = layerRef.current
    if (!L || !map || !layer) return

    layer.clearLayers()
    if (!videosVisible) return

    const located = videos
      .map(video => ({video, coordinates: coordinatesFor(video)}))
      .filter((item): item is {video: MapVideo; coordinates: [number, number]} => Boolean(item.coordinates))

    const grouped = new Map<string, {coordinates: [number, number]; videos: MapVideo[]}>()
    for (const item of located) {
      const key = item.coordinates.map(value => value.toFixed(5)).join(',')
      const group = grouped.get(key)
      if (group) group.videos.push(item.video)
      else grouped.set(key, {coordinates: item.coordinates, videos: [item.video]})
    }

    for (const group of grouped.values()) {
      const selected = group.videos.some(video => video.id === selectedVideoId)
      const icon = L.divIcon({
        className: '',
        html: markerHtml(group.videos.length, selected),
        iconSize: group.videos.length > 1 ? [42, 42] : [38, 38],
        iconAnchor: group.videos.length > 1 ? [21, 21] : [19, 36],
      })
      const marker = L.marker(group.coordinates, {icon}).addTo(layer)

      if (group.videos.length === 1) {
        const video = group.videos[0]
        marker.on('click', () => onSelect(video))
        marker.bindTooltip(video.title, {direction: 'top', offset: [0, -14]})
      } else {
        marker.on('click', () => {
          const popup = document.createElement('div')
          popup.style.minWidth = '220px'

          const heading = document.createElement('div')
          heading.textContent = group.videos.length + ' videos grabados aquí'
          heading.style.font = '800 13px/1.3 system-ui'
          heading.style.marginBottom = '8px'
          popup.appendChild(heading)

          group.videos.forEach(video => {
            const button = document.createElement('button')
            button.type = 'button'
            button.style.cssText = 'display:flex;width:100%;gap:8px;align-items:center;text-align:left;border:0;border-top:1px solid #e5e7eb;background:#fff;padding:8px 0;cursor:pointer;color:#111827;font:700 12px/1.3 system-ui;'
            const img = document.createElement('img')
            img.src = video.thumbnailUrl
            img.alt = ''
            img.style.cssText = 'width:58px;height:34px;object-fit:cover;border-radius:6px;flex:none;'
            const label = document.createElement('span')
            label.textContent = video.title
            button.appendChild(img)
            button.appendChild(label)
            button.addEventListener('click', () => {
              onSelect(video)
              map.closePopup()
            })
            popup.appendChild(button)
          })

          L.popup({maxWidth: 300, closeButton: true})
            .setLatLng(group.coordinates)
            .setContent(popup)
            .openOn(map)
        })
      }
    }

    if (!fittedRef.current && located.length) {
      const bounds = L.latLngBounds(located.map(item => item.coordinates))
      map.fitBounds(bounds.pad(0.08), {maxZoom: 11})
      fittedRef.current = true
    }

    setTimeout(() => map.invalidateSize(), 0)
  }, [videos, videosVisible, selectedVideoId, onSelect])

  return <div ref={elementRef} className="absolute inset-0 h-full w-full" aria-label="Mapa interactivo de Tucson con videos de Vive en Tucson"/>
}
