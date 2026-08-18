import type { MapPin } from '../components/pinModels'

export interface PlacedPin {
  pin: MapPin
  anchorX: number
  anchorY: number
  x: number
  y: number
  showLabel: boolean
  showCount: boolean
  heldBack: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function pillSize(pin: PlacedPin) {
  if (!pin.showLabel) return { width: 44, height: 44 }
  const countWidth = pin.showCount && pin.pin.count ? 24 : 0
  return {
    width: Math.min(170, 38 + pin.pin.label.length * 6.7 + countWidth),
    height: 44,
  }
}

function overlaps(a: PlacedPin, b: PlacedPin, gap = 6) {
  const aSize = pillSize(a)
  const bSize = pillSize(b)
  return (
    Math.abs(a.x - b.x) < (aSize.width + bSize.width) / 2 + gap &&
    Math.abs(a.y - b.y) < (aSize.height + bSize.height) / 2 + gap
  )
}

export function layoutPins({
  pins,
  project,
  width,
  height,
  padding = 14,
  mode,
}: {
  pins: MapPin[]
  project: (lat: number, lng: number) => [number, number] | null
  width: number
  height: number
  padding?:
    | number
    | { top: number; right: number; bottom: number; left: number }
  mode: 'world' | 'country' | 'city'
}): PlacedPin[] {
  const placed = pins.map<PlacedPin>((pin) => {
    const point = project(pin.lat, pin.lng)
    const [x, y] = point ?? [0, 0]
    return {
      pin,
      anchorX: x,
      anchorY: y,
      x,
      y,
      showLabel: true,
      showCount: typeof pin.count === 'number',
      heldBack: point == null,
    }
  })
  const frame =
    typeof padding === 'number'
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : padding

  const clampPin = (pin: PlacedPin) => {
    if (pin.heldBack) return
    const { width: pinWidth, height: pinHeight } = pillSize(pin)
    pin.x = clamp(
      pin.x,
      frame.left + pinWidth / 2,
      Math.max(
        frame.left + pinWidth / 2,
        width - frame.right - pinWidth / 2,
      ),
    )
    pin.y = clamp(
      pin.y,
      frame.top + pinHeight / 2,
      Math.max(
        frame.top + pinHeight / 2,
        height - frame.bottom - pinHeight / 2,
      ),
    )
  }

  placed.forEach(clampPin)
  for (let iteration = 0; iteration < 18; iteration += 1) {
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        const a = placed[i]
        const b = placed[j]
        if (a.heldBack || b.heldBack || !overlaps(a, b)) continue

        const deltaX = a.x - b.x || (i % 2 === 0 ? -0.5 : 0.5)
        const deltaY = a.y - b.y || (j % 2 === 0 ? -0.5 : 0.5)
        const aSize = pillSize(a)
        const bSize = pillSize(b)
        const moveX =
          Math.sign(deltaX) *
          Math.max(
            0,
            (aSize.width + bSize.width) / 4 - Math.abs(deltaX) / 2 + 4,
          )
        const moveY =
          Math.sign(deltaY) *
          Math.max(
            0,
            (aSize.height + bSize.height) / 4 - Math.abs(deltaY) / 2 + 4,
          )

        a.x += moveX
        a.y += moveY
        b.x -= moveX
        b.y -= moveY
      }
    }
    placed.forEach(clampPin)
  }

  if (mode === 'world') return placed

  const visible = placed
    .filter((pin) => !pin.heldBack)
    .sort((a, b) => a.pin.rank - b.pin.rank)

  for (let index = visible.length - 1; index > 0; index -= 1) {
    const pin = visible[index]
    const others = visible.filter((other) => other !== pin && !other.heldBack)
    const stillOverlaps = () => others.some((other) => overlaps(pin, other, 4))

    if (!stillOverlaps()) continue
    pin.showCount = false
    clampPin(pin)
    if (!stillOverlaps()) continue
    pin.showLabel = false
    clampPin(pin)
    if (!stillOverlaps()) continue
    pin.heldBack = true
  }

  return placed
}

export function nearestPin(
  placed: PlacedPin[],
  x: number,
  y: number,
  maxDistance = 22,
) {
  let best: PlacedPin | null = null
  let bestDistance = maxDistance

  for (const pin of placed) {
    if (pin.heldBack) continue
    const distance = Math.hypot(pin.x - x, pin.y - y)
    if (distance <= bestDistance) {
      best = pin
      bestDistance = distance
    }
  }

  return best
}
