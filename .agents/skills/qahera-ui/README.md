# Qahera UI Kit — AI Coding Agent Skill (`qahera-ui`)

> Sovereign AI-Native UI Kit & Design System Engine by **Alwkala**.

$$\mathbf{\text{Qahera UI Kit}} = \mathbf{\text{Design System}} + \mathbf{\text{Registry}} + \mathbf{\text{AI Decision Layer}}$$

---

## Overview

`qahera-ui` is the authoritative AI Decision Layer for the **Qahera UI Kit**. It orchestrates component authoring, screen composition, invariant auditing, and multi-target code generation directly from canonical YAML contracts (`contracts/components/`) and recipes (`recipes/`).

### Target Framework Parity (6 Renderers)
- **HTML Native**: Vanilla semantic HTML5 with CSS custom properties and Alpine.js.
- **HTML Tailwind**: Tailwind CSS v3/v4 powered by `@alwkala/qahera-tailwind-preset`.
- **React**: Pure React 19 Server Components with an isolated 0kb client footprint.
- **PHP**: Plates / Native PHP component renderer (`$qhr->render(...)`).
- **HTMX**: Hypermedia-driven server components (`hx-get`, `hx-swap`).
- **JS Web Components**: Zero-dependency custom elements (`<qhr-...>`).

---

## Commands

| Command | Syntax | Purpose |
|---|---|---|
| **Compose** | `/qahera-ui compose` | Assemble production-ready screens from canonical components and patterns. |
| **Scaffold** | `/qahera-ui scaffold` | Author a brand-new component following the complete Definition of Done (DoD). |
| **Audit** | `/qahera-ui audit` | Verify compliance against the 15 Qahera Invariants and run CI test suites. |
| **Theme** | `/qahera-ui theme` | Apply or synthesize authentic Egyptian architectural and cultural themes. |

---

## The 15 Non-Negotiable Invariants

1. **YAML is Authoritative**: Contracts, recipes, and tokens in YAML are the sole SSOT.
2. **Tokens Precede Styling**: Hardcoded hex, raw pixels, or arbitrary CSS are strictly forbidden.
3. **Contracts Precede Implementations**: No component exists without a registered contract.
4. **RTL is Infrastructure**: 100% CSS logical properties (`margin-inline-start`, `padding-inline-end`).
5. **Arabic Typography Discipline**: Alexandria for headings/brand; Cairo for UI/labels. Zero Amiri.
6. **Renderer Parity**: Zero semantic prop drift across all 6 targets.
7. **Canonical Icons (`QAHERA-VISUAL-001`)**: 41 registered SVG icons (`icons/registry.yaml`). Zero emoji.
8. **Dogfooding (`QAHERA-COMP-001`)**: Composed exclusively from registered recipes and patterns.
9. **Alpine Hydration Integrity (`QAHERA-ALPINE-001`)**: Single-root templates, unique `:key`s, zero nested `x-for`.
10. **Thematic Topography (`QAHERA-THEME-001`)**: Authentic Egyptian contexts via `[data-theme="..."]`.
11. **7-Axis Pre-Emit Critique**: All code emissions require `/* Pre-emit critique: P5 H5 E5 S5 R5 V5 D5 */`.
12. **Modular Stylesheet Architecture**: Atomic CSS per component in `renderers/html/native/components/*.css`.
13. **Progressive AI Context Protocol**: Level 0 (Index) $\to$ Level 1 (Metadata) $\to$ Level 2 (Recipe).
14. **Contextual Decision Layer (CDL)**: Resolve design baselines before emitting code.
15. **Source Ownership**: shadcn-style component ownership without runtime lock-in.

---

## Quality & Test Harness

Run the native deterministic test suite:
```bash
node bin/qahera.js test
```
Validates schema compliance, WCAG 2.1 AA accessibility ratios, performance budgets, and logical CSS parity.
