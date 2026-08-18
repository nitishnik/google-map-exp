import {
  AdvancedMarker,
  AltitudeMode,
  CollisionBehavior,
  GestureHandling,
  Map as GoogleMap,
  Map3D,
  MapMode,
  Marker3D,
  type MapCameraChangedEvent,
  RenderingType,
} from '@vis.gl/react-google-maps'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MapChrome } from '../components/MapChrome'
import { PillFace } from '../components/PillMarker'
import { pinsForLevel } from '../components/pinModels'
import type { AudienceId, MapLevel } from '../types'
import type { CameraTarget } from '../useHomepageMap'
import { CameraFly } from './CameraFly'
import { CameraSync } from './CameraSync'
import { CityRingsLayer } from './CityRingsLayer'
import { CountryTintLayer } from './CountryTintLayer'
import { GooglePinLayer } from './GooglePinLayer'
import { camera3dForLevel } from './camera'
import { MAP_SEA } from './mapColors'
import type { MapSurface } from './MapModeToggle'
import { pillMarkerImage } from './pillMarkerImage'
import { ROSO_MAP_STYLES } from './rosoMapStyles'
import { AttractionClusterLayer } from './AttractionClusterLayer'

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

interface GoogleRecommendationMapProps {
  surface: MapSurface
  camera: CameraTarget
  aud: AudienceId
  level: MapLevel
  countryId: string | null
  cityId: string | null
  poiName: string | null
  onCountry: (id: string) => void
  onCity: (id: string) => void
  onPoi: (name: string) => void
  onWorld: () => void
  onBackCountry: () => void
  onBackCity: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function GoogleRecommendationMap(props: GoogleRecommendationMapProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--hm-sea)]">
      {props.surface === 'globe3d' ? (
        <Globe3DMap {...props} />
      ) : (
        <FlatGoogleMap {...props} />
      )}
      {props.surface === 'flat' &&
      (props.level === 'city' || props.level === 'poi') ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bottom-6 z-10 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--hm-hair2) 0.8px, transparent 0.9px)',
            backgroundSize: '12px 12px',
          }}
          aria-hidden
        />
      ) : null}
      <MapChrome
        level={props.level}
        countryId={props.countryId}
        cityId={props.cityId}
        onWorld={props.onWorld}
        onCountry={props.onBackCountry}
        onCity={props.onBackCity}
        onZoomIn={props.onZoomIn}
        onZoomOut={props.onZoomOut}
      />
    </div>
  )
}

function FlatGoogleMap({
  camera,
  aud,
  level,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
  onZoomIn,
  onZoomOut,
}: GoogleRecommendationMapProps) {
  const pins = pinsForLevel({
    aud,
    level,
    countryId,
    cityId,
    poiName,
    onCountry,
    onCity,
    onPoi,
  })

  const cityView = level === 'city' || level === 'poi'
  const zoomBaseline = useRef(camera.zoom)
  const suppressZoomUntil = useRef(Date.now() + 900)

  useEffect(() => {
    zoomBaseline.current = camera.zoom
    suppressZoomUntil.current = Date.now() + 900
  }, [camera])

  const handleZoomChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      const zoom = event.detail.zoom
      if (Date.now() < suppressZoomUntil.current) {
        zoomBaseline.current = zoom
        return
      }

      const delta = zoom - zoomBaseline.current
      if (Math.abs(delta) < 0.8) return
      zoomBaseline.current = zoom
      suppressZoomUntil.current = Date.now() + 900
      if (delta > 0) onZoomIn()
      else onZoomOut()
    },
    [onZoomIn, onZoomOut],
  )

  return (
    <GoogleMap
      className="h-full w-full"
      defaultCenter={camera.center}
      defaultZoom={camera.zoom}
      gestureHandling="greedy"
      disableDefaultUI
      clickableIcons={false}
      renderingType={RenderingType.RASTER}
      reuseMaps
      colorScheme="LIGHT"
      backgroundColor={MAP_SEA}
      styles={ROSO_MAP_STYLES}
      scaleControl={cityView}
      onZoomChanged={handleZoomChanged}
    >
      <CameraSync camera={camera} />
      <CountryTintLayer aud={aud} level={level} selectedId={countryId} />
      {level === 'country' ? (
        <AttractionClusterLayer
          countryId={countryId}
          aud={aud}
          onCity={onCity}
        />
      ) : null}
      {cityView ? <CityRingsLayer cityId={cityId} /> : null}
      <GooglePinLayer pins={pins} level={level} />
    </GoogleMap>
  )
}

function Globe3DMap(props: GoogleRecommendationMapProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return <TiltedHybridMap {...props} />
  return <PhotorealisticMap {...props} onFail={() => setFailed(true)} />
}

function PhotorealisticMap({
  camera,
  level,
  aud,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
  onFail,
}: GoogleRecommendationMapProps & { onFail: () => void }) {
  const view = camera3dForLevel(camera, level)
  const pins = pinsForLevel({
    aud,
    level,
    countryId,
    cityId,
    poiName,
    onCountry,
    onCity,
    onPoi,
  })

  return (
    <Map3D
      className="h-full w-full"
      mode={MapMode.HYBRID}
      defaultCenter={view.center}
      defaultRange={view.range}
      defaultTilt={view.tilt}
      defaultHeading={view.heading}
      maxTilt={85}
      minTilt={0}
      defaultLabelsDisabled
      gestureHandling={GestureHandling.GREEDY}
      onError={() => onFail()}
    >
      <CameraFly camera={camera} level={level} />
      {pins.map((pin) => {
        const image = pillMarkerImage(pin)
        return (
          <Marker3D
            key={pin.key}
            position={{ lat: pin.lat, lng: pin.lng, altitude: 40 }}
            altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
            sizePreserved
            drawsWhenOccluded
            collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
            collisionPriority={100 - pin.rank}
            zIndex={pin.selected ? 40 : 20 + (3 - pin.rank)}
            title={pin.label}
            onClick={() => pin.onClick()}
          >
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={pin.label}
              draggable={false}
              decoding="sync"
            />
          </Marker3D>
        )
      })}
    </Map3D>
  )
}

function TiltedHybridMap({
  camera,
  aud,
  level,
  countryId,
  cityId,
  poiName,
  onCountry,
  onCity,
  onPoi,
}: GoogleRecommendationMapProps) {
  const pins = pinsForLevel({
    aud,
    level,
    countryId,
    cityId,
    poiName,
    onCountry,
    onCity,
    onPoi,
  })
  const zoom = Math.min(18, camera.zoom + (level === 'world' ? 1.2 : 1.6))
  const tilt = level === 'world' ? 0 : 67
  const heading = level === 'world' ? 0 : 32

  return (
    <GoogleMap
      className="h-full w-full"
      mapId={MAP_ID}
      defaultCenter={camera.center}
      defaultZoom={zoom}
      mapTypeId="hybrid"
      gestureHandling="greedy"
      disableDefaultUI
      clickableIcons={false}
      renderingType={RenderingType.VECTOR}
      reuseMaps
    >
      <CameraSync
        camera={{ ...camera, zoom }}
        tilt={tilt}
        heading={heading}
      />
      {pins.map((pin) => (
        <AdvancedMarker
          key={pin.key}
          position={{ lat: pin.lat, lng: pin.lng }}
          zIndex={pin.selected ? 40 : 20 + (3 - pin.rank)}
          onClick={() => pin.onClick()}
          title={pin.label}
        >
          <PillFace
            label={pin.label}
            count={pin.count}
            tier={pin.tier}
            selected={pin.selected}
            quiet={pin.quiet}
          />
        </AdvancedMarker>
      ))}
    </GoogleMap>
  )
}
