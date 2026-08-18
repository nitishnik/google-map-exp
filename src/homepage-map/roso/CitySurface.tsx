import { geoMercator } from 'd3-geo'
import { useMemo, useRef, useState } from 'react'
import { pinsForLevel } from '../components/pinModels'
import { CITIES } from '../data/catalog'
import { haversineKm, niceKm } from '../geo/distance'
import { layoutPins, nearestPin } from '../geo/pinLayout'
import { useElementSize } from '../geo/useElementSize'
import { useMapGestures } from '../geo/useMapGestures'
import type { AudienceId, MapLevel } from '../types'
import { PinLayer } from './PinLayer'

const PAD = 48

export function CitySurface({
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
  cityId: string
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
  const city = CITIES[cityId]

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

  const frame = useMemo(() => {
    if (!city) return null
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'MultiPoint' as const,
        coordinates: [
          [city.lng, city.lat],
          ...city.attractions.map((a) => [a.lng, a.lat] as [number, number]),
        ] as [number, number][],
      },
    }
  }, [city])

  const projection = useMemo(() => {
    if (width < 8 || height < 8 || !frame) return null
    return geoMercator().fitExtent(
      [
        [PAD, PAD],
        [width - PAD, height - PAD],
      ],
      frame,
    )
  }, [frame, height, width])

  const centre = projection && city ? projection([city.lng, city.lat]) : null

  const rings = useMemo(() => {
    if (!city || !projection || !centre) return []
    const maxKm = Math.max(
      1.5,
      ...city.attractions.map((a) =>
        haversineKm({ lat: city.lat, lng: city.lng }, a),
      ),
    )
    const steps = [
      ...new Set([
        niceKm(maxKm / 3),
        niceKm((maxKm * 2) / 3),
        niceKm(maxKm),
      ]),
    ]
    return steps.map((km) => {
      const north = projection([city.lng, city.lat + km / 110.574])
      const r = north ? Math.abs(north[1] - centre[1]) : 0
      return { km, r }
    })
  }, [centre, city, projection])

  const scale = rings[0]
  const scalePx = scale?.r ?? 0

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
      pad: 52,
      mode: 'city',
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
    <div
      ref={ref}
      className="relative h-full w-full touch-none overflow-hidden"
      style={{
        backgroundColor: '#f3efe7',
        backgroundImage:
          'radial-gradient(var(--hm-dot) 1.15px, transparent 1.25px)',
        backgroundSize: '11px 11px',
      }}
    >
      {centre && width > 0 ? (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {rings.map((ring) => (
            <circle
              key={ring.km}
              cx={centre[0]}
              cy={centre[1]}
              r={ring.r}
              fill="none"
              stroke="var(--hm-dot)"
              strokeWidth={1.1}
            />
          ))}
          <circle cx={centre[0]} cy={centre[1]} r={3.5} fill="var(--hm-navy)" />
          <text
            x={centre[0]}
            y={centre[1] + 16}
            textAnchor="middle"
            fill="var(--hm-ink2)"
            fontFamily="var(--hm-sans)"
            fontSize={10}
            fontWeight={500}
          >
            {city.name}
          </text>
          {scale && scalePx > 8 ? (
            <g transform={`translate(16, ${height - 28})`}>
              <line
                x1={0}
                y1={0}
                x2={scalePx}
                y2={0}
                stroke="var(--hm-ink)"
                strokeWidth={1.5}
              />
              <line
                x1={0}
                y1={-4}
                x2={0}
                y2={4}
                stroke="var(--hm-ink)"
                strokeWidth={1.5}
              />
              <line
                x1={scalePx}
                y1={-4}
                x2={scalePx}
                y2={4}
                stroke="var(--hm-ink)"
                strokeWidth={1.5}
              />
              <text
                x={scalePx / 2}
                y={14}
                textAnchor="middle"
                fill="var(--hm-ink)"
                fontFamily="var(--hm-sans)"
                fontSize={10}
                fontWeight={600}
              >
                {scale.km} km
              </text>
            </g>
          ) : null}
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
