# Changelog

## [22.0.0] - 2026-07-05

### Added

- Initial release of **`ng-hub-ui-metrics`** — read-only value visualizations for Angular 21+, bundling three standalone, signal-driven primitives:
  - **`<hub-progress>`** — a linear determinate/indeterminate bar with a semantic `color`, three size steps, an optional value readout and a full `progressbar` ARIA contract (drops `aria-valuenow` while indeterminate).
  - **`<hub-meter>`** — a graded gauge following HTML `<meter>` semantics, whose fill colour reflects the band the value falls in (`low` / `optimum` / `high`) relative to the `optimum` point.
  - **`<hub-ring>`** (alias `hubGauge`) — an SVG `stroke-dasharray` arc for a normalized score, with optional colour thresholds and a projected centre caption.
- Token-driven theming through the `--hub-progress-*`, `--hub-meter-*` and `--hub-ring-*` CSS custom properties, all derived from the shared `--hub-sys-color-*` design-system tokens.
- A public `hub-metrics-theme()` Sass mixin (`ng-hub-ui-metrics/styles`) to override the shared tokens in one call.
