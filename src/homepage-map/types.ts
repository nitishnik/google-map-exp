export type AudienceId = 'first' | 'family' | 'culture' | 'active' | 'budget'

export type MapLevel = 'world' | 'country' | 'city' | 'poi'

export type TierIndex = 0 | 1 | 2 | 3

export interface Audience {
  id: AudienceId
  label: string
}

/** Country preference fit: [tier, chips, why, tradeOff] */
export type CountryFit = [TierIndex, string[], string, string]

/** Attraction preference fit: [tier, why] */
export type AttractionFit = [TierIndex, string]

export interface Product {
  title: string
  rating: number
  reviews: number
  duration: string
  price: number
  why: string
  trade: string
  snip: string
  quote: string
}

export interface Attraction {
  name: string
  category: string
  lat: number
  lng: number
  from: number
  rating: number
  reviews: number
  fits: Partial<Record<AudienceId, AttractionFit>>
  products: Product[]
}

export interface CityCatalog {
  id: string
  countryId: string
  name: string
  lat: number
  lng: number
  picks: number
  attractions: Attraction[]
}

export interface Destination {
  id: string
  name: string
  lat: number
  lng: number
  cityId: string
  picks: number
  opts: number
  fits: Partial<Record<AudienceId, CountryFit>>
}

export const AUDIENCES: Audience[] = [
  { id: 'first', label: 'First visit' },
  { id: 'family', label: 'Family' },
  { id: 'culture', label: 'Culture & history' },
  { id: 'active', label: 'Active' },
  { id: 'budget', label: 'Budget-smart' },
]

export const TIERS = [
  'Best match',
  'Best alternative',
  'Also fits',
  'Worth considering',
] as const
