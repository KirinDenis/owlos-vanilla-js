# owlos vanilla JS — open-source JS effects library

A curated catalog of vanilla-JS effects: backgrounds, cursors, HUDs, particles, audio. Each effect is **self-contained** — one HTML file, no dependencies, no build step.

## Live catalog

Open `index.html` to browse. Click any card → live demo + tweak panel + code editor + download.

## Effects in this release (v1.0)

| # | Name | Category | Size |
|---|------|----------|------|
| 1 | Wire canvas | Background | ~3 KB |
| 2 | Cursor halo | Cursor | ~1 KB |
| 3 | Motion-tracker ping | Audio | ~1.5 KB |

More effects will be added — backgrounds, HUDs, 3D, text effects, transitions.

## Using an effect in your site

Each effect is one HTML file. To embed:

1. Open the effect's detail page (e.g. `fx/wire-canvas/index.html`)
2. Tweak the parameters with the live controls
3. Click **Download** — gets you a self-contained HTML with your settings baked in
4. Either embed via `<iframe>`, or copy the `<script>` block into your site

## License

**MIT** — use it anywhere, including commercial work. No attribution required (but appreciated). See [LICENSE](LICENSE).

## Contributing

Adding an effect = adding a folder under `fx/<name>/` with:
- `effect.html` — the standalone effect (must declare `window.PARAMS` at top)
- `index.html` — detail page with tweak controls (use existing as template)
- Card entry in main `index.html`

Pull requests welcome.

## Credits

Built and maintained by [owlos.sk](https://owlos.sk) — small design studio in Slovakia.
