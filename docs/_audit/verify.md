# BibCycle shared UI verification — 2026-07-28

## Automated browser checks

| Check | Result | Notes |
|---|---|---|
| Console errors | Pass | Fresh tabs for all five pages produced no errors. |
| Horizontal overflow | Pass | No overflow found at 320px in fresh tabs; the full 320, 375, 768, 960, and 1440px sweep also found none after cache refresh. |
| Image dimensions | Reverted | Explicit `width`/`height` attributes conflict with the pages’ existing CSS width rules and visibly stretch artwork. They were removed in the follow-up visual fix; safe loading priorities remain. |
| Hero image loading | Pass | The download bird is `loading="eager" fetchpriority="high"`; non-hero source images are lazy-loaded. |
| Mobile menu | Pass | At 375px it opens the full-screen link panel, changes `aria-expanded` to `true`, locks scroll, moves focus to the first link, and Escape restores focus to the toggle and unlocks scroll. |
| Resize reset | Pass (code) | `matchMedia` and `resize` handlers force-close the panel and unlock body scrolling at 960px+. The in-app responsive viewport does not apply a live width change to an existing tab, so this assertion was inspected in code rather than exercised by the harness. |
| Language persistence | Pass | Choosing English on `index.html`, then reloading `download.html`, retained `lang="en"`, English serif/sans, translated heading, and all three factual statements. |
| Privacy opt-out | Pass | Privacy has the common nav and responsive menu but no language controls or i18n script; its bilingual legal content remains stacked. |
| Accessibility controls | Pass | Language controls are buttons with `aria-pressed`; menu is a button with `aria-controls` and `aria-expanded`; focus-visible styling and reduced-motion handling are shared. |

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
