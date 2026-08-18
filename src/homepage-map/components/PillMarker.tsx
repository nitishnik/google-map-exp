import type { TierIndex } from '../types'

export interface PillFaceProps {
  label: string
  count?: number
  tier: TierIndex
  selected?: boolean
  quiet?: boolean
  showLabel?: boolean
  showCount?: boolean
}

export interface PillMarkerProps extends PillFaceProps {
  x: number
  y: number
  onClick: () => void
  zIndex?: number
}

const TIER_DOT: Record<TierIndex, string> = {
  0: 'bg-[var(--hm-red)]',
  1: 'bg-[var(--hm-navy)]',
  2: 'bg-[#9aa3ad]',
  3: 'bg-[#c4c9cf]',
}

const TIER_CNT: Record<TierIndex, string> = {
  0: 'bg-[var(--hm-red)] text-white',
  1: 'bg-[var(--hm-navy)] text-white',
  2: 'bg-[#d8dde2] text-[var(--hm-ink)]',
  3: 'bg-transparent text-[var(--hm-ink)]',
}

export function PillFace({
  label,
  count,
  tier,
  selected = false,
  quiet = false,
  showLabel = true,
  showCount = true,
}: PillFaceProps) {
  const countVisible = showCount && typeof count === 'number' && count > 0

  return (
    <span
      className={`inline-flex max-w-[160px] items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-[var(--hm-sans)] text-[12px] font-semibold shadow-[0_4px_14px_rgba(16,22,32,0.12)] ${
        selected
          ? 'border-[var(--hm-navy)] bg-[var(--hm-navy)] text-white'
          : quiet
            ? 'border-[var(--hm-hair2)] bg-[#f4f1ea] text-[var(--hm-ink)]'
            : 'border-[var(--hm-hair)] bg-white text-[var(--hm-ink)]'
      }`}
    >
      <span
        className={`inline-block size-1.5 shrink-0 rounded-full ${
          selected ? 'bg-white' : TIER_DOT[tier]
        }`}
      />
      {showLabel ? <span className="truncate">{label}</span> : null}
      {countVisible ? (
        <span
          className={`ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            selected ? 'bg-white/20 text-white' : TIER_CNT[tier]
          }`}
        >
          {count}
        </span>
      ) : null}
    </span>
  )
}

export function PillMarker({
  x,
  y,
  onClick,
  zIndex = 10,
  selected = false,
  ...face
}: PillMarkerProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{ left: x, top: y, zIndex: selected ? zIndex + 20 : zIndex }}
      className="pointer-events-auto absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      aria-label={face.label}
    >
      <PillFace selected={selected} {...face} />
    </button>
  )
}
