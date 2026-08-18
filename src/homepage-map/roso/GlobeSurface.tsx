import { geoDistance, geoOrthographic, geoPath } from 'd3-geo'
import { useMemo, useRef, useState } from 'react'
import { pinsForLevel } from '../components/pinModels'
import { layoutPins, nearestPin } from '../geo/pinLayout'
import { useElementSize } from '../geo/useElementSize'
import { useMapGestures } from '../geo/useMapGestures'
import type { AudienceId, MapLevel } from '../types'
import { LandLayer } from './LandLayer'
import { PinLayer } from './PinLayer'

export function GlobeSurface({
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
  const [rotate, setRotate] = useState<[number, number]>([-32, -22])

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
    return geoOrthographic()
      .rotate([rotate[0], rotate[1], 0])
      .translate([width / 2, height / 2])
      .scale(Math.min(width, height) * 0.46)
      .clipAngle(90)
  }, [height, rotate, width])

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  )

  const placed = useMemo(() => {
    if (!projection) return []
    const antipode: [number, number] = [-rotate[0], -rotate[1]]
    return layoutPins({
      pins,
      project: (lat, lng) => {
        if (geoDistance([lng, lat], antipode) > Math.PI / 2 - 0.06) return null
        const pt = projection([lng, lat])
        return pt ? [pt[0], pt[1]] : null
      },
      width,
      height,
      pad: 20,
      mode: 'globe',
    })
  }, [height, pins, projection, rotate, width])

  useMapGestures(ref, {
    onPan: (dx, dy) => {
      setRotate(([lam, phi]) => [
        lam + dx * 0.42,
        Math.max(-80, Math.min(80, phi - dy * 0.32)),
      ])
    },
    onZoomIn,
    onZoomOut,
    onTap: (x, y) => {
      const hit = nearestPin(placed, x, y, 22)
      hit?.pin.onClick()
    },
  })

  return (
    <div ref={ref} className="relative h-full w-full touch-none overflow-hidden">
      {path && width > 0 ? (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
        >
          <path d={path({ type: 'Sphere' }) ?? undefined} fill="var(--hm-sea)" />
          <LandLayer path={path} aud={aud} />
        </svg>
      ) : null}
      <PinLayer placed={placed} />
    </div>
  )
}
