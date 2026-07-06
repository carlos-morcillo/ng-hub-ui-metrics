import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubMeterComponent } from './meter.component';

@Component({
	standalone: true,
	imports: [HubMeterComponent],
	template: `<hub-meter [value]="value" [min]="min" [max]="max" [low]="low" [high]="high" [optimum]="optimum" />`
})
class HostMeterComponent {
	value = 0.5;
	min = 0;
	max = 1;
	low: number | undefined = 0.3;
	high: number | undefined = 0.7;
	optimum: number | undefined = 0.9;
}

describe('HubMeterComponent', () => {
	async function render(patch: Partial<HostMeterComponent> = {}): Promise<HTMLElement> {
		const fixture = await TestBed.configureTestingModule({ imports: [HostMeterComponent] }).createComponent(
			HostMeterComponent
		);
		Object.assign(fixture.componentInstance, patch);
		fixture.detectChanges();
		return fixture.nativeElement.querySelector('hub-meter');
	}

	it('renders as a meter and reflects the value into the ARIA attributes', async () => {
		const el = await render();

		expect(el.getAttribute('role')).toBe('meter');
		expect(el.getAttribute('aria-valuemin')).toBe('0');
		expect(el.getAttribute('aria-valuemax')).toBe('1');
		expect(el.getAttribute('aria-valuenow')).toBe('0.5');
		expect(el.style.getPropertyValue('--hub-meter-value')).toBe('50%');
	});

	it('selects the optimum band inside the [low, high] plateau', async () => {
		const el = await render({ value: 0.5 });

		expect(el.getAttribute('data-band')).toBe('optimum');
		expect(el.className).toContain('hub-meter--optimum');
	});

	it('selects the low band below the plateau (value under optimum)', async () => {
		const el = await render({ value: 0.1 });

		expect(el.getAttribute('data-band')).toBe('low');
		expect(el.className).toContain('hub-meter--low');
	});

	it('selects the high band above the plateau (value over optimum)', async () => {
		const el = await render({ value: 0.95, optimum: 0.1 });

		expect(el.getAttribute('data-band')).toBe('high');
		expect(el.className).toContain('hub-meter--high');
	});

	it('guards a degenerate range without dividing by zero', async () => {
		const el = await render({ min: 5, max: 5, value: 5 });

		expect(el.style.getPropertyValue('--hub-meter-value')).toBe('0%');
	});
});
