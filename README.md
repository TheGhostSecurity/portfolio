# Portfolio

Static single-page site for **Burhani H. Katimba**, published via GitHub Pages.

## Files

```
index.html          markup, content and all the JavaScript
src.css             Tailwind entry point + the hand-written component styles
tailwind.config.js  palette (`ink`, `brand`, `term`), fonts, keyframes
assets/css/         generated — do not edit by hand
assets/fonts/       Inter + JetBrains Mono (self-hosted, latin subset)
assets/vendor/      Lucide icon bundle
assets/labs.json    59 SomaCloud labs, drives the searchable lab explorer
assets/shots/       screenshots, WebP, ~40-60 KB each
.nojekyll           serve the folder as-is, no Jekyll processing
```

Everything is self-hosted, so the page makes **zero external requests** and still
renders correctly offline or behind a restrictive network.

## Building the CSS

`assets/css/tailwind.css` is generated from `src.css` + `tailwind.config.js`.
Install the dev dependency and rebuild after changing classes or the palette:

```bash
npm install
npm run build:css     # one-off production build
npm run watch:css     # rebuild while editing
```

Anything already committed works without running this — the compiled CSS is
checked in, so a plain `git push` is enough to publish.

## Editing

Content lives in `index.html`. The palette is defined once in
`theme.extend.colors` in `tailwind.config.js` — change `brand` there and
rebuild the CSS. Dark mode is class-based and toggled from the nav button; it
defaults to the visitor's OS preference and remembers an explicit choice in
`localStorage`.

Scroll-reveal sections start at `opacity: 0` and are revealed by an
`IntersectionObserver`. An inline head script sets `html.js`, and a
`html:not(.js)` rule plus a 2.5s failsafe keep content visible if scripting is
unavailable — so a blocked script never leaves a blank page.

### Interactive pieces

All of it is vanilla JS in one IIFE at the bottom of `index.html`:

| Feature | Where in the file |
|---------|-------------------|
| Hero canvas particle grid with mouse repulsion | `live terminal` block above it |
| Typing terminal that streams scheduler / mTLS output | `#term` script block |
| Skill bars that grow on scroll | `SKILLS` array + `.bar` CSS rule |
| 3D tilt and magnetic buttons | `[data-tilt]` / `.magnet` handlers |
| Expandable project panels | `[data-project]` handler |
| Lab explorer: search, phase chips, live count | `#labFilters` / `#labList` |

The lab explorer reads `assets/labs.json` at runtime. If that fetch fails (for
example opening `index.html` straight off the filesystem) the whole section is
removed rather than left as an empty grid.

`assets/labs.json` is exported from the platform database, not maintained by
hand. Each record is `{"p": phase, "t": title, "s": slug, "d": description}`.

### Icons

Lucide no longer ships brand icons, so GitHub and LinkedIn are inline SVG
symbols (`#i-github`, `#i-linkedin`) defined in a hidden sprite at the top of
`<body>`. Everything else uses `data-lucide` and is rendered by
`lucide.createIcons()`. If the CDN is unreachable the page still works — icons
are the only thing that degrades.

## Screenshots

`assets/shots/` holds neutral filenames so they can be swapped without touching
the markup:

| File | Currently shown as |
|------|--------------------|
| `s01.webp` | SomaCloud |
| `s02.webp` | ShamsQuiz |
| `s03.webp` | F.R.I.D.A.Y |
| `s04.webp` – `s08.webp` | Spare, not yet placed |

The captions are deliberately generic — **check that each image actually shows
the project it is placed under** and tighten the caption and `alt` text once you
have confirmed them.

To replace one, keep the filename and overwrite the file. Keep the aspect ratio
if you care about the reserved space, or update the `width`/`height` attributes
in the `<img>` tag so the layout does not shift. Full-size 16:9 source images are
cropped to 1440px wide and encoded as WebP at quality 86.

### Regenerating the images

Resize to 1440px wide and convert to WebP:

```bash
python -c "
from PIL import Image
im = Image.open('new-screenshot.png').convert('RGB')
if im.width > 1440:
    im = im.resize((1440, round(im.height*1440/im.width)), Image.LANCZOS)
im.save('assets/shots/s01.webp', 'WEBP', quality=86, method=6)
"
```

## Accessibility

Honours `prefers-reduced-motion`: the canvas grid is skipped, reveal animations
resolve immediately, and the terminal prints a static transcript instead of
typing. Content is reachable without JavaScript except for the lab explorer.

## Deploying

Pages serves the repository root on `main`. Push to `main` and it goes live.

```bash
git add -A
git commit -m "..."
git push origin main
```

## Before sharing the link

- [ ] Confirm `s01`–`s03` show the projects they sit under, then write real
      captions
- [ ] Check whether the SomaCloud lab count should read 8 phases with content
      rather than 9 defined — the site currently shows both
- [ ] Add a CV PDF if you want one linked
- [ ] Confirm the GitHub profile README is set up, since the contact section
      links to the profile
- [ ] Re-check the page on a phone — the nav collapses to the logo, theme
      toggle and a menu button