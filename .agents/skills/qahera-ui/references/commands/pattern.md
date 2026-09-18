# Command: pattern

Runtime entry point for discovering, inspecting, and composing any of the 20 canonical UX patterns in Qahera UI Kit.

## Dispatch

1. Load `../memory/patterns-catalog.md`
2. Load `../workflows/compose-screen.md`
3. Load `../memory/7-axis-critique.md`

## Invariants

- **Canonical Composition**: Patterns must be implemented using the canonical recipes specified in `patterns/<name>.yaml` without inventing ad-hoc wrappers.
- **State Integrity**: Respect all interactive data bindings (e.g. Alpine.js state or React hooks) associated with the pattern.
- **Visual Purity**: Follow `QAHERA-VISUAL-001` (zero emoji, registered SVG icons only).
