# Operational Memory: 7-Axis Pre-Emit Critique Stamp

<!-- last-verified: 2026-09-12 -->

Every component, layout, or screen emission in Qahera UI Kit must be evaluated against the 7-Axis Quality Stamp before output.

## Syntax

```css
/* Pre-emit critique: P5 H5 E5 S5 R5 V5 D5 */
```
Each axis is scored on a strict 1–5 scale (5 = Perfect compliance; <5 = Refuse emission and refactor).

---

## The 7 Axes Defined

### 1. Axis P: Palette & Token Integrity
- **5/5 Criteria**: Every color, background, surface, border, and shadow references a CSS custom property `--qhr-*`. Zero hex codes, zero hardcoded rgba values.
- **Fail (<5)**: Raw color strings or arbitrary hex numbers found in code.

### 2. Axis H: Heading & Typography Discipline
- **5/5 Criteria**: Primary headings and brand identity strictly use Alexandria (`--qhr-font-heading`). Body copy, UI labels, and inputs strictly use Cairo (`--qhr-font-body`). Zero Amiri font.
- **Fail (<5)**: Browser default fonts, arbitrary font families, or Amiri used in UI components.

### 3. Axis E: Eight-State Completeness
- **5/5 Criteria**: Component handles all 8 interaction states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `empty`, `error`.
- **Fail (<5)**: Missing focus ring, missing disabled cursor, or unhandled loading states.

### 4. Axis S: Structure & Logical Layout
- **5/5 Criteria**: 100% CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-end`).
- **Fail (<5)**: Physical `margin-left`, `margin-right`, `left`, or `right` properties present.

### 5. Axis R: RTL & Bidirectional Parity
- **5/5 Criteria**: Fully tested and mirrored natural flow in Arabic RTL. Directional icons (arrows, next/prev) flip smoothly in RTL mode.
- **Fail (<5)**: Inverted alignment, unmirrored icons, or separate RTL-specific components.

### 6. Axis V: Visual Authenticity & Iconography (`QAHERA-VISUAL-001`)
- **5/5 Criteria**: All iconography references `icons/registry.yaml` with 24x24 viewBox and stroke-width 2. Absolutely zero emoji characters in UI elements.
- **Fail (<5)**: Emoji (🚀, 🗑️, ☀️, ✕) or unverified random SVG paths detected.

### 7. Axis D: Decision Alignment & Dogfooding (`QAHERA-COMP-001`)
- **5/5 Criteria**: Composed strictly from canonical Qahera components (`recipes/*.yaml`) and patterns (`patterns/*.yaml`). No ad-hoc classes.
- **Fail (<5)**: Invented utility classes or styling hacks added to bypass the design kit contract.
