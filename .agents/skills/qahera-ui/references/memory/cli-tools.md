# Operational Memory: Native CLI Tools, IDE Integration & CDN Architecture

<!-- last-verified: 2026-09-17 -->

The Qahera UI Kit repository provides a native Node.js CLI entrypoint at `bin/qahera.js`, invocable locally as `qahera` or globally via `npx qahera-ui`. This document specifies all available commands, their parameters, IDE autocompletion configurations, and CDN quickstart workflows.

---

## Command Reference

### 1. `npx qahera-ui init` (or `qahera init`)
- **Purpose**: Scaffolds Qahera in an external consumer project with **Zero-Touch IDE Configuration**.
- **Operations Performed**:
  - Emits `tokens.css` with all `--qhr-*` custom properties.
  - Emits `components.css` with baseline component styles.
  - Copies `qahera.css-data.json` and `qahera.html-data.json` to the project root.
  - Automatically creates/updates `.vscode/settings.json` with:
    ```json
    {
      "css.customData": ["./qahera.css-data.json"],
      "html.customData": ["./qahera.html-data.json"],
      "editor.quickSuggestions": { "strings": true, "other": true, "comments": false }
    }
    ```
  - Automatically creates `.vscode/extensions.json` with recommended extensions.
  - Generates `qahera.json` configuration with target and path aliases.
  - Embeds `.agents/skills/qahera-ui` into the consumer project, equipping coding agents (Antigravity, Cursor, Claude Code) with the AI Decision Layer.
- **Usage**:
  ```bash
  npx qahera-ui init --target=react
  npx qahera-ui init --target=php --dest=./views/qahera
  ```

### 2. `npx qahera-ui add <items...>` (or `qahera add`)
- **Purpose**: Copies component, pattern, or template source code directly into a consuming project (`renderers/` source files), following the **shadcn-style** source ownership model.
- **Usage**:
  ```bash
  # Individual components (45 available)
  npx qahera-ui add button modal input cartouche --target=react
  npx qahera-ui add navbar dropdown --target=php --dest=./views/qahera
  
  # Canonical UX patterns (21 available)
  npx qahera-ui add pattern:dashboard-stat --target=react
  npx qahera-ui add pattern:hero-skyline-panorama --target=react
  npx qahera-ui add pattern:data-table-toolbar --target=php
  
  # Production application templates (20 available)
  npx qahera-ui add template:flagship-portal --target=react
  npx qahera-ui add template:admin --target=react
  npx qahera-ui add template:auth --target=php
  ```
- **Flags**:
  - `--target=<target>`: Target renderer (`react`, `php`, `html`, `htmx`, `js`).
  - `--dest=<path>`: Custom destination directory.
  - `--overwrite`: Overwrites existing files.
  - `--all`: Adds all 45 canonical components.

### 3. `npx qahera-ui list` (or `qahera list` / `ls`)
- **Purpose**: Prints the complete canonical registry of 45 components, 21 patterns, and 20 templates.

### 4. `npx qahera-ui build` (or `qahera build`)
- **Purpose**: Runs the full compilation pipeline:
  1. Compiles CSS bundle (`cli/build-css.js` -> `dist/qahera.css`).
  2. Compiles icons (`cli/build-icons.js` -> React, PHP, JS, SVG).
  3. Generates CSS Custom Data (`cli/generate-css-data.js` -> `dist/qahera.css-data.json`).
  4. Generates HTML Custom Data (`cli/generate-html-data.js` -> `dist/qahera.html-data.json`).
  5. Runs 8-stage compiler pipeline emitting canonical registry artifacts.

### 5. `npx qahera-ui build:css`
- **Purpose**: Compiles all atomic component stylesheets from `renderers/html/native/components/*.css` into `dist/qahera.css` and updates the `@import` manifest `components.css`.

### 6. `npx qahera-ui build:icons`
- **Purpose**: Compiles all 46 canonical semantic SVG icons into multi-target renderers (React TSX, PHP Plates, JS Web Component, SVG sprite).

### 7. `npx qahera-ui build:css-data`
- **Purpose**: Generates `qahera.css-data.json` covering all 325 design tokens for instant autocomplete and rich hover documentation in VS Code, Cursor, and Antigravity.

### 8. `npx qahera-ui build:html-data`
- **Purpose**: Generates `qahera.html-data.json` covering all 45 Web Components (`<qhr-*>`) and 3 global attributes (`data-theme`, `data-mode`, `dir`) with 13 Cairo themes.

### 9. `npx qahera-ui build:ide-data`
- **Purpose**: Simultaneously generates both CSS and HTML Custom Data maps.

### 10. `npx qahera-ui cdn [theme]` (or `qahera cdn [theme]`)
- **Purpose**: Emits a complete, production-ready HTML5 zero-build boilerplate connected directly to global CDNs (jsDelivr / unpkg) with the requested Cairo theme (default: `zamalek`).
- **Usage**:
  ```bash
  # Output boilerplate for Heliopolis theme directly to index.html
  npx qahera-ui cdn heliopolis > index.html
  ```

### 11. `npx qahera-ui validate` (or `qahera validate`)
- **Purpose**: Fast, read-only validation. Executes schema and invariant checks without mutating files on disk.

### 12. `npx qahera-ui test` (or `qahera test` / `audit`)
- **Purpose**: The supreme CI quality gate executing 4 automated test stages:
  - Stage 1: Compiler Schema & Invariant Validation (45 contracts, 45 recipes, 21 patterns, 46 icons).
  - Stage 2: WCAG 2.1 AA Accessibility & Color Contrast (4.5:1 / 3:1).
  - Stage 3: Performance Budgets & RSC 0kb Client Footprint verification.
  - Stage 4: Strict RTL/LTR Parity & 100% Logical CSS enforcement.

---

## Zero-Build CDN Quickstart Reference

When composing standalone prototypes or zero-build HTML pages:

```html
<!-- 1. Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- 2. Tokens -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qahera-ui@latest/dist/qahera-tokens.min.css">

<!-- 3. Themes -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qahera-ui@latest/dist/qahera-themes.min.css">

<!-- 4. Components -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qahera-ui@latest/dist/qahera.min.css">

<!-- 5. Alpine.js (Optional for interactive components) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
```
