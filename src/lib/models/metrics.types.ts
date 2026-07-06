/**
 * Built-in semantic colour families shared by the metrics primitives, backed by
 * the design-system `--hub-sys-color-*` tokens.
 *
 * The list mirrors the canonical accents exposed by the ng-hub-ui design system
 * (`primary, secondary, success, danger, warning, info` plus the neutral grey),
 * so the type documents exactly the hues that work out of the box.
 */
export type HubMetricsBuiltinColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

/**
 * Semantic colour name accepted by the metrics primitives.
 *
 * The open string branch lets host applications point a component at any custom
 * semantic colour registered through the `--hub-sys-color-<name>` token family.
 */
export type HubMetricsColor = HubMetricsBuiltinColor | (string & {});
