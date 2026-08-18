import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState } from 'react'
import { leadAttraction, rankedCities } from '../ranking'
import type { AudienceId } from '../types'

interface Cluster {
  cityId: string
  cityName: string
  category: string
  count: number
  lat: number
  lng: number
}

interface PositionedCluster extends Cluster {
  x: number
  y: number
}

export function AttractionClusterLayer({
  countryId,
  aud,
  onCity,
}: {
  countryId: string | null
  aud: AudienceId
  onCity: (id: string) => void
}) {
  const map = useMap()
  const maps = useMapsLibrary('maps')
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [positioned, setPositioned] = useState<PositionedCluster[]>([])
  const clusters = useMemo<Cluster[]>(() => {
    if (!countryId) return []
    return rankedCities(countryId, aud).map((city) => {
      const lead = leadAttraction(city, aud)
      const attractions = city.attractions
      const lat =
        attractions.reduce((sum, attraction) => sum + attraction.lat, 0) /
        Math.max(1, attractions.length)
      const lng =
        attractions.reduce((sum, attraction) => sum + attraction.lng, 0) /
        Math.max(1, attractions.length)
      return {
        cityId: city.id,
        cityName: city.name,
        category: lead?.category ?? 'Attractions',
        count: city.picks,
        lat,
        lng,
      }
    })
  }, [aud, countryId])

  useEffect(() => {
    if (!map || !maps || clusters.length === 0) return
    const activeMap = map

    const root = document.createElement('div')
    root.className = 'pointer-events-none absolute left-0 top-0 overflow-visible'
    root.style.zIndex = '10'
    let animationFrame = 0

    class ClusterOverlay extends maps.OverlayView {
      onAdd() {
        activeMap.getDiv().appendChild(root)
        setContainer(root)
      }

      draw() {
        cancelAnimationFrame(animationFrame)
        animationFrame = requestAnimationFrame(() => {
          const projection = this.getProjection()
          const mapElement = activeMap.getDiv()
          root.style.width = `${mapElement.clientWidth}px`
          root.style.height = `${mapElement.clientHeight}px`
          setPositioned(
            clusters.flatMap((cluster, index) => {
              const point = projection.fromLatLngToContainerPixel(
                new google.maps.LatLng(cluster.lat, cluster.lng),
              )
              if (!point) return []
              const direction = index % 2 === 0 ? 1 : -1
              return [
                {
                  ...cluster,
                  x: point.x + direction * 20,
                  y: point.y + 25,
                },
              ]
            }),
          )
        })
      }

      onRemove() {
        cancelAnimationFrame(animationFrame)
        root.remove()
        setContainer(null)
        setPositioned([])
      }
    }

    const overlay = new ClusterOverlay()
    overlay.setMap(activeMap)
    return () => overlay.setMap(null)
  }, [clusters, map, maps])

  if (!container) return null

  return createPortal(
    <>
      {positioned.map((cluster) => (
        <button
          key={cluster.cityId}
          type="button"
          title={`${cluster.cityName}: ${cluster.category}, ${cluster.count} picks`}
          aria-label={`${cluster.cityName} attraction cluster, ${cluster.count} picks`}
          onClick={(event) => {
            event.stopPropagation()
            onCity(cluster.cityId)
          }}
          style={{ left: cluster.x, top: cluster.y }}
          className="pointer-events-auto absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-[var(--hm-hair2)] bg-[var(--hm-wash)] font-[var(--hm-sans)] text-[10px] font-bold text-[var(--hm-ink2)] shadow-[0_3px_10px_rgba(16,22,32,0.12)]">
            {cluster.count}
          </span>
        </button>
      ))}
    </>,
    container,
  )
}
