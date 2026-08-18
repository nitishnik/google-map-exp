import type { MapPin } from '../components/pinModels'

export interface PlacedPin {
  pin: MapPin
  x: number
  y: number
  showLabel: boolean
  showCount: boolean
  heldBack: boolean
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function pillSize(p: PlacedPin) {
  if (!p.showLabel) return { w: 14, h: 14 }
  const countW = p.showCount && p.pin.count ? 22 : 0
  return {
    w: Math.min(160, 34 + p.pin.label.length * 6.5 + countW),
    h: 28,
  }
}

function overlap(a: PlacedPin, b: PlacedPin, gap = 5) {
  const sa = pillSize(a)
  const sb = pillSize(b)
  return (
    Math.abs(a.x - b.x) < (sa.w + sb.w) / 2 + gap &&
    Math.abs(a.y - b.y) < (sa.h + sb.h) / 2 + gap
  )
}

export function layoutPins({
  pins,
  project,
  width,
  height,
  pad,
  mode,
}: {
  pins: MapPin[]
  project: (lat: number, lng: number) => [number, number] | null
  width: number
  height: number
  pad: number
  mode: 'world' | 'country' | 'city' | 'globe'
}): PlacedPin[] {
  const items: PlacedPin[] = pins.map((pin) => {
    const pt = project(pin.lat, pin.lng)
    if (!pt) {
      return {
        pin,
        x: 0,
        y: 0,
        showLabel: true,
        showCount: typeof pin.count === 'number',
        heldBack: true,
      }
    }
    return {
      pin,
      x: pt[0],
      y: pt[1],
      showLabel: true,
      showCount: typeof pin.count === 'number',
      heldBack: false,
    }
  })

  if (mode === 'globe') return items

  const clampPin = (p: PlacedPin) => {
    if (p.heldBack) return
    const { w, h } = pillSize(p)
    p.x = clamp(p.x, pad + w / 2, Math.max(pad + w / 2, width - pad - w / 2))
    p.y = clamp(p.y, pad + h / 2, Math.max(pad + h / 2, height - pad - h / 2))
  }

  for (let iter = 0; iter < 16; iter++) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i]
        const b = items[j]
        if (a.heldBack || b.heldBack || !overlap(a, b)) continue
        const dx = a.x - b.x || 0.4
        const dy = a.y - b.y || 0.4
        const sa = pillSize(a)
        const sb = pillSize(b)
        const sx =
          Math.sign(dx) *
          Math.max(0, (sa.w + sb.w) / 4 - Math.abs(dx) / 2 + 3)
        const sy =
          Math.sign(dy) *
          Math.max(0, (sa.h + sb.h) / 4 - Math.abs(dy) / 2 + 3)
        a.x += sx
        a.y += sy
        b.x -= sx
        b.y -= sy
      }
    }
    items.forEach(clampPin)
  }

  if (mode === 'world') {
    items.forEach(clampPin)
    return items
  }

  const visible = items
    .filter((p) => !p.heldBack)
    .sort((a, b) => a.pin.rank - b.pin.rank)

  for (let i = visible.length - 1; i > 0; i--) {
    const p = visible[i]
    const others = visible.filter((o) => o !== p && !o.heldBack)
    const hits = () => others.some((o) => overlap(p, o, 3))
    if (!hits()) continue
    p.showCount = false
    clampPin(p)
    if (!hits()) continue
    p.showLabel = false
    clampPin(p)
    if (!hits()) continue
    p.heldBack = true
  }

  return items
}

export function nearestPin(
  placed: PlacedPin[],
  x: number,
  y: number,
  maxDist = 22,
): PlacedPin | null {
  let best: PlacedPin | null = null
  let bestD = maxDist
  for (const p of placed) {
    if (p.heldBack) continue
    const d = Math.hypot(p.x - x, p.y - y)
    if (d <= bestD) {
      best = p
      bestD = d
    }
  }
  return best
}
