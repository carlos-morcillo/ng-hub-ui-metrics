import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubRingComponent } from './ring.component';

@Component({
	standalone: true,
	imports: [HubRingComponent],
	template: `<hub-ring [value]="value" [max]="max" [thresholds]="thresholds" [showValue]="showValue">Score</hub-ring>`
})
class HostRingComponent {
	value = 0.5;
	max = 1;
	thresholds: { low?: number; high?: number } | undefined = undefined;
	showValue = true;
}

/**
 * Every optional input supplied, so the per-instance overrides are exercised
 * without a binding that would feed `undefined` and mask an unset input.
 */
@Component({
	standalone: true,
	imports: [HubRingComponent],
	template: `<hub-ring [value]="0.5" [label]="'Lighthouse score'" [size]="96" [thickness]="'0.75rem'">Score</hub-ring>`
})
class HostConfiguredRingComponent {}

describe('HubRingComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HostRingComponent, HostConfiguredRingComponent] });
	});

	function render(patch: Partial<HostRingComponent> = {}): { host: HTMLElement; indicator: SVGCircleElement } {
		const fixture = TestBed.createComponent(HostRingComponent);
		Object.assign(fixture.componentInstance, patch);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement.querySelector('hub-ring');
		return { host, indicator: host.querySelector('.hub-ring__indicator') as SVGCircleElement };
	}

	function renderConfigured(): HTMLElement {
		const fixture = TestBed.createComponent(HostConfiguredRingComponent);
		fixture.detectChanges();
		return fixture.nativeElement.querySelector('hub-ring');
	}

	it('renders as a meter with the ARIA value contract', () => {
		const { host } = render();

		expect(host.getAttribute('role')).toBe('meter');
		expect(host.getAttribute('aria-valuemin')).toBe('0');
		expect(host.getAttribute('aria-valuemax')).toBe('1');
		expect(host.getAttribute('aria-valuenow')).toBe('0.5');
		expect(host.getAttribute('aria-valuetext')).toBe('50%');
	});

	it('maps the dash offset linearly for 0 / 50 / 100 %', () => {
		expect(render({ value: 0 }).indicator.getAttribute('stroke-dashoffset')).toBe('100');
		expect(render({ value: 0.5 }).indicator.getAttribute('stroke-dashoffset')).toBe('50');
		expect(render({ value: 1 }).indicator.getAttribute('stroke-dashoffset')).toBe('0');
	});

	it('normalizes value against a non-unit max', () => {
		const { host, indicator } = render({ value: 50, max: 100 });

		expect(host.getAttribute('aria-valuetext')).toBe('50%');
		expect(indicator.getAttribute('stroke-dashoffset')).toBe('50');
	});

	it('guards a zero max without dividing by zero', () => {
		expect(render({ value: 5, max: 0 }).indicator.getAttribute('stroke-dashoffset')).toBe('100');
	});

	it('names the ring from the consumer label and keeps the percentage in aria-valuetext', () => {
		const host = renderConfigured();

		expect(host.getAttribute('aria-label')).toBe('Lighthouse score');
		expect(host.getAttribute('aria-valuetext')).toBe('50%');
	});

	it('leaves aria-label off when no label is given, so the percentage is not the name', () => {
		const { host } = render();

		expect(host.getAttribute('aria-label')).toBeNull();
	});

	it('leaves the size and thickness tokens to the stylesheet when the inputs are unset', () => {
		const { host } = render();

		expect(host.style.getPropertyValue('--hub-ring-size')).toBe('');
		expect(host.style.getPropertyValue('--hub-ring-thickness')).toBe('');
	});

	it('writes size and thickness inline as a per-instance override', () => {
		const host = renderConfigured();

		expect(host.style.getPropertyValue('--hub-ring-size')).toBe('96px');
		expect(host.style.getPropertyValue('--hub-ring-thickness')).toBe('0.75rem');
	});

	it('recolours the indicator by threshold band', () => {
		expect(render({ value: 0.2, thresholds: { low: 0.4, high: 0.8 } }).host.className).toContain('hub-ring--low');
		expect(render({ value: 0.9, thresholds: { low: 0.4, high: 0.8 } }).host.className).toContain('hub-ring--high');
	});

	// The two thresholds are not symmetric, and the published typings say so: `low` is
	// exclusive, `high` inclusive. Pinning both edges keeps the .d.ts a consumer reads in
	// their IDE answerable to the code.
	it('excludes the low threshold from the low band and includes the high one', () => {
		expect(render({ value: 0.4, thresholds: { low: 0.4, high: 0.8 } }).host.className).not.toContain('hub-ring--low');
		expect(render({ value: 0.8, thresholds: { low: 0.4, high: 0.8 } }).host.className).toContain('hub-ring--high');
	});
});
