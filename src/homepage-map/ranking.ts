import {
  AUDIENCES,
  TIERS,
  type AudienceId,
  type Attraction,
  type CityCatalog,
  type Destination,
  type Product,
  type TierIndex,
} from './types'
import { CITIES, DESTINATIONS } from './data/catalog'

export function audienceLabel(id: AudienceId): string {
  return AUDIENCES.find((a) => a.id === id)?.label ?? id
}

export function destinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id)
}

export function fitCountry(dest: Destination, aud: AudienceId) {
  return dest.fits[aud] ?? null
}

export function tierOf(dest: Destination, aud: AudienceId): TierIndex {
  const fit = fitCountry(dest, aud)
  return fit ? fit[0] : 3
}

export function rankedDestinations(aud: AudienceId): Destination[] {
  return DESTINATIONS.slice().sort(
    (a, b) => tierOf(a, aud) - tierOf(b, aud) || b.picks - a.picks,
  )
}

export function bestAudFor(dest: Destination) {
  const keys = Object.keys(dest.fits) as AudienceId[]
  const best = keys.sort((x, y) => dest.fits[x]![0] - dest.fits[y]![0])[0]
  return {
    id: best,
    label: audienceLabel(best),
    fit: dest.fits[best]!,
  }
}

export function whyCountry(dest: Destination, aud: AudienceId): string {
  const fit = fitCountry(dest, aud)
  if (fit) return fit[2]
  const best = bestAudFor(dest)
  const why = best.fit[2]
  return `Strongest for ${best.label.toLowerCase()} rather than ${audienceLabel(aud).toLowerCase()} — ${why.charAt(0).toLowerCase()}${why.slice(1)}`
}

export function tradeCountry(dest: Destination, aud: AudienceId): string {
  const fit = fitCountry(dest, aud)
  if (fit) return fit[3]
  return `Inventory here is built around ${bestAudFor(dest).label.toLowerCase()}, so expect fewer ${audienceLabel(aud).toLowerCase()} formats.`
}

export function chipsCountry(dest: Destination, aud: AudienceId): string[] {
  const fit = fitCountry(dest, aud)
  if (fit) return fit[1]
  return [`Best for ${bestAudFor(dest).label.toLowerCase()}`]
}

export function fitAttraction(a: Attraction, aud: AudienceId) {
  return a.fits[aud] ?? null
}

export function tierAttraction(a: Attraction, aud: AudienceId): TierIndex {
  const fit = fitAttraction(a, aud)
  return fit ? fit[0] : 3
}

export function rankedAttractions(cityId: string, aud: AudienceId): Attraction[] {
  const city = CITIES[cityId]
  if (!city) return []
  return city.attractions
    .slice()
    .sort(
      (x, y) =>
        tierAttraction(x, aud) - tierAttraction(y, aud) || y.reviews - x.reviews,
    )
    .slice(0, 4)
}

export function cityTier(
  city: CityCatalog,
  aud: AudienceId,
): TierIndex {
  if (city.attractions.length === 0) return 3
  return Math.min(
    ...city.attractions.map((attraction) => tierAttraction(attraction, aud)),
  ) as TierIndex
}

export function rankedCities(
  countryId: string,
  aud: AudienceId = 'family_traveler',
): CityCatalog[] {
  const dest = destinationById(countryId)
  return Object.values(CITIES)
    .filter((c) => c.countryId === countryId)
    .sort((a, b) => {
      const tierDifference = cityTier(a, aud) - cityTier(b, aud)
      if (tierDifference !== 0) return tierDifference
      if (dest && a.id === dest.cityId) return -1
      if (dest && b.id === dest.cityId) return 1
      return b.picks - a.picks
    })
    .slice(0, 8)
}

export function leadAttraction(city: CityCatalog, aud: AudienceId) {
  return city.attractions
    .slice()
    .sort(
      (a, b) =>
        tierAttraction(a, aud) - tierAttraction(b, aud) ||
        b.reviews - a.reviews,
    )[0]
}

export function whyCity(city: CityCatalog, aud: AudienceId) {
  const attraction = leadAttraction(city, aud)
  return attraction
    ? whyAttraction(attraction, aud)
    : `No prioritised attraction is available for ${audienceLabel(aud).toLowerCase()}.`
}

export function cityReasonChip(city: CityCatalog, aud: AudienceId) {
  const attraction = leadAttraction(city, aud)
  return attraction ? factChip(attraction) : 'Limited recommendation data'
}

export function rankedProducts(a: Attraction): Product[] {
  const seen = new Set<string>()
  const unique: Product[] = []
  for (const p of a.products) {
    const key = `${p.duration}|${p.price}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(p)
  }
  return unique.slice(0, 3)
}

export function bestAudAttraction(a: Attraction) {
  const keys = Object.keys(a.fits) as AudienceId[]
  const best = keys.sort((x, y) => a.fits[x]![0] - a.fits[y]![0])[0]
  return {
    id: best,
    label: audienceLabel(best),
    why: a.fits[best]![1],
  }
}

export function whyAttraction(a: Attraction, aud: AudienceId): string {
  const fit = fitAttraction(a, aud)
  if (fit) return fit[1]
  const best = bestAudAttraction(a)
  return `Prioritised for ${best.label.toLowerCase()} rather than ${audienceLabel(aud).toLowerCase()} — ${best.why.charAt(0).toLowerCase()}${best.why.slice(1)}`
}

function durationMinutes(d: string): number {
  const hourMatch = d.match(/(\d+)\s*h/)
  const minMatch = d.match(/(\d+)\s*m/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const mins = minMatch ? Number(minMatch[1]) : 0
  return hours * 60 + mins || 1e6
}

export function factChip(a: Attraction): string {
  const durations = a.products.map((p) => p.duration)
  const shortest = durations
    .slice()
    .sort((x, y) => durationMinutes(x) - durationMinutes(y))[0]
  return `Clear ${shortest} format`
}

export function matchedCount(aud: AudienceId): number {
  return DESTINATIONS.filter((d) => tierOf(d, aud) <= 1).length
}

export function audienceMatchCount(aud: AudienceId): number {
  return DESTINATIONS.filter((d) => {
    const fit = d.fits[aud]
    return fit ? fit[0] <= 1 : false
  }).length
}

export function tierLabel(tier: TierIndex): string {
  return TIERS[tier]
}

export function matchlineCopy(aud: AudienceId): string {
  const ranked = rankedDestinations(aud)
  const best = ranked.filter((d) => tierOf(d, aud) === 0).length
  const alt = ranked.filter((d) => tierOf(d, aud) === 1).length
  const label = audienceLabel(aud).toLowerCase()
  const bestPart = best === 1 ? '1 best match' : `${best} best matches`
  const altPart = alt === 1 ? '1 best alternative' : `${alt} best alternatives`
  return `${bestPart} and ${altPart} for ${label}. Everything else stays on the map, labelled honestly.`
}
