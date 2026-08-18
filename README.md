# Google homepage map

Flat / 3D destination discovery map. Nothing else from the old POC is included.

## Docs

| File | What it is |
| --- | --- |
| [docs/client-requirements.md](docs/client-requirements.md) | Client brief |
| [docs/HOMEPAGE_MAP_DATA_LOADING.md](docs/HOMEPAGE_MAP_DATA_LOADING.md) | Load the catalog once (v1 default) |
| [docs/HOMEPAGE_MAP_API.md](docs/HOMEPAGE_MAP_API.md) | Frontend / backend architecture |
| [docs/API.md](docs/API.md) | REST endpoint contract |

## Setup

```bash
npm install
cp .env.example .env
```

Put a Google Maps JavaScript API key in `.env` as `VITE_GOOGLE_MAPS_API_KEY`. Optional: `VITE_GOOGLE_MAPS_MAP_ID` for Advanced Markers / vector styling.

```bash
npm run dev
```

3D view needs the Maps JavaScript API alpha channel plus 3D Maps / Map Tiles enabled on the key.
