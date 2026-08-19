# Homepage Discovery Map


This prototype is the **recommendation funnel on Google Maps**. What follows is what that engine can and cannot do. Items that belong on the production site are not listed here.

---

## What this prototype is

A four-level funnel on **Google Maps**:

World (countries) → Country (cities) → City (attractions) → Attraction (products)

Preference chips re-rank pins and the list. Trade-offs and match labels sit next to recommendations. A results panel sits under the map.

It is **not** a Natural Earth world with no third-party branding, a quiet city diagram, or a globe in the same look as the flat map. Those are Google Maps limits, listed below.

---

## Achieved — with constraints

These items exist in the prototype. The limits below are from **Google Maps**, not from missing production work.

### Funnel, preference, and honesty

| Brief item | What we did | Constraint |
| --- | --- | --- |
| Four-level funnel (L0–L3) | Pin/list taps descend one level. Breadcrumbs, controls, and guarded native zoom gestures move through levels. | Native zoom uses a threshold and short lockout so camera animations do not accidentally trigger another level change. |
| A pin is a recommendation | Only catalogued destinations / cities / attractions get pins. | — |
| We reorder, we never hide | Every destination stays on the map; match label and copy change with the chip. | — |
| One entity type per level | World = countries, country = cities, city = attractions. Products and product counts stay in the panel. | — |
| Preference row — one tap re-ranks | Chips re-rank pins, rewrite labels/copy, reorder the list, update the count line. | Re-tint of recommended countries is an **overlay** on Google land, not a restyle of Google’s own polygons. Unreliable if Google labels/roads show through. |
| Poor fit returns to World | If the open country, city, or attraction is a poor fit for the new chip, we leave that view. | — |
| Preference is never a URL | Chip is session state. URL does not change. | — |
| Transition flash states what changed | Lines such as “Poland · 5 cities prioritised”. | Google tiles can still visibly load. |
| Pan never changes level | Dragging does not open a country or city. | Google still pans a wayfinding map. The brief’s “not a Google Maps-style wayfinding tool” is not met by the surface itself. |
| Map failure does not remove recommendations | A poster occupies only the map while Google loads; a no-map message replaces only the map if the API fails. | The recommendation list remains usable, but map interactions are unavailable. |

### Map levels

| Brief item | What we did | Constraint |
| --- | --- | --- |
| L0 — country pins, pick counts, match-tier pills | White pills, coloured tier, country name, pick badge. | **Not Natural Earth.** Google is Web Mercator only. |
| L0 — warm land, pale water, hairline borders, no roads/labels | The flat map uses Google JSON styling without a Cloud Map ID; roads, POIs, and labels are suppressed; country overlays tint recommended land. | Google’s own geometry remains underneath. **Google attribution cannot be removed** (terms of use). |
| L1 — Mercator fitted to the country | Google is already Mercator; we fly to country bounds; selected country is filled darker; city pins are accompanied by low-priority attraction-count clusters. | Neighbouring Google geography remains visible. |
| L2 — centre, km rings, scale, true coordinates | Centre dot, concentric rings, Google scale control, dotted screen overlay, attractions at real lat/lng. | Surface is still **Google’s map**, so the dotted field is an approximation rather than a standalone diagram. |
| L3 — stay at city scale; selected attraction emphasised; siblings tappable | Camera stays on the city; selected pill is emphasised; other attractions stay tappable. | 3D markers may hide behind Google’s collision behaviour. |
| Commercial detail arrives late | World/country: counts only. City: rating, reviews, from-price. Attraction: duration, exact price, CTA. | — |
| Caps 8 / 4 / 3 | Code slices cities to 8, attractions to 4, unique products to 3. | — |
| Pin readability and touch | Flat-map pins use screen-space collision layout, stay inside a control-safe frame, expose 44px hit areas, and progressively drop count/label detail before holding back a crowded lower-ranked pin. | 3D uses Google’s own collision system. |
| Touch 44px; never fade text | Pins, mode controls, chips, rows, breadcrumbs, and CTA use 44px-class hit areas. De-emphasis uses fill/border, not faded type. | — |

### Phase 2 — 3D

| Brief item | What we did | Constraint |
| --- | --- | --- |
| 3D globe with rotation/tilt | A toggle switches to Google **photorealistic 3D** (or tilted hybrid if 3D fails). | This is **Google’s 3D tiles**, not a RosoTravel globe in the same language as the flat map. Needs extra Google APIs and billing. Country tints and city rings do **not** appear on the 3D surface. |

---

## Cannot achieve on Google Maps

These are limits of the Maps JavaScript API and Google’s terms. They cannot be finished on Google Maps. This prototype stays on Google Maps, so these brief items stay as limits.

| Brief requirement | Google Maps limitation |
| --- | --- |
| Phase 1: **Natural Earth** projection | Google Maps is Web Mercator only. There is no Natural Earth (or other cartographic) projection. |
| **Own vector geometry**, RosoTravel styling, **no third-party branding** | The basemap is Google’s. Attribution (logo and data credits) **must stay visible**. Hiding it breaks Google’s terms. |
| No provider labels, city names, or roads on the surface | The flat map hides most labels and roads with JSON styles, but Google’s basemap geometry, logo, data credits, and legal links remain. |
| Recommended countries **re-tinted** as part of the basemap | Overlay polygons can approximate this. They are not Google’s own land styling. |
| L2 as a **quiet dotted field** (diagram, not a street map) | Google city view is still a map (roadmap, satellite, or hybrid). Overlays do not turn it into the specified diagram. |
| Phase 2: globe in the **same visual language** as the flat map | Google 3D is photorealistic tiles — branded, heavy, not the same look as the flat recommendation map. |
| “**Not** a Google Maps-style wayfinding tool” as the homepage centrepiece | Google Maps remains a wayfinding product even with chrome hidden. |

---

## Scorecard

| | Status |
| --- | --- |
| Recommendation funnel (4 levels, preference chips, trade-offs, match labels) | **Achieved** on Google Maps |
| Spec map (Natural Earth, no Google branding, quiet city diagram, matching globe) | **Not achievable** on Google Maps |
| Google flat + photorealistic 3D with our pins | **Achieved**, with the limits above |

---

## What we recommend saying

> This prototype is the **recommendation funnel on Google Maps**: preference, four levels, honest labels, and a list beside the map. Google Maps cannot be Natural Earth, cannot drop Google branding, and cannot become the quiet city diagram or a globe in the same look as the flat map. We stay on Google Maps and accept those limits.
