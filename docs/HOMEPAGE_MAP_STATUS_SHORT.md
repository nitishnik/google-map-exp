# Homepage Discovery Map — status (short)

For the client. Full detail: [HOMEPAGE_MAP_STATUS.md](./HOMEPAGE_MAP_STATUS.md).

This is a **prototype**, not the live homepage. Data is sample. There is no booking, CMS, or destination pages yet.

---

## In one sentence

The **recommendation funnel** works. The **map surface in the brief** does not — Google Maps cannot deliver it.

---

## What we achieved (and the limit)

| Done | Constraint |
| --- | --- |
| Four levels: country → city → attraction → products | Sample catalog (6 countries), not live inventory |
| Preference chips re-rank pins and the list; we never hide destinations | City copy still uses country text; not preference-specific per city |
| Match labels, reason chips, trade-offs | Editorial sample copy, not live product facts |
| Prices from city level; full facts and CTA at attraction level | Hardcoded numbers, not live prices |
| Caps: 8 cities / 4 attractions / 3 products | We always show the cap; crowded labels are not dropped for readability |
| List under the map; empty photo slots; preference not in the URL | List is not crawlable; `/destinations/...` pages do not exist |
| Flat Google map + photorealistic 3D toggle | 3D is Google’s tiles, not a RosoTravel globe. Google logo must stay |

---

## What we have not achieved

**Google Maps cannot do these** (not a coding gap — the engine cannot honour the brief):

- Natural Earth world map  
- Own geometry, RosoTravel styling, **no Google branding**  
- Quiet city diagram (dotted field, no street map)  
- Globe in the **same** look as the flat map  
- Homepage that is **not** a Google wayfinding map  

To get those, we need a **custom map**, not a Google setting.

**Not built yet** (can do on the real site):

- Crawlable list and real destination pages  
- Poster / first paint, map-error fallback  
- How We Do It as one homepage block  
- Attraction clusters, pin collision, live reviews, working **Check dates**  
- Real photography and live catalog  

---

## Decision

Keep **Google Maps** → rewrite the brief (Natural Earth, no branding, city diagram, matching globe).

Keep the **brief** → Google stays a comparison. The homepage map must be a custom canvas.

The long note has the item-by-item tables.
