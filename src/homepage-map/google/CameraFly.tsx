import { useMap3D } from '@vis.gl/react-google-maps'
import { useEffect, useRef } from 'react'
import type { MapLevel } from '../types'
import type { CameraTarget } from '../useHomepageMap'
import { camera3dForLevel } from './camera'

export function CameraFly({
  camera,
  level,
}: {
  camera: CameraTarget
  level: MapLevel
}) {
  const map3d = useMap3D()
  const lastNavKey = useRef<string | null>(null)
  const navKey = [
    level,
    camera.center.lat.toFixed(4),
    camera.center.lng.toFixed(4),
    String(camera.zoom),
  ].join(':')

  useEffect(() => {
    if (!map3d) return

    const stop = () => map3d.stopCameraAnimation()
    map3d.addEventListener('pointerdown', stop)
    map3d.addEventListener('wheel', stop, { passive: true })

    if (lastNavKey.current === null) {
      lastNavKey.current = navKey
      return () => {
        map3d.removeEventListener('pointerdown', stop)
        map3d.removeEventListener('wheel', stop)
      }
    }

    if (lastNavKey.current === navKey) {
      return () => {
        map3d.removeEventListener('pointerdown', stop)
        map3d.removeEventListener('wheel', stop)
      }
    }

    lastNavKey.current = navKey
    const view = camera3dForLevel(camera, level)

    map3d.flyCameraTo({
      endCamera: view,
      durationMillis: 1400,
    })

    return () => {
      map3d.removeEventListener('pointerdown', stop)
      map3d.removeEventListener('wheel', stop)
    }
  }, [camera, level, map3d, navKey])

  return null
}
