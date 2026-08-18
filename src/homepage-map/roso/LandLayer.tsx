import type { GeoPath } from 'd3-geo'
import type { Geometry } from 'geojson'
import { destIdFromFeatureId } from '../geo/iso'
import { landFill } from '../geo/landFill'
import { worldCountries } from '../geo/worldData'
import type { AudienceId } from '../types'

export function LandLayer({
  path,
  aud,
  selectedId = null,
}: {
  path: GeoPath
  aud: AudienceId
  selectedId?: string | null
}) {
  return (
    <g>
      {worldCountries.features.map((feature, i) => {
        const d = path(feature as unknown as Geometry)
        if (!d) return null
        const destId = destIdFromFeatureId(feature.id)
        return (
          <path
            key={feature.id ?? i}
            d={d}
            fill={landFill(destId, aud, selectedId)}
            stroke="var(--hm-coast)"
            strokeWidth={0.45}
            vectorEffect="nonScalingStroke"
            style={{ transition: 'fill 280ms ease' }}
          />
        )
      })}
    </g>
  )
}
