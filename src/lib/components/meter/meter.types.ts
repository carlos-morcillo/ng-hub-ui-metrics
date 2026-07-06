/**
 * Band a `hub-meter` value falls into, following HTML `<meter>` grading:
 *
 * - `low` — the value sits below the acceptable plateau (on the far side of
 *   `optimum`); rendered with `--hub-meter-low-bg`.
 * - `optimum` — the value sits inside the acceptable `[low, high]` plateau;
 *   rendered with `--hub-meter-optimum-bg`.
 * - `high` — the value sits above the acceptable plateau; rendered with
 *   `--hub-meter-high-bg`.
 */
export type HubMeterBand = 'low' | 'optimum' | 'high';

/**
 * Fully resolved, clamped meter bounds derived from the raw inputs.
 */
export interface HubMeterResolved {
	/** Lower bound of the scale. */
	min: number;
	/** Upper bound of the scale. */
	max: number;
	/** Value clamped into `[min, max]`. */
	value: number;
	/** Lower threshold, clamped into `[min, max]` (defaults to `min`). */
	low: number;
	/** Upper threshold, clamped into `[low, max]` (defaults to `max`). */
	high: number;
	/** Optimum point, clamped into `[min, max]` (defaults to the midpoint). */
	optimum: number;
	/** Fill ratio as a `0..100` percentage. */
	percent: number;
}
