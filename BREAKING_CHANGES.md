# Breaking Changes — ng-hub-ui-metrics

## [22.4.0] - 2026-09-08

### The stylesheet no longer reaches outside the component

- **Change**: `<hub-progress>`, `<hub-meter>` and `<hub-ring>` dropped `ViewEncapsulation.None`.
  Every rule they emit now carries the component's own marker attribute: `.hub-progress__indicator`
  ships as `.hub-progress__indicator[_ngcontent-…]`, and the modifier blocks as
  `.hub-progress--sm[_nghost-…]`.

- **Impact**: nothing in the TypeScript API moved — same inputs, same outputs, same classes on the
  host — and two things change in CSS, both without a warning of any kind.

    - Markup that is not the component's stops being painted. A `<div class="hub-progress">` of your
      own picked up the library's layout for free; it now renders as a bare div.
    - The library's rules weigh one attribute selector more than they did — (0,2,0) where they were
      (0,1,0). An override that won by adding a single class, `.dashboard .hub-progress__indicator`,
      now ties with the library and loses on source order, because component styles are injected
      after the stylesheet your application ships.

- **Migration**: use the element, and theme through the tokens rather than through the internals.
  `<div class="hub-progress">` becomes `<hub-progress>`; a rule written against an inner element
  becomes a token set on the component element or on a wrapper — which is what `hub-metrics-theme()`
  emits, and the route that has always been supported.

    ```scss
    // Before — one extra class was enough to win
    .dashboard .hub-progress__indicator {
    	background: var(--brand);
    }

    // After — set the token the indicator reads
    .dashboard {
    	@include hub.hub-metrics-theme($accent: var(--brand));
    }
    ```

    Setting the tokens still works from anywhere, including a plain global rule on
    `.hub-progress`: the class is on the host element, which a global sheet reaches as it always
    did, and encapsulation only stamps the rules the library itself emits.

## [22.3.0] - 2026-09-06
### A static `aria-label` on `<hub-meter>` or `<hub-ring>` is no longer kept

- **Change**: both primitives now bind `aria-label` from the new `label` input. A host binding owns
  the attribute outright, so it overwrites whatever the consumer wrote in the template, and clears it
  when `label` is unset.
- **Impact**: `<hub-meter aria-label="Disk usage" />` used to be the documented way to name the
  control, because the library offered nothing else. That element now reaches assistive technology
  with no name at all. Nothing warns: the template still compiles and the attribute simply is not
  there at runtime.
- **Migration**: move the text into the input — `<hub-meter [label]="'Disk usage'" />`. An
  `aria-labelledby` on the element is unaffected and keeps working.

## [22.1.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-metrics/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/metrics/styles/...` instead of `dist/metrics/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-metrics/styles' as *;`

