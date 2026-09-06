# Deploy the built site

Build with `npm ci && npm test`, then publish the contents of `dist/` as the web root. Keep the HTML files at that root so existing project-page URLs continue to work. Do not upload `assets/research/`, logs, or the course kit.

## GitHub Pages

This migration moves the live pages out of the repository root, so the former “Deploy from a branch / main / root” configuration is no longer appropriate.

A manual workflow is provided at `.github/workflows/pages.yml`. After reviewing and committing the migration:

1. In repository Settings → Pages, choose GitHub Actions as the source.
2. Run the “Publish research portfolio” workflow from the Actions tab.
3. The workflow installs locked dependencies, builds and tests the site, and uploads only `dist/`.

The workflow is manual; it does not publish automatically on push. No deployment or remote settings change was performed during restructuring.
