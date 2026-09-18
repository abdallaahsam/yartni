# Workflow: Compose Screen

Ordered steps to compose a complete, production-ready screen using exclusively canonical Qahera UI Kit components, patterns, and templates.

## Step 1: Discover Requirements & Target Stack
1. Identify the target framework renderer requested:
   - `HTML Native` (with Alpine.js for interactivity)
   - `HTML Tailwind` (with `@alwkala/qahera-tailwind-preset`)
   - `React` (React 19 / Server Components with terminal interactive client leaves)
   - `PHP` (Templates using `$qhr->render('Component', [...])`)
   - `HTMX` (Hypermedia attributes `hx-get`, `hx-swap` on canonical controls)
   - `JS Web Components` (`<qhr-component ...>`)
2. Confirm the active theme (`default`, `downtown`, `heliopolis`, `nubia`, `new-cairo`, `luxury-gold`, etc.) via `[data-theme="..."]`.

## Step 2: Check Existing Templates & Patterns
1. Consult `templates-catalog.md`:
   - If the request matches one of the 20 canonical tracks (e.g. `flagship-portal`, `academic-executive`, `admin`, `dashboard`, `ecommerce`, `fintech-wealth`, `helpdesk-kanban`, `auth`), inspect `templates/<track>/` for authoritative layout structure and component hierarchy.
2. Consult `patterns-catalog.md`:
   - Select relevant pre-composed UX units (e.g. `hero-skyline-panorama`, `data-table-toolbar`, `search-toolbar`, `metric-comparison-grid`, `kanban-board`, `chat-stream`).
3. Zero-Build CDN Fast Path:
   - For rapid prototyping or standalone HTML landing pages without Node.js tooling, utilize `npx qahera-ui cdn [theme]` to scaffold an instant zero-build template with edge CDN assets.
4. For individual components:
   - Verify props and slots against `recipes/<component-name>.yaml`.
   - Leverage IDE autocomplete via `qahera.css-data.json` and `qahera.html-data.json`.
   - Optionally instruct the user or run `node bin/qahera.js add <components...>` to copy source files into consuming projects.

## Step 3: 7-Axis Pre-Emit Critique
Before generating the markup or component tree, evaluate against the 7-Axis criteria:
`/* Pre-emit critique: P5 H5 E5 S5 R5 V5 D5 */`
- **P (Palette & Tokens)**: Are all colors `--qhr-*` tokens? Zero raw hex codes.
- **H (Heading & Typography)**: Alexandria for headings, Cairo for UI labels.
- **E (Eight-State Completeness)**: Are interactive controls supporting hover, active, focus, disabled, loading?
- **S (Structure & Layout)**: CSS logical properties only (`margin-inline-start`, `padding-inline-end`).
- **R (RTL & Directionality)**: Tested for natural RTL flow. Directional icons checked.
- **V (Visual Authenticity)**: Zero emojis. Icons from `icons/registry.yaml`.
- **D (Decision Alignment)**: Adheres strictly to the requested screen intent without ad-hoc CSS classes.

## Step 4: Emit Production Code
1. Structure the layout with clean semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`).
2. Attach component classes using the canonical prefix: `.qhr-<component>` (e.g. `.qhr-btn`, `.qhr-input`, `.qhr-card`, `.qhr-badge`).
3. For Alpine.js interactive patterns:
   - Encapsulate state inside `Alpine.data('<name>', () => ({ ... }))`.
   - Provide globally unique template keys in `<template x-for="...">`.
   - Strictly avoid interactive children (`<button>`, `<a>`, `<input>`) nested inside `<a>` tags.

## Validation Checklist

- [ ] Evaluated against existing templates in `templates/` and patterns in `patterns/`.
- [ ] All components map to an existing recipe in `recipes/*.yaml` or pattern in `patterns/*.yaml`.
- [ ] No hardcoded colors, pixel widths, or arbitrary CSS classes outside `--qhr-*` tokens.
- [ ] Typography adheres to Alexandria / Cairo font families.
- [ ] All icons reference `icons/registry.yaml` semantic SVG paths (24x24 viewBox). Zero emoji.
- [ ] Layout is 100% bidirectional and uses logical CSS properties.
- [ ] Interactive elements satisfy all states (default, hover, focus, disabled).
- [ ] Code includes the 7-Axis Pre-Emit Critique stamp header.
