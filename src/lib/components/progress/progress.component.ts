import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { HubMetricsColor } from '../../models/metrics.types';
import { HubProgressSize } from './progress.types';

/**
 * Linear progress bar for a determinate or indeterminate read-only value.
 *
 * The component owns no hard-coded colour values: the semantic `color` input
 * maps to the host application's `--hub-sys-color-*` token family and drives the
 * indicator through the local `--hub-progress-accent` slot. When
 * {@link indeterminate} is set the bar loops a looping animation and drops
 * `aria-valuenow`, matching the ARIA `progressbar` contract for an unknown value.
 */
@Component({
	selector: 'hub-progress',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './progress.component.html',
	styleUrl: './progress.component.scss',
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'hub-progress',
		role: 'progressbar',
		'[class]': 'hostClasses()',
		'[style.--hub-progress-accent]': 'accentVar()',
		'[style.--hub-progress-value]': 'valueCss()',
		'[attr.aria-valuemin]': '0',
		'[attr.aria-valuemax]': 'max()',
		'[attr.aria-valuenow]': 'ariaValueNow()',
		'[attr.aria-label]': 'label() || null',
		'[attr.aria-busy]': 'indeterminate() || null'
	}
})
export class HubProgressComponent {
	/** Current progress value, expressed on the `[0, max]` scale. */
	readonly value = input<number>(0);

	/** Upper bound of the progress scale. */
	readonly max = input<number>(100);

	/** Renders a looping bar for work of unknown duration; drops `aria-valuenow`. */
	readonly indeterminate = input(false, { transform: booleanAttribute });

	/** Semantic accent driving the indicator colour. */
	readonly color = input<HubMetricsColor>('primary');

	/** Size token controlling the bar thickness. */
	readonly size = input<HubProgressSize>('md');

	/** Whether the rounded percentage is rendered next to the bar. */
	readonly showValue = input(false, { transform: booleanAttribute });

	/** Accessible label describing what the progress bar measures. */
	readonly label = input<string>('');

	/** Value clamped to the `[0, max]` range; `0` when `max` is not positive. */
	protected readonly clampedValue = computed(() => {
		const max = this.max();
		if (max <= 0) {
			return 0;
		}
		return Math.min(max, Math.max(0, this.value()));
	});

	/** Completion ratio as a `0..100` percentage; `0` while indeterminate. */
	protected readonly percent = computed(() => {
		const max = this.max();
		if (this.indeterminate() || max <= 0) {
			return 0;
		}
		return (this.clampedValue() / max) * 100;
	});

	/** Indicator width as a CSS length consumed by `--hub-progress-value`. */
	protected readonly valueCss = computed(() => `${this.percent()}%`);

	/** Rounded percentage label shown when {@link showValue} is enabled. */
	protected readonly displayValue = computed(() => `${Math.round(this.percent())}%`);

	/** `aria-valuenow`, omitted (null) while the bar is {@link indeterminate}. */
	protected readonly ariaValueNow = computed(() => (this.indeterminate() ? null : this.clampedValue()));

	/** Local accent slot resolved from the semantic {@link color} input. */
	protected readonly accentVar = computed(
		() => `var(--hub-sys-color-${this.color()}, var(--hub-sys-color-primary, #0d6efd))`
	);

	/** Host modifier classes derived from the signal inputs. */
	protected readonly hostClasses = computed(() =>
		['hub-progress', `hub-progress--${this.size()}`, this.indeterminate() ? 'hub-progress--indeterminate' : '']
			.filter(Boolean)
			.join(' ')
	);
}
