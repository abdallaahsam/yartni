# Command: theme

Runtime entry point for discovering, deriving, and applying authentic Egyptian cultural/architectural themes conforming to `QAHERA-THEME-001`.

## Dispatch

1. Load `../workflows/compose-screen.md`
2. Load `../memory/anti-slop-matrix.md`

## Invariants

- **Cultural Coherence (`QAHERA-THEME-001`)**: Themes must synthesize a global design movement (Art Deco, Belle Époque, Neo-Brutalism, Modern Minimalist, Vernacular Claymorphism, Desert Raw Materiality) with an authentic Egyptian context (Heliopolis, Khedivial Downtown Cairo, New Cairo, Maadi, Shubra, Nubia, Sinai Bedouin, Historic Islamic Cairo).
- **Semantic Token Overrides**: Themes operate strictly by setting custom property overrides in `tokens/themes/<theme-name>.yaml` and applying via `[data-theme="<theme-name>"]`.
- **Contract Purity**: Themes must NEVER alter component contracts, HTML structure, or logical RTL layout.
