import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FlashToast } from '../homepage-map/components/FlashToast'
import { HowWeDoIt } from '../homepage-map/components/HowWeDoIt'
import { Matchline } from '../homepage-map/components/Matchline'
import { PreferenceBar } from '../homepage-map/components/PreferenceBar'
import { RankedPanel } from '../homepage-map/components/RankedPanel'
import { MapSurfaceToggle } from '../homepage-map/roso/MapSurfaceToggle'
import {
  RosoRecommendationMap,
  type RosoSurface,
} from '../homepage-map/roso/RosoRecommendationMap'
import '../homepage-map/tokens.css'
import { useHomepageMap } from '../homepage-map/useHomepageMap'

export function DiscoveryMap() {
  const map = useHomepageMap()
  const [surface, setSurface] = useState<RosoSurface>('flat')

  return (
    <div className="min-h-full w-full bg-[var(--hm-wash)] px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
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
              <MapSurfaceToggle value={surface} onChange={setSurface} />
            </div>

            <div className="relative h-[200px] w-full shrink-0 border-b border-[var(--hm-hair)] sm:h-[228px] md:h-[260px]">
              <RosoRecommendationMap
                surface={surface}
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
              <FlashToast message={map.flash} onDone={map.clearFlash} />
            </div>

            <div className="h-[240px] overflow-y-auto overscroll-contain p-4 sm:h-[280px] sm:p-5">
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

        <HowWeDoIt />

        <p className="font-[var(--hm-sans)] text-xs text-[var(--hm-ink3)]">
          Photo slots stay empty until product photography lands.{' '}
          <Link to="/" className="underline decoration-[var(--hm-hair2)] underline-offset-2">
            Google Maps version
          </Link>
        </p>
      </div>
    </div>
  )
}
