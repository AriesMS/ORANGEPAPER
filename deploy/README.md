# Deploy the built site

Build with `npm ci && npm test`, then publish the contents of `dist/` as the web root. Keep the HTML files at that root so existing project-page URLs continue to work. Do not upload `assets/research/`, logs, or the course kit.

## GitHub Pages

This migration moves the live pages out of the repository root, so the former “Deploy from a branch / main / root” configuration is no longer appropriate.

The workflow at `.github/workflows/pages.yml` automatically builds and deploys every push to `main`. One-time setup:

1. In repository Settings → Pages, choose GitHub Actions as the source.
2. Commit and push your changes to `main`.
3. The workflow installs locked dependencies, builds and tests the site, and uploads only `dist/`.

Future pushes to `main` automatically update the site after the build, tests, and deployment succeed. You can also run “Publish research portfolio” manually from Actions when needed. Keep Pages → Source set to GitHub Actions.
