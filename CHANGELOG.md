# Changelog

## [22.4.0] - 2026-09-08

### Changed

- **The three primitives keep their stylesheet to themselves.** `<hub-progress>`, `<hub-meter>` and
  `<hub-ring>` shipped with `ViewEncapsulation.None`, which publishes every rule they emit into the
  application's global cascade — where it competes with rules the library never sees and cannot be
  removed by anyone who did not know it was there. None of the four reasons `CODING_RULES.md` allows
  for leaving encapsulation applied here: all three paint their own host and their own template, and
  nothing else. The token defaults move from `:where(.hub-progress)` to `:where(:host)`, which costs
  nothing — a custom property inherits, so declaring it on the host reaches every element inside —
  and the size and band modifiers, which ride on the host, are matched through `:host()`. Theming is
  untouched: the defaults stay at specificity zero, and `hub-metrics-theme()` emits
  `<your scope> :where(.hub-progress, …)` from your own sheet, which still matches the host element.
  `BREAKING_CHANGES.md` records the one case that does change.

### Added

- **`ng-hub-ui-ds` is declared as an optional peer dependency** (`>=22.0.0`). Every token in the
  three stylesheets has always resolved through the `--hub-sys-*` / `--hub-ref-*` ladder, and the
  manifest said nothing about it, so a consumer reading the package on npm had no way to learn that
  installing the token package is what gives these primitives the family palette and its dark mode.
  It is optional because it truly is: each token carries a literal fallback and the library renders
  without it.

## [22.3.0] - 2026-09-06

### Added

- **`<hub-meter>` and `<hub-ring>` accept a `label` input**, mirroring `<hub-progress>`. `role="meter"` is named by the author alone — the meter renders no text of its own and the ring's projected caption is not a name — so both primitives reached assistive technology unnamed, and the ring could not even be named from outside. The input feeds `aria-label` through a host binding and is dropped when empty, so an outer `aria-labelledby` still applies. An `aria-label` written on the element itself does not: a host binding owns the attribute, so it is cleared whenever `label` is unset. See `BREAKING_CHANGES.md`.
- **`FUNCTIONALITIES.md`**, the coverage table the rest of the family ships. Nothing stated which parts of the three primitives a live example actually demonstrates and which are only described in prose, so a reader had to open the docs site and infer it.

### Fixed

- **`<hub-ring>` no longer takes its accessible name from its own percentage.** `aria-label` was hard-wired to the rounded value already carried by `aria-valuetext`, which announced the number twice and overwrote any name written on the element. The name now comes from the new `label` input; the percentage stays in `aria-valuetext`.
- **`<hub-ring>` `size` and `thickness` no longer shadow their own tokens.** Both defaulted to a concrete length written inline as a custom property on every render, so `--hub-ring-size` and `--hub-ring-thickness` — advertised as themeable by the README, the CSS reference and the ds token spec — could only be overridden with `!important`, and not even the `hub-metrics-theme()` mixin reached them. The inputs now default to `undefined` (their type widens accordingly) and the inline declaration is dropped when unset, leaving the stylesheet in charge: `4rem` and `var(--hub-ref-space-2, 0.5rem)`, the same values as before. Same shape as the 22.0.1 fix for `<hub-progress>`'s `color`.
- **The README no longer advertises "zero external dependencies".** `ng-hub-ui-utils` has been a required peer since 22.2.0 — `<hub-progress>` imports `resolveHubAccent` from it — so anyone who followed the Quick Start installed a tree that cannot resolve. Both READMEs now state the dependency and the install command names it.
- **The `<hub-progress>` token table lists `--hub-progress-accent`.** It is the root slot the `color` input and the mixin's `$accent` write, and the one every other progress token derives from, yet it was the single token the table left out — so a theme author reading only the README could not see what to override.
- **`HubRingThresholds.low` described itself as inclusive** ("at or below") while the component treats a value equal to `low` as neutral. The JSDoc ships in the `.d.ts`, so the wrong sentence is what a consumer reads in their editor.

## [22.2.4] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

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

- **NEW peer dependency: `ng-hub-ui-utils` `>=22.7.0`.** Consumers must have `ng-hub-ui-utils` installed alongside this library (it is where `resolveHubAccent` lives). Users installing via `ng add ng-hub-ui` get it automatically; manual installs need `npm i ng-hub-ui-utils`.

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
