# Functionalities of Metrics Library

This table details the functionalities of the `ng-hub-ui-metrics` library and indicates which ones are covered by interactive examples.

The library ships three read-only primitives: `hub-progress` (linear bar), `hub-meter` (graded gauge) and `hub-ring` (circular gauge, `exportAs: hubGauge`).

## Progress (`hub-progress`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Value** | Determinate value on the `[0, max]` scale (`value` / `max`) | ✅ |
| | Value clamped into the scale | ❌ |
| | Indeterminate loop (`indeterminate`) | ✅ |
| **Appearance** | Size steps (`sm` / `md` / `lg`) | ✅ |
| | Built-in semantic accent (`color="success"`, …) | ✅ |
| | Registered custom accent or literal colour (`#hex`, `rgb()`, `oklch()`, `var()`) | ❌ |
| | Accent left to `--hub-progress-accent` when `color` is omitted | ✅ |
| | Rounded percentage (`showValue`) | ✅ |
| | Leading caption rendered from `label` | ✅ |
| **Accessibility** | `role="progressbar"` with `aria-valuemin` / `-valuemax` / `-valuenow` | ✅ |
| | Accessible name (`label` → `aria-label`) | ✅ |
| | `aria-busy` set and `aria-valuenow` dropped while indeterminate | ✅ |
| | `prefers-reduced-motion` slows the loop and drops the transition | ❌ |

## Meter (`hub-meter`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Scale** | Measurement on the `[min, max]` scale (`value` / `min` / `max`) | ✅ |
| | `low` / `high` plateau | ✅ |
| | `optimum` point | ✅ |
| | Omitted bounds default to `min` / `max` / the midpoint | ❌ |
| | Bounds clamped and reordered when they contradict each other | ❌ |
| **Bands** | `low` / `optimum` / `high` fill selection | ✅ |
| | Band published as `data-band` for consumer styling | ❌ |
| **Accessibility** | `role="meter"` with `aria-valuemin` / `-valuemax` / `-valuenow` | ✅ |
| | `aria-valuetext` carrying the percentage and the band | ✅ |
| | Accessible name (`label` → `aria-label`) | ✅ |
| **Motion** | `prefers-reduced-motion` drops the fill transition | ❌ |

## Ring (`hub-ring`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Value** | Score as a `0..1` ratio or a `0..max` figure (`value` / `max`) | ✅ |
| | Non-positive `max` guarded instead of dividing by zero | ❌ |
| **Appearance** | Per-instance diameter and stroke (`size` / `thickness`) | ✅ |
| | Diameter and stroke left to the tokens when both inputs are unset | ✅ |
| | Threshold bands recolouring the arc (`thresholds`) | ✅ |
| | Centre percentage (`showValue`) | ✅ |
| | Percentage hidden (`[showValue]="false"`) | ✅ |
| | Caption projected through `<ng-content>` | ✅ |
| **Accessibility** | `role="meter"` with `aria-valuemin` / `-valuemax` / `-valuenow` | ✅ |
| | `aria-valuetext` carrying the rounded percentage | ✅ |
| | Accessible name (`label` → `aria-label`) | ✅ |
| | SVG hidden from assistive technology (`aria-hidden`) | ✅ |
| **Motion** | `prefers-reduced-motion` drops the arc transition | ❌ |

## Styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Progress tokens** | `--hub-progress-accent` | ✅ |
| | `--hub-progress-track-bg` | ✅ |
| | `--hub-progress-indicator-bg` | ❌ |
| | `--hub-progress-height` | ❌ |
| | `--hub-progress-radius` | ✅ |
| **Meter tokens** | `--hub-meter-track-bg` | ✅ |
| | `--hub-meter-low-bg` | ✅ |
| | `--hub-meter-optimum-bg` | ✅ |
| | `--hub-meter-high-bg` | ✅ |
| | `--hub-meter-height` | ❌ |
| | `--hub-meter-radius` | ❌ |
| **Ring tokens** | `--hub-ring-size` | ✅ |
| | `--hub-ring-thickness` | ✅ |
| | `--hub-ring-track` | ✅ |
| | `--hub-ring-indicator` | ✅ |
| | `--hub-ring-caption-color` | ✅ |
| | `--hub-ring-low-color` | ❌ |
| | `--hub-ring-high-color` | ❌ |
| **Sass** | `hub-metrics-theme()` mixin | ✅ |
| **Structure** | BEM classes (`hub-progress__track`, `hub-meter__indicator`, `hub-ring__caption`) | ❌ |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
