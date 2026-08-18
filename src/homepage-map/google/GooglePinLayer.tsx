import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { PillMarker } from '../components/PillMarker'
import type { MapPin } from '../components/pinModels'
import {
  layoutPins,
  nearestPin,
  type PlacedPin,
} from '../geo/pinLayout'
import type { MapLevel } from '../types'

export function GooglePinLayer({
  pins,
  level,
}: {
  pins: MapPin[]
  level: MapLevel
}) {
  const map = useMap()
  const maps = useMapsLibrary('maps')
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [placed, setPlaced] = useState<PlacedPin[]>([])
  const placedRef = useRef<PlacedPin[]>([])

  useEffect(() => {
    if (!map || !maps) return
    const activeMap = map

    const root = document.createElement('div')
    root.className = 'pointer-events-none absolute left-0 top-0 overflow-visible'
    root.style.zIndex = '20'
    root.setAttribute('aria-label', 'Recommendation pins')
    let animationFrame = 0

    class RecommendationOverlay extends maps.OverlayView {
      onAdd() {
        activeMap.getDiv().appendChild(root)
        setContainer(root)
      }

      draw() {
        cancelAnimationFrame(animationFrame)
        animationFrame = requestAnimationFrame(() => {
          const projection = this.getProjection()
          const mapElement = activeMap.getDiv()
          const width = mapElement.clientWidth
          const height = mapElement.clientHeight
          root.style.width = `${width}px`
          root.style.height = `${height}px`

          const next = layoutPins({
            pins,
            width,
            height,
            padding:
              level === 'world'
                ? { top: 12, right: 58, bottom: 24, left: 100 }
                : { top: 12, right: 58, bottom: 24, left: 12 },
            mode:
              level === 'world'
                ? 'world'
                : level === 'country'
                  ? 'country'
                  : 'city',
            project: (lat, lng) => {
              const point = projection.fromLatLngToContainerPixel(
                new google.maps.LatLng(lat, lng),
              )
              return point ? [point.x, point.y] : null
            },
          })
          placedRef.current = next
          setPlaced(next)
        })
      }

      onRemove() {
        cancelAnimationFrame(animationFrame)
        root.remove()
        setContainer(null)
        placedRef.current = []
        setPlaced([])
      }
    }

    const overlay = new RecommendationOverlay()
    overlay.setMap(activeMap)
    const clickListener = activeMap.addListener(
      'click',
      (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return
        const point = overlay
          .getProjection()
          .fromLatLngToContainerPixel(event.latLng)
        if (!point) return
        nearestPin(placedRef.current, point.x, point.y)?.pin.onClick()
      },
    )

    return () => {
      clickListener.remove()
      overlay.setMap(null)
    }
  }, [level, map, maps, pins])

  if (!container) return null

  return createPortal(
    <>
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width="100%"
        height="100%"
        aria-hidden
      >
        {placed.map((pin) => {
          if (
            pin.heldBack ||
            Math.hypot(pin.x - pin.anchorX, pin.y - pin.anchorY) < 18
          ) {
            return null
          }
          return (
            <line
              key={`${pin.pin.key}-leader`}
              x1={pin.anchorX}
              y1={pin.anchorY}
              x2={pin.x}
              y2={pin.y}
              stroke="var(--hm-hair2)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          )
        })}
      </svg>
      {placed
        .filter((pin) => !pin.heldBack)
        .map(({ pin, x, y, showLabel, showCount }) => (
          <PillMarker
            key={pin.key}
            x={x}
            y={y}
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
    </>,
    container,
  )
}
