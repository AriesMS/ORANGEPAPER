# Adding or implementing project pages

1. Create `public/new-project.html`. You can copy `public/internal-wall-inference.html`; update its metadata, heading, description, and content. Its `data-project="03"` selects construct 03, so retain it only when implementing that project. A different construct needs its own matching record; a content-only page should remove the construct canvas, inspector, data attribute, and journey script together.
2. Put published images in `public/images/new-project/` and reference them as `images/new-project/example.png` from the HTML. Raw models and working photos stay in `assets/research/` until needed by the website.
3. Create optional CSS in `src/styles/new-project.css` and link to `styles/new-project.css` in the HTML. The build copies styles automatically. Load `styles/typography.css` last to preserve the shared fonts.
4. For custom interaction, create `src/pages/new-project.js`, add `'new-project': 'src/pages/new-project.js'` to `entryPoints` in `config/build.mjs`, and reference `scripts/new-project.js` with a deferred script tag. Shared modules belong in `src/components/`.
5. In `src/pages/journey.js`, set the relevant record's `link` to `new-project.html`. Adding a completely new construct also requires its record and arrangement entry, plus updating the inspector's total count, currently hardcoded to 08. Existing empty carrier arms are visual placeholders, not project records.
6. Update `docs/DESIGN.md` and the expected page count and output list in `tests/site.test.mjs`. Those tests currently expect four HTML pages. Update build-specific tests as needed for any new bundle.
7. Run `npm test`, then `npm run preview`. Open `http://127.0.0.1:4173/new-project.html`. If the preview server is already running, rebuild and refresh instead of starting a second server.
8. Commit and push to `main`. The publishing workflow builds, tests, and deploys `dist/` automatically when GitHub Pages is configured to use GitHub Actions.

Edit source files, never generated `dist/` files. `public/` alone does not contain the compiled scripts and styles, so preview the built site through the local server. The old root HTML paths no longer exist.
