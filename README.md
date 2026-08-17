# Google homepage map

Flat / 3D destination discovery map. Nothing else from the old POC is included.

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
