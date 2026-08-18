# Homepage map: frontend, backend, and APIs

This app is a **Vite + React frontend**. There is no backend in this repo yet. The map talks to **Google Maps**. Destination / city / attraction data is currently **hardcoded** in the frontend.

This note explains what happens today, then how a backend API would replace the local catalog.

**v1 data loading:** one bootstrap of the homepage slice, then navigate in memory. Do not fetch on every zoom or preference tap. Decision record: [HOMEPAGE_MAP_DATA_LOADING.md](./HOMEPAGE_MAP_DATA_LOADING.md). Endpoint shapes: [API.md](./API.md).

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

Keep Google Maps on the client. Move **catalog** to your API. **v1: load it once.**

```
Homepage mounts
        │
        ▼
Frontend  GET /bootstrap  (full homepage slice + fits for every audience)
        │
        ▼
In-memory catalog (same role as catalog.ts today)
        │
        ├── preference tap  → re-rank locally → flash “Re-ranked for …”
        ├── pin / list tap  → swap pins from memory → fly camera
        └── pan             → never fetches, never changes level
        │
        ▼
Google Maps SDK pans / zooms (no extra HTTP from you)
```

Do **not** call the API again on `goCountry` / `goCity` / `goPoi` / `setAud`. That pattern is documented as Approach C in [HOMEPAGE_MAP_DATA_LOADING.md](./HOMEPAGE_MAP_DATA_LOADING.md) and is **not** the v1 default.

### Suggested env

```bash
# Google (browser)
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=

# Your API (browser)
VITE_API_BASE_URL=http://localhost:8080
```

### Suggested endpoints

**v1 default** — full homepage slice (call once on mount)

```http
GET /api/homepage-map/bootstrap?audience=family
```

Returns audiences, destinations, every city’s attractions and products, and `fits` for all five audiences. After this, `useHomepageMap` navigates from memory.

Granular URLs below stay for other clients, debug, or a later live-price fetch at L3. They are not the homepage funnel.

**World** — ranked countries for an audience (optional after bootstrap)

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

Query `audience` on **granular** list endpoints so other clients can get a pre-ranked list. After bootstrap, the homepage **does** keep using `ranking.ts` (or equivalent) against cached `fits` — preference must re-rank with one tap and no GET.

### Example frontend fetch (v1)

```ts
const API = import.meta.env.VITE_API_BASE_URL

export async function fetchBootstrap(audience: string) {
  const res = await fetch(
    `${API}/api/homepage-map/bootstrap?audience=${encodeURIComponent(audience)}`,
  )
  if (!res.ok) throw new Error(`Bootstrap failed: ${res.status}`)
  return res.json()
}
```

Wire that into `useHomepageMap` instead of importing `DESTINATIONS` / `CITIES`:

1. On load → `fetchBootstrap` **once**, cache destinations + cities.
2. On `goCountry` / `goCity` / `goPoi` → read cache, then set camera. **No fetch.**
3. On audience change → re-rank from cached `fits`. **No fetch.** If the open country is a poor fit (tier > 2), return to world — still no fetch.
4. On pan / breadcrumb / zoom out → memory only.

Bootstrap may run behind the first-paint poster. After the slice is in memory, the flash states what changed, never “loading”. On error, keep last good state and degrade to the list.

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
| Destination / city / attraction records | Backend (one bootstrap payload) |
| Ranking by audience | Client from cached `fits` (today: `ranking.ts`). Server may pre-rank granular endpoints. |
| Product prices, ratings, copy | Backend (in bootstrap; live L3 fetch later if needed) |
| Secrets (DB, CMS, private Google keys) | Backend only — never `VITE_` |

Do **not** put a server-only Google key in `VITE_*`. The Maps JavaScript key is the one exception: it must be in the browser, so restrict it in Cloud Console.

---

## Map levels and which request fires

| User action | `level` | Frontend | Backend |
| --- | --- | --- | --- |
| Open homepage | `world` | Fetch bootstrap **once**, fit world camera | `GET .../bootstrap?audience=` |
| Click country pin / row | `country` | Cities from cache, fly to country bounds | none |
| Click city | `city` | Attractions from cache, fly to city | none |
| Click attraction | `poi` | Products from cache | none (optional later: live price GET) |
| Change audience | same or reset to world | Re-rank from cached `fits` | none |
| Pan | unchanged | Camera only | none |

If the new audience makes the current country a poor fit (tier > 2), the UI already resets to world — keep that rule; it still does not need a fetch.

---

## Backend sketch

Any stack is fine (Node, Java, Go, …) as long as it returns JSON that matches `types.ts`.

Typical layout:

```
GET  /api/homepage-map/bootstrap          ← v1 homepage (full slice)
GET  /api/homepage-map/destinations       ← optional / other clients
GET  /api/homepage-map/countries/:countryId/cities
GET  /api/homepage-map/cities/:cityId/attractions
GET  /api/homepage-map/cities/:cityId/attractions/:attractionId
```

Backend jobs:

1. Load the **homepage-map slice** from DB / CMS (not the whole booking catalogue).
2. Return it in one bootstrap payload, including `fits` for every audience.
3. Include `lat` / `lng` so the frontend can place pins without geocoding.
4. Granular endpoints may still apply `ranking.ts` for `?audience=` if other clients need a pre-ranked list.

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
| `src/homepage-map/ranking.ts` | Ranks cached `fits` (stays on the client after bootstrap) |
| `src/homepage-map/types.ts` | Contract to copy into API responses |
| `.env` / `.env.example` | Google Maps key (and later API base URL) |
| `docs/HOMEPAGE_MAP_DATA_LOADING.md` | Why bootstrap-once is the v1 default |
