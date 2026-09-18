# Command: audit

Runtime entry point for auditing compliance against the 15 Qahera UI Kit Invariants, typography rules, icon registry parity, Alpine.js hydration safety, and deterministic test suites.

## Dispatch

1. Load `../workflows/audit-kit.md`
2. Load `../memory/anti-slop-matrix.md`
3. Load `../memory/alpine-hydration-protocol.md`

## Invariants

- **Zero-Warning Tolerance**: Audits must verify that `node bin/qahera.js test` executes cleanly with 0 errors and 0 warnings.
- **Icon Enforcement (`QAHERA-VISUAL-001`)**: Grep for prohibited emoji characters and unverified SVG paths across templates and components.
- **Hydration Audit (`QAHERA-ALPINE-001`)**: Verify unique template `:key`s, absence of nested `x-for`, no interactive elements inside `<a>` tags, and external `Alpine.data()` definitions.
- **Typography Audit**: Ensure display and brand elements use Alexandria, body copy uses Cairo, and Amiri is nowhere in UI components.
