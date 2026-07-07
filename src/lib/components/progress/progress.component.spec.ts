import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubProgressComponent } from './progress.component';

@Component({
	standalone: true,
	imports: [HubProgressComponent],
	template: `<hub-progress
		[value]="value"
		[max]="max"
		[color]="color"
		[size]="size"
		[indeterminate]="indeterminate"
		[label]="label"
	/>`
})
class HostProgressComponent {
	value = 25;
	max = 100;
	color = 'success';
	size = 'lg' as const;
	indeterminate = false;
	label = 'Upload';
}

describe('HubProgressComponent', () => {
	async function render(): Promise<{ host: HostProgressComponent; el: HTMLElement }> {
		const fixture = await TestBed.configureTestingModule({ imports: [HostProgressComponent] }).createComponent(
			HostProgressComponent
		);
		fixture.detectChanges();
		return { host: fixture.componentInstance, el: fixture.nativeElement.querySelector('hub-progress') };
	}

	it('renders as a progressbar and reflects the value into the ARIA attributes', async () => {
		const { el } = await render();

		expect(el.getAttribute('role')).toBe('progressbar');
		expect(el.getAttribute('aria-valuemin')).toBe('0');
		expect(el.getAttribute('aria-valuemax')).toBe('100');
		expect(el.getAttribute('aria-valuenow')).toBe('25');
		expect(el.getAttribute('aria-label')).toBe('Upload');
		expect(el.className).toContain('hub-progress--lg');
		expect(el.style.getPropertyValue('--hub-progress-value')).toBe('25%');
		expect(el.style.getPropertyValue('--hub-progress-accent')).toBe('var(--hub-sys-color-success, success)');
	});

	it('resolves a semantic colour to the ds token with a raw fallback', async () => {
		const fixture = await TestBed.configureTestingModule({ imports: [HostProgressComponent] }).createComponent(
			HostProgressComponent
		);
		fixture.componentInstance.color = 'primary';
		fixture.detectChanges();
		const el: HTMLElement = fixture.nativeElement.querySelector('hub-progress');

		expect(el.style.getPropertyValue('--hub-progress-accent')).toBe('var(--hub-sys-color-primary, primary)');
	});

	it('passes a literal colour value through unchanged', async () => {
		const fixture = await TestBed.configureTestingModule({ imports: [HostProgressComponent] }).createComponent(
			HostProgressComponent
		);
		fixture.componentInstance.color = '#ff0000';
		fixture.detectChanges();
		const el: HTMLElement = fixture.nativeElement.querySelector('hub-progress');

		expect(el.style.getPropertyValue('--hub-progress-accent')).toBe('#ff0000');
	});

	it('clamps an out-of-range value to the max', async () => {
		const fixture = await TestBed.configureTestingModule({ imports: [HostProgressComponent] }).createComponent(
			HostProgressComponent
		);
		fixture.componentInstance.value = 250;
		fixture.detectChanges();
		const el: HTMLElement = fixture.nativeElement.querySelector('hub-progress');

		expect(el.getAttribute('aria-valuenow')).toBe('100');
		expect(el.style.getPropertyValue('--hub-progress-value')).toBe('100%');
	});

	it('omits aria-valuenow while indeterminate and marks the host busy', async () => {
		const fixture = await TestBed.configureTestingModule({ imports: [HostProgressComponent] }).createComponent(
			HostProgressComponent
		);
		fixture.componentInstance.indeterminate = true;
		fixture.detectChanges();
		const el: HTMLElement = fixture.nativeElement.querySelector('hub-progress');

		expect(el.hasAttribute('aria-valuenow')).toBe(false);
		expect(el.getAttribute('aria-busy')).toBe('true');
		expect(el.className).toContain('hub-progress--indeterminate');
	});
});
