import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const p = (...s) => path.join(root, ...s);
const read = f => fs.readFileSync(p(f), 'utf8');
const write = (f, s) => fs.writeFileSync(p(f), s);

const page = read('src/page.html');

/* ---- icons --------------------------------------------------------------
   The page uses ~40 Lucide icons. Rather than ship the 1,700-icon bundle
   (356 KB) we lift just those out of it and inline a few KB of SVG markup
   plus a small createIcons() replacement.

   Icon names reach the markup three ways: literal data-lucide attributes,
   names swapped in at runtime (the clipboard "check"), and the per-category
   `icon:` fields in the SKILLS array plus the lab explorer's phase map. Rather
   than pattern-match each of those, every quoted string in the template is
   tested against Lucide's own index and kept if it names a real icon. That
   over-collects slightly, which costs a couple of KB but cannot miss one.  */
function collectIconNames(src, icons) {
  const pascal = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
  const names = new Set();
  // Explicit placeholders, including single-character names like "x" that the
  // broader scan below cannot match.
  for (const m of src.matchAll(/data-lucide=["']([a-z0-9-]+)["']/g)) {
    if (icons[pascal(m[1])]) names.add(m[1]);
  }
  for (const m of src.matchAll(/['"]([a-z][a-z0-9-]{1,30})['"]/g)) {
    if (icons[pascal(m[1])]) names.add(m[1]);
  }
  return [...names].sort();
}

function buildIcons() {
  const ctx = vm.createContext({ console, document: {} });
  ctx.globalThis = ctx; ctx.self = ctx; ctx.window = ctx;
  vm.runInContext(read('assets/vendor/lucide.min.js'), ctx);
  const icons = ctx.lucide.icons;
  const pascal = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');

  const wanted = collectIconNames(page, icons);
  if (!wanted.length) throw new Error('no icons detected in template');

  const svg = {};
  for (const name of wanted) {
    const [, attrs, children] = icons[pascal(name)];
    // Drop the fixed width/height so the existing Tailwind size classes
    // (h-4 w-4 …) keep controlling the rendered size.
    const { width, height, ...rest } = attrs;
    const head = Object.entries(rest).map(([k, v]) => `${k}="${v}"`).join(' ');
    const body = children
      .map(([tag, a]) => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}></${tag}>`)
      .join('');
    svg[name] = `<svg xmlns="${attrs.xmlns}" viewBox="${attrs.viewBox}" ${head}>${body}</svg>`;
  }

  const payload = JSON.stringify(svg);
  console.log(`  icons: ${wanted.length} inlined (${(payload.length / 1024).toFixed(1)} KB)`);
  // Attributes are carried across so hooks like data-copy-icon survive the
  // swap to <svg>; dropping them broke the clipboard button's icon toggle.
  return `window.__ICONS__=${payload};
window.lucide={createIcons(){document.querySelectorAll('[data-lucide]').forEach(function(el){var s=window.__ICONS__[el.getAttribute('data-lucide')];if(!s)return;var t=document.createElement('template');t.innerHTML=s;var n=t.content.firstElementChild;[...el.attributes].forEach(function(a){if(a.name!=='data-lucide')n.setAttribute(a.name,a.value);});n.setAttribute('aria-hidden','true');el.replaceWith(n);});}};`;
}

/* ---- css ----------------------------------------------------------------
   Compiled Tailwind plus @font-face rules with the woff2 payloads inlined
   as data URIs, so the page makes no font requests either.              */
function buildCss() {
  const b64 = f => fs.readFileSync(p('assets/fonts', f)).toString('base64');
  return `<style>
${read('assets/css/tailwind.css').trim()}

@font-face{font-family:Inter;font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${b64('Inter.woff2')}) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:100 800;font-display:swap;src:url(data:font/woff2;base64,${b64('JetBrainsMono.woff2')}) format('woff2')}
</style>`;
}

/* ---- assemble ----------------------------------------------------------- */
const shot = n => `data:image/webp;base64,${fs.readFileSync(p(`assets/shots/${n}.webp`)).toString('base64')}`;
const labs = JSON.stringify(JSON.parse(read('assets/labs.json')));

let html = page
  .replace('<!--INLINE_CSS-->', () => buildCss())
  .replace('/*INLINE_ICONS*/', () => buildIcons())
  .replace('__SHOT_S01__', () => shot('s01'))
  .replace('__SHOT_S02__', () => shot('s02'))
  .replace('__SHOT_S03__', () => shot('s03'));

// The lab explorer reads window.__LABS__, so define it just ahead of the
// main script. Inlining the data removes the runtime fetch entirely.
const anchor = '<script>\n(() => {';
if (!html.includes(anchor)) throw new Error('main script anchor not found');
html = html.replace(anchor, () => `<script>window.__LABS__=${labs}</script>\n${anchor}`);

// Guard against typos in the template, ignoring the runtime globals
// (__ICONS__ / __LABS__) that legitimately survive into the output.
const left = [...html.matchAll(/__SHOT_[A-Z0-9]+__|<!--INLINE_[A-Z]+-->|\/\*INLINE_[A-Z]+\*\//g)];
if (left.length) throw new Error(`unreplaced placeholders: ${[...new Set(left.map(m => m[0]))].join(', ')}`);

write('index.html', html);
console.log(`index.html — ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, self-contained`);