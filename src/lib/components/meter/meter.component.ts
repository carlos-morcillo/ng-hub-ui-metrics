import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { HubMeterBand, HubMeterResolved } from './meter.types';

/**
 * Graded gauge bar following HTML `<meter>` semantics for a scalar measurement
 * within a known range (disk usage, score, capacity…).
 *
 * The filled colour reflects which band the value falls in relative to the
 * `optimum` point: inside the `[low, high]` plateau it uses the optimum fill,
 * below `optimum` and outside the plateau the low fill, above it the high fill.
 * Every band colour derives from a `--hub-meter-*-bg` token so no colour is
 * hard-coded.
 */
@Component({
	selector: 'hub-meter',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './meter.component.html',
	styleUrl: './meter.component.scss',
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'hub-meter',
		role: 'meter',
		'[class]': 'hostClasses()',
		'[attr.data-band]': 'band()',
		'[style.--hub-meter-value]': 'valueCss()',
		'[attr.aria-valuemin]': 'resolved().min',
		'[attr.aria-valuemax]': 'resolved().max',
		'[attr.aria-valuenow]': 'resolved().value',
		'[attr.aria-valuetext]': 'valueText()'
	}
})
export class HubMeterComponent {
	/** Current measurement, expressed on the `[min, max]` scale. */
	readonly value = input<number>(0);

	/** Lower bound of the scale. */
	readonly min = input<number>(0);

	/** Upper bound of the scale. */
	readonly max = input<number>(1);

	/** Upper limit of the "low" region; defaults to {@link min} when omitted. */
	readonly low = input<number | undefined>(undefined);

	/** Lower limit of the "high" region; defaults to {@link max} when omitted. */
	readonly high = input<number | undefined>(undefined);

	/** Preferred point of the range; defaults to the midpoint when omitted. */
	readonly optimum = input<number | undefined>(undefined);

	/** Fully resolved, clamped bounds derived from the raw inputs. */
	protected readonly resolved = computed<HubMeterResolved>(() => {
		const min = this.min();
		const max = Math.max(min, this.max());
		const clamp = (candidate: number): number => Math.min(max, Math.max(min, candidate));

		const value = clamp(this.value());
		const low = this.low() === undefined ? min : clamp(this.low() as number);
		const high = this.high() === undefined ? max : Math.max(low, clamp(this.high() as number));
		const optimum = this.optimum() === undefined ? (min + max) / 2 : clamp(this.optimum() as number);
		const span = max - min;
		const percent = span <= 0 ? 0 : ((value - min) / span) * 100;

		return { min, max, value, low, high, optimum, percent };
	});

	/**
	 * The band the value falls in: `optimum` inside the `[low, high]` plateau,
	 * otherwise `low`/`high` depending on which side of `optimum` the value sits.
	 */
	protected readonly band = computed<HubMeterBand>(() => {
		const { value, low, high, optimum } = this.resolved();
		if (value >= low && value <= high) {
			return 'optimum';
		}
		return value < optimum ? 'low' : 'high';
	});

	/** Fill width as a CSS length consumed by `--hub-meter-value`. */
	protected readonly valueCss = computed(() => `${this.resolved().percent}%`);

	/** Human-readable `aria-valuetext` (rounded percentage plus band). */
	protected readonly valueText = computed(() => `${Math.round(this.resolved().percent)}% (${this.band()})`);

	/** Host modifier classes derived from the computed band. */
	protected readonly hostClasses = computed(() => ['hub-meter', `hub-meter--${this.band()}`].join(' '));
}
