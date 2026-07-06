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

describe('HubRingComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HostRingComponent] });
	});

	function render(patch: Partial<HostRingComponent> = {}): { host: HTMLElement; indicator: SVGCircleElement } {
		const fixture = TestBed.createComponent(HostRingComponent);
		Object.assign(fixture.componentInstance, patch);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement.querySelector('hub-ring');
		return { host, indicator: host.querySelector('.hub-ring__indicator') as SVGCircleElement };
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

	it('recolours the indicator by threshold band', () => {
		expect(render({ value: 0.2, thresholds: { low: 0.4, high: 0.8 } }).host.className).toContain('hub-ring--low');
		expect(render({ value: 0.9, thresholds: { low: 0.4, high: 0.8 } }).host.className).toContain('hub-ring--high');
	});
});
