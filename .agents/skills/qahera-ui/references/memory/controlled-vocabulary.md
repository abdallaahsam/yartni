# Operational Memory: Strict Controlled Vocabulary

<!-- last-verified: 2026-09-12 -->

Authoritative mapping of prop names and allowed values across all Qahera UI Kit components. Arbitrary values outside this dictionary are strictly prohibited.

---

## Allowed Values vs Prohibited Slop

| Contract Property | Canonical Allowed Values | Prohibited Slop (Banned) |
|---|---|---|
| `variant` | `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive` | `special`, `hero`, `nice`, `blue`, `action`, `default-btn` |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | `tiny`, `huge`, `normal`, `medium`, `small`, `big` |
| `tone` | `neutral`, `info`, `success`, `warning`, `danger` | `error`, `positive`, `alert-red`, `good`, `bad` |
| `state` | `default`, `hover`, `focus`, `disabled`, `loading` | `busy`, `blocked`, `inactive`, `working` |

---

## Semantic Token Prefixes

All tokens must start with `--qhr-` followed by the domain category:

```yaml
Color:
  Primary: var(--qhr-color-primary)
  Surface: var(--qhr-color-surface)
  Text: var(--qhr-color-text-primary)
  Border: var(--qhr-color-border)
  Focus Ring: var(--qhr-color-focus-ring)

Typography:
  Heading Family: var(--qhr-font-heading)   # Alexandria
  Body Family: var(--qhr-font-body)         # Cairo
  Mono Family: var(--qhr-font-mono)         # Fira Code

Spacing & Layout:
  Space Units: var(--qhr-space-1) through var(--qhr-space-12)
  Border Radius: var(--qhr-radius-sm), var(--qhr-radius-md), var(--qhr-radius-lg), var(--qhr-radius-full)
  Elevation / Shadow: var(--qhr-shadow-sm), var(--qhr-shadow-md), var(--qhr-shadow-lg)
```

---

## Multi-Renderer Prop Binding Syntax

| Property | HTML Native Attribute | Tailwind / Preset Class | React Prop | PHP Argument |
|---|---|---|---|---|
| Variant | `data-variant="primary"` | `qhr-btn-primary` | `variant="primary"` | `'variant' => 'primary'` |
| Size | `data-size="md"` | `qhr-btn-md` | `size="md"` | `'size' => 'md'` |
| Tone | `data-tone="success"` | `qhr-tone-success` | `tone="success"` | `'tone' => 'success'` |
| Disabled | `disabled aria-disabled="true"` | `opacity-50 cursor-not-allowed` | `disabled={true}` | `'disabled' => true` |
| Loading | `data-loading="true"` | `qhr-loading` | `loading={true}` | `'loading' => true` |
