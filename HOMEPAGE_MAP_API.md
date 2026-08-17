# Homepage map: frontend, backend, and APIs

This app is a **Vite + React frontend**. There is no backend in this repo yet. The map talks to **Google Maps**. Destination / city / attraction data is currently **hardcoded** in the frontend.

This note explains what happens today, then how a backend API would replace the local catalog.

---

## Two different APIs

| API | Who calls it | What it is for |
| --- | --- | --- |
| **Google Maps JavaScript API** | Browser (frontend) | Draw the map, 3D globe, markers, camera |
| **Homepage catalog API** (not built yet) | Frontend → your backend | Destinations, cities, attractions, ranking, products |

Google never sees your travel catalog. Your backend never draws the map. They stay separate.

```
Browser
  ├── Google Maps JS API  →  tiles, 3D, markers
  └── Your backend API    →  ranked destinations / cities / POIs
        └── database or CMS
```

---

## What happens today (no backend)

```
.env  VITE_GOOGLE_MAPS_API_KEY
        │
        ▼
GoogleMapsProvider          catalog.ts  (DESTINATIONS, CITIES)
        │                         │
        ▼                         ▼
APIProvider (Google)        useHomepageMap + ranking.ts
        │                         │
        └──────────┬──────────────┘
                   ▼
         HomepageMap page
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
 GoogleRecommendationMap   RankedPanel
 (pins on the map)         (list under the map)
```

1. Vite injects `VITE_GOOGLE_MAPS_API_KEY` at build time.
2. `GoogleMapsProvider` wraps the page in Google’s `APIProvider`.
3. `useHomepageMap` reads `src/homepage-map/data/catalog.ts` in memory.
4. `ranking.ts` sorts countries / cities / attractions by audience (`family`, `culture`, …).
5. The map and the list both use that ranked data. Clicks change `level`: `world` → `country` → `city` → `poi`.

No `fetch()`. No REST. No auth.

---

## Google Maps (frontend → Google)

### Env

Copy `.env.example` to `.env`:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
# Optional Cloud map ID for Advanced Markers / vector styling
# VITE_GOOGLE_MAPS_MAP_ID=
```

`VITE_` is required so Vite can expose the key to the browser. This key is **public** (it ships in JS). Restrict it in Google Cloud:

- Application: HTTP referrers (your domains)
- APIs: Maps JavaScript API, and Map Tiles API if you use 3D

### How the frontend loads it

`src/homepage-map/google/GoogleMapsProvider.tsx`:

```tsx
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

<APIProvider apiKey={API_KEY} version="alpha">
  {children}
</APIProvider>
```

`version="alpha"` is required for photorealistic 3D (`Map3D`).

The map itself is in `GoogleRecommendationMap.tsx`:

- **Flat** — `Map` + `AdvancedMarker`
- **3D** — `Map3D` + `Marker3D` (falls back to tilted hybrid if 3D fails)

Pin positions come from catalog lat/lng, not from Google Places.

Google is only the **map surface**. Ranking, copy, prices, and products are app data.

---

## Catalog data (what a backend would own)

Shapes live in `src/homepage-map/types.ts`.

| Entity | Used when | Key fields |
| --- | --- | --- |
| `Destination` | World view | `id`, `name`, `lat`, `lng`, `cityId`, `picks`, `fits` |
| `CityCatalog` | Country view | `id`, `countryId`, `name`, `lat`, `lng`, `attractions` |
| `Attraction` | City / POI view | `name`, `lat`, `lng`, `from`, `fits`, `products` |
| `Product` | POI panel | `title`, `price`, `duration`, `rating`, `why` |

Audience ids: `first` | `family` | `culture` | `active` | `budget`.

`fits` is preference scoring. Example for a country:

```ts
fits: {
  family: [
    0,                                    // tier: 0 best match … 3 worth considering
    ['Strong family-compatible inventory'],
    'Why this destination fits.',
    'Trade-off to show honestly.',
  ]
}
```

Today this is all in `src/homepage-map/data/catalog.ts`.

---

## How frontend and backend should talk

Keep Google Maps on the client. Move **catalog + ranking** to your API.

```
User picks audience / clicks a pin
        │
        ▼
Frontend  GET /api/...  (JSON)
        │
        ▼
Backend ranks destinations / cities / attractions
        │
        ▼
Frontend updates camera + pins + RankedPanel
        │
        ▼
Google Maps SDK pans / zooms (no extra HTTP from you)
```

### Suggested env

```bash
# Google (browser)
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=

# Your API (browser)
VITE_API_BASE_URL=http://localhost:8080
```

### Suggested endpoints

Match the four map levels already in `useHomepageMap`.

**World** — ranked countries for an audience

```http
GET /api/homepage-map/destinations?audience=family
```

```json
{
  "audience": "family",
  "matchline": "2 best matches and 1 best alternative for family.",
  "destinations": [
    {
      "id": "pl",
      "name": "Poland",
      "lat": 52,
      "lng": 19.4,
      "cityId": "krakow",
      "picks": 9,
      "opts": 180,
      "tier": 0,
      "chips": ["Strong family-compatible inventory"],
      "why": "Compact old towns you can walk in an hour.",
      "tradeOff": "Fewer English-language departures than western Europe."
    }
  ]
}
```

**Country** — ranked cities

```http
GET /api/homepage-map/countries/pl/cities?audience=family
```

**City** — ranked attractions (frontend currently keeps top 4)

```http
GET /api/homepage-map/cities/krakow/attractions?audience=family
```

**POI** — products for one attraction

```http
GET /api/homepage-map/cities/krakow/attractions/wieliczka-salt-mine
```

Query `audience` on list endpoints so the backend can rank. The frontend should not re-implement `ranking.ts` once the API exists.

### Example frontend fetch

```ts
const API = import.meta.env.VITE_API_BASE_URL

export async function fetchDestinations(audience: string) {
  const res = await fetch(
    `${API}/api/homepage-map/destinations?audience=${encodeURIComponent(audience)}`,
  )
  if (!res.ok) throw new Error(`Destinations failed: ${res.status}`)
  return res.json()
}
```

Wire that into `useHomepageMap` instead of importing `DESTINATIONS` / `CITIES`:

1. On load (and when audience changes) → fetch destinations.
2. On `goCountry(id)` → fetch cities for that country, then set camera.
3. On `goCity(id)` → fetch attractions, then set camera.
4. On `goPoi(name)` → fetch products (or use data already returned with the city).

Show a loading / error state on the map and panel while requests are in flight.

### CORS

The Vite app (`localhost:5173`) and API (`localhost:8080`) are different origins. The backend must allow the frontend origin:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET
```

In production, allow only your real site origin.

---

## What stays in the frontend vs backend

| Concern | Where |
| --- | --- |
| Google Maps key, `APIProvider`, `Map` / `Map3D` | Frontend |
| Camera fly / pan / zoom | Frontend (`useHomepageMap`, `CameraSync`, `CameraFly`) |
| Pin UI (pill markers, tiers) | Frontend |
| Audience toggle UI | Frontend |
| Destination / city / attraction records | Backend |
| Ranking by audience | Backend (today: `ranking.ts`) |
| Product prices, ratings, copy | Backend |
| Secrets (DB, CMS, private Google keys) | Backend only — never `VITE_` |

Do **not** put a server-only Google key in `VITE_*`. The Maps JavaScript key is the one exception: it must be in the browser, so restrict it in Cloud Console.

---

## Map levels and which request fires

| User action | `level` | Frontend | Backend |
| --- | --- | --- | --- |
| Open homepage | `world` | Fetch destinations, fit world camera | `GET .../destinations?audience=` |
| Click country pin / row | `country` | Fetch cities, fly to country bounds | `GET .../countries/:id/cities` |
| Click city | `city` | Fetch attractions, fly to city | `GET .../cities/:id/attractions` |
| Click attraction | `poi` | Fetch or reveal products | `GET .../attractions/:id` |
| Change audience | same or reset to world | Refetch current level | same URLs, new `audience` |

If the new audience makes the current country a poor fit (tier > 2), the UI already resets to world — keep that rule after you move ranking to the API.

---

## Backend sketch

Any stack is fine (Node, Java, Go, …) as long as it returns JSON that matches `types.ts`.

Typical layout:

```
GET  /api/homepage-map/destinations
GET  /api/homepage-map/countries/:countryId/cities
GET  /api/homepage-map/cities/:cityId/attractions
GET  /api/homepage-map/cities/:cityId/attractions/:attractionId
```

Backend jobs:

1. Load catalog from DB / CMS.
2. Apply the same ranking as `src/homepage-map/ranking.ts`.
3. Return already-ranked lists plus `tier`, `why`, `chips`.
4. Include `lat` / `lng` so the frontend can place pins without geocoding.

You do not need a Google Maps server SDK for this homepage. Geocoding is only needed if you store addresses instead of coordinates.

---

## Local run (current app)

```bash
npm install
cp .env.example .env   # add VITE_GOOGLE_MAPS_API_KEY
npm run dev
```

The UI runs at the Vite URL (usually `http://localhost:5173`). Google Maps loads in the browser. Catalog data is still local until you add `VITE_API_BASE_URL` and the fetch layer above.

---

## File map

| File | Role |
| --- | --- |
| `src/pages/HomepageMap.tsx` | Page: provider + map + panel |
| `src/homepage-map/google/GoogleMapsProvider.tsx` | Google `APIProvider` + API key |
| `src/homepage-map/google/GoogleRecommendationMap.tsx` | Flat / 3D map + markers |
| `src/homepage-map/useHomepageMap.ts` | Navigation, camera, flash messages |
| `src/homepage-map/data/catalog.ts` | Local stand-in for the backend |
| `src/homepage-map/ranking.ts` | Local stand-in for backend ranking |
| `src/homepage-map/types.ts` | Contract to copy into API responses |
| `.env` / `.env.example` | Google Maps key (and later API base URL) |
