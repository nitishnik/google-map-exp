import { useEffect, useRef } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { CITIES } from '../data/catalog'
import { MAP_DOT, MAP_NAVY } from './mapColors'

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)))
}

function niceKm(value: number) {
  if (value <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(value))
  const n = value / pow
  const step = n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10
  return step * pow
}

export function CityRingsLayer({ cityId }: { cityId: string | null }) {
  const map = useMap()
  const maps = useMapsLibrary('maps')
  const shapes = useRef<google.maps.Circle[]>([])

  useEffect(() => {
    shapes.current.forEach((c) => c.setMap(null))
    shapes.current = []
    if (!map || !maps || !cityId) return
    const city = CITIES[cityId]
    if (!city) return

    const maxKm = Math.max(
      1.5,
      ...city.attractions.map((a) =>
        haversineKm({ lat: city.lat, lng: city.lng }, a),
      ),
    )
    const rings = [...new Set([niceKm(maxKm / 3), niceKm((maxKm * 2) / 3), niceKm(maxKm)])]

    const centre = new maps.Circle({
      map,
      center: { lat: city.lat, lng: city.lng },
      radius: 90,
      fillColor: MAP_NAVY,
      fillOpacity: 1,
      strokeWeight: 0,
      clickable: false,
      zIndex: 3,
    })
    shapes.current.push(centre)

    for (const km of rings) {
      shapes.current.push(
        new maps.Circle({
          map,
          center: { lat: city.lat, lng: city.lng },
          radius: km * 1000,
          fillOpacity: 0,
          strokeColor: MAP_DOT,
          strokeOpacity: 0.85,
          strokeWeight: 1.1,
          clickable: false,
          zIndex: 1,
        }),
      )
    }

    return () => {
      shapes.current.forEach((c) => c.setMap(null))
      shapes.current = []
    }
  }, [cityId, map, maps])

  return null
}
