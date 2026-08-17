import type { MapLevel } from '../types'
import type { CameraTarget } from '../useHomepageMap'

export function camera3dForLevel(camera: CameraTarget, level: MapLevel) {
  const range =
    level === 'world'
      ? 5_200_000
      : level === 'country'
        ? 380_000
        : level === 'poi'
          ? 1_600
          : 4_200
  const tilt =
    level === 'world' ? 48 : level === 'country' ? 58 : 67
  const heading = level === 'world' ? 18 : level === 'poi' ? 48 : 32

  return {
    center: {
      lat: camera.center.lat,
      lng: camera.center.lng,
      altitude: 0,
    },
    range,
    tilt,
    heading,
  }
}

export const TIER_PIN_COLORS: Record<
  0 | 1 | 2 | 3,
  { background: string; border: string; glyph: string }
> = {
  0: { background: '#e0261f', border: '#be1c16', glyph: '#ffffff' },
  1: { background: '#0d2233', border: '#08141f', glyph: '#ffffff' },
  2: { background: '#d8d0c4', border: '#b7b0a4', glyph: '#101620' },
  3: { background: '#ffffff', border: '#6b7280', glyph: '#101620' },
}
