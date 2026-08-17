import type { MapPin } from '../components/pinModels'
import { TIER_PIN_COLORS } from './camera'

const SCALE =
  typeof window === 'undefined'
    ? 2
    : Math.min(3, Math.max(2, Math.round(window.devicePixelRatio || 2)))

const cache = new Map<string, { src: string; width: number; height: number }>()

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

export function pillMarkerImage(pin: MapPin): {
  src: string
  width: number
  height: number
} {
  const key = [
    pin.label,
    pin.count ?? '',
    pin.tier,
    pin.selected ? '1' : '0',
    pin.quiet ? '1' : '0',
    String(SCALE),
  ].join('|')
  const cached = cache.get(key)
  if (cached) return cached

  const colors = pin.selected
    ? { background: '#0d2233', border: '#0d2233', glyph: '#ffffff' }
    : pin.quiet
      ? { background: '#f4f1ea', border: '#dbd8d1', glyph: '#101620' }
      : { background: '#ffffff', border: '#e9e7e2', glyph: '#101620' }
  const dot = pin.selected ? '#ffffff' : TIER_PIN_COLORS[pin.tier].background
  const showCount =
    typeof pin.count === 'number' && pin.count > 0 && pin.tier < 3
  const countText = showCount ? String(pin.count) : ''
  const label = pin.label.slice(0, 22)

  const height = 26
  const padX = 10
  const dotR = 3
  const gap = 6
  const countMin = 20

  const measure = document.createElement('canvas').getContext('2d')
  if (!measure) {
    return { src: '', width: 80, height }
  }
  measure.font = '600 12px Manrope, system-ui, sans-serif'
  const labelW = measure.measureText(label).width
  measure.font = '700 10px Manrope, system-ui, sans-serif'
  const countW = countText
    ? Math.max(countMin, measure.measureText(countText).width + 10)
    : 0
  const width = Math.ceil(
    padX + dotR * 2 + gap + labelW + (countW ? gap + countW : 0) + padX,
  )

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * SCALE)
  canvas.height = Math.round(height * SCALE)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { src: '', width, height }
  }

  ctx.scale(SCALE, SCALE)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  roundRect(ctx, 0.5, 0.5, width - 1, height - 1, (height - 1) / 2)
  ctx.fillStyle = colors.background
  ctx.fill()
  ctx.lineWidth = 1
  ctx.strokeStyle = colors.border
  ctx.stroke()

  const cy = height / 2
  let x = padX + dotR
  ctx.beginPath()
  ctx.arc(x, cy, dotR, 0, Math.PI * 2)
  ctx.fillStyle = dot
  ctx.fill()

  x += dotR + gap
  ctx.font = '600 12px Manrope, system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.glyph
  ctx.fillText(label, x, cy)

  if (countText) {
    x += labelW + gap
    roundRect(ctx, x, (height - 16) / 2, countW, 16, 8)
    ctx.fillStyle = pin.selected ? 'rgba(255,255,255,0.2)' : dot
    ctx.fill()
    ctx.font = '700 10px Manrope, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = pin.selected || pin.tier < 2 ? '#ffffff' : '#101620'
    ctx.fillText(countText, x + countW / 2, cy)
  }

  const png = canvas.toDataURL('image/png')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${png}" width="${width}" height="${height}" preserveAspectRatio="none"/>
</svg>`

  const image = {
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    width,
    height,
  }
  cache.set(key, image)
  return image
}
