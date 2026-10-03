# Portfolio

Static single-page site for **Burhani H. Katimba**, published via GitHub Pages.

## Files

```
index.html          the entire site
assets/shots/       screenshots, WebP, ~40-60 KB each
```

No build step, no dependencies to install. Tailwind and Lucide load from a CDN.

## Editing

Everything lives in `index.html` — content, colours and layout. The Tailwind
config at the top of the file defines the palette (`ink` and `brand`) and fonts.

To change the accent colour, edit `theme.extend.colors.brand` in that config
block. Dark mode is class-based and toggled from the nav button; it defaults to
the visitor's OS preference and remembers an explicit choice in `localStorage`.

## Screenshots

`assets/shots/` holds neutral filenames so they can be swapped without touching
the markup:

| File | Currently shown as |
|------|--------------------|
| `s01.webp` | SomaCloud — instructor analytics |
| `s02.webp` | ShamsQuiz — live podium |
| `s03.webp` | F.R.I.D.A.Y — gateway permission prompt |
| `s04.webp` – `s08.webp` | Spare, not yet placed |

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

## Deploying

Pushes to `main` on the `gh-pages` branch are served automatically. If the site
is served from the repository root instead, publish with:

```bash
# keep dist-style layout: copy index.html to the gh-pages branch
git subtree push --prefix . origin gh-pages
```

## Before sharing the link

- [ ] Replace the three screenshots with ones that show the right projects
- [ ] Add a CV PDF if you want one linked
- [ ] Confirm the GitHub profile README is set up, since the contact section
      links to the profile
- [ ] Check the page on a phone — the nav collapses to just the logo and theme
      toggle
