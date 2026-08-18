# Why the discovery map is not Google Maps (and why we used d3-geo)

This note is for the client conversation: **why we could not deliver the homepage map on Google Maps**, and **why we chose d3-geo** instead.

The short answer: the brief asks for a **RosoTravel-owned recommendation surface**, not a Google Maps product. Google Maps cannot honour several **non-negotiable** items in the client requirements. d3-geo can.

---

## What the brief actually asks for

From *Destination Discovery Map — Client Requirements*:

| Requirement | Where it is written |
| --- | --- |
| Phase 1 is a **custom flat world map** in **Natural Earth** projection | Phase scope + Level 0 map treatment |
| The product is **not** a Google Maps–style wayfinding tool | “What this map is NOT” |
| **Own vector geometry**, RosoTravel styling | Non-negotiables — Basemap |
| **No third-party map branding**, no provider POI labels on the surface | Same |
| Warm land, pale water, **hairline national borders only** | Level 0 map treatment |
| **Recommended countries** tinted a half-step warmer (and **re-tinted** when a preference chip is tapped) | Level 0 + Preference row |
| **No** provider labels, **no** city names from the basemap, **no** roads | Level 0 — Suppressed |
| Level 1 switches to **Mercator**, fitted to the country; neighbours visible but unlabelled | Level 1 |
| Level 2 is a **quiet dotted field** with rings and a km scale — not a street map | Level 2 |
| Phase 2 is a **3D globe with rotation/tilt** in the same visual language | Phase scope |

That is a designed **recommendation canvas**. Pins are opinions. Geography is context. Google Maps is built to be a **navigation product** (roads, places, Google’s world, Google’s attribution).

---

## Why Google Maps cannot match this

We did implement a Google Maps version (`/google`) so the gap is visible, not theoretical. These limits are in the **Maps JavaScript API**, not in our code.

### 1. Natural Earth projection — not available

Google Maps is **Web Mercator** only. There is no API to draw the world in Natural Earth (or any other cartographic projection).

The brief’s Phase 1 deliverable is explicitly *“Custom flat world map (Natural Earth projection)”*. That single line rules Google Maps out as the world surface.

### 2. “No third-party branding” vs Google’s terms

Google requires **visible Google attribution** (logo and data credits) on every map. Hiding it breaks their terms of use.

The brief says: **own vector geometry, RosoTravel styling, no third-party map branding**. We cannot legally ship a “Google-free” Google Map.

### 3. The basemap is Google’s, not ours

Even with Cloud map styling we still get:

- Google’s land/water/road model  
- Google’s labels and POIs unless a custom Map ID is fully restyled in Cloud Console  
- Roads and city names that the brief says must be **suppressed**

JSON map styles (`styles: [...]`) are **ignored** when a **Map ID** is set. Advanced Markers (the HTML pills) **require** a Map ID. So the two things we need — custom pins and custom basemap colours — fight each other on Google’s vector maps.

We can overlay country polygons on top of Google. That is a **skin**, not “own vector geometry”. Roads and labels can still show through. Preference **re-tint** of recommended countries is unreliable.

### 4. Level 2 is not a Google map

City view is specified as: light dotted field, centre dot, distance rings, kilometre scale, quiet geography. That is a **diagram**, not Google roadmap or satellite. Forcing Google here puts roads and POIs back on a surface the brief wants silent.

### 5. Photorealistic 3D is the wrong Phase 2

Google’s 3D is **photorealistic tiles** (heavy, branded, not RosoTravel land tints). The brief’s Phase 2 is a **globe with rotation/tilt** in the same recommendation language as the flat map — not Street View in orbit.

### 6. The brief says it is not a wayfinding tool

Google Maps is wayfinding: pan the world, search places, follow roads. Using it as the homepage centrepiece fights the product definition, even if we hide the UI chrome.

---

## Why d3-geo

[d3-geo](https://d3js.org/d3-geo) is a small, standard library for **projecting geographic coordinates** (lat/lng → x/y). It does not draw Google’s world. We draw **our** polygons.

| Brief item | What d3-geo lets us do |
| --- | --- |
| Natural Earth (L0) | `geoNaturalEarth1` |
| Mercator fitted to country (L1) | `geoMercator` + fit to the country polygon |
| Globe rotate/tilt (Phase 2) | `geoOrthographic` + drag to rotate |
| Own geometry | Natural Earth country outlines (via world-atlas / TopoJSON) — no Google tiles |
| Warm land, pale water, hairline borders | SVG fills and strokes we control (`--hm-land`, `--hm-sea`, `--hm-coast`) |
| Recommended countries warmer; re-tint on preference | Fill by match tier; update on chip tap |
| No provider labels / roads / POIs | We never draw them |
| No Google logo | Nothing in the Google Maps terms applies |
| City dotted field + rings | SVG on a quiet field; true lat/lng for attractions |
| Frame all destinations | Fit the projection to catalog points so pins stay in the card |

We still use the **same catalog, ranking, pins, and panel**. Only the **map surface** changed. Funnel behaviour did not depend on Google.

Country outlines come from **Natural Earth** (public cartographic data), not from Google. That matches “own vector geometry”.

---

## What we kept Google Maps for

Google Maps is still in the prototype at **`/google`**.

Use it to show stakeholders:

- Pins, preference re-rank, and the four levels **can** sit on Google  
- The **look** (Natural Earth, no branding, quiet city diagram) **cannot**

It is a comparison surface, not the homepage. Production homepage should follow the spec map (`/`).

---

## Honest limits (either engine)

Choosing d3-geo does **not** finish the whole brief. These still need the real (likely Next.js) build:

- Server-rendered, crawlable destination list and real `/destinations/...` pages  
- Attraction clusters on country view  
- Poster / first paint, loading skeleton, map-error fallback  
- Preference-specific review slices, working “Check dates” CTA  

Those are **product/platform** items, not reasons to go back to Google Maps.

---

## Recommended line for the client

> Google Maps cannot legally or technically be the RosoTravel homepage map as specified: it is Web Mercator only, it requires Google branding, and its basemap is a wayfinding product. We used d3-geo so Phase 1 can be Natural Earth with our colours, hairline borders, and preference tints, and Phase 2 can be a globe in the same language. Google Maps remains available as a comparison at `/google`. In production we keep this custom surface and put crawlable destination pages around it.

---

## One-page comparison

| | Google Maps JS API | d3-geo + Natural Earth (current `/`) |
| --- | --- | --- |
| Natural Earth world | No | Yes |
| RosoTravel land/water/borders | Partial overlay only; Map ID vs styles conflict | Yes |
| No third-party branding | No (attribution required) | Yes |
| Re-tint recommended countries | Unreliable | Yes |
| Quiet city diagram (no roads) | Fights the product | Yes |
| Globe in the same visual system | Photorealistic Google 3D (different product) | Orthographic globe |
| API key / Google bill | Yes | No |
| Street-level wayfinding | Yes (not asked for) | No (by design) |
