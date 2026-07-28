# BibCycle shared UI baseline — 2026-07-28

## Capture

Full-page baseline captures were taken from the local static site at 375px and
1440px. They are stored in `before/{index,wingbearer,partner,download,privacy}-{375,1440}.png`.

## Page inventory

| Page | Navbar DOM | i18n | Breakpoints | Footer | Active state | Images |
|---|---|---|---|---|---|---|
| `index.html` | `nav#main-nav > div > a.nav-logo + div.nav-right > ul.nav-links + div.lang-switcher` | Complete inline `T` + `applyLang()` | 700, 960px | `<footer>` plus `.footer-copyright` | none | 19; 3 lazy; 0 explicit dimensions |
| `wingbearer.html` | `nav#main-nav > a.nav-logo + div.nav-right > ul.nav-links + div.lang-switcher` | Complete inline `T` + `applyLang()` | 640, 960px | `<footer>` plus `.footer-copyright` | none | 14; 0 lazy; 0 explicit dimensions |
| `partner.html` | `nav.top-nav > div.top-nav-left > a* + div.top-nav-right > span[onclick]*` | Complete inline `T` + `applyLang()`; controls are spans | 900px | absent | partner link gets `.partner-link`; no page indication | 3; 0 lazy; 0 explicit dimensions (includes lightbox image) |
| `download.html` | `nav.top-nav > div.top-nav-left > a* + div.top-nav-right > span*` | Absent except one `data-i18n="nav-partner"`; controls are inert spans | 600, 900px | absent | download link has `.active` | 1; 0 lazy; 0 explicit dimensions |
| `privacy.html` | absent | Opted out: deliberate bilingual stacked document | none | `<footer>` | n/a | 0 |

### Existing custom properties

- `index.html`: `--navy`, `--amber`, `--amber-dark`, `--bg`, `--bg-warm`, `--text`, `--text-muted`, `--serif`, `--sans`, `--nav-logo-size`, `--nav-link-size`, `--nav-padding-x`, `--nav-padding-y`.
- `wingbearer.html`: `--navy`, `--amber`, `--amber-dark`, `--bg`, `--bg-warm`, `--text`, `--text-muted`, `--serif`, `--sans`.
- `partner.html` / `download.html`: `--navy`, `--amber`, `--amber-dark`, `--bg`, `--serif`, `--sans`.
- `privacy.html`: no custom properties; it hardcodes `#1A3A5C` and hardcodes both font families.

### Scripts and dependency order

- `index.html`: JSON-LD, an immediate `.js` class setter, deferred `scroll-effects.js`, tweak defaults, then an inline page script. The page script owns the translation dictionary, `applyLang()`, language events, nav scroll state, and lightbox. `applyLang()` calls `window.BibCycleScroll?.refreshMetrics()`.
- `wingbearer.html`: an early inline script resolves `localStorage['bibcycle-lang']`, then a final inline script owns its dictionary, i18n, lightbox, and scroll nav state.
- `partner.html`: one final inline script owns its dictionary, i18n (including `setLang`), and lightbox.
- `download.html` and `privacy.html`: no scripts.

### i18n contracts present before migration

`index.html`, `wingbearer.html`, and `partner.html` each use `data-i18n` and
`data-i18n-html="true"`. Their engine leaves missing keys untouched. The index
implementation highlights `翼使` by writing `innerHTML`; it excludes `TITLE`,
`how-resource-btn`, and `.faq-q` values. These behaviours are retained in the
shared engine.

### Image baseline

All existing image loading attributes and dimensions are listed by the counts
above. Every image is missing HTML `width`/`height`; some visual dimensions are
only present in CSS or inline styles. Decorative assets generally have
`alt="" aria-hidden="true"`; the index bird has contradictory `alt="小白鳥"`
and `aria-hidden="true"`.

