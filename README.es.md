# ng-hub-ui-metrics

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-metrics.svg)](https://www.npmjs.com/package/ng-hub-ui-metrics)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-metrics.svg)](LICENSE)

Visualizaciones de valores de solo lectura para Angular 21+ — una barra de **progreso** lineal, un **medidor** graduado y un **anillo** circular (gauge) — reunidos en una única librería standalone basada en señales. Sin dependencias externas; cada color y dimensión es una propiedad personalizada CSS `--hub-*` derivada de los tokens compartidos del sistema de diseño.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de librerías de componentes de Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/metrics/overview/
- Ejemplos en vivo: https://hubui.dev/metrics/examples/
- Hub UI: https://hubui.dev/

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics) ← Estás aquí
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

## 🚀 Inicio rápido

### 1. Instalación

```bash
npm install ng-hub-ui-metrics
```

> **Tematización (recomendado):** instala los tokens de diseño compartidos para
> que las métricas —y el resto de librerías ng-hub-ui— usen la misma paleta y
> los colores de modo oscuro:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
>
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> Es una dependencia peer **opcional**: cada componente incluye valores CSS de
> reserva razonables y funciona sin ella.

### 2. Importa los componentes standalone

```typescript
import { HubProgressComponent, HubMeterComponent, HubRingComponent } from 'ng-hub-ui-metrics';

@Component({
    standalone: true,
    imports: [HubProgressComponent, HubMeterComponent, HubRingComponent],
    template: `
        <hub-progress [value]="72" label="Subida" [showValue]="true" color="info" />

        <hub-meter [value]="0.82" [low]="0.3" [high]="0.7" [optimum]="0.9" />

        <hub-ring [value]="0.86" [thresholds]="{ low: 0.4, high: 0.75 }">Puntuación</hub-ring>
    `
})
export class DashboardComponent {}
```

---

## 📦 Descripción

`ng-hub-ui-metrics` cubre un hueco habitual en los cuadros de mando: las
visualizaciones de valores de solo lectura que cada aplicación reimplementa a
mano. Los tres primitivos cubren las formas recurrentes —una barra lineal, un
medidor graduado y un anillo circular— con una estética coherente basada en
tokens y un contrato ARIA correcto, para pagar la ceremonia una sola vez.

## 🎯 Componentes

### `<hub-progress>` — barra lineal

Barra de progreso determinada o indeterminada. Rol de host `progressbar`.

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `number` | `0` | Valor actual en la escala `[0, max]`. |
| `max` | `number` | `100` | Límite superior de la escala. |
| `indeterminate` | `boolean` | `false` | Anima la barra y omite `aria-valuenow`. |
| `color` | `HubMetricsColor \| undefined` | `undefined` | Acento semántico opcional (`primary`, `success`, `neutral`, …); se aplica inline cuando se define. Omítelo para que un tema (mixin / override de token) mande el acento — por defecto es `primary`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Grosor de la barra. |
| `showValue` | `boolean` | `false` | Muestra el porcentaje redondeado. |
| `label` | `string` | `''` | Etiqueta accesible (`aria-label`) y rótulo inicial. |

### `<hub-meter>` — medidor graduado

Medidor con semántica del `<meter>` de HTML; el color de relleno refleja la
banda en la que cae el valor. Rol de host `meter`.

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `number` | `0` | Medición actual. |
| `min` | `number` | `0` | Límite inferior de la escala. |
| `max` | `number` | `1` | Límite superior de la escala. |
| `low` | `number \| undefined` | `undefined` | Límite superior de la región "baja" (por defecto `min`). |
| `high` | `number \| undefined` | `undefined` | Límite inferior de la región "alta" (por defecto `max`). |
| `optimum` | `number \| undefined` | `undefined` | Punto preferido (por defecto el punto medio). |

La banda calculada se expone como `data-band` (`low` / `optimum` / `high`) y se
asigna a `--hub-meter-low-bg` / `--hub-meter-optimum-bg` / `--hub-meter-high-bg`.

### `<hub-ring>` — gauge circular (alias `hubGauge`)

Una puntuación normalizada dibujada como arco SVG, con un rótulo central
opcional proyectado mediante `<ng-content>`. Rol de host `meter`.

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `number` | `0` | Puntuación como razón `0..1` o cifra `0..max`. |
| `max` | `number` | `1` | El valor se normaliza contra esto. |
| `size` | `number \| string` | `'4rem'` | Diámetro exterior (número → px). |
| `thickness` | `number \| string` | `'0.5rem'` | Grosor del trazo (número → px). |
| `thresholds` | `{ low?: number; high?: number }` | `undefined` | Recolorea el arco por banda. |
| `showValue` | `boolean` | `true` | Muestra el porcentaje redondeado en el centro. |

---

## 🎨 Estilos

Cada detalle visual es una propiedad personalizada CSS `--hub-*`. Cada componente
declara sus valores por defecto en su propio elemento (`:where(.hub-progress)` /
`:where(.hub-meter)` / `:where(.hub-ring)`), así que un valor puesto **en el elemento**
gana al heredado de un ancestro pelado. Define los tokens en el elemento del componente,
o en un wrapper que *apunte a los componentes como descendientes*
(`.wrapper :where(.hub-ring) { … }`) — que es justo lo que emite el mixin
`hub-metrics-theme()`. Para `<hub-progress>` prefiere el input `color` por instancia
para tintes semánticos puntuales.

### `hub-progress`

| Token | Por defecto | Descripción |
|---|---|---|
| `--hub-progress-track-bg` | tinte del acento | Fondo de la pista. |
| `--hub-progress-indicator-bg` | `--hub-progress-accent` | Color del indicador relleno. |
| `--hub-progress-height` | `0.5rem` | Grosor de la barra. |
| `--hub-progress-radius` | `50rem` | Radio de las esquinas. |

### `hub-meter`

| Token | Por defecto | Descripción |
|---|---|---|
| `--hub-meter-track-bg` | neutro sutil | Fondo de la pista. |
| `--hub-meter-low-bg` | `--hub-sys-color-danger` | Relleno "por debajo del objetivo". |
| `--hub-meter-optimum-bg` | `--hub-sys-color-success` | Relleno "en el objetivo". |
| `--hub-meter-high-bg` | `--hub-sys-color-warning` | Relleno "por encima del objetivo". |
| `--hub-meter-height` | `0.5rem` | Grosor de la barra. |
| `--hub-meter-radius` | `50rem` | Radio de las esquinas. |

### `hub-ring`

| Token | Por defecto | Descripción |
|---|---|---|
| `--hub-ring-size` | `4rem` | Diámetro exterior. |
| `--hub-ring-thickness` | `0.5rem` | Grosor del trazo. |
| `--hub-ring-track` | neutro sutil | Trazo de la pista (sin rellenar). |
| `--hub-ring-indicator` | `--hub-sys-color-primary` | Trazo del indicador. |
| `--hub-ring-caption-color` | `--hub-sys-text-primary` | Color del rótulo central. |
| `--hub-ring-low-color` | `--hub-sys-color-danger` | Trazo por debajo del umbral bajo. |
| `--hub-ring-high-color` | `--hub-sys-color-success` | Trazo en/por encima del umbral alto. |

### Tematización Sass en una llamada

```scss
@use 'ng-hub-ui-metrics/styles' as hub;

.app-dashboard {
    @include hub.hub-metrics-theme($accent: var(--hub-sys-color-info), $radius: 0.25rem);
}
```

---

## 📄 Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
