# Backend API (homepage map)

Two ways to give data. Pick **one** for the homepage.

| | Single API | Multiple APIs (branch) |
| --- | --- | --- |
| What | One call returns **everything** | One call **per level** as the user drills in |
| API | `GET /bootstrap` | `/audiences`, `/destinations`, `/countries/{id}/cities`, `/cities/{id}/attractions`, … |
| When frontend calls | **Once**, on page load | Again on every country / city / attraction tap |
| Map feel | Fast (data already in memory) | Slower (wait for network, then fly the camera) |
| Use | **Homepage v1 — use this** | Other clients, debug, or later live prices |

**Recommended:** single API (`/bootstrap`). Frontend sends `?audience=family`. Backend returns countries + cities + attractions + products in that one JSON. After that, zoom and preference chips do **not** call the backend.

**If you branch:** frontend calls a different API at each step (world → country → city → products). Same field meanings as below. The homepage should **not** use this path for v1.

GET only. No body, no auth. Full contract: [API.md](./API.md).

Base: `/api/v1/homepage-map`

Query used on most calls:

| Name | Example | Values | Purpose |
| --- | --- | --- | --- |
| `audience` | `family` | `first`, `family`, `culture`, `active`, `budget` | Rank and copy for first paint. Default: `family`. |

Prices are numbers in EUR (no `€`). `lat` / `lng` are decimal degrees. Caps: cities ≤ 8, attractions ≤ 4, products ≤ 3.

---

## All APIs (build these; homepage only needs #1)

| # | API | Frontend sends | Purpose |
| --- | --- | --- | --- |
| 1 | `GET /bootstrap` | `?audience=` | **Main call.** Whole homepage tree in one response. |
| 2 | `GET /audiences` | (none) | Preference chips and badge counts. |
| 3 | `GET /destinations` | `?audience=` | World pins + country list. |
| 4 | `GET /countries/{countryId}` | path + `?audience=` | One country (name, coords, why). |
| 5 | `GET /countries/{countryId}/cities` | path + `?audience=` | Cities in that country (pins + list). |
| 6 | `GET /cities/{cityId}` | path + `?audience=` | One city. |
| 7 | `GET /cities/{cityId}/attractions` | path + `?audience=` | Attractions in that city. |
| 8 | `GET /cities/{cityId}/attractions/{attractionId}` | path + `?audience=` | Products for one attraction. |

Ids: `pl`, `krakow`, `wawel-castle`.

---

## 1. Bootstrap (required for homepage)

```
GET /api/v1/homepage-map/bootstrap?audience=family
```

**Send:** `audience`.

**Return:** chips + all countries + cities + attractions + products. Include `fits` for **all five** audiences, not only the query.

Production: 6 countries. Example is two countries and one city.

```json
{
  "audience": "family",
  "audiences": [
    { "id": "family", "label": "Family", "matchCount": 2 },
    { "id": "culture", "label": "Culture & history", "matchCount": 3 }
  ],
  "matchline": "1 best match and 1 best alternative for family.",
  "destinations": [
    {
      "id": "pl",
      "name": "Poland",
      "lat": 52,
      "lng": 19.4,
      "cityId": "krakow",
      "picks": 9,
      "opts": 180,
      "fits": {
        "family": [0, ["Strong family-compatible inventory"], "Compact old towns you can walk in an hour.", "Fewer English-language departures than western Europe."],
        "culture": [1, ["Twentieth-century depth"], "Guides can name the buildings that were rebuilt.", "Heavier subject matter for under-12s."]
      }
    },
    {
      "id": "it",
      "name": "Italy",
      "lat": 42.8,
      "lng": 12.6,
      "cityId": "rome",
      "picks": 31,
      "opts": 812,
      "fits": {
        "family": [2, ["Skip-the-line ticket classes"], "Ticket class is the difference between a great day and a queue.", "August heat pushes good formats before 10:00."],
        "culture": [0, ["Archaeologist-led access"], "Restricted-area entry with a specialist.", "Crowds at the icons."]
      }
    }
  ],
  "cities": {
    "krakow": {
      "id": "krakow",
      "countryId": "pl",
      "name": "Kraków",
      "lat": 50.0647,
      "lng": 19.945,
      "picks": 9,
      "attractions": [
        {
          "name": "Wawel Castle",
          "category": "Castles & royal sites",
          "lat": 50.054,
          "lng": 19.9354,
          "from": 14,
          "rating": 4.8,
          "reviews": 3420,
          "fits": {
            "family": [0, "Flat courtyards and a 90-minute format."],
            "culture": [0, "Royal apartments with a guide who can date each rebuild."]
          },
          "products": [
            {
              "title": "Wawel Castle & Cathedral, 90-minute family walk",
              "rating": 4.9,
              "reviews": 1204,
              "duration": "1h 30m",
              "price": 32,
              "why": "Ninety minutes, flat ground, dragon legend before the tombs.",
              "trade": "Skips the Crown Treasury.",
              "snip": "Reviews from travellers with children under 12.",
              "quote": "Short enough that our seven-year-old was still listening."
            }
          ]
        }
      ]
    }
  }
}
```

**Purpose:** `audiences` → chips. `destinations` → world pins (`lat`/`lng`) and list. `fits` → re-rank on chip tap (`0` best match … `3` worth considering). `cities` → country/city/attraction drill-in. `products` → last-level cards.

---

## 2. Audiences

```
GET /api/v1/homepage-map/audiences
```

**Send:** nothing.

**Return:**

```json
{
  "audiences": [
    { "id": "family", "label": "Family", "matchCount": 2 },
    { "id": "culture", "label": "Culture & history", "matchCount": 3 }
  ]
}
```

**Purpose:** chip label and badge. `matchCount` = how many countries are a strong match (tier 0 or 1). Already inside bootstrap.

---

## 3. Destinations (world)

```
GET /api/v1/homepage-map/destinations?audience=family
```

**Send:** `audience`.

**Return:**

```json
{
  "audience": "family",
  "matchline": "1 best match and 1 best alternative for family.",
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

**Purpose:** world map pins and destination list for one audience. Already inside bootstrap.

---

## 4. One country

```
GET /api/v1/homepage-map/countries/pl?audience=family
```

**Send:** `countryId` in the path (`pl`), plus `audience`.

**Return:**

```json
{
  "country": {
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
}
```

**Purpose:** country name, pin, and why/trade-off copy.

---

## 5. Cities in a country

```
GET /api/v1/homepage-map/countries/pl/cities?audience=family
```

**Send:** `countryId` (`pl`), plus `audience`.

**Return:**

```json
{
  "country": { "id": "pl", "name": "Poland", "cityId": "krakow" },
  "cities": [
    { "id": "krakow", "countryId": "pl", "name": "Kraków", "lat": 50.0647, "lng": 19.945, "picks": 9 },
    { "id": "warsaw", "countryId": "pl", "name": "Warsaw", "lat": 52.2297, "lng": 21.0122, "picks": 6 }
  ]
}
```

**Purpose:** city pins and list after someone opens a country. `lat`/`lng` place the pin. `picks` is the badge.

---

## 6. One city

```
GET /api/v1/homepage-map/cities/krakow?audience=family
```

**Send:** `cityId` (`krakow`), plus `audience`.

**Return:**

```json
{
  "city": {
    "id": "krakow",
    "countryId": "pl",
    "name": "Kraków",
    "lat": 50.0647,
    "lng": 19.945,
    "picks": 9
  }
}
```

**Purpose:** city name and centre for the map.

---

## 7. Attractions in a city

```
GET /api/v1/homepage-map/cities/krakow/attractions?audience=family
```

**Send:** `cityId` (`krakow`), plus `audience`.

**Return:**

```json
{
  "city": { "id": "krakow", "name": "Kraków", "lat": 50.0647, "lng": 19.945 },
  "attractions": [
    {
      "name": "Wawel Castle",
      "category": "Castles & royal sites",
      "lat": 50.054,
      "lng": 19.9354,
      "from": 14,
      "rating": 4.8,
      "reviews": 3420,
      "tier": 0,
      "why": "Flat courtyards and a 90-minute format."
    },
    {
      "name": "Kazimierz",
      "category": "Quarters & food walks",
      "lat": 50.0517,
      "lng": 19.9445,
      "from": 22,
      "rating": 4.9,
      "reviews": 1980,
      "tier": 2,
      "why": "Food-led version works well; the memorial-site version does not."
    }
  ]
}
```

**Purpose:** attraction pins and list. `from` / `rating` / `reviews` show from this level.

---

## 8. Products for one attraction

```
GET /api/v1/homepage-map/cities/krakow/attractions/wawel-castle?audience=family
```

**Send:** `cityId` + `attractionId` in the path, plus `audience`.

**Return:**

```json
{
  "attraction": {
    "id": "wawel-castle",
    "name": "Wawel Castle",
    "lat": 50.054,
    "lng": 19.9354,
    "from": 14,
    "rating": 4.8,
    "reviews": 3420
  },
  "products": [
    {
      "title": "Wawel Castle & Cathedral, 90-minute family walk",
      "rating": 4.9,
      "reviews": 1204,
      "duration": "1h 30m",
      "price": 32,
      "why": "Ninety minutes, flat ground, dragon legend before the tombs.",
      "trade": "Skips the Crown Treasury.",
      "snip": "Reviews from travellers with children under 12.",
      "quote": "Short enough that our seven-year-old was still listening."
    },
    {
      "title": "Royal apartments & Crown Treasury, historian-led",
      "rating": 4.8,
      "reviews": 876,
      "duration": "2h 45m",
      "price": 58,
      "why": "Full interior circuit with an art historian.",
      "trade": "Longer duration and 140 stairs.",
      "snip": "Reviews from travellers who booked expert-led formats.",
      "quote": "The guide answered questions I did not know I had."
    }
  ]
}
```

**Purpose:** last-level product cards. `price` / `duration` / `why` / `trade` / `quote` are the card. CTA uses `price` (`Check dates · from €32`).
