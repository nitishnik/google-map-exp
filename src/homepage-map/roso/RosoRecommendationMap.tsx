import { MapChrome } from '../components/MapChrome'
import type { AudienceId, MapLevel } from '../types'
import { CitySurface } from './CitySurface'
import { CountrySurface } from './CountrySurface'
import { GlobeSurface } from './GlobeSurface'
import { WorldSurface } from './WorldSurface'

export type RosoSurface = 'flat' | 'globe'

interface RosoRecommendationMapProps {
  surface: RosoSurface
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  onCountry: (id: string) => void
  onCity: (id: string) => void
  onPoi: (name: string) => void
  onWorld: () => void
  onBackCountry: () => void
  onBackCity: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function RosoRecommendationMap(props: RosoRecommendationMapProps) {
  const showGlobe = props.surface === 'globe' && props.level === 'world'

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--hm-sea)]">
      {showGlobe ? (
        <GlobeSurface {...props} />
      ) : props.level === 'country' && props.countryId ? (
        <CountrySurface {...props} countryId={props.countryId} />
      ) : (props.level === 'city' || props.level === 'poi') && props.cityId ? (
        <CitySurface {...props} cityId={props.cityId} />
      ) : (
        <WorldSurface {...props} />
      )}
      <MapChrome
        level={props.level}
        countryId={props.countryId}
        cityId={props.cityId}
        onWorld={props.onWorld}
        onCountry={props.onBackCountry}
        onCity={props.onBackCity}
        onZoomIn={props.onZoomIn}
        onZoomOut={props.onZoomOut}
      />
    </div>
  )
}
