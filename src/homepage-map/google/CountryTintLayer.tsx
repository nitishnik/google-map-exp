import { useEffect, useRef } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { destIdFromFeatureId } from '../geo/iso'
import { worldCountries } from '../geo/worldData'
import { destinationById, tierOf } from '../ranking'
import type { AudienceId, MapLevel } from '../types'
import {
  MAP_COAST,
  MAP_LAND,
  MAP_LAND_COVERED,
  MAP_LAND_SELECTED,
  MAP_LAND_WARM,
} from './mapColors'

function fillFor(
  destId: string | null,
  aud: AudienceId,
  selectedId: string | null,
  level: MapLevel,
) {
  if (level === 'country' && selectedId && destId === selectedId) {
    return MAP_LAND_SELECTED
  }
  if (!destId) return MAP_LAND
  const dest = destinationById(destId)
  if (!dest) return MAP_LAND
  if (level === 'country') return MAP_LAND
  return tierOf(dest, aud) <= 1 ? MAP_LAND_WARM : MAP_LAND_COVERED
}

export function CountryTintLayer({
  aud,
  level,
  selectedId,
}: {
  aud: AudienceId
  level: MapLevel
  selectedId: string | null
}) {
  const map = useMap()
  const maps = useMapsLibrary('maps')
  const dataRef = useRef<google.maps.Data | null>(null)

  useEffect(() => {
    if (!map || !maps) return

    const hide = level === 'city' || level === 'poi'
    if (hide) {
      dataRef.current?.setMap(null)
      return
    }

    if (!dataRef.current) {
      const data = new maps.Data({ map })
      data.addGeoJson(worldCountries)
      dataRef.current = data
    } else {
      dataRef.current.setMap(map)
    }

    dataRef.current.setStyle((feature) => {
      const destId = destIdFromFeatureId(feature.getId())
      const fill = fillFor(destId, aud, selectedId, level)
      return {
        fillColor: fill,
        fillOpacity: destId ? 0.88 : 0.62,
        strokeColor: MAP_COAST,
        strokeWeight: 0.7,
        strokeOpacity: 1,
        clickable: false,
        zIndex: destId ? 2 : 1,
      }
    })
  }, [aud, level, map, maps, selectedId])

  useEffect(() => {
    return () => {
      dataRef.current?.setMap(null)
      dataRef.current = null
    }
  }, [])

  return null
}
