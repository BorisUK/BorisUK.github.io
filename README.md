# Boris Hurinek Apps website

Static HTML/CSS/JavaScript website intended for GitHub Pages.

## First-time setup

1. Open this folder in VS Code.
2. Keep `manrope-latin-vf.woff2` in `assets/fonts/`. If you are extracting this ZIP over the previous version, your existing font file will remain there.
3. Install Microsoft's **Live Preview** extension when VS Code offers the workspace recommendation.

## Recommended development workflow

For normal HTML/CSS work:

1. Open `index.html`.
2. Right-click in the editor and choose **Show Preview**.
3. Live Preview hosts the site through a local HTTP server and updates the preview as you edit.

You do not need IIS.

## JavaScript debugging

Live Preview is also the cleanest HTTP-based debugging workflow. Use its external/debug browser option and set breakpoints in `assets/js/site.js`.

The supplied `.vscode/launch.json` still contains direct Edge/Chrome launch options. Those use `file://` deliberately and do not start a server. The third launch configuration expects a local server to already be running on port 3000.

## Project structure

- `index.html` - homepage content and semantic structure
- `assets/css/site.css` - site styling and responsive layout
- `assets/js/site.js` - carousel and reveal behaviour
- `assets/images/` - app artwork, screenshots and site mark
- `assets/fonts/` - self-hosted Manrope variable font
- `favicon.ico` - multi-size 16/32/48 px browser favicon
- `favicon-32x32.png` - PNG favicon
- `favicon-48x48.png` - PNG favicon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `.vscode/` - VS Code launch and extension recommendations
- `.nojekyll` - tells GitHub Pages to serve the static files directly
- `404.html` - GitHub Pages 404 page

## GitHub Pages

The intended user-site repository is `BorisUK.github.io`.

Once the site is ready, create that repository, copy these files to its root, commit and push the `main` branch. GitHub Pages can then publish at `https://borisuk.github.io/`.

## Privacy policies

For now, privacy links still point to the existing Google Sites pages. They can be moved into this repository later.

## v4 screenshot sizing
The portrait screenshot carousel is now capped by height rather than width on desktop. This keeps the app cards compact and automatically reduces screenshot width while preserving the original portrait aspect ratio.


## v5 cleanup

- Removed screenshot zoom/lightbox code.
- Replaced the corrected Drop Ten Adventure screenshot.
- Removed unused/heavy National Flags decorative assets (`compass-rose.png`, `star-medal.png`).

## Privacy policy pages

The privacy policies are hosted directly in this static site:

- `drop-ten-privacy.html`
- `national-flags-privacy.html`

The Privacy Policy links on the homepage point to these local pages, so the Google Sites privacy pages are no longer required after this version is published.


## v7 changes

- Privacy policy cards now use the same site shell width as the app cards.
- National Flags privacy request form corrected to https://forms.cloud.microsoft/r/4KenKK9VMp.
