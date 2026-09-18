# Command: scaffold

Runtime entry point for authoring a brand new canonical Qahera UI Kit component according to the strict Definition of Done (DoD).

## Dispatch

1. Load `../workflows/author-component.md`
2. Load `../memory/controlled-vocabulary.md`
3. Load `../memory/7-axis-critique.md`

## Invariants

- **YAML is Authoritative**: Begin by authoring the contract in `contracts/components/<Name>.yaml`, followed by the recipe in `recipes/<name>.yaml`.
- **Atomic Stylesheet**: Author the atomic component stylesheet in `renderers/html/native/components/<name>.css`, then register in `renderers/html/native/components.css`.
- **Zero-Drift Multi-Target Renderers**: Scaffold all 6 renderers (`HTML Native`, `HTML Tailwind`, `PHP`, `HTMX`, `React RSC`, `JS Web Components`) with 100% semantic prop parity.
- **Behavior Module**: If the component is interactive, author its Alpine.js behavior module in `behavior/<name>.js` complying with `QAHERA-ALPINE-001`.
- **Automated Verification**: Component must pass `node bin/qahera.js test` with 0 errors and 0 warnings.
