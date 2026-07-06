/**
 * Optional colour thresholds for `hub-ring`, expressed in the same units as the
 * ring's `value` input.
 *
 * When the value drops below `low` the ring paints with `--hub-ring-low-color`;
 * when it reaches `high` it paints with `--hub-ring-high-color`; otherwise it
 * keeps the neutral `--hub-ring-indicator` colour.
 */
export interface HubRingThresholds {
	/** Value at or below which the ring is treated as "low". */
	low?: number;
	/** Value at or above which the ring is treated as "high". */
	high?: number;
}

/**
 * Colour band a `hub-ring` value falls into, driving the indicator stroke.
 */
export type HubRingBand = 'low' | 'default' | 'high';
