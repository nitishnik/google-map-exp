import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import topology from 'world-atlas/countries-110m.json'
import { DEST_TO_NUMERIC } from './iso'

type WorldObjects = {
  countries: GeometryCollection
  land: GeometryCollection
}

const topo = topology as unknown as Topology<WorldObjects>

export const worldCountries = feature(
  topo,
  topo.objects.countries,
) as FeatureCollection<Geometry, { name: string }>

export function countryFeature(destId: string): Feature<Geometry, { name: string }> | undefined {
  const numeric = DEST_TO_NUMERIC[destId]
  if (!numeric) return undefined
  return worldCountries.features.find((f) => String(f.id) === numeric)
}
