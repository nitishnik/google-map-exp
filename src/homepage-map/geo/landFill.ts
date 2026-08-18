import { destinationById, tierOf } from '../ranking'
import type { AudienceId } from '../types'

export function landFill(
  destId: string | null,
  aud: AudienceId,
  selectedId: string | null = null,
) {
  if (selectedId && destId === selectedId) return 'var(--hm-land-selected)'
  if (!destId) return 'var(--hm-land)'
  const dest = destinationById(destId)
  if (!dest) return 'var(--hm-land)'
  if (selectedId) return 'var(--hm-land)'
  return tierOf(dest, aud) <= 1 ? 'var(--hm-land-warm)' : 'var(--hm-land-covered)'
}
