import type { AudienceId } from '../types'
import { matchlineCopy } from '../ranking'

interface MatchlineProps {
  aud: AudienceId
}

export function Matchline({ aud }: MatchlineProps) {
  return (
    <p className="font-[var(--hm-sans)] text-sm leading-relaxed text-[var(--hm-ink2)]">
      {matchlineCopy(aud)}
    </p>
  )
}
