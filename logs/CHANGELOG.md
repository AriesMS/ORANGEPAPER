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

## Facade landing section

Added centred project 02 geometry, an editable right-side introduction (`public/facade-to-interior.html`, `#landing-copy`), and links down to the study. Moved the existing scroll sequence into a separate track and made its progress relative to that section. Mobile layout stacks the text below the preview. Build and path tests passed.


## 2026-09-12 — Facade-to-interior stages and detection animation

- Reused the homepage's intact fragment 02 geometry as the landing construct. Its pods/antenna, collar, core, and supports link to stages 1–4 respectively, with rotation, zoom, and panning.
- Shared the homepage modernist texture generator so hovered geometry groups reveal the same red, yellow, blue, cream, and black pattern; inactive groups remain wireframe.
- Added vertically ordered detection training, photogrammetric context, prediction, and embodied-carbon/material-cost sections. Preserved the exploded facade study inside Stage 3.
- Replaced the preliminary landing introduction panel with one descriptive sentence and removed visible navigation prompts. Stage links remain available on keyboard focus and as a WebGL fallback.
- Created a looping 97-frame panel GIF (1200 × 800, 800 ms per frame), retained it in `assets/research/facade-to-interior/stage1fotos/`, and published a copy under `public/images/facade-to-interior/` with a Stage 1 caption. GIF padding matches the black page background.
- Stage 1 selection centers the GIF in the viewport. The fixed return link fades while overlapping visible page content and reappears when clear; keyboard focus restores visibility.
- Validation: all three `npm test` checks passed; the four geometry groups were checked against the full assembly's faces and edges; all 97 GIF frames were decoded and padded corners checked for black. Browser interaction was not visually verified.
- Generated `dist/` output and operational logs remain gitignored. Unrelated raw research imports and file-permission changes are outside this commit.
