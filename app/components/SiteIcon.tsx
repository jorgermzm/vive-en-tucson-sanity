import type {SVGProps} from 'react'

export type IconName = 'chat' | 'play' | 'home' | 'arrow' | 'menu' | 'close' | 'food' | 'mountain' | 'museum' | 'night' | 'calendar' | 'bag' | 'pin' | 'video'
const paths: Record<IconName, React.ReactNode> = {
  chat: <><path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-4.5A8 8 0 1 1 20 11.5Z"/><path d="M8 7.5c0 4.5 3 7.5 7.5 7.5l1-2.5-2.5-1-1 1a8 8 0 0 1-2.5-2.5l1-1-1-2.5Z"/></>,
  play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeLinejoin="round"/>,
  home: <><path d="m3 11 9-8 9 8M5 10v11h14V10"/><path d="M9 21v-8h6v8"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  close: <path d="m5 5 14 14M5 19 19 5"/>,
  food: <><path d="M5 3v7c0 3 5 3 5 0V3M7.5 3v18M18 3c-4 3-4 8 0 8V3Zm0 8v10"/></>,
  mountain: <><path d="m2 20 7-14 4 7 3-5 6 12ZM6 12l3 1 2-2"/><circle cx="17" cy="4" r="1"/></>,
  museum: <><path d="m3 8 9-5 9 5ZM3 21h18M5 11v7m5-7v7m4-7v7m5-7v7M3 19h18"/></>,
  night: <><path d="m3 3 9 10 9-10ZM12 13v8m-4 0h8M7 7h10"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h3m4 0h3m-10 3h3"/></>,
  bag: <><path d="M4 7h16l-1 14H5ZM8 8V6a4 4 0 0 1 8 0v2"/></>,
  pin: <><path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/></>,
  video: <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/></>,
}
export function SiteIcon({name, ...props}: SVGProps<SVGSVGElement> & {name: IconName}) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}
