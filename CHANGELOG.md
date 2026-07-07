# Changelog

## [22.1.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-metrics/styles`.** The theme mixin now builds to `dist/metrics/styles/...` (was `dist/metrics/src/lib/styles/...`), so `@use 'ng-hub-ui-metrics/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-progress>` `color` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` resolver (a local copy of the canonical `ng-hub-ui-utils` helper): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.0.1] - 2026-07-06

### Fixed

- **Wrapper / mixin theming now actually retints the primitives.** Each component declares its token defaults on its own element (`:where(.hub-progress)` / `:where(.hub-meter)` / `:where(.hub-ring)`), and a custom property set on the element wins over one inherited from an ancestor — so a bare `.wrapper { --hub-*: … }` override, and the `hub-metrics-theme()` mixin that emitted such overrides, had no effect. The mixin now emits its token overrides ON the metrics elements as descendants of the include scope (`<scope> :where(.hub-progress, .hub-meter, .hub-ring)`), which beats the per-element defaults and reaches the components.
- **`<hub-ring>` host role corrected to `meter`** (was `img`, which does not expose the `aria-valuemin` / `-valuemax` / `-valuenow` / `-valuetext` attributes the component sets).

### Changed

- **`<hub-progress>` `color` input is now optional** (`HubMetricsColor | undefined`, default `undefined`). When set it is applied inline as a per-instance override; when omitted the accent falls back to the `--hub-progress-accent` token so a theme (mixin / token override) can drive it. The rendered default is unchanged (`primary`).

### Added

- `docs/css-variables-reference.md` — complete CSS custom-property reference for `<hub-progress>`, `<hub-meter>` and `<hub-ring>`, with the theming guidance above.

## [22.0.0] - 2026-07-05

### Added

- Initial release of **`ng-hub-ui-metrics`** — read-only value visualizations for Angular 21+, bundling three standalone, signal-driven primitives:
  - **`<hub-progress>`** — a linear determinate/indeterminate bar with a semantic `color`, three size steps, an optional value readout and a full `progressbar` ARIA contract (drops `aria-valuenow` while indeterminate).
  - **`<hub-meter>`** — a graded gauge following HTML `<meter>` semantics, whose fill colour reflects the band the value falls in (`low` / `optimum` / `high`) relative to the `optimum` point.
  - **`<hub-ring>`** (alias `hubGauge`) — an SVG `stroke-dasharray` arc for a normalized score, with optional colour thresholds and a projected centre caption.
- Token-driven theming through the `--hub-progress-*`, `--hub-meter-*` and `--hub-ring-*` CSS custom properties, all derived from the shared `--hub-sys-color-*` design-system tokens.
- A public `hub-metrics-theme()` Sass mixin (`ng-hub-ui-metrics/styles`) to override the shared tokens in one call.
