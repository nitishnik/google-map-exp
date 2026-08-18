import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { useMemo, useRef, useState } from 'react'
import { pinsForLevel } from '../components/pinModels'
import { DESTINATIONS } from '../data/catalog'
import { layoutPins, nearestPin } from '../geo/pinLayout'
import { useElementSize } from '../geo/useElementSize'
import { useMapGestures } from '../geo/useMapGestures'
import type { AudienceId, MapLevel } from '../types'
import { LandLayer } from './LandLayer'
import { PinLayer } from './PinLayer'

const PAD = 52

const DEST_POINTS = {
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'MultiPoint' as const,
    coordinates: DESTINATIONS.map((d) => [d.lng, d.lat] as [number, number]),
  },
}

export function WorldSurface({
  aud,
  level,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
  onZoomIn,
  onZoomOut,
}: {
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  onCountry: (id: string) => void
  onCity: (id: string) => void
  onPoi: (name: string) => void
  onZoomIn: () => void
  onZoomOut: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(ref)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const pins = pinsForLevel({
    aud,
    level,
    countryId,
    cityId,
    poiName,
    onCountry,
    onCity,
    onPoi,
  })

  const projection = useMemo(() => {
    if (width < 8 || height < 8) return null
    return geoNaturalEarth1().fitExtent(
      [
        [PAD, PAD],
        [width - PAD, height - PAD],
      ],
      DEST_POINTS,
    )
  }, [height, width])

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  )

  const placed = useMemo(() => {
    if (!projection) return []
    return layoutPins({
      pins,
      project: (lat, lng) => {
        const pt = projection([lng, lat])
        return pt ? [pt[0], pt[1]] : null
      },
      width,
      height,
      pad: 56,
      mode: 'world',
    })
  }, [height, pins, projection, width])

  useMapGestures(ref, {
    onPan: (dx, dy) => setPan((p) => ({ x: p.x + dx, y: p.y + dy })),
    onZoomIn,
    onZoomOut,
    onTap: (x, y) => {
      const hit = nearestPin(placed, x - pan.x, y - pan.y, 22)
      hit?.pin.onClick()
    },
  })

  return (
    <div ref={ref} className="relative h-full w-full touch-none overflow-hidden">
      {path && projection ? (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          <path d={path({ type: 'Sphere' }) ?? undefined} fill="var(--hm-sea)" />
          <LandLayer path={path} aud={aud} />
        </svg>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <div className="pointer-events-auto relative h-full w-full">
          <PinLayer placed={placed} />
        </div>
      </div>
    </div>
  )
}
