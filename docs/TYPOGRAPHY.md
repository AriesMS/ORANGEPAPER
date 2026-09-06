# Typography history

## Current: 2026-09-06

All four HTML pages load `src/styles/typography.css` last. Titles (h1–h6, including dynamically inserted project headings) use the installed **Bauhaus** family. Text and controls use **IBM Plex Mono**, the installed IBM Plex variant. These are local fonts; visitors without them see sans-serif titles and monospace text.

## Original fonts

All four pages originally inherited `"Courier New", monospace` from `src/styles/journey.css`, for both titles and text. Facade navigation controls explicitly used `font:11px 'Courier New',monospace`. Renderer errors used `font:12px/1.8 monospace`. Native controls otherwise used browser defaults.

The first typography change applied only to Facade to Interior: titles used `"Bauhaus 93", Bauhaus, "ITC Bauhaus"` with a Helvetica fallback; text used `Helvetica, "Helvetica Neue", Arial, sans-serif`.

The unused legacy `docs/archive/legacy-site/style.css` remains unchanged: its sans-serif stack is `"Nunito", "Helvetica Neue", Arial, sans-serif`, and its monospace stack is `"Courier New", Courier, monospace`.

## Restore original typography

1. Remove the `typography.css?v=1` stylesheet link from all four HTML pages.
2. In `src/styles/facade-study.css`, replace `font:11px var(--study-text-font)` with `font:11px 'Courier New',monospace`.
3. Refresh the page. The original shared `src/styles/journey.css` font declarations remain intact.


Repository paths changed on September 6, 2026. HTML is in `public/`; deployable output is generated in `dist/`. See [the structure guide](STRUCTURE.md) and [root README](../README.md).
