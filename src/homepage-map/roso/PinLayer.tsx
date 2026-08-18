import { PillMarker } from '../components/PillMarker'
import type { PlacedPin } from '../geo/pinLayout'

export function PinLayer({
  placed,
  panX = 0,
  panY = 0,
}: {
  placed: PlacedPin[]
  panX?: number
  panY?: number
}) {
  return (
    <>
      {placed
        .filter((p) => !p.heldBack)
        .map(({ pin, x, y, showLabel, showCount }) => (
          <PillMarker
            key={pin.key}
            x={x + panX}
            y={y + panY}
            label={pin.label}
            count={pin.count}
            tier={pin.tier}
            selected={pin.selected}
            quiet={pin.quiet}
            showLabel={showLabel}
            showCount={showCount}
            zIndex={pin.selected ? 40 : 20 + (3 - pin.rank)}
            onClick={pin.onClick}
          />
        ))}
    </>
  )
}
