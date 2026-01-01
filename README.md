# RetroLoop Studio — Refactor (Transport + Soundbank)

## What changed
- Inline CSS moved to `src/css/legacy.css`
- Added DAW-style transport facelift in `src/css/transport.css`
- Inline JS moved to `src/js/app.js`
- Fixed drum dropdown label bug (`s.name` -> `s.label`)
- Added Soundbank WAV support via `soundbank/manifest.json`

## Generate the soundbank manifest
From repo root:

```bash
node tools/gen-manifest.mjs
```

This will scan `soundbank/**.wav` and write `soundbank/manifest.json`.

## Run locally
Use a local server (required for fetch/decode of WAV files):

```bash
python -m http.server 8080
# open http://localhost:8080
```
