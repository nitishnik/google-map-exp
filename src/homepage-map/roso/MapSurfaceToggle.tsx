import type { RosoSurface } from './RosoRecommendationMap'

interface MapSurfaceToggleProps {
  value: RosoSurface
  onChange: (next: RosoSurface) => void
}

export function MapSurfaceToggle({ value, onChange }: MapSurfaceToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Map surface"
      className="inline-flex shrink-0 rounded-full border border-black/10 bg-white p-0.5"
    >
      <ToggleButton active={value === 'flat'} onClick={() => onChange('flat')}>
        Flat
      </ToggleButton>
      <ToggleButton active={value === 'globe'} onClick={() => onChange('globe')}>
        Globe
      </ToggleButton>
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-9 min-w-11 rounded-full px-3 font-[var(--hm-sans)] text-[12px] font-semibold tracking-wide transition ${
        active
          ? 'bg-[var(--hm-navy)] text-white'
          : 'text-[var(--hm-ink2)] hover:text-[var(--hm-ink)]'
      }`}
    >
      {children}
    </button>
  )
}
