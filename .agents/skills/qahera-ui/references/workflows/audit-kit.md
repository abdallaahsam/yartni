# Workflow: Audit Kit

Ordered steps to audit the Qahera UI Kit repository or downstream consuming projects for compliance with the 15 Non-Negotiable Invariants.

## Step 1: Run Automated Test Suite
Execute the repository's native deterministic test harness:
```bash
node bin/qahera.js test
```
Verify that all recipes, contracts, schemas, and renderers pass with 0 errors and 0 warnings.

## Step 2: Visual & Iconography Audit (`QAHERA-VISUAL-001`)
Scan the codebase for unverified icons or prohibited emoji characters:
1. Search for emoji patterns in UI templates, headers, showcases, and previews.
2. Ensure every icon uses an SVG referencing `icons/registry.yaml` or a compliant 24x24 viewBox inline SVG.

## Step 3: Typography & Font Audit
Verify font declarations in CSS and generated code:
1. Check that display, headings, and brand identity reference `--qhr-font-heading` (Alexandria).
2. Check that body copy and UI labels reference `--qhr-font-body` (Cairo).
3. Confirm that the font **Amiri** is not used in UI components.

## Step 4: Logical CSS & RTL Layout Audit
Verify bidirectional layout compliance:
1. Search for hardcoded physical properties:
   - `margin-left` / `margin-right` -> flag as violation; must use `margin-inline-start` / `margin-inline-end`.
   - `padding-left` / `padding-right` -> flag as violation; must use `padding-inline-start` / `padding-inline-end`.
   - `left:` / `right:` -> flag as violation; must use `inset-inline-start` / `inset-inline-end`.
2. Verify directional icons (e.g. arrows, chevrons) flip correctly in RTL.

## Step 5: Alpine.js Hydration Audit (`QAHERA-ALPINE-001`)
Check interactive templates for hydration hazards:
1. Ensure no inline `x-data="{ ... }"` contains large data objects or multi-statement functions.
2. Confirm every `<template x-for="...">` has a globally unique `:key` attribute.
3. Confirm no `<button>`, `<a>`, or `<input>` is nested inside an outer `<a>` link within iterated templates.
4. Confirm zero nested `<template x-for>` for simple badge or tag lists.

## Step 7: Smart Custom Data & IDE Autocomplete Audit (`QAHERA-CSS-DATA-001`)
1. Run `node bin/qahera.js build:ide-data` and verify clean generation with 0 schema errors.
2. Confirm `qahera.css-data.json` contains all 325 design tokens with syntax and markdown cards.
3. Confirm `qahera.html-data.json` contains all 45 Web Components and 3 global attributes (`data-theme` with 13 Cairo themes, `data-mode`, `dir`).
4. Ensure `.vscode/settings.json` registers `css.customData` and `html.customData`.

## Validation Checklist

- [ ] `node bin/qahera.js test` exits with code 0.
- [ ] 0 emojis found across components, previews, and templates.
- [ ] 100% logical CSS properties (0 physical left/right margins/paddings).
- [ ] Alexandria and Cairo fonts verified; zero Amiri in UI.
- [ ] Alpine templates pass single-root and unique `:key` requirements.
- [ ] All colors and spacing derive from `--qhr-*` tokens.
- [ ] `qahera.css-data.json` and `qahera.html-data.json` verified 100% synchronized with zero schema drift.
