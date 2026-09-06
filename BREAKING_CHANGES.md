# Breaking Changes — ng-hub-ui-metrics

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

