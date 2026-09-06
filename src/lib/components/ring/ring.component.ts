import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { HubRingBand, HubRingThresholds } from './ring.types';

/**
 * Circular gauge (ring) rendering a normalized score as an SVG arc.
 *
 * The value is normalized against `max` (accepting either a `0..1` ratio or a
 * `0..max` figure) and drawn with a `stroke-dasharray`/`stroke-dashoffset` arc
 * over a `pathLength`-normalized circle, so the offset maps linearly to the
 * completion (100 at 0%, 0 at 100%). Optional {@link thresholds} recolour the
 * indicator through the `--hub-ring-low-color` / `--hub-ring-high-color` tokens;
 * a centred caption is projected through `<ng-content>`. That caption is decoration:
 * `role="meter"` is named by the author, so pass {@link label} to name the gauge.
 *
 * @example
 * ```html
 * <hub-ring [value]="0.82" [thresholds]="{ low: 0.4, high: 0.75 }" label="Quality score">Score</hub-ring>
 * ```
 */
@Component({
	selector: 'hub-ring',
	exportAs: 'hubGauge',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './ring.component.html',
	styleUrl: './ring.component.scss',
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'hub-ring',
		role: 'meter',
		'[class]': 'hostClasses()',
		'[style.--hub-ring-size]': 'sizeCss()',
		'[style.--hub-ring-thickness]': 'thicknessCss()',
		'[attr.aria-valuemin]': '0',
		'[attr.aria-valuemax]': 'max()',
		'[attr.aria-valuenow]': 'value()',
		'[attr.aria-valuetext]': 'displayValue()',
		'[attr.aria-label]': 'label() || null'
	}
})
export class HubRingComponent {
	/** Score value, expressed as a `0..1` ratio or a `0..max` figure. */
	readonly value = input<number>(0);

	/** Upper bound the {@link value} is normalized against. */
	readonly max = input<number>(1);

	/**
	 * Outer diameter of the ring (number → px, or any CSS length string), applied
	 * inline as a per-instance override. Omit it to let the `--hub-ring-size`
	 * token (default or theme override) drive the diameter.
	 */
	readonly size = input<number | string | undefined>(undefined);

	/**
	 * Stroke width of the ring (number → px, or any CSS length string), applied
	 * inline as a per-instance override. Omit it to let the
	 * `--hub-ring-thickness` token (default or theme override) drive the stroke.
	 */
	readonly thickness = input<number | string | undefined>(undefined);

	/** Optional colour thresholds recolouring the indicator by band. */
	readonly thresholds = input<HubRingThresholds | undefined>(undefined);

	/** Whether the rounded percentage is rendered in the centre. */
	readonly showValue = input(true, { transform: booleanAttribute });

	/**
	 * Accessible label describing what the ring scores. `role="meter"` takes its
	 * name from the author only, so neither the projected caption nor the centred
	 * percentage can name the gauge — this input is the only way to do it.
	 */
	readonly label = input<string>('');

	/** Total normalized path length of the SVG circle (see `pathLength`). */
	protected readonly PATH_LENGTH = 100;

	/** Completion ratio in `[0, 1]`; `0` when `max` is not positive. */
	protected readonly fraction = computed(() => {
		const max = this.max();
		if (max <= 0) {
			return 0;
		}
		return Math.min(1, Math.max(0, this.value() / max));
	});

	/** Completion as a `0..100` percentage. */
	protected readonly percent = computed(() => this.fraction() * 100);

	/** Dash pattern for the indicator (the full normalized path). */
	protected readonly dashArray = computed(() => this.PATH_LENGTH);

	/** Dash offset drawing the arc: `PATH_LENGTH` at 0%, `0` at 100%. */
	protected readonly dashOffset = computed(() => this.PATH_LENGTH * (1 - this.fraction()));

	/** Rounded percentage label shown in the centre when {@link showValue} is on. */
	protected readonly displayValue = computed(() => `${Math.round(this.percent())}%`);

	/** Colour band derived from the optional {@link thresholds} against the value. */
	protected readonly band = computed<HubRingBand>(() => {
		const thresholds = this.thresholds();
		if (!thresholds) {
			return 'default';
		}
		const value = this.value();
		if (thresholds.low !== undefined && value < thresholds.low) {
			return 'low';
		}
		if (thresholds.high !== undefined && value >= thresholds.high) {
			return 'high';
		}
		return 'default';
	});

	/** Host modifier classes derived from the computed band. */
	protected readonly hostClasses = computed(() => ['hub-ring', `hub-ring--${this.band()}`].join(' '));

	/** Ring diameter as a CSS length (numbers are treated as pixels). */
	protected readonly sizeCss = computed(() => this.toCssLength(this.size()));

	/** Stroke thickness as a CSS length (numbers are treated as pixels). */
	protected readonly thicknessCss = computed(() => this.toCssLength(this.thickness()));

	/**
	 * Normalizes a number|string dimension into a CSS length string, returning
	 * `null` when the input is unset so the inline binding is dropped altogether
	 * and the stylesheet token wins the cascade instead of being shadowed.
	 */
	private toCssLength(dimension: number | string | undefined): string | null {
		if (dimension === undefined) {
			return null;
		}
		return typeof dimension === 'number' ? `${dimension}px` : dimension;
	}
}
