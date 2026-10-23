export type VideoMapLocation = {
  label: string
  address: string
  mode: 'exact' | 'fallback'
}

/**
 * Manual overrides for videos whose filming location should appear on the Vive en Tucson map.
 * Exact venue/address data can replace these labels later without changing the map UI.
 */
export const VIDEO_MAP_LOCATION_OVERRIDES: Record<string, VideoMapLocation> = {
  // El Califa de León pop-up in the University of Arizona / University Boulevard area.
  'uhymFx81PjY': {
    label: 'University Boulevard / University of Arizona',
    address: 'University Boulevard, University of Arizona, Tucson, AZ',
    mode: 'exact',
  },
}

export const TUCSON_GENERAL_VIDEO_FALLBACK: VideoMapLocation = {
  label: 'Downtown Tucson',
  address: 'Downtown Tucson, Tucson, AZ',
  mode: 'fallback',
}

export function getVideoMapLocation(videoId: string, isGeneralTucsonVideo = false) {
  return VIDEO_MAP_LOCATION_OVERRIDES[videoId]
    ?? (isGeneralTucsonVideo ? TUCSON_GENERAL_VIDEO_FALLBACK : null)
}
