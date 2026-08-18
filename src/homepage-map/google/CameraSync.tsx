import { useEffect } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import type { CameraTarget } from '../useHomepageMap'

export function CameraSync({
  camera,
  tilt = 0,
  heading = 0,
}: {
  camera: CameraTarget
  tilt?: number
  heading?: number
}) {
  const map = useMap()
  const { lat, lng } = camera.center
  const zoom = camera.zoom
  const north = camera.bounds?.north
  const south = camera.bounds?.south
  const east = camera.bounds?.east
  const west = camera.bounds?.west

  useEffect(() => {
    if (!map) return
    map.setTilt(tilt)
    map.setHeading(heading)
    if (
      north != null &&
      south != null &&
      east != null &&
      west != null &&
      tilt === 0
    ) {
      map.fitBounds(
        { north, south, east, west },
        { top: 64, right: 72, bottom: 36, left: 28 },
      )
      return
    }
    map.panTo({ lat, lng })
    map.setZoom(zoom)
  }, [east, heading, lat, lng, map, north, south, tilt, west, zoom])

  return null
}
