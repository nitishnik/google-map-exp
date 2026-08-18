import {
  APILoadingStatus,
  APIProvider,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps'
import type { ReactNode } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

export function GoogleMapsProvider({
  children,
  loading = <MapPoster />,
  fallback = <MapUnavailable />,
}: {
  children: ReactNode
  loading?: ReactNode
  fallback?: ReactNode
}) {
  if (!API_KEY || API_KEY === 'your_google_maps_api_key_here') {
    return fallback
  }

  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      <MapApiBoundary loading={loading} fallback={fallback}>
        {children}
      </MapApiBoundary>
    </APIProvider>
  )
}

function MapApiBoundary({
  children,
  loading,
  fallback,
}: {
  children: ReactNode
  loading: ReactNode
  fallback: ReactNode
}) {
  const status = useApiLoadingStatus()
  if (status === APILoadingStatus.LOADED) return children
  if (status === APILoadingStatus.FAILED) return fallback
  return loading
}

function MapPoster() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--hm-sea)]"
      aria-label="Map loading"
    >
      <div className="absolute inset-x-[8%] top-[18%] h-[64%] rounded-[45%] border border-[var(--hm-coast)] bg-[var(--hm-land)] opacity-80" />
      <p className="relative rounded-full border border-[var(--hm-hair)] bg-white/90 px-3 py-2 font-[var(--hm-sans)] text-xs font-semibold text-[var(--hm-ink2)] shadow-sm">
        Preparing recommendations…
      </p>
    </div>
  )
}

function MapUnavailable() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[var(--hm-sea)] p-6 text-center"
      role="status"
    >
      <div>
        <p className="font-[var(--hm-sans)] text-sm font-semibold text-[var(--hm-ink)]">
          Map unavailable
        </p>
        <p className="mt-1 font-[var(--hm-sans)] text-xs text-[var(--hm-ink2)]">
          All recommendations remain available in the list below.
        </p>
      </div>
    </div>
  )
}
