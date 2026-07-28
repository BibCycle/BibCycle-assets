# BibCycle shared UI verification — 2026-07-28

## Automated browser checks

| Check | Result | Notes |
|---|---|---|
| Console errors | Pass | Fresh tabs for all five pages produced no errors. |
| Horizontal overflow | Pass | No overflow found at 320px in fresh tabs; the full 320, 375, 768, 960, and 1440px sweep also found none after cache refresh. |
| Image dimensions | Pass | Every asset-backed image carries the dimensions read from its source file. The three runtime lightbox placeholders have no source on initial load and intentionally carry no dimension attributes. Generic image sizing uses `height: auto` without raising selector specificity. |
| Hero image loading | Pass | The download bird is `loading="eager" fetchpriority="high"`; non-hero source images are lazy-loaded. |
| Mobile menu | Pass | At 375px it opens the full-screen link panel, changes `aria-expanded` to `true`, locks scroll, moves focus to the first link, and Escape restores focus to the toggle and unlocks scroll. |
| Resize reset | Pass (code) | `matchMedia` and `resize` handlers force-close the panel and unlock body scrolling at 960px+. The in-app responsive viewport does not apply a live width change to an existing tab, so this assertion was inspected in code rather than exercised by the harness. |
| Language persistence | Pass | Choosing English on `index.html`, then reloading `download.html`, retained `lang="en"`, English serif/sans, translated heading, and all three factual statements. |
| Privacy opt-out | Pass | Privacy has the common nav and responsive menu but no language controls or i18n script; its bilingual legal content remains stacked. |
| Accessibility controls | Pass | Language controls are buttons with `aria-pressed`; menu is a button with `aria-controls` and `aria-expanded`; focus-visible styling and reduced-motion handling are shared. |

## v0.2 remediation verification

| Check | Result | Notes |
|---|---|---|
| Shared stylesheet order | Pass | Core and nav precede every page’s inline stylesheet; index loads scroll effects after them. |
| Page-local tokens / legacy nav CSS | Pass | No inline `:root`, bare `nav` / `footer`, or legacy top-nav selectors remain. |
| Navbar scroll state | Pass | `scroll-effects.js` now applies `.bc-nav.is-scrolled`; a desktop scroll check observed that class on index. |
| Footer contract | Pass | All five pages have one `.bc-footer`, brand wrap, links, four labeled social links, and copyright. Index keeps its `#faq` contact target; privacy uses literal Traditional Chinese. |
| Download structure | Pass | `.dl-return` is inside `main`; the footer is outside it; the cloud-sync comment occurs once. |
| Image ratios | Pass | Desktop checks confirmed the mission art at `300×180` and the three pain illustrations at `120×64`, `120×107`, and `120×133`, matching their natural proportions. |
| Mobile overflow | Pass | All five pages were checked at the 375px responsive viewport with no horizontal overflow. |
| C-a: `.wing-term` | Core stylesheet | It lives in `bibcycle-core.css`; all page-local copies were deleted. |
| C-b: initial `refreshMetrics()` | Pass | All external scripts use `defer` in document order. On index, `scroll-effects.js` therefore initializes before the i18n engine invokes `refreshMetrics()` on initial load. |
| N1: runtime lightboxes | Pass | The three lightbox placeholders have no numeric dimensions; when opened, their CSS max-size constraints preserve the assigned asset's natural ratio. |
| N2: image selectors | Pass | The bird and phone rules use their original class selectors. The download bird intentionally remains a square `object-fit: contain` box: `304×304` desktop and `260×260` at 375px. |
| N3: image alt translations | Pass | `data-i18n-alt` is documented and applied by the i18n engine. Partner's two meaningful images switch to their English alt text; decorative imagery remains empty-alt and hidden from assistive technology. |

## Screenshots

Final full-page captures at 375px and 1440px are in
`after/{index,wingbearer,partner,download,privacy}-{375,1440}.png`.

## Extraction diff gate

Not separately measurable: the repository entered feature migration immediately
after the baseline capture, so the final captures include the intentionally new
mobile menu, standardized nav, privacy shell, and download content. The
extraction-only 0B pixel-identical checkpoint was therefore not run as an
isolated intermediate build. Baseline images are retained to support a manual
visual review of page-specific content and layout.
