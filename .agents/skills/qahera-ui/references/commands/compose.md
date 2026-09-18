# Command: compose

Runtime entry point for assembling complete, production-grade screens and layouts exclusively from registered Qahera UI Kit components, patterns, and templates.

## Dispatch

1. Load `../workflows/compose-screen.md`
2. Load `../memory/templates-catalog.md`
3. Load `../memory/patterns-catalog.md`
4. Load `../memory/anti-slop-matrix.md`
5. Load `../memory/7-axis-critique.md`

## Invariants

- **Dogfooding Requirement (`QAHERA-COMP-001`)**:
  - First consult `templates-catalog.md` (18 canonical tracks) to check if a relevant template already exists.
  - Next consult `patterns-catalog.md` (20 canonical patterns) to compose higher-order sections.
  - Strictly assemble from registered canonical component recipes (`recipes/*.yaml`). Never invent ad-hoc CSS classes or arbitrary inline styles.
- **Source Imports (shadcn-style)**: When creating external project layouts, use `node bin/qahera.js add <components...>` to import clean source files into the consumer codebase.
- **RTL by Default**: All layout and alignment must use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`).
- **Icons (`QAHERA-VISUAL-001`)**: Use only icons registered in `icons/registry.yaml` or inline SVG conforming to the 24x24 viewBox standard. Emoji are strictly banned.
- **Target Renderer**: Respect the user's requested stack (`HTML Native`, `React RSC`, `PHP`, `HTMX`, `Tailwind`, `Web Components`). Maintain identical semantics across targets.
