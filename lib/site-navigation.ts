export const ACTIVITY_LINKS = [
  {label: 'Restaurantes', href: '/restaurantes'},
  {label: 'Atracciones', href: '/atracciones'},
  {label: 'Bares y vida nocturna', href: '/vida-nocturna'},
  {label: 'Museos', href: '/museos'},
  {label: 'Hiking y Outdoors', href: '/hiking-outdoors'},
] as const

export const AREA_LINKS = [
  {label: 'Tucson Downtown', slug: 'downtown-tucson'},
  {label: 'Oro Valley', slug: 'oro-valley'},
  {label: 'Marana', slug: 'marana'},
  {label: 'Catalina Foothills', slug: 'catalina-foothills'},
  {label: 'Sur de Tucson', slug: 'sur-de-tucson'},
  {label: 'Este de Tucson', slug: 'este-de-tucson'},
  {label: 'Vail', slug: 'vail'},
  {label: 'Sahuarita', slug: 'sahuarita'},
  {label: 'Noreste de Tucson', slug: 'noreste-de-tucson'},
] as const

type NavigationItem = {label: string; href: string; children?: never} | {label: string; href?: never; children: readonly {label: string; href: string}[]}
export const SITE_NAVIGATION: readonly NavigationItem[] = [
  {label: 'Inicio', href: '/#inicio'},
  {label: 'Qué hacer', children: ACTIVITY_LINKS},
  {label: 'Vivir en Tucson', children: AREA_LINKS.map(area => ({label: area.label, href: `/zonas/${area.slug}`}))},
  {label: 'Video del Mes', href: '/#video-del-mes'},
  {label: 'Comprar', href: '/comprar'},
  {label: 'Vender', href: '/vender'},
  {label: 'Videos', href: '/videos'},
  {label: 'Guías', href: '/#guias'},
  {label: 'Sobre Jorge', href: '/#sobre-jorge'},
  {label: 'Contacto', href: '/#contacto'},
]
