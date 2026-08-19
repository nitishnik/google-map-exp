# Destination Discovery Map — Client Requirements

## 1. Vision & Purpose

The Destination Discovery Map is the **centrepiece of the RosoTravel homepage**. It replaces the traditional "browse destinations" grid with an **opinionated, recommendation-driven map** that guides travellers through a four-level decision funnel:

```
"Where should someone like me go?"
        ↓
"Where in this country do I base myself?"
        ↓
"What is actually worth my time here?"
        ↓
"Which version of this do I book?"
```

### What This Map Is

- A **recommendation engine with spatial context** — not a traditional map
- A **preference-driven filter** that re-ranks everything on screen with one tap
- An **honest advisor** that shows trade-offs alongside recommendations
- A **conversion funnel** that moves from inspiration (L0) to booking (L3)

### What This Map Is NOT

- ❌ Not a product carousel inside a map
- ❌ Not a Google Maps-style wayfinding tool
- ❌ Not a "show everything" catalogue view
- ❌ Not a separate page — it lives within the homepage section

### Phase Scope

| Phase | Deliverable |
|---|---|
| **Phase 1** | Custom flat world map (Natural Earth projection) |
| **Phase 2** | 3D globe with rotation/tilt |

### Design Context

> **Important:** The map section should sit together with **Travel Preferences** and **How We Do It** sections as one unified homepage block, not as an isolated component.

---

## 2. Core Principles

These seven principles hold at **every zoom level** and are non-negotiable for implementation:

| # | Principle | Implication |
|---|---|---|
| 1 | **A pin is a recommendation, not a location** | If we have nothing to recommend somewhere, it does not get a pin |
| 2 | **We reorder, we never hide** | A destination that doesn't match the active preference stays on the map with an honest label and reason |
| 3 | **One entity type per level** | Countries don't appear at city level; products never appear on the map surface |
| 4 | **Counts are ceilings, readability outranks them** | Up to 8 cities, up to 4 attractions, 3 products (4 if readable). If labels crowd, show fewer — never reduce type size or tighten spacing |
| 5 | **Commercial detail arrives late** | Prices, ratings and review counts start at L2, complete only at L3 |
| 6 | **Every recommendation carries its cost** | A trade-off line is mandatory wherever we make a claim |
| 7 | **The map is an enhancement, not the content** | The list below is server-rendered, crawlable, and the fallback when the map cannot load |

---

## 3. Architecture Overview — Four Zoom Levels

| Level | Entities on Map | Question Answered | Commercial Detail |
|---|---|---|---|
| **L0 World** | Countries | Where should someone like me go? | Pick count only. No prices, no ratings |
| **L1 Country** | Cities (up to 8, readability-capped) + attraction clusters | Where in this country do I base myself? | Counts only. Clusters show pick count, nothing else |
| **L2 City** | Attractions (max 4 winners) + categories | What is actually worth my time here? | Rating, review count, from-price per attraction |
| **L3 Attraction** | Selected attraction + siblings (3 products, 4 if readable) | Which version of this do I book? | Full: rating, reviews, duration, exact price, CTA |

---

## 4. Level 0 — World

### Purpose
Turn a preference into a shortlist of countries, and make the reasoning visible before anything is clicked.

### Map Treatment
- **Projection**: Flat world — Natural Earth
- **Land colour**: Warm tint
- **Water colour**: Pale / muted
- **Borders**: National borders as hairlines only
- **Recommended countries**: Tinted a half-step warmer than the rest
- **Suppressed**: No provider labels, no city names from basemap, no roads
- **Frame**: Fitted to all covered destinations — no pin can fall outside the card

### Pins
- **One pin per country**: white pill with coloured dot, country name, badge with pick count
- **Pill styling encodes match tier**
- **Labels never overlap**: separated in both axes; a pin that can't be placed cleanly is moved, never dropped

### Panel Below Map
- Photo, match label, one reason chip, country name with top city
- "Why this fits" line
- Selection figure (e.g., "9 picks from 180")

---

## 5. Level 1 — Country

### Purpose
Answer "where in this country" before anyone starts comparing tours.

### Map Treatment
- **Projection**: Switches to **Mercator**, fitted to selected country
- **Selected country**: Filled a shade darker than neighbours — boundary of decision is obvious
- **Surrounding countries**: Visible but unlabelled

### How Many Cities
> **Hard ceiling: 8 cities. Readability decides the real number.**
- Add cities while every label still sits clear of its neighbours at **390px viewport**
- Ranking is by **decision value**, not catalogue size
- **Top-ranked city is emphasised** — default choice is never ambiguous

### Pin Behaviour Under Crowding
- Lower-ranked cities drop their **count badge** first
- If still crowded, lower-ranked cities drop their **label**
- If still can't be placed cleanly, city is held back from the map → stays in panel list (never lost)

---

## 6. Level 2 — City

### Purpose
Show the two or three things in this city that we would actually send this traveller to, and start being specific about money.

### Map Treatment
- **Surface**: Light dotted field
- **City centre**: Marked with a dot
- **Distance rings**: Concentric rings from centre
- **Scale bar**: In kilometres
- **City name**: Set small beneath centre dot
- **Attraction positions**: True coordinates — geography is real even though basemap is quiet

### How Many Attractions
> **Maximum: 4 winners per city. Not 4 of everything — 4 genuinely relevant to the active preference.**
- Ranked by **review volume within their category** — ordering is earned by evidence

### Panel
- Photo, match label, reason chip (assembled from verified product facts)
- Attraction name + category
- Fit explanation
- **Rating, review count, from-price** (commercial detail starts here)
- One trade-off line closes the list

---

## 7. Level 3 — Attraction & Products

### Purpose
Make the booking decision between two or three versions of the same attraction, and be explicit about what each one gives up.

### Map Treatment
- **Frame**: Stays at **city scale** — context is what makes comparison possible
- **Selected attraction**: Emphasised
- **Sibling attractions**: Visible in quieter treatment (paler fill/border, **never faded text**), remain tappable
- **Switching**: One tap to switch between attractions

### How Many Products
> **Cap: 3 products. A 4th is allowed only where the card set still reads cleanly.**
- 3 genuinely different options beat 4 near-identical ones
- **Duplicates are removed before the cap is reached**
- Each product must differ on something actionable: **duration, access level, price bracket, or group size**

### Product Card — Panel
1. Photo + title
2. Fact row: rating, review count, duration, exact price
3. **Why this fits** — assembled from approved template + verified product facts
4. **Material trade-off** — in quiet grey block
5. **Review prioritisation block** — preference-filtered review slice
6. **Single priced CTA** — `Check dates · from €49`

---

## 8. Preference Row — The Only Input

A single horizontally scrolling row of **preference chips** sits above the map.

### Seven Canonical Audience Profiles

The homepage uses the same underlying profiles as sign-up and the preference editor. Landing-page labels are intentionally shorter and clearer:

| Internal profile | Preference chip |
|---|---|
| `first_time_visitor` | First Visit, Made Memorable |
| `family_traveler` | Family Favourites |
| `couple_traveler` | Perfect for Two |
| `comfort_easy_pace_traveler` | Premium & Effortless |
| `solo_social_traveler` | Solo & Social |
| `interest_deep_dive_traveler` | Go Deeper |
| `active_adventure_traveler` | Active Discovery |

These are audience profiles, not trip-intent or group-format filters. Budget, value, private, small-group, and standard-group signals support ranking but are not separate preference chips.

### Behaviour
- **Tap a chip**: Re-ranks pins, re-tints map, rewrites every match label, reason chip, fit explanation, trade-off. Reorders the list below. Updates count line above map
- **One selection at a time**: Selected chip = solid navy fill
- **Poor fit on current view**: If currently open destination is a poor fit for the new preference → **view returns to World level** rather than leaving someone inside a recommendation we no longer stand behind

---

## 9. Match Labels & Reason Chips

### Match Label System
- **Best match**: Solid red, white text
- **Best alternative**: White with navy outline
- **Also fits**: Warm grey fill, no border
- **Worth considering**: White with dashed border

### Reason Chips
Reason chips name **specific reasons, never moods** (e.g., "Strong family-compatible inventory" instead of "Perfect for families").
- **One chip per row** on the map panel
- **Two maximum** on an attraction row
- Where a chip states a format or duration → **derived from real product data**, can never contradict the product list underneath

---

## 10. Trade-offs & Review Prioritisation

### Material Trade-off
> Every country, city, and product carries **one trade-off**. It must be **material** — something that would change a decision.
- Never a disclaimer, never legal small print

### Review Prioritisation Block
- Label **changes with the preference row** — same product can honestly show a different review slice to a family vs. a culture traveller
- Contextual snippet explains **why these reviews** were selected

---

## 11. Navigation Between Levels

### Movement Rules
- **⬇ Down**: Tap a pin or panel row (Descends one level)
- **⬇ Down**: Zoom in (Same as tap — chooses highest-ranked entity in view)
- **⬆ Up**: Zoom out (Climbs one level, drops the selection it leaves behind)
- **⬆ Up**: Breadcrumb tap (Any level is one tap away)
- **↔ Pan**: Drag (**Never changes level, never opens anything**)

### Transition Feedback
Each transition confirms itself with a brief line over the map (e.g. "Poland · 5 cities prioritised", "Re-ranked for family favourites"). States **what changed**, never "loading".

---

## 12. States to Design

- **Poster / First Paint**: Map loads behind a static poster — it never blocks the first render. 
- **Single-Match Preference**: When only one destination is a strong match, map still frames all covered destinations. Must never collapse onto one point or come back empty.
- **No Map (Fallback)**: The crawlable list below is the section. Same match labels, same order, real links.
- **Empty Photography**: Every image is a drop slot until real photography lands. **No stock, no illustration, no AI imagery**.
- **Loading Level**: Brief skeleton matching target level's layout. Transition feedback line appears immediately.
- **Error**: Map degrades to list gracefully. No error modals over the map surface.

---

## 13. Non-Negotiables

| Constraint | Specification |
|---|---|
| **Touch targets** | 44px minimum for every control. Map pins stay visually small; a tap within 22px resolves to nearest pin |
| **Contrast** | 4.5:1 on all functional text, including match labels and smallest metadata. De-emphasis via fill and border, **never by fading text** |
| **Basemap** | Own vector geometry, RosoTravel styling. **No third-party map branding**, no provider POI labels anywhere on the surface |
| **Section height** | Map roughly **200px on a 390px screen**, with one results panel that scrolls internally. Descending a level must not lengthen the page |
| **Indexability** | Ranking and copy adapt to preference; the page's indexable structure and routing targets do **not**. Preference is a session signal, **never a URL** |
