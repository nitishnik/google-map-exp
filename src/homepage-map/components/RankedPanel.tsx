import { CITIES } from '../data/catalog'
import {
  audienceLabel,
  chipsCountry,
  cityTier,
  destinationById,
  factChip,
  rankedAttractions,
  rankedCities,
  rankedDestinations,
  rankedProducts,
  tierAttraction,
  tierOf,
  tradeCountry,
  whyAttraction,
  whyCountry,
} from '../ranking'
import type { AudienceId, MapLevel } from '../types'
import { TierBadge } from './TierBadge'

interface RankedPanelProps {
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  onCountry: (id: string) => void
  onCity: (id: string) => void
  onPoi: (name: string) => void
}

function PhotoSlot({ label }: { label: string }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--hm-wash)] text-[9px] font-medium tracking-wide text-[var(--hm-ink3)] uppercase">
      {label.slice(0, 3)}
    </div>
  )
}

export function RankedPanel({
  aud,
  level,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
}: RankedPanelProps) {
  if (level === 'world') {
    const list = rankedDestinations(aud)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-[var(--hm-sans)] text-base font-semibold text-[var(--hm-ink)]">
            Destinations
          </h4>
          <span className="font-[var(--hm-sans)] text-xs font-medium tracking-wide text-[var(--hm-ink3)] uppercase">
            Ranked for {audienceLabel(aud)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {list.map((c) => {
            const city = CITIES[c.cityId]
            const t = tierOf(c, aud)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onCountry(c.id)}
                className="flex min-h-11 w-full items-start gap-3 rounded-2xl border border-[var(--hm-hair)] bg-white p-3 text-left transition hover:border-[var(--hm-hair2)]"
              >
                <PhotoSlot label={c.name} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <TierBadge tier={t} />
                    {chipsCountry(c, aud)
                      .slice(0, 1)
                      .map((chip) => (
                        <span
                          key={chip}
                          className="rounded-md bg-[var(--hm-wash)] px-2 py-0.5 font-[var(--hm-sans)] text-[10px] font-medium text-[var(--hm-ink2)]"
                        >
                          {chip}
                        </span>
                      ))}
                  </div>
                  <h5 className="font-[var(--hm-sans)] text-sm font-semibold text-[var(--hm-ink)]">
                    {c.name}{' '}
                    <small className="font-normal text-[var(--hm-ink3)]">
                      · {city?.name}
                    </small>
                  </h5>
                  <p className="mt-1 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
                    {whyCountry(c, aud)}
                  </p>
                  <p className="mt-2 font-[var(--hm-sans)] text-[11px] font-semibold tracking-wide text-[var(--hm-ink)] uppercase">
                    {c.picks} picks from {c.opts}
                  </p>
                </div>
                <span className="mt-1 text-[var(--hm-ink3)]">›</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (level === 'country' && countryId) {
    const dest = destinationById(countryId)
    const cities = rankedCities(countryId)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-[var(--hm-sans)] text-base font-semibold text-[var(--hm-ink)]">
            {dest?.name} · {cities.length} cities
          </h4>
          <span className="font-[var(--hm-sans)] text-xs font-medium tracking-wide text-[var(--hm-ink3)] uppercase">
            Ranked for {audienceLabel(aud)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {cities.map((city) => {
            const t = cityTier(city, countryId)
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onCity(city.id)}
                className="flex min-h-11 w-full items-start gap-3 rounded-2xl border border-[var(--hm-hair)] bg-white p-3 text-left transition hover:border-[var(--hm-hair2)]"
              >
                <PhotoSlot label={city.name} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <TierBadge tier={t} />
                    {dest
                      ? chipsCountry(dest, aud)
                          .slice(0, 1)
                          .map((chip) => (
                            <span
                              key={chip}
                              className="rounded-md bg-[var(--hm-wash)] px-2 py-0.5 font-[var(--hm-sans)] text-[10px] font-medium text-[var(--hm-ink2)]"
                            >
                              {chip}
                            </span>
                          ))
                      : null}
                  </div>
                  <h5 className="font-[var(--hm-sans)] text-sm font-semibold text-[var(--hm-ink)]">
                    {city.name}
                    {dest?.cityId === city.id ? (
                      <small className="font-normal text-[var(--hm-ink3)]">
                        {' '}
                        · default base
                      </small>
                    ) : null}
                  </h5>
                  <p className="mt-1 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
                    {dest ? whyCountry(dest, aud) : ''}
                  </p>
                  <p className="mt-2 font-[var(--hm-sans)] text-[11px] font-semibold tracking-wide text-[var(--hm-ink)] uppercase">
                    {city.picks} picks
                  </p>
                </div>
                <span className="mt-1 text-[var(--hm-ink3)]">›</span>
              </button>
            )
          })}
        </div>
        {dest ? (
          <div className="rounded-xl border border-[var(--hm-hair)] bg-[var(--hm-wash)] px-3 py-2.5">
            <p className="font-[var(--hm-sans)] text-[11px] font-bold tracking-wide text-[var(--hm-ink)] uppercase">
              Trade-off
            </p>
            <p className="mt-1 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
              {tradeCountry(dest, aud)}
            </p>
          </div>
        ) : null}
      </div>
    )
  }

  if (level === 'city' && cityId) {
    const city = CITIES[cityId]
    const list = rankedAttractions(cityId, aud)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-[var(--hm-sans)] text-base font-semibold text-[var(--hm-ink)]">
            {city.name} · {list.length} attractions
          </h4>
          <span className="font-[var(--hm-sans)] text-xs font-medium tracking-wide text-[var(--hm-ink3)] uppercase">
            Prioritised for {audienceLabel(aud)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {list.map((a) => {
            const t = tierAttraction(a, aud)
            return (
              <button
                key={a.name}
                type="button"
                onClick={() => onPoi(a.name)}
                className="flex min-h-11 w-full items-start gap-3 rounded-2xl border border-[var(--hm-hair)] bg-white p-3 text-left transition hover:border-[var(--hm-hair2)]"
              >
                <PhotoSlot label={a.name} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <TierBadge tier={t} />
                    <span className="rounded-md bg-[var(--hm-wash)] px-2 py-0.5 font-[var(--hm-sans)] text-[10px] font-medium text-[var(--hm-ink2)]">
                      {factChip(a)}
                    </span>
                  </div>
                  <h5 className="font-[var(--hm-sans)] text-sm font-semibold text-[var(--hm-ink)]">
                    {a.name}{' '}
                    <small className="font-normal text-[var(--hm-ink3)]">
                      · {a.category}
                    </small>
                  </h5>
                  <p className="mt-1 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
                    {whyAttraction(a, aud)}
                  </p>
                  <p className="mt-2 font-[var(--hm-sans)] text-[11px] text-[var(--hm-ink2)]">
                    ★ {a.rating} ({a.reviews.toLocaleString('en-US')}) · from €
                    {a.from}
                  </p>
                </div>
                <span className="mt-1 text-[var(--hm-ink3)]">›</span>
              </button>
            )
          })}
        </div>
        <div className="rounded-xl border border-[var(--hm-hair)] bg-[var(--hm-wash)] px-3 py-2.5">
          <p className="font-[var(--hm-sans)] text-[11px] font-bold tracking-wide text-[var(--hm-ink)] uppercase">
            Trade-off
          </p>
          <p className="mt-1 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
            {tradeCountry(destinationById(city.countryId)!, aud)}
          </p>
        </div>
      </div>
    )
  }

  if (level === 'poi' && cityId && poiName) {
    const city = CITIES[cityId]
    const a = city.attractions.find((x) => x.name === poiName)
    if (!a) return null
    const t = tierAttraction(a, aud)
    const products = rankedProducts(a)
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-[var(--hm-sans)] text-base font-semibold text-[var(--hm-ink)]">
            {a.name} · {products.length} product
            {products.length > 1 ? 's' : ''}
          </h4>
          <TierBadge tier={t} />
        </div>
        {products.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-[var(--hm-hair)] bg-white p-3"
          >
            <div className="flex gap-3">
              <PhotoSlot label={a.name} />
              <div className="min-w-0 flex-1">
                <h5 className="font-[var(--hm-sans)] text-sm font-semibold text-[var(--hm-ink)]">
                  {p.title}
                </h5>
                <p className="mt-1 font-[var(--hm-sans)] text-[11px] text-[var(--hm-ink2)]">
                  ★ {p.rating} ({p.reviews.toLocaleString('en-US')}) · {p.duration}{' '}
                  · €{p.price}
                </p>
              </div>
            </div>
            <p className="mt-3 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
              <strong className="text-[var(--hm-ink)]">Why this fits:</strong> {p.why}
            </p>
            <div className="mt-2 rounded-lg bg-[var(--hm-wash)] px-2.5 py-2">
              <p className="font-[var(--hm-sans)] text-[11px] font-bold tracking-wide text-[var(--hm-ink)] uppercase">
                Trade-off
              </p>
              <p className="mt-1 font-[var(--hm-sans)] text-xs text-[var(--hm-ink2)]">
                {p.trade}
              </p>
            </div>
            <div className="mt-3 border-t border-[var(--hm-hair)] pt-3">
              <p className="font-[var(--hm-sans)] text-[10px] font-semibold tracking-wide text-[var(--hm-ink3)] uppercase">
                Reviews for {audienceLabel(aud).toLowerCase()}
              </p>
              <q className="mt-1 block font-[var(--hm-disp)] text-sm italic text-[var(--hm-ink)]">
                {p.quote}
              </q>
              <p className="mt-1 font-[var(--hm-sans)] text-[11px] text-[var(--hm-ink3)]">
                Showing {audienceLabel(aud).toLowerCase()} travellers because{' '}
                {whyAttraction(a, aud).charAt(0).toLowerCase()}
                {whyAttraction(a, aud).slice(1)} {p.snip}
              </p>
            </div>
            <button
              type="button"
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--hm-navy)] px-3 font-[var(--hm-sans)] text-sm font-semibold text-white transition hover:bg-[#143247]"
            >
              Check dates · from €{p.price}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return null
}
