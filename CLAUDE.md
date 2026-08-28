# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Afton King's art gallery website: a single self-contained `index.html` (~5.3 MB, 1,952 lines). No build step, no npm, no `package.json`, no framework installation. React is loaded and JSX is compiled entirely in the browser at page load.

- `index.html` — the entire app (markup, CSS, JSX)
- `vercel.json` — `cleanUrls: true`, `trailingSlash: false`
- `.vercelignore` — keeps `.claude/`, `archive/`, `PROJECT.md` out of the deploy (PROJECT.md would otherwise be publicly served at `/PROJECT.md`)
- `archive/` — gitignored, a retired staging copy kept for local reference only
- `PROJECT.md` — deploy/status notes; read it for current project status

## Architecture

**No bundler.** `<script type="text/babel" data-presets="react">` starting at `index.html:906` holds all application code as in-browser-compiled JSX. React 18.3.1 UMD, ReactDOM UMD, and `@babel/standalone` 7.29.0 load from unpkg with SRI `integrity` hashes (`index.html:899-901`). Mounted via `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` at `index.html:1945`.

**Critical gotcha:** because JSX compiles in the browser, a syntax error does not fail at build/save time — it produces a **blank page** with the error only in the browser console. Always check the console first when something isn't rendering.

**No router.** State-based view switching only: `const [route, setRoute] = useState({ section: 'paintings' })` (`index.html:1735`), rendered by an `&&` chain in `<main>` starting around `index.html:1796`. No URLs, no deep links — sections are `'paintings'` and `'inquiries'`.

**No backend.** The Inquiries form (`InquiriesView`, `index.html:1614`) submits by building a `mailto:aftonkking@gmail.com` link (`index.html:1635`) and setting `window.location.href` — there's no server or API.

### CSS theming — use the tokens

All CSS lives in one `<style>` block, `index.html:10-897`, in sections marked by `/* ── Name ── */` comments (Header, Main scroll area, Paintings index, Year detail, Painting block, Sidebar drawer, Lightbox, Inquiries).

Custom properties on `:root` (`index.html:13-25`): `--bg`, `--fg`, `--fg-mute`, `--fg-faint`, `--line`, `--line-strong`, `--display`, `--body`, `--tracking-display`, `--display-weight`, `--gap`. Three background themes via `body[data-bg="white"|"cream"|"dark"]` and four heading fonts via `body[data-font="serif"|"display-sans"|"signature"|"bold-modern"]`. These attributes are set on `document.body` by a `useEffect` in `App` (`index.html:1740-1743`) from a `TWEAK_DEFAULTS` object.

**Any new CSS must use these custom properties, never hard-coded colors/fonts** — hard-coding breaks the theme switcher.

### EDITMODE block — do not hand-edit

`index.html:1725-1730` defines `TWEAK_DEFAULTS`, wrapped in `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` markers. This pairs with `TweaksPanel` (`index.html:1069`), a dev-only live-edit panel that talks to a host page over `postMessage` (`__activate_edit_mode`, `__edit_mode_set_keys`, etc. — see comments starting `index.html:912`). **These markers are machine-rewritten by the host tool** — don't hand-edit the object literal's formatting/structure inside the markers, since the host parses and rewrites it in place.

### Component map (`index.html`)

| Component | Line |
|---|---|
| `TweaksPanel` | 1069 |
| `PaintingBlock` | 1398 |
| `YearCard` | 1431 |
| `Sidebar` | 1479 |
| `SidebarSection` | 1518 |
| `Lightbox` | 1541 |
| `InquiriesView` | 1614 |
| `App` | 1733 |
| `PaintingsIndex` | 1855 |
| `YearDetail` | 1900 |
| `PAINTINGS` data | 1338 |

The 5.3 MB file size is from 9 paintings inlined as base64 data URIs (each a single very long line, around `index.html:1340-1348`).

## Development

No test suite, no linter, no CI.

```bash
python3 -m http.server 8080
```
Open `http://localhost:8080`, edit `index.html`, reload. Check the browser console first if the page is blank.

## Deploy

- Live: https://afton-king-gallery.vercel.app
- Vercel project: `afton-king-gallery`; GitHub: `ck22coding/afton-king-gallery`
- Pushing to `main` auto-deploys to production via the GitHub→Vercel integration (per `PROJECT.md`, verified 2026-08-27).
- `vercel --prod` from the repo root also works as a manual fallback, but needs `vercel link` first — `.vercel/` is gitignored and not present in this checkout.
- If you bump the React/ReactDOM unpkg version, recompute the `integrity` SRI hash on the `<script>` tag or the browser blocks the script and the page goes blank.
