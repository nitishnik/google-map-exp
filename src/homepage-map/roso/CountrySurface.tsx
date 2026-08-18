import { geoMercator, geoPath } from 'd3-geo'
import { useMemo, useRef, useState } from 'react'
import { pinsForLevel } from '../components/pinModels'
import { layoutPins, nearestPin } from '../geo/pinLayout'
import { useElementSize } from '../geo/useElementSize'
import { useMapGestures } from '../geo/useMapGestures'
import { countryFeature } from '../geo/worldData'
import type { AudienceId, MapLevel } from '../types'
import { LandLayer } from './LandLayer'
import { PinLayer } from './PinLayer'

const PAD = 44

export function CountrySurface({
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
  countryId: string
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
  const feature = countryFeature(countryId)

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
    if (width < 8 || height < 8 || !feature) return null
    const proj = geoMercator().fitExtent(
      [
        [PAD, PAD],
        [width - PAD, height - PAD],
      ],
      feature,
    )
    proj.scale(proj.scale() * 0.78)
    return proj
  }, [feature, height, width])

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
      mode: 'country',
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
      {path ? (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          <rect width={width} height={height} fill="var(--hm-sea)" />
          <LandLayer path={path} aud={aud} selectedId={countryId} />
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
