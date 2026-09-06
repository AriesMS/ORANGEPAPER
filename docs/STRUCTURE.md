# Repository structure and migration

The September 6, 2026 reorganisation follows the applicable parts of [Understanding Web Project Folder Structure](https://medium.com/@mohitkhubchandani88/understanding-web-project-folder-structure-6cc7ae62fb40): public assets, editable source, generated distribution, configuration, utilities, tests, logs, documentation, and temporary files.

This is a static multi-page website. Backend folders such as controllers, middleware, routes, database migrations, and API handlers are not created because the project has no backend. Dependencies stay in `node_modules/` under npm management. The course kit remains a self-contained reference collection in `docs/course-kit/`, and legacy site experiments are preserved in `docs/archive/legacy-site/`.

## Move history

The exact directory/file moves are in [the migration manifest](../logs/restructure-2026-09-06.json). Directory moves include their children, including existing untracked imports. No research inputs were deleted. The active facade illustration moved to `public/images/facade-to-interior/`; other images and raw inputs moved to `assets/research/`.

- Root HTML → `public/`.
- Page source scripts → `src/pages/`, renamed without the `-source` suffix.
- Geometry/motion modules → `src/components/`.
- Current CSS → `src/styles/`.
- Design/typography documents → `docs/`.
- Old generated bundles → ignored `tmp/pre-restructure/`; new bundles are generated in `dist/scripts/`.
- Course materials → `docs/course-kit/`; unused root script/style → `docs/archive/legacy-site/`.

Imports, HTML links, image paths, build commands, and current documentation have been adjusted. Existing raw OBJ/MTL/texture files remain together to preserve their relative references. Historical course exercises may still describe their original examples; follow the root README for this live project.

## Build and delivery

`npm run build` creates `dist/` from scratch, copying `public/`, copying current styles to `dist/styles/`, and bundling page scripts into `dist/scripts/`. Root package metadata remains in place for npm. Production output is reproducible and gitignored. The build publishes neither logs nor raw research. Do not point a production server at the repository root.

The previous branch-root GitHub Pages setup must be changed to deploy `dist/` using a build workflow; see [deployment instructions](../deploy/README.md). No remote hosting configuration is changed by this local migration.

## Rollback

Before committing, use the JSON manifest to reverse moves in reverse order and restore path edits from Git, preserving local imports. Original tracked versions remain in commit `b79fd78`; bundle snapshots also remain locally in `tmp/pre-restructure/`. Do not use a hard reset or clean command that would discard untracked research inputs.
