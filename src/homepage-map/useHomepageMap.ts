import { useCallback, useMemo, useState } from 'react'
import { CITIES, DESTINATIONS } from './data/catalog'
import { geoBounds, padLiteral } from './geo/bounds'
import { countryFeature } from './geo/worldData'
import {
  audienceLabel,
  cityTier,
  destinationById,
  rankedAttractions,
  rankedCities,
  rankedDestinations,
  tierAttraction,
  tierOf,
} from './ranking'
import type { AudienceId, MapLevel } from './types'

export interface CameraTarget {
  center: { lat: number; lng: number }
  zoom: number
  bounds?: { north: number; south: number; east: number; west: number }
}

export interface HomepageMapState {
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  flash: string | null
  camera: CameraTarget
  setAud: (id: AudienceId) => void
  goCountry: (id: string) => void
  goCity: (id: string) => void
  goPoi: (name: string) => void
  backWorld: () => void
  backCountry: () => void
  backCity: () => void
  zoomIn: () => void
  zoomOut: () => void
  clearFlash: () => void
}

function padBounds(
  points: { lat: number; lng: number }[],
  pad = 0.35,
): CameraTarget['bounds'] {
  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  return {
    north: Math.max(...lats) + pad,
    south: Math.min(...lats) - pad,
    east: Math.max(...lngs) + pad,
    west: Math.min(...lngs) - pad,
  }
}

function worldCamera(): CameraTarget {
  const points = DESTINATIONS.map((d) => ({ lat: d.lat, lng: d.lng }))
  return {
    center: { lat: 30, lng: 40 },
    zoom: 2.4,
    bounds: padBounds(points, 8),
  }
}

function countryCamera(
  countryId: string,
  aud: AudienceId,
): CameraTarget {
  const dest = destinationById(countryId)!
  const cities = rankedCities(countryId, aud)
  const feature = countryFeature(countryId)
  const bounds = feature
    ? padLiteral(geoBounds(feature.geometry), 0.55)
    : padBounds(
        [
          { lat: dest.lat, lng: dest.lng },
          ...cities.map((c) => ({ lat: c.lat, lng: c.lng })),
        ],
        0.8,
      )
  return {
    center: cities[0]
      ? { lat: cities[0].lat, lng: cities[0].lng }
      : dest,
    zoom: 6.2,
    bounds,
  }
}

function cityCamera(cityId: string): CameraTarget {
  const city = CITIES[cityId]
  const points = [
    { lat: city.lat, lng: city.lng },
    ...city.attractions.map((a) => ({ lat: a.lat, lng: a.lng })),
  ]
  return {
    center: { lat: city.lat, lng: city.lng },
    zoom: 12,
    bounds: padBounds(points, 0.04),
  }
}

function poiCamera(cityId: string, _poiName: string): CameraTarget {
  return cityCamera(cityId)
}

export function useHomepageMap(): HomepageMapState {
  const [aud, setAudState] = useState<AudienceId>('family')
  const [level, setLevel] = useState<MapLevel>('world')
  const [countryId, setCountryId] = useState<string | null>(null)
  const [cityId, setCityId] = useState<string | null>(null)
  const [poiName, setPoiName] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [camera, setCamera] = useState<CameraTarget>(() => worldCamera())

  const clearFlash = useCallback(() => setFlash(null), [])

  const goCountry = useCallback(
    (id: string) => {
      const dest = destinationById(id)
      if (!dest) return
      const cities = rankedCities(id, aud)
      setLevel('country')
      setCountryId(id)
      setCityId(cities[0]?.id ?? dest.cityId)
      setPoiName(null)
      setCamera(countryCamera(id, aud))
      setFlash(`${dest.name} · ${cities.length} cities prioritised`)
    },
    [aud],
  )

  const goCity = useCallback(
    (id: string) => {
      const city = CITIES[id]
      if (!city) return
      setLevel('city')
      setCityId(id)
      setCountryId(city.countryId)
      setPoiName(null)
      setCamera(cityCamera(id))
      setFlash(
        `${city.name} · ${rankedAttractions(id, aud).length} attractions prioritised`,
      )
    },
    [aud],
  )

  const goPoi = useCallback(
    (name: string) => {
      const id = cityId ?? rankedDestinations(aud)[0]?.cityId
      if (!id) return
      const city = CITIES[id]
      const a = city.attractions.find((x) => x.name === name)
      if (!a) return
      setLevel('poi')
      setCityId(id)
      setCountryId(city.countryId)
      setPoiName(name)
      setCamera(poiCamera(id, name))
      setFlash(
        `${a.name} · ${a.products.length} product${a.products.length > 1 ? 's' : ''} from €${a.from}`,
      )
    },
    [aud, cityId],
  )

  const backWorld = useCallback(() => {
    setLevel('world')
    setCountryId(null)
    setCityId(null)
    setPoiName(null)
    setCamera(worldCamera())
  }, [])

  const backCountry = useCallback(() => {
    if (countryId) goCountry(countryId)
  }, [countryId, goCountry])

  const backCity = useCallback(() => {
    if (cityId) goCity(cityId)
  }, [cityId, goCity])

  const zoomIn = useCallback(() => {
    if (level === 'world') {
      goCountry(rankedDestinations(aud)[0].id)
      return
    }
    if (level === 'country' && countryId) {
      const top = rankedCities(countryId, aud)[0]
      if (top) goCity(top.id)
      return
    }
    if (level === 'city' && cityId) {
      const top = rankedAttractions(cityId, aud)[0]
      if (top) goPoi(top.name)
    }
  }, [aud, cityId, countryId, goCity, goCountry, goPoi, level])

  const zoomOut = useCallback(() => {
    if (level === 'poi' && cityId) {
      goCity(cityId)
      return
    }
    if (level === 'city' && countryId) {
      goCountry(countryId)
      return
    }
    if (level === 'country') {
      backWorld()
    }
  }, [backWorld, cityId, countryId, goCity, goCountry, level])

  const setAud = useCallback(
    (id: AudienceId) => {
      setAudState(id)
      setFlash(`Re-ranked for ${audienceLabel(id).toLowerCase()}`)
      const city = cityId ? CITIES[cityId] : null
      const attraction =
        city && poiName
          ? city.attractions.find((item) => item.name === poiName)
          : null
      const poorFit =
        (attraction && tierAttraction(attraction, id) > 2) ||
        (city && cityTier(city, id) > 2) ||
        (countryId && tierOf(destinationById(countryId)!, id) > 2)

      if (level !== 'world' && poorFit) {
        setLevel('world')
        setCountryId(null)
        setCityId(null)
        setPoiName(null)
        setCamera(worldCamera())
      }
    },
    [cityId, countryId, level, poiName],
  )

  return useMemo(
    () => ({
      aud,
      level,
      countryId,
      cityId,
      poiName,
      flash,
      camera,
      setAud,
      goCountry,
      goCity,
      goPoi,
      backWorld,
      backCountry,
      backCity,
      zoomIn,
      zoomOut,
      clearFlash,
    }),
    [
      aud,
      level,
      countryId,
      cityId,
      poiName,
      flash,
      camera,
      setAud,
      goCountry,
      goCity,
      goPoi,
      backWorld,
      backCountry,
      backCity,
      zoomIn,
      zoomOut,
      clearFlash,
    ],
  )
}
