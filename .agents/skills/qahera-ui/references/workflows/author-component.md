# Workflow: Author Component

Ordered steps to scaffold, implement, and register a new canonical component in Qahera UI Kit according to the strict Definition of Done (DoD).

## Step 1: Semantic Contract Definition
1. Create `contracts/components/<ComponentName>.yaml`.
2. Define:
   - `name`: PascalCase component identifier.
   - `category`: Base, Form, Feedback, Navigation, Overlay, Layout, Data.
   - `props`: Strict vocabulary (`variant`, `size`, `tone`, `state`, `disabled`).
   - `slots`: Default and named slots (`leading_icon`, `trailing_icon`, `content`).
   - `accessibility`: ARIA roles, states, and keyboard navigation keys.
   - `events`: Standard emitted events (`click`, `change`, `toggle`).

## Step 2: Component Recipe & AI Metadata
1. Create `recipes/<component-name>.yaml`.
2. Populate the AI decision block:
   - `purpose`: Precise 1-sentence technical definition.
   - `use_when`: Concrete scenarios where this component is required.
   - `avoid_when`: Anti-patterns and what other component to use instead.
3. Map component slots and props to `--qhr-*` design tokens.

## Step 3: Atomic Stylesheet
1. Create `renderers/html/native/components/<component-name>.css`.
2. Use logical CSS properties exclusively:
   - `padding-inline`, `padding-block`, `margin-inline`, `inset-inline-start`.
   - Focus ring via `--qhr-ring-offset` and `outline: 2px solid var(--qhr-color-focus-ring)`.
3. Support all 8 states:
   - `default`, `:hover`, `:focus-visible`, `:active`, `:disabled`, `[data-loading="true"]`, `[data-state="empty"]`, `[aria-invalid="true"]`.
4. Register the stylesheet import in `renderers/html/native/components.css`.

## Step 4: Multi-Target Renderers
Implement the component across all 6 targets with identical prop contracts:
1. `renderers/html/native/components/<component-name>.html`
2. `renderers/html/tailwind/components/<component-name>.html`
3. `renderers/php/components/<component-name>.php`
4. `renderers/htmx/components/<component-name>.html`
5. `renderers/react/components/<ComponentName>.tsx` (Preserve 0kb RSC boundary; use `'use client'` only if stateful)
6. `renderers/js/components/<component-name>.js` (Custom element `<qhr-...>`)

## Step 5: Interactive Behavior (If Applicable)
If the component requires client-side state (e.g. dropdown, modal, accordion):
1. Create `behavior/<component-name>.js`.
2. Register an Alpine.js component: `Alpine.data('qhr<ComponentName>', () => ({ ... }))`.
3. Comply strictly with `QAHERA-ALPINE-001`:
   - Never embed multi-statement logic in inline HTML attributes.
   - Ensure globally unique template keys.
   - Do not nest `<template x-for>` for simple arrays.

## Step 6: Showcase & Standalone Preview
1. Create `examples/previews/<component-name>.html`.
2. Demonstrate every variant, size, tone, and interactive state in both LTR and RTL.

## Validation Checklist

- [ ] Contract YAML validated against `schemas/contract.schema.yaml`.
- [ ] Recipe YAML validated against `schemas/recipe.schema.yaml`.
- [ ] AI metadata (`purpose`, `use_when`, `avoid_when`) is complete.
- [ ] Stylesheet uses `--qhr-*` tokens and 100% logical CSS properties.
- [ ] All 6 target renderers implemented without prop or attribute drift.
- [ ] Standalone preview created in `examples/previews/<name>.html`.
- [ ] Zero emoji used; all icons from `icons/registry.yaml`.
- [ ] Passes `node bin/qahera.js test` with 0 errors and 0 warnings.
