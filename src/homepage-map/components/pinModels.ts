import {
  cityTier,
  rankedAttractions,
  rankedCities,
  rankedDestinations,
  tierAttraction,
  tierOf,
} from '../ranking'
import type { AudienceId, MapLevel, TierIndex } from '../types'

export interface MapPin {
  key: string
  lat: number
  lng: number
  label: string
  count?: number
  tier: TierIndex
  selected?: boolean
  quiet?: boolean
  rank: number
  onClick: () => void
}

export function pinsForLevel({
  aud,
  level,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
}: {
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  onCountry: (id: string) => void
  onCity: (id: string) => void
  onPoi: (name: string) => void
}): MapPin[] {
  if (level === 'world') {
    return rankedDestinations(aud).map((d, i) => ({
      key: d.id,
      lat: d.lat,
      lng: d.lng,
      label: d.name,
      count: d.picks,
      tier: tierOf(d, aud),
      rank: i,
      onClick: () => onCountry(d.id),
    }))
  }

  if (level === 'country' && countryId) {
    return rankedCities(countryId, aud).map((city, i) => ({
      key: city.id,
      lat: city.lat,
      lng: city.lng,
      label: city.name,
      count: city.picks,
      tier: cityTier(city, aud),
      selected: i === 0,
      rank: i,
      onClick: () => onCity(city.id),
    }))
  }

  if ((level === 'city' || level === 'poi') && cityId) {
    return rankedAttractions(cityId, aud).map((a, i) => {
      const selected = poiName === a.name
      return {
        key: a.name,
        lat: a.lat,
        lng: a.lng,
        label: a.name,
        tier: tierAttraction(a, aud),
        selected,
        quiet: level === 'poi' && !selected,
        rank: i,
        onClick: () => onPoi(a.name),
      }
    })
  }

  return []
}
