# Operational Memory: Anti-Slop Matrix for Qahera UI Kit

<!-- last-verified: 2026-09-12 -->

Binary negative constraints for generating, composing, and auditing UI code in Qahera UI Kit. All rules must be satisfied before emitting code.

---

## I. Color & Surface
- ❌ **No raw hex / rgb values**: Never write `#fff`, `#0b6bcb`, or `rgb(...)`. Use `var(--qhr-color-...)` or semantic tokens.
- ❌ **No unverified dark mode overrides**: Dark mode must leverage `[data-theme="..."]` or system tokens; never use inverted ad-hoc backgrounds.
- ❌ **No low-contrast text**: Text on surfaces must satisfy WCAG AA contrast ratio $\ge 4.5:1$ (normal text) and $\ge 3:1$ (large headings).

## II. Typography & Font Discipline
- ❌ **No browser default fonts**: Font declarations must strictly use `--qhr-font-heading` (Alexandria) and `--qhr-font-body` (Cairo).
- ❌ **No Amiri font in UI**: Amiri is strictly prohibited for UI components and form controls.
- ❌ **No unjustified long lines**: Paragraph body widths must not exceed `65ch` for readability.
- ❌ **No arbitrary line-heights**: Use `--qhr-line-height-*` tokens matching the font scale.

## III. Layout & Bidirectionality (RTL/LTR)
- ❌ **No physical margin/padding**: Never use `margin-left`, `margin-right`, `padding-left`, or `padding-right`. Use `margin-inline-start`, `margin-inline-end`, `padding-inline-start`, `padding-inline-end`.
- ❌ **No physical positioning**: Never use `left: 10px` or `right: 0`. Use `inset-inline-start` and `inset-inline-end`.
- ❌ **No separate RTL components**: Never author `ButtonRTL` or `SidebarRTL`. RTL is handled via CSS logical properties on the core component.
- ❌ **No unmirrored directional icons**: Directional icons (arrows, chevrons) must rotate 180° in RTL via `[dir="rtl"] .qhr-icon-directional { transform: scaleX(-1); }`.

## IV. Iconography & Visual Authenticity (`QAHERA-VISUAL-001`)
- ❌ **Zero emoji as UI icons**: Never use emojis (🗑️, ✕, 🚀, ❤️, ☀️, 🌙, 🏛️) as buttons, badges, indicators, or decorations.
- ❌ **Zero unregistered SVGs**: All iconography must reference `icons/registry.yaml` or follow the 24x24 viewBox stroke-width 2 standard.

## V. Interaction & 8-State Completeness
- ❌ **No missing states**: Any interactive component must handle:
  1. `default`: Normal rest state.
  2. `hover`: Visual elevation, subtle background shift (`:hover`).
  3. `focus`: Distinct, accessible focus ring (`:focus-visible`). Never set `outline: none` without replacement.
  4. `active`: Pressed state feedback (`:active`).
  5. `disabled`: Reduced opacity, `cursor: not-allowed`, `pointer-events: none` (`:disabled`, `[aria-disabled="true"]`).
  6. `loading`: Spinner replacement, preserved dimensions (`[data-loading="true"]`).
  7. `empty`: Meaningful zero-data state (`[data-state="empty"]`).
  8. `error`: Accessible error border, helper text, and `aria-invalid="true"`.

## VI. Alpine.js & Hydration Protocol (`QAHERA-ALPINE-001`)
- ❌ **No inline attribute logic bloat**: Never place multi-line functions or large objects in `x-data="{ ... }"`. Always declare in `Alpine.data()`.
- ❌ **No non-unique keys**: `<template x-for="...">` must have `:key="item.uniqueId"`. Never use colliding indices across entity types.
- ❌ **No interactive descendants inside `<a>`**: Never place `<button>`, `<select>`, `<input>`, or `<a>` inside an outer `<a>` wrapper.
- ❌ **No nested `x-for` for simple badges**: Render nested array tags via `x-html="renderBadges(item.tags)"` or single-level loops.

## VII. Dogfooding & Class Discipline (`QAHERA-COMP-001`)
- ❌ **No ad-hoc utility soup**: Never invent arbitrary CSS class names (e.g. `.my-custom-box-shadow-2`).
- ❌ **No inline style overrides**: Do not use `style="..."` on elements to patch layout defects. Adjust tokens or author recipes.

## VIII. Multi-Target Renderer Parity
- ❌ **No semantic prop drift**: A prop named `variant` with value `primary` in HTML must not become `type="blue"` in React or `$style = 'main'` in PHP.
- ❌ **No React 0kb RSC violations**: Never mark entire layouts as `'use client'`. Server Components must remain 0kb client bundle, isolating client directives to terminal interactive buttons/dropdowns.

## IX. Cultural Themes (`QAHERA-THEME-001`)
- ❌ **No arbitrary cosmetic themes**: Themes must not be named `theme-cool` or `theme-blue`. They must synthesize global design movements with Egyptian architectural/cultural contexts (e.g. `downtown`, `heliopolis`, `nubia`, `khedivial`).

## X. SVG Dimensional Discipline & Vector Scaling (`QAHERA-SVG-001`)
- ❌ **No unconstrained SVGs**: Never output inline `<svg>` elements without explicit `width`, `height`, and `viewBox` attributes.
- ❌ **No unstyled vector expansion**: Stylesheets must enforce defensive scaling (`max-width: 100%`) and explicit dimensions on icon/motif containers (e.g. `.qhr-frieze__motif svg`, `.qhr-seal__emblem svg`) with `fill: currentColor` or `fill: none; stroke: currentColor`.

## XI. Popover & Megamenu Positioning Architecture (`QAHERA-POPOVER-001`)
- ❌ **No padding on relative trigger wrappers**: Never apply `padding-bottom` (or `padding-block-end`) on a wrapper that has `position: relative` (like `.qhr-megamenu-wrapper`). It distorts `inset-block-start: calc(100% + 8px)` calculation, casting dropdown menus into empty space away from the trigger.
- ❌ **No unconstrained 900px dropdowns**: Large dropdowns/megamenus must define `max-inline-size: calc(100vw - 32px)` and provide explicit horizontal alignment modifiers (`--start`, `--center`, `--end`, `--container`).

## XII. Navigation Hierarchy & BiDi Flow (`QAHERA-NAV-001`)
- ❌ **No hardcoded numbers in navigation**: Never hardcode version tags ("v1.5.0") or counts in navbar headers or links.
- ❌ **No multiple primary CTAs in header**: Keep a single primary CTA button in the header accompanied by unified circular icon controls.
- ❌ **No inline theme strips in top navigation**: Never crowd the top navbar with multi-item theme strips; place them in a dedicated control bar in the content hub.
- ❌ **No unisolated Latin fragments in Arabic copy**: When mixing Arabic with Latin terms (like `(UX Patterns)`, `100%`, `0kb RSC`), wrap with `<bdi dir="ltr">` or `<span dir="ltr">` to prevent bidirectional sentence inversion.

## XIII. Compiler Bundle Order & Preview Asset Integrity (`QAHERA-BUILD-001`)
- ❌ **No unbundled component stylesheets**: Whenever a new component stylesheet is added to `renderers/html/native/components/`, it MUST be registered in `CANONICAL_ORDER` in `cli/build-css.js` and compiled into `dist/qahera.css`.
- ❌ **No unreachable relative preview links**: Previews must link to compiled production assets (`../dist/qahera.css`, `../dist/qahera-tokens.css`, `../dist/qahera-themes.css`), never to unreachable dev-only paths.

## XIV. Hero Skyline Panorama & Architectural Discipline (`QAHERA-HERO-001`)
- ❌ **No height mismatch / empty top void**: Hero section height MUST match the background illustration height (e.g. `height: clamp(500px, 62vh, 588px); max-height: 588px;`). Never use unconstrained viewport heights (`calc(100vh - 68px)`) that leave a giant empty margin above the cropped artwork.
- ❌ **No typography-visual collisions**: Never allow background artwork or architectural landmarks to stretch across or sit under the typography column. Always enforce strict column isolation (`max-width: min(100%, 540px)`) with dedicated horizontal breathing room.
- ❌ **No floating box hero landscapes**: Panoramic skylines and landscape illustrations must never be trapped in isolated floating cards with drop shadows. They must anchor flush to the section's bottom edge (`align-items: flex-end`, `bottom: 0`) and blend seamlessly into the surface background with feathered inward gradient masks (`mask-image: linear-gradient(...)`).
- ❌ **No unmirrored RTL hero artwork**: When switching to Arabic (`dir="rtl"`), the architectural illustration MUST be mirrored horizontally (`transform: scaleX(-1)`) so that landmark towers and focal points anchor cleanly to the outer edge, while water and open horizon fade softly inward toward the Arabic typography.

## XV. Smart Token Map & IDE Custom Data Autocomplete (`QAHERA-CSS-DATA-001`)
- ❌ **No guessing token names**: Never write invented `--qhr-*` variable names. Tokens must be cross-referenced against `qahera.css-data.json` or `tokens/tokens.css`.
- ❌ **No outdated custom data maps**: Whenever design tokens in `tokens/*.yaml` or component contracts change, `qahera build:ide-data` (or `build:css-data` and `build:html-data`) must be executed to keep `qahera.css-data.json` and `qahera.html-data.json` 100% synchronized with zero schema drift.

## XVI. Zero-Build CDN Asset Ordering & Protocol (`QAHERA-CDN-001`)
- ❌ **No reversed CDN layer imports**: When using global CDNs, imports must strictly respect cascade order:
  1. Google Fonts (`Alexandria` + `Cairo`).
  2. `dist/qahera-tokens.min.css` (primitives, spacing, cultural materials).
  3. `dist/qahera-themes.min.css` (13 Cairo neighborhood archetypes).
  4. `dist/qahera.min.css` (45 component styles).
- ❌ **No hardcoded unstable URLs**: Always pin production releases to tagged versions (`@1.5.4`) or use `@latest` with SRI or defensive fallback.


