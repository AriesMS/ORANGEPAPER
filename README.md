# Aries Yang — Research Construct

Interactive architectural research portfolio built with Three.js and esbuild.

## Run locally

Requires Node.js 20+ and npm.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173. `npm start` builds the site and serves `dist/`.
After editing, run `npm run build` and refresh the browser. The preview server serves the new files without restarting. `npm test` rebuilds and checks page assets, links, bundle syntax, source imports, and output boundaries.

## Folder map

| Location | Purpose |
| --- | --- |
| `public/` | Four editable HTML pages and the published facade image |
| `src/pages/` | Home construct and facade scrolling entry scripts |
| `src/components/` | Shared geometry and carrier motion |
| `src/styles/` | Editable CSS and typography |
| `dist/` | Generated deployable website; never edit directly |
| `config/` | esbuild configuration |
| `scripts/` | Build and local preview utilities |
| `tests/` | Build and path regression checks |
| `docs/` | Design, typography, structure, course kit, archived experiments |
| `assets/research/` | Unpublished slides, raw models and working photos |
| `logs/` | Tracked migration manifest and ignored operational logs |
| `deploy/` | Hosting instructions |
| `tmp/` | Ignored pre-move bundle snapshots and temporary files |

Edit `public/index.html` for homepage markup; the previous root `index.html` has moved. Serve **dist/**, not the repository root or public/ alone. Page URLs within the deployed site remain `index.html`, `facade-to-interior.html`, `internal-wall-inference.html`, and `interior-segmentation.html`.

See [design](docs/DESIGN.md), [typography](docs/TYPOGRAPHY.md), [structure and migration](docs/STRUCTURE.md), [deployment](deploy/README.md), and [log policy](logs/README.md).

Deployment automatically runs on pushes to `main` using `.github/workflows/pages.yml`. Keep GitHub Pages → Source set to GitHub Actions; no manual workflow run is needed.

See [adding or implementing pages](docs/ADDING_PAGES.md) for the development workflow and [work log](logs/CHANGELOG.md) for the change history.
