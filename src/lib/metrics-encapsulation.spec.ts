import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubMeterComponent } from './components/meter/meter.component';
import { HubProgressComponent } from './components/progress/progress.component';
import { HubRingComponent } from './components/ring/ring.component';

/** One `selector { … }` rule of the stylesheet as the build injects it into the document. */
interface StyleRule {
	selector: string;
	body: string;
}

/** A keyframe step (`0%`, `from`, `to`) — a rule, but not one that selects an element. */
const KEYFRAME_STEP = /^(from|to|\d+(\.\d+)?%)(\s*,\s*(from|to|\d+(\.\d+)?%))*$/;

/**
 * The rules the component actually ships, read back from the document rather than from the
 * `.scss` source. What decides whether encapsulation holds is the CSS that reaches the page,
 * after the build has compiled it and the shim has rewritten `:host` into an attribute
 * selector — the source says nothing about either.
 */
function shippedRules(prefix: string): StyleRule[] {
	const css = Array.from(document.querySelectorAll('style'))
		.map((style) => style.textContent ?? '')
		.filter((text) => text.includes(prefix))
		.join('\n')
		.replace(/\/\*[\s\S]*?\*\//g, '');

	const rules: StyleRule[] = [];
	// Nested at-rules (`@media`, `@keyframes`) are stepped over rather than parsed: their
	// wrapper never matches this pattern, and the rules inside them do.
	for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		const selector = match[1].trim();
		if (!KEYFRAME_STEP.test(selector)) {
			rules.push({ selector, body: match[2] });
		}
	}
	return rules;
}

/** Whether Angular's emulated-encapsulation shim has stamped this selector. */
const isScoped = (selector: string): boolean => selector.includes('_nghost-') || selector.includes('_ngcontent-');

describe.each([
	['hub-progress', HubProgressComponent as Type<unknown>],
	['hub-meter', HubMeterComponent as Type<unknown>],
	['hub-ring', HubRingComponent as Type<unknown>]
])('%s stylesheet', (prefix, component) => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [component] }).compileComponents();
		TestBed.createComponent(component).detectChanges();
	});

	/**
	 * The whole point of the change: nothing this component paints with can be reached — or
	 * broken — by a rule written elsewhere, because every selector it emits is stamped with
	 * its own marker attribute and matches nothing outside its view.
	 */
	it('emits no rule that escapes into the application cascade', () => {
		const escaped = shippedRules(prefix)
			.map((rule) => rule.selector)
			.filter((selector) => !isScoped(selector));

		expect(escaped).toEqual([]);
	});

	/**
	 * The token defaults are declared ON the host, which is what makes the global half
	 * unnecessary: a custom property inherits, so every element inside sees them. They stay
	 * inside `:where()` so their specificity is zero and `hub-metrics-theme()` — which emits
	 * `<scope> :where(.hub-…)` at (0,1,0) — still outranks them.
	 */
	it('declares its tokens on the host at zero specificity', () => {
		// The modifier blocks are the deliberate exception, and they are excluded by selector
		// rather than by token: a size or a band is an explicit instruction on this instance
		// and is meant to outrank the defaults. What is being pinned is that nothing else
		// declares above zero.
		const declaring = shippedRules(prefix).filter(
			(rule) => new RegExp(`--${prefix}-[a-z-]+\\s*:`).test(rule.body) && !rule.selector.includes(`${prefix}--`)
		);

		expect(declaring.length).toBeGreaterThan(0);
		for (const rule of declaring) {
			expect(rule.selector).toMatch(/^:where\(\[_nghost-[^\]]+\]\)$/);
		}
	});

	/** And the modifier blocks land on the host, which is the element carrying the class. */
	it('applies its modifier blocks to the host', () => {
		const modifiers = shippedRules(prefix).filter((rule) => rule.selector.includes(`${prefix}--`));

		expect(modifiers.length).toBeGreaterThan(0);
		for (const rule of modifiers) {
			expect(rule.selector).toMatch(new RegExp(`${prefix}--[a-z-]+[^\\s]*\\[_nghost-`));
		}
	});
});

describe('hub-progress host modifiers', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [HubProgressComponent] }).compileComponents();
		TestBed.createComponent(HubProgressComponent).detectChanges();
	});

	/**
	 * The modifier classes ride on the host element, which carries `_nghost` and never
	 * `_ngcontent`. A plain `.hub-progress--sm` rule would be rewritten with the content
	 * marker and silently stop matching, so the bar would keep its default thickness at
	 * every size — the exact failure this pins down.
	 */
	it('matches the size modifiers on the host, not on a descendant', () => {
		const sizes = shippedRules('hub-progress').filter((rule) => /hub-progress--(sm|md|lg)/.test(rule.selector));

		expect(sizes.length).toBe(3);
		for (const rule of sizes) {
			expect(rule.selector).toMatch(/hub-progress--(sm|md|lg)\[_nghost-/);
		}
	});

	/** Same for the state modifier, which reaches from the host down into the indicator. */
	it('reaches the indicator from the indeterminate host', () => {
		const indeterminate = shippedRules('hub-progress').filter((rule) =>
			rule.selector.includes('hub-progress--indeterminate')
		);

		expect(indeterminate.length).toBeGreaterThan(0);
		for (const rule of indeterminate) {
			expect(rule.selector).toMatch(
				/hub-progress--indeterminate\[_nghost-[^\]]+\]\s+\.hub-progress__indicator\[_ngcontent-/
			);
		}
	});
});
