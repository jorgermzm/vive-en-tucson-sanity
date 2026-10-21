export const PLACE_CATEGORIES = {
  'que-hacer': {title: 'Qué hacer en Tucson', label: 'Qué hacer', description: 'Museos, cultura y lugares para descubrir Tucson.', queries: ['museums in Tucson Arizona', 'tourist attractions in Tucson Arizona']},
  restaurantes: {title: 'Restaurantes en Tucson', label: 'Restaurantes', description: 'Descubre dónde comer en Tucson.', queries: ['restaurants in Tucson Arizona']},
  'vida-nocturna': {title: 'Bares y vida nocturna en Tucson', label: 'Bares y vida nocturna', description: 'Bares y lugares para disfrutar la noche en Tucson.', queries: ['bars in Tucson Arizona', 'night clubs in Tucson Arizona']},
} as const

export type PlaceCategory = keyof typeof PLACE_CATEGORIES
export function isPlaceCategory(value: string): value is PlaceCategory {
  return Object.hasOwn(PLACE_CATEGORIES, value)
}
