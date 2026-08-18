import { ChevronRight } from 'lucide-react'
import { CITIES } from '../data/catalog'
import { destinationById } from '../ranking'
import type { MapLevel } from '../types'

interface MapChromeProps {
  level: MapLevel
  countryId: string | null
  cityId: string | null
  onWorld: () => void
  onCountry: () => void
  onCity: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

function Crumb({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex min-h-11 items-center rounded-full px-3 font-[var(--hm-sans)] text-[11px] font-semibold tracking-wide transition ${
        active
          ? 'bg-[var(--hm-navy)] text-white'
          : 'border border-[var(--hm-hair2)] bg-white/95 text-[var(--hm-ink2)] hover:bg-white'
      }`}
    >
      {label}
    </button>
  )
}

export function MapChrome({
  level,
  countryId,
  cityId,
  onWorld,
  onCountry,
  onCity,
  onZoomIn,
  onZoomOut,
}: MapChromeProps) {
  const country = countryId ? destinationById(countryId) : null
  const city = cityId ? CITIES[cityId] : null

  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 z-50 flex max-w-[70%] flex-wrap items-center gap-1 sm:left-4 sm:top-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1">
          <Crumb
            label="World"
            active={level === 'world'}
            onClick={level === 'world' ? undefined : onWorld}
          />
          {country && level !== 'world' && (
            <>
              <ChevronRight className="size-3 text-[var(--hm-ink3)]" />
              <Crumb
                label={country.name}
                active={level === 'country'}
                onClick={level === 'country' ? undefined : onCountry}
              />
            </>
          )}
          {city && (level === 'city' || level === 'poi') && (
            <>
              <ChevronRight className="size-3 text-[var(--hm-ink3)]" />
              <Crumb
                label={city.name}
                active={level === 'city' || level === 'poi'}
                onClick={level === 'poi' ? onCity : undefined}
              />
            </>
          )}
        </div>
      </div>

      <div className="absolute right-3 top-3 z-50 flex flex-col gap-2 sm:right-4 sm:top-4">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={onZoomIn}
          className="flex size-11 items-center justify-center rounded-xl border border-[var(--hm-hair)] bg-white text-lg font-medium text-[var(--hm-ink)] shadow-[0_4px_14px_rgba(16,22,32,0.12)] transition hover:bg-[var(--hm-wash)]"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={onZoomOut}
          disabled={level === 'world'}
          className="flex size-11 items-center justify-center rounded-xl border border-[var(--hm-hair)] bg-white text-lg font-medium text-[var(--hm-ink)] shadow-[0_4px_14px_rgba(16,22,32,0.12)] transition hover:bg-[var(--hm-wash)] disabled:cursor-default disabled:opacity-40"
        >
          −
        </button>
      </div>
    </>
  )
}
