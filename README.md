# RetroLoop Studio (refactor)

This refactor moves all inline CSS + JS out of `index.html` into:
- `src/css/legacy.css` (original CSS moved as-is)
- `src/css/styles.css` (aggregator)
- `src/js/app.js` (original JS moved as-is)

## Fix included
- Drum row dropdown options now display correctly:
  - changed `DRUM_SOUNDS` option text from `.name` -> `.label`

## Run locally
Because this project uses fetch() for demo/midi assets, serve it with a local server:

```bash
python -m http.server 8080
# then open http://localhost:8080
```
