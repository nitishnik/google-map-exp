import { useState } from 'react'
import '../homepage-map/tokens.css'
import { FlashToast } from '../homepage-map/components/FlashToast'
import { Matchline } from '../homepage-map/components/Matchline'
import { PreferenceBar } from '../homepage-map/components/PreferenceBar'
import { RankedPanel } from '../homepage-map/components/RankedPanel'
import { GoogleMapsProvider } from '../homepage-map/google/GoogleMapsProvider'
import { GoogleRecommendationMap } from '../homepage-map/google/GoogleRecommendationMap'
import {
  MapModeToggle,
  type MapSurface,
} from '../homepage-map/google/MapModeToggle'
import { useHomepageMap } from '../homepage-map/useHomepageMap'

export function HomepageMap() {
  const map = useHomepageMap()
  const [surface, setSurface] = useState<MapSurface>('flat')

  return (
    <div className="min-h-full w-full bg-[var(--hm-page)] px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        <section className="flex flex-col gap-4">
          <div>
            <p className="mb-2 font-[var(--hm-sans)] text-[11px] font-semibold tracking-[0.14em] text-[var(--hm-ink3)] uppercase">
              Travel preferences
            </p>
            <PreferenceBar aud={map.aud} onChange={map.setAud} />
          </div>

          <div className="flex flex-col overflow-hidden rounded-[28px] border border-[var(--hm-hair)] bg-white shadow-[0_18px_50px_rgba(16,22,32,0.08)]">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--hm-hair)] px-4 py-2.5 sm:px-5">
              <div className="min-w-0 flex-1">
                <Matchline aud={map.aud} />
              </div>
              <MapModeToggle value={surface} onChange={setSurface} />
            </div>

            <div
              className={`relative w-full shrink-0 border-b border-[var(--hm-hair)] ${
                surface === 'globe3d'
                  ? 'h-[320px] sm:h-[420px] md:h-[520px]'
                  : 'h-[220px] sm:h-[280px] md:h-[360px]'
              }`}
            >
              <GoogleMapsProvider>
                <GoogleRecommendationMap
                  key={surface}
                  surface={surface}
                  camera={map.camera}
                  aud={map.aud}
                  level={map.level}
                  countryId={map.countryId}
                  cityId={map.cityId}
                  poiName={map.poiName}
                  onCountry={map.goCountry}
                  onCity={map.goCity}
                  onPoi={map.goPoi}
                  onWorld={map.backWorld}
                  onBackCountry={map.backCountry}
                  onBackCity={map.backCity}
                  onZoomIn={map.zoomIn}
                  onZoomOut={map.zoomOut}
                />
              </GoogleMapsProvider>
              <FlashToast message={map.flash} onDone={map.clearFlash} />
            </div>

            <div className="p-4 sm:p-5">
              <RankedPanel
                aud={map.aud}
                level={map.level}
                countryId={map.countryId}
                cityId={map.cityId}
                poiName={map.poiName}
                onCountry={map.goCountry}
                onCity={map.goCity}
                onPoi={map.goPoi}
              />
            </div>
          </div>
        </section>

        <p className="font-[var(--hm-sans)] text-xs text-[var(--hm-ink3)]">
          Toggle Flat map / 3D map to compare Google Maps surfaces. Photo slots
          stay empty until product photography lands.
        </p>
      </div>
    </div>
  )
}
