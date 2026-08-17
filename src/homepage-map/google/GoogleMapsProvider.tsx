import { APIProvider } from '@vis.gl/react-google-maps'
import type { ReactNode } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  if (!API_KEY || API_KEY === 'your_google_maps_api_key_here') {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--hm-wash)] p-6 text-center text-sm text-[var(--hm-ink)]">
        Set <code className="mx-1 rounded bg-white px-1">VITE_GOOGLE_MAPS_API_KEY</code> in{' '}
        <code className="mx-1 rounded bg-white px-1">.env</code> to load Google Maps.
      </div>
    )
  }

  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      {children}
    </APIProvider>
  )
}
