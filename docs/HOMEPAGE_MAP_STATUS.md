# Homepage Discovery Map — what we achieved, what we have not, and the constraints

This note is for the client. It is an honest status against *Destination Discovery Map — Client Requirements*.

**How to read it**

- **Achieved, with a constraint** — the behaviour is in the prototype, but it is incomplete, approximated, or limited by Google Maps / this being a frontend demo.
- **Not achieved** — either we have not built it yet, or Google Maps **cannot** honour the brief without changing the requirement.

This is a **working prototype**, not the production homepage. Catalog, ranking, and copy are local sample data. There is no live booking, CMS, or crawlable destination site yet.

Related brief: [client-requirements.md](./client-requirements.md).

---

## What this prototype is

A four-level recommendation funnel on **Google Maps**:

World (countries) → Country (cities) → City (attractions) → Attraction (products)

Preference chips re-rank pins and the list. Trade-offs and match labels sit next to recommendations. A results panel sits under the map.

It is **not** yet the RosoTravel-owned canvas the brief describes (Natural Earth world, no third-party branding, quiet city diagram, globe in the same visual language). Those items need a custom map surface, not Google.

---

## Achieved — with constraints

These items exist in the prototype. Each has a limit you should know before treating it as signed-off.

### Funnel, preference, and honesty

| Brief item | What we did | Constraint |
| --- | --- | --- |
| Four-level funnel (L0–L3) | Pin tap and list tap descend one level. Breadcrumbs and zoom controls climb. | Native Google pinch/scroll can still pan and zoom the *basemap* without changing funnel level. Level changes are driven by our chrome and pins, not by Google’s zoom. |
| A pin is a recommendation | Only catalogued destinations / cities / attractions get pins. | Sample catalog only (6 countries). Not live inventory. |
| We reorder, we never hide | Every destination stays on the map; match label and copy change with the chip. | City pins are ranked by “default base + pick count”, not by preference-specific city copy. City rows reuse **country** why/chips. |
| One entity type per level | World = countries, country = cities, city = attractions. Products stay in the panel. | Attraction pins show a **product count** badge. Strict reading of “products never appear on the map” would drop that number. |
| Preference row — one tap re-ranks | Chips re-rank pins, rewrite labels/copy, reorder the list, update the count line. | Re-tint of recommended countries is an **overlay** on Google land, not a restyle of Google’s own polygons. Unreliable if Google labels/roads show through (see Map ID note below). |
| Poor fit returns to World | If the open country is “worth considering” (tier 3) for the new chip, we leave that view. | Uses country tier only. A city or attraction that is a poor fit does not, by itself, bounce the view. |
| Preference is never a URL | Chip is session state. URL does not change. | List `href`s look like `/destinations/...` but clicks are intercepted — those pages **do not exist**. Indexable routing is not built. |
| Transition flash states what changed | Lines such as “Poland · 5 cities prioritised”, “Re-ranked for culture & history”. | There is no poster or skeleton behind first paint. Google tiles can still visibly load. |
| Pan never changes level | Dragging does not open a country or city. | Google still pans a wayfinding map. The brief’s “not a Google Maps-style wayfinding tool” is not met by the surface itself. |

### Map levels (look and data)

| Brief item | What we did | Constraint |
| --- | --- | --- |
| L0 — country pins, pick counts, match-tier pills | White pills, coloured tier, country name, pick badge. | **Not Natural Earth.** Google is Web Mercator only. World frame is a fitted camera, not a Natural Earth card. Pins can still collide; we do not move labels on both axes. |
| L0 — warm land, pale water, hairline borders, no roads/labels | JSON styles hide roads, POIs, and labels; country overlay tints recommended land. | A **Cloud Map ID** (required for Advanced Markers) **ignores** JSON styles. Overlay still paints, but Google’s roads/labels can return. **Google attribution cannot be removed** (terms of use). |
| L1 — Mercator fitted to the country | Google is already Mercator; we fly to country bounds; selected country is filled darker. | Neighbours are Google’s world, not an unlabelled custom basemap. **Attraction clusters are not built.** City count is always capped at 8 — we do **not** drop pins for 390px readability. |
| L1 crowding rules (drop badge → drop label → keep in list only) | Not implemented. All city pins keep name + count. | To achieve this we need our own collision layout (or accept Google’s marker collision, which **hides** pins — the brief says never drop from the product, only from the map surface). |
| L2 — dotted field, centre, km rings, scale, true coordinates | Centre dot, concentric rings, Google scale control, attractions at real lat/lng. | Surface is still **Google’s map**, not a quiet dotted diagram. Roads/imagery can remain. Rings are an overlay, not the specified city treatment. |
| L3 — stay at city scale; selected attraction emphasised; siblings tappable | Camera stays on the city; selected pill is emphasised; other attractions stay tappable. | Sibling “quieter treatment” is a quieter pill, not a full visual spec. 3D markers may hide behind Google’s collision behaviour. |
| Commercial detail arrives late | World/country: counts only. City: rating, reviews, from-price. Attraction: duration, exact price, CTA. | Numbers are **hardcoded sample data**, not live prices or availability. |
| Caps 8 / 4 / 3 | Code slices cities to 8, attractions to 4, unique products to 3. | “Readability outranks the ceiling” is **not** implemented. We always show the cap when the catalog has that many, even if labels crowd. |
| Product cards (why, trade-off, review block, priced CTA) | Layout is in the panel. | Review block copy is **static** — the same quote is labelled for the active preference; it is not a real preference-filtered review slice. **Check dates** is a button with no booking action. |
| Empty photography | Dashed photo slots. No stock, no AI images. | Real photography has not landed. Drop slots only. |

### Product principles that are only partly true

| Brief item | What we did | Constraint |
| --- | --- | --- |
| Map is enhancement; list is the content | A ranked list sits under the map and mirrors pin order. | List is **client-rendered** in this Vite app. It is **not** server-rendered, not crawlable, and not a fallback if the map fails. Links do not resolve. |
| Unified homepage block with Travel Preferences and How We Do It | Preference row sits with the map. | **How We Do It is not in this prototype.** The map is a standalone page, not a homepage section at ~200px on a 390px screen. Current map height is ~220–360px (flat) and taller in 3D. |
| Touch 44px | Preference chips, list rows, breadcrumbs, and CTA use 44px-class hit areas. | Map pins are visually small; we have **not** implemented “tap within 22px resolves to nearest pin”. Google hit-testing is on the marker only. |
| Contrast 4.5:1; never fade text | De-emphasis uses fill/border on pills, not faded type. | **Not audited.** We have not measured 4.5:1 on match labels and smallest metadata. |
| Ranking by decision value / review volume in category | Attractions sort by match tier, then review count. | Not “review volume **within category**” as specified. City ranking is not preference-driven. Copy is editorial sample, not assembled from verified live product facts. |

### Phase 2 — 3D

| Brief item | What we did | Constraint |
| --- | --- | --- |
| 3D globe with rotation/tilt | A toggle switches to Google **photorealistic 3D** (or tilted hybrid if 3D fails). | This is **Google’s 3D tiles**, not a RosoTravel globe in the same language as the flat map. Needs extra Google APIs and billing. Country tints and city rings do **not** appear on the 3D surface. |

---

## Not achieved

Split into two kinds: **blocked by Google Maps** (cannot ship the brief on this engine), and **not built yet** (can ship on a custom surface + production site).

### Cannot achieve on Google Maps (without changing the brief)

These are limits of the Maps JavaScript API and Google’s terms, not missing coding time.

| Brief requirement | Why it is not achievable here |
| --- | --- |
| Phase 1: **Natural Earth** projection | Google Maps is Web Mercator only. There is no Natural Earth (or other cartographic) projection. |
| **Own vector geometry**, RosoTravel styling, **no third-party branding** | The basemap is Google’s. Attribution (logo and data credits) **must stay visible**. Hiding it breaks Google’s terms. |
| No provider labels, city names, or roads on the surface | We can hide many of them with styles, but a Map ID fights JSON styles, and Google’s world remains underneath. This is a skin, not our canvas. |
| Recommended countries **re-tinted** as part of the basemap | Overlay polygons can approximate this. They are not Google’s land, and they will not match the brief’s “own geometry”. |
| L2 as a **quiet dotted field** (diagram, not a street map) | Google city view is still a map (roadmap, satellite, or hybrid). Overlays do not turn it into the specified diagram. |
| Phase 2: globe in the **same visual language** as the flat map | Google 3D is photorealistic tiles — a different product (heavy, branded, not our land tints). |
| “**Not** a Google Maps-style wayfinding tool” as the homepage centrepiece | Using Google as the surface keeps wayfinding in the centre of the homepage, even with chrome hidden. |

**What it would take:** a custom map (for example d3-geo + Natural Earth for Phase 1, orthographic globe for Phase 2). That is a **different engine**, not a settings change on Google Maps.

### Not built yet (product / platform)

These can be achieved. They need production work, not a Google feature flag.

| Brief requirement | What is missing | What it takes |
| --- | --- | --- |
| Server-rendered, crawlable list and real `/destinations/...` pages | Dummy `href`s; clicks stay in the map. No SSR. | Real site (e.g. Next.js), default ranking in HTML, preference still session-only. |
| Map error / no-map fallback | If Google fails, there is no designed degrade to the list. | List as the section; map optional. No error modal on the map. |
| Poster / first paint | Map can block or flash empty while tiles load. | Static poster; hydrate map behind it. |
| Loading-level skeleton | Not implemented. | Brief skeleton matching the target level; flash line still immediate. |
| How We Do It + homepage section height | Standalone demo page; map taller than ~200px. | Compose as one homepage block; lock section height so descending a level does not lengthen the page. |
| L1 attraction clusters | Country view shows cities only. | Cluster marks with pick counts, no prices. |
| Pin collision (move, never drop; then badge → label → list-only) | Pins may overlap. | Custom layout at 390px; Google’s hide-on-collision is the wrong rule. |
| Readability cap (show fewer than 8/4 if labels crowd) | Always show the numeric cap. | Measure label overlap; hold extras in the list. |
| City-specific fit copy and ranking | Cities inherit country copy; city order is default base + picks. | Per-city `fits` (or equivalent) by preference. |
| Reason chips from verified product facts | Editorial strings in the sample catalog. | Generate chips from live product fields; they must not contradict L3. |
| Preference-specific review slices | Same quote, relabelled. | Real review query per audience + “why these reviews” snippet. |
| Working **Check dates** CTA | Button only. | Hook to booking / availability. |
| Contrast audit | Not measured. | 4.5:1 on all functional text. |
| Nearest-pin hit testing (22px) | Marker-only hits. | Custom hit target around small pins. |
| Live catalog / CMS / API | All data in the frontend sample file. | Homepage-slice bootstrap (load once — see [HOMEPAGE_MAP_DATA_LOADING.md](./HOMEPAGE_MAP_DATA_LOADING.md)). |
| Real photography | Empty slots only. | Product photography; still no stock/AI. |

---

## One-page scorecard

| | Status |
| --- | --- |
| Recommendation funnel (4 levels, preference chips, trade-offs, match labels) | **Achieved** in the prototype, on sample data |
| Spec map (Natural Earth, no Google branding, quiet city diagram, matching globe) | **Not achieved** — Google Maps cannot deliver this |
| Production homepage (SSR list, real pages, poster, fallback, live prices, booking CTA) | **Not achieved** — not this prototype’s job; needs the real site |
| Google flat + photorealistic 3D with our pins | **Achieved**, as a comparison surface, with Google’s constraints |

---

## What we recommend saying

> This prototype proves the **recommendation funnel**: preference, four levels, honest labels, and a list beside the map. It does **not** prove the **specified map surface**. Google Maps cannot be Natural Earth, cannot drop Google branding, and cannot become the quiet city diagram or RosoTravel globe in the brief. Those need a custom canvas. Everything else still open — crawlable pages, photography, live prices, Check dates, clusters, pin collision, first-paint poster — is production work on top of that canvas, not a Google setting.

If the decision is to **keep Google Maps** as the shipped surface, the brief’s Phase 1 (Natural Earth), basemap non-negotiable (no third-party branding), L2 diagram, and Phase 2 globe **must be rewritten**. We cannot “finish” those items on this engine.

If the decision is to **keep the brief**, Google Maps stays a useful comparison, not the homepage.
