export type MapSurface = 'flat' | 'globe3d'

interface MapModeToggleProps {
  value: MapSurface
  onChange: (next: MapSurface) => void
}

export function MapModeToggle({ value, onChange }: MapModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Map surface"
      className="inline-flex shrink-0 rounded-full border border-black/10 bg-white p-0.5"
    >
      <ToggleButton
        active={value === 'flat'}
        onClick={() => onChange('flat')}
      >
        Flat map
      </ToggleButton>
      <ToggleButton
        active={value === 'globe3d'}
        onClick={() => onChange('globe3d')}
      >
        3D map
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
      className={`h-9 rounded-full px-3 font-[var(--hm-sans)] text-[12px] font-semibold tracking-wide transition ${
        active
          ? 'bg-[var(--hm-navy)] text-white'
          : 'text-[var(--hm-ink2)] hover:text-[var(--hm-ink)]'
      }`}
    >
      {children}
    </button>
  )
}
