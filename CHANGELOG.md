# Changelog

## [22.2.3] - 2026-08-17

### Fixed

- **The published package declared no licence.** An absent `license` field is not neutral — a registry reports it as unlicensed, which legally reads as all rights reserved, the most restrictive state possible rather than the most open. The intent was always MIT; it is now stated in `package.json` and carried in a `LICENSE` file that ships with the package.

## [22.2.2] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.2.1] - 2026-07-28

### Fixed

- **The package could not be published**: `tsconfig.lib.prod.json` was missing `"compilationMode": "partial"`, so production builds emitted full Ivy output, which npm publishing rejects. 22.2.0 never reached the registry; this release carries the 22.2.0 changes (canonical `resolveHubAccent` from ng-hub-ui-utils) plus the build fix.

## [22.2.0] - 2026-07-28

### Changed

- **Accent resolution now imports the canonical `resolveHubAccent` from `ng-hub-ui-utils`.** The private copy under `src/lib/shared/resolve-hub-accent.ts` (used by `<hub-progress>`) has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to `var(--hub-sys-color-<name>, <name>)`, a literal colour passes through unchanged, an empty value yields `null`.

### Added

- **NEW peer dependency: `ng-hub-ui-utils` `>=22.7.0`.** Consumers must have `ng-hub-ui-utils` installed alongside this library (it is where `resolveHubAccent` lives). Users installing via `ng add ng-hub-ui-installer` get it automatically; manual installs need `npm i ng-hub-ui-utils`.

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
