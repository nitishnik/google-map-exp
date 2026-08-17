import type { TierIndex } from '../types'
import { tierLabel } from '../ranking'

const TIER_CLASS: Record<TierIndex, string> = {
  0: 'border border-[var(--hm-red)] bg-[var(--hm-red)] text-white',
  1: 'border border-[var(--hm-navy)] bg-white text-[var(--hm-navy)]',
  2: 'border border-transparent bg-[#d8d0c4] text-[var(--hm-ink)]',
  3: 'border border-dashed border-[var(--hm-ink3)] bg-white text-[var(--hm-ink)]',
}

export function TierBadge({
  tier,
  className = '',
}: {
  tier: TierIndex
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 font-[var(--hm-sans)] text-[10px] font-bold tracking-wide uppercase ${TIER_CLASS[tier]} ${className}`}
    >
      {tierLabel(tier)}
    </span>
  )
}
