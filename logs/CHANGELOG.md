# Work log

## 2026-09-06 — Website implementation and restructuring

- `b79fd78`: committed the animated research carrier, current typography, design documentation, restored facade scrolling, and persistent click selection.
- `6c2bfe4`: committed the public/src/dist folder structure, path updates, build and preview utilities, migration manifest, regression tests, and initial manual Pages workflow. Raw local imports remained outside the commit.
- Recorded exact moves in `restructure-2026-09-06.json`. Operational build/access/error logs remain local and gitignored.

## 2026-09-06 — Preview, deployment, and page authoring follow-up

- Clarified that editable HTML is in `public/`, and the working preview is generated in `dist/`. `npm start` builds and serves the site; subsequent edits require a rebuild and browser refresh.
- Explained that deployed page URLs stay the same when `dist/` is served as the web root. The former branch-root publishing configuration must use GitHub Actions for the new build structure.
- Guided the Pages Source selection and manual workflow navigation. The user's screenshot showed GitHub Actions selected; a successful remote deployment was not verified in this session.
- Changed `.github/workflows/pages.yml` to publish on pushes to `main`, retaining manual dispatch. This removes the repeated manual-run step once the workflow change is pushed.
- Updated root and deployment documentation, and added `docs/ADDING_PAGES.md` covering HTML, assets, CSS, JavaScript build entries, homepage links, construct records, tests, and preview commands.
- Validation: `npm test` rebuilds and verifies published HTML dependencies, output boundaries, and source imports. Git whitespace checks are performed before commit.

This entry describes the prepared changes; commit/push confirmation is reported separately after Git succeeds. Workflow trigger configuration does not itself confirm a successful deployment.
