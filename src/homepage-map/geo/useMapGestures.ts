import { useEffect, useRef, type RefObject } from 'react'

export function useMapGestures(
  ref: RefObject<HTMLElement | null>,
  {
    onPan,
    onZoomIn,
    onZoomOut,
    onTap,
  }: {
    onPan: (dx: number, dy: number) => void
    onZoomIn: () => void
    onZoomOut: () => void
    onTap?: (x: number, y: number) => void
  },
) {
  const onPanRef = useRef(onPan)
  const onZoomInRef = useRef(onZoomIn)
  const onZoomOutRef = useRef(onZoomOut)
  const onTapRef = useRef(onTap)
  onPanRef.current = onPan
  onZoomInRef.current = onZoomIn
  onZoomOutRef.current = onZoomOut
  onTapRef.current = onTap

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let dragging = false
    let moved = false
    let lastX = 0
    let lastY = 0
    let lastWheel = 0

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = false
      lastX = e.clientX
      lastY = e.clientY
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      if (Math.hypot(dx, dy) > 2) moved = true
      if (moved) onPanRef.current(dx, dy)
    }
    const up = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (!moved && onTapRef.current) {
        const rect = el.getBoundingClientRect()
        onTapRef.current(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel < 420) return
      lastWheel = now
      if (e.deltaY < 0) onZoomInRef.current()
      else onZoomOutRef.current()
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [ref])
}
