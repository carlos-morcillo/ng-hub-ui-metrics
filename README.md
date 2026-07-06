# ng-hub-ui-metrics

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-metrics.svg)](https://www.npmjs.com/package/ng-hub-ui-metrics)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-metrics.svg)](LICENSE)

Read-only value visualizations for Angular 21+ — a linear **progress** bar, a graded **meter** gauge and a circular **ring** (gauge) — bundled into a single standalone, signal-driven library. Zero external dependencies; every colour and dimension is a `--hub-*` CSS custom property derived from the shared design-system tokens.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/metrics/overview/
- Live examples: https://hubui.dev/metrics/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics) ← You are here
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 🚀 Quick Start

### 1. Install

```bash
npm install ng-hub-ui-metrics
```

> **Theming (recommended):** install the shared design tokens so the metrics —
> and every other ng-hub-ui library — read the same palette and dark-mode colours:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
>
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> It is an **optional** peer dependency: every component ships sensible CSS
> fallbacks and works without it.

### 2. Import the standalone components

```typescript
import { HubProgressComponent, HubMeterComponent, HubRingComponent } from 'ng-hub-ui-metrics';

@Component({
    standalone: true,
    imports: [HubProgressComponent, HubMeterComponent, HubRingComponent],
    template: `
        <hub-progress [value]="72" label="Upload" [showValue]="true" color="info" />

        <hub-meter [value]="0.82" [low]="0.3" [high]="0.7" [optimum]="0.9" />

        <hub-ring [value]="0.86" [thresholds]="{ low: 0.4, high: 0.75 }">Score</hub-ring>
    `
})
export class DashboardComponent {}
```

---

## 📦 Description

`ng-hub-ui-metrics` closes a common gap in product dashboards: read-only value
visualizations that every app otherwise hand-rolls. The three primitives cover
the recurring shapes — a linear bar, a graded gauge and a circular ring — with a
consistent, token-driven look and a correct ARIA contract, so you pay the
ceremony once.

## 🎯 Components

### `<hub-progress>` — linear bar

A determinate or indeterminate progress bar. Host role `progressbar`.

| Input | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Current value on the `[0, max]` scale. |
| `max` | `number` | `100` | Upper bound of the scale. |
| `indeterminate` | `boolean` | `false` | Loops the bar and drops `aria-valuenow`. |
| `color` | `HubMetricsColor \| undefined` | `undefined` | Optional semantic accent (`primary`, `success`, `neutral`, …); applied inline when set. Omit to let a theme (mixin / token override) drive the accent — it defaults to `primary`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar thickness. |
| `showValue` | `boolean` | `false` | Render the rounded percentage. |
| `label` | `string` | `''` | Accessible label (`aria-label`) and leading caption. |

### `<hub-meter>` — graded gauge

A gauge following HTML `<meter>` semantics; the fill colour reflects the band
the value falls in. Host role `meter`.

| Input | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Current measurement. |
| `min` | `number` | `0` | Lower bound of the scale. |
| `max` | `number` | `1` | Upper bound of the scale. |
| `low` | `number \| undefined` | `undefined` | Upper limit of the "low" region (defaults to `min`). |
| `high` | `number \| undefined` | `undefined` | Lower limit of the "high" region (defaults to `max`). |
| `optimum` | `number \| undefined` | `undefined` | Preferred point (defaults to the midpoint). |

The computed band is exposed as `data-band` (`low` / `optimum` / `high`) and
maps to `--hub-meter-low-bg` / `--hub-meter-optimum-bg` / `--hub-meter-high-bg`.

### `<hub-ring>` — circular gauge (alias `hubGauge`)

A normalized score drawn as an SVG arc, with an optional centre caption
projected via `<ng-content>`. Host role `meter`.

| Input | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Score as a `0..1` ratio or a `0..max` figure. |
| `max` | `number` | `1` | Value is normalized against this. |
| `size` | `number \| string` | `'4rem'` | Outer diameter (number → px). |
| `thickness` | `number \| string` | `'0.5rem'` | Stroke width (number → px). |
| `thresholds` | `{ low?: number; high?: number }` | `undefined` | Recolours the arc by band. |
| `showValue` | `boolean` | `true` | Render the rounded percentage in the centre. |

---

## 🎨 Styling

Every visual detail is a `--hub-*` CSS custom property. Each component declares
its defaults on its own element (`:where(.hub-progress)` / `:where(.hub-meter)` /
`:where(.hub-ring)`), so a value set **on the element** wins over one inherited
from a bare ancestor. Set the tokens on the component element, or on a wrapper that
*targets the components as descendants* (`.wrapper :where(.hub-ring) { … }`) — which
is exactly what the `hub-metrics-theme()` mixin emits. For `<hub-progress>` prefer the
per-instance `color` input for one-off semantic tints.

### `hub-progress`

| Token | Default | Description |
|---|---|---|
| `--hub-progress-track-bg` | tint of the accent | Track background. |
| `--hub-progress-indicator-bg` | `--hub-progress-accent` | Filled indicator colour. |
| `--hub-progress-height` | `0.5rem` | Bar thickness. |
| `--hub-progress-radius` | `50rem` | Corner radius. |

### `hub-meter`

| Token | Default | Description |
|---|---|---|
| `--hub-meter-track-bg` | subtle neutral | Track background. |
| `--hub-meter-low-bg` | `--hub-sys-color-danger` | "Below target" fill. |
| `--hub-meter-optimum-bg` | `--hub-sys-color-success` | "On target" fill. |
| `--hub-meter-high-bg` | `--hub-sys-color-warning` | "Above target" fill. |
| `--hub-meter-height` | `0.5rem` | Bar thickness. |
| `--hub-meter-radius` | `50rem` | Corner radius. |

### `hub-ring`

| Token | Default | Description |
|---|---|---|
| `--hub-ring-size` | `4rem` | Outer diameter. |
| `--hub-ring-thickness` | `0.5rem` | Stroke width. |
| `--hub-ring-track` | subtle neutral | Track (unfilled) stroke. |
| `--hub-ring-indicator` | `--hub-sys-color-primary` | Indicator stroke. |
| `--hub-ring-caption-color` | `--hub-sys-text-primary` | Centre caption colour. |
| `--hub-ring-low-color` | `--hub-sys-color-danger` | Stroke below the low threshold. |
| `--hub-ring-high-color` | `--hub-sys-color-success` | Stroke at/above the high threshold. |

### One-call Sass theming

```scss
@use 'ng-hub-ui-metrics/styles' as hub;

.app-dashboard {
    @include hub.hub-metrics-theme($accent: var(--hub-sys-color-info), $radius: 0.25rem);
}
```

---

## 📄 License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
