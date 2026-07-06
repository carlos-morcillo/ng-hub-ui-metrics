# ng-hub-ui-metrics — CSS Variables Reference

Complete reference of the CSS custom properties exposed by `ng-hub-ui-metrics`.
Use these variables to customize the read-only value visualizations (`<hub-progress>`,
`<hub-meter>`, `<hub-ring>`) without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Progress (`<hub-progress>`)](#progress-hub-progress)
- [Meter (`<hub-meter>`)](#meter-hub-meter)
- [Ring (`<hub-ring>`)](#ring-hub-ring)
- [Theming Examples](#theming-examples)

---

## How it Works

Each component declares its token defaults on its own element (`:where(.hub-progress)`,
`:where(.hub-meter)`, `:where(.hub-ring)`) with a fallback chain:

```text
component token -> sys token -> ref token -> literal fallback
```

There are three ways to theme, from most to least local:

1. **Per-instance semantic colour** — the `<hub-progress>` `color` input maps to the
   design-system `--hub-sys-color-<name>` families (`primary` / `success` / `danger` / …).
   No CSS required for the common case.
2. **The `hub-metrics-theme()` SCSS mixin** — one include retints all three primitives.
   Import the public styles entry and call it on a wrapper:

   ```scss
   @use 'ng-hub-ui-metrics/styles' as hub;

   .app-dashboard {
     @include hub.hub-metrics-theme($accent: var(--hub-sys-color-brand), $radius: 0.25rem);
   }
   ```

3. **Direct `--hub-*` overrides** — set the tokens yourself.

> **Theme on the elements, not a bare ancestor.** Because each component declares its
> own defaults on `:where(.hub-<comp>)`, a value set on the element wins over one
> inherited from an ancestor — so a bare `.wrapper { --hub-ring-indicator: … }` would be
> shadowed. Target the components as descendants (`.wrapper :where(.hub-ring) { … }`),
> which is exactly what the `hub-metrics-theme()` mixin emits.

---

## Progress (`<hub-progress>`)

| Variable | Default |
| --- | --- |
| `--hub-progress-accent` | `var(--hub-sys-color-primary, #0d6efd)` |
| `--hub-progress-track-bg` | `color-mix(in oklch, var(--hub-progress-accent) 16%, transparent)` |
| `--hub-progress-indicator-bg` | `var(--hub-progress-accent)` |
| `--hub-progress-height` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-progress-radius` | `var(--hub-ref-radius-pill, 50rem)` |

`--hub-progress-value` is written at runtime (the fill width) and is not themeable.

## Meter (`<hub-meter>`)

| Variable | Default |
| --- | --- |
| `--hub-meter-track-bg` | `color-mix(in oklch, var(--hub-sys-color-neutral, #6c757d) 16%, transparent)` |
| `--hub-meter-low-bg` | `var(--hub-sys-color-danger, #dc3545)` |
| `--hub-meter-optimum-bg` | `var(--hub-sys-color-success, #198754)` |
| `--hub-meter-high-bg` | `var(--hub-sys-color-warning, #ffc107)` |
| `--hub-meter-height` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-meter-radius` | `var(--hub-ref-radius-pill, 50rem)` |
| `--hub-meter-fill` | `var(--hub-meter-optimum-bg)` |

The band the value falls in (`low` / `optimum` / `high`) picks the matching `-bg` token as
`--hub-meter-fill`. `--hub-meter-value` is written at runtime (the fill width).

## Ring (`<hub-ring>`)

| Variable | Default |
| --- | --- |
| `--hub-ring-size` | `4rem` |
| `--hub-ring-thickness` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-ring-track` | `color-mix(in oklch, var(--hub-sys-color-neutral, #6c757d) 20%, transparent)` |
| `--hub-ring-indicator` | `var(--hub-sys-color-primary, #0d6efd)` |
| `--hub-ring-caption-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-ring-low-color` | `var(--hub-sys-color-danger, #dc3545)` |
| `--hub-ring-high-color` | `var(--hub-sys-color-success, #198754)` |

`--hub-ring-size` and `--hub-ring-thickness` also accept the `size` / `thickness` inputs
(applied inline per instance); the optional `thresholds` input recolours the indicator
through `--hub-ring-low-color` / `--hub-ring-high-color`.

---

## Theming Examples

```scss
@use 'ng-hub-ui-metrics/styles' as hub;

// One include retints the shared surfaces of all three primitives.
.app-panel {
  @include hub.hub-metrics-theme(
    $accent:  var(--hub-sys-color-brand),
    $track:   color-mix(in oklch, var(--hub-sys-color-brand) 14%, transparent),
    $low:     var(--hub-sys-color-danger),
    $optimum: var(--hub-sys-color-success),
    $high:    var(--hub-sys-color-warning),
    $radius:  0.5rem
  );
}
```

Prefer the per-instance `color` input for one-off semantic tints on `<hub-progress>` — it
maps straight to the ds `--hub-sys-color-<name>` families, so no CSS is required.
