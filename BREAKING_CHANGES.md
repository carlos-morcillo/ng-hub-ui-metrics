# Breaking Changes — ng-hub-ui-metrics

## [22.1.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-metrics/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/metrics/styles/...` instead of `dist/metrics/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-metrics/styles' as *;`

