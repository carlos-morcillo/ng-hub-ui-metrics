/**
 * Resolves a metrics accent colour into the CSS value bound to a component's
 * single `--hub-<comp>-accent` slot.
 *
 * A bareword (semantic name, registered accent or CSS named colour) maps to
 * `var(--hub-sys-color-<name>, <name>)` — the design-system token with the raw
 * word as its fallback — while a literal colour (`#hex`, `rgb()`, `oklch()`,
 * `var()`…) is passed through unchanged. Returns `null` when no colour is set so
 * the caller can drop the inline binding and let the `--hub-<comp>-accent` token
 * (default or theme override) take over.
 *
 * @param value Raw colour input, or `null`/`undefined` when unset.
 * @returns The resolved CSS accent value, or `null` when no colour is provided.
 */
export function resolveHubAccent(value: string | null | undefined): string | null {
	const color = value?.trim();
	if (!color) {
		return null;
	}
	return /^[a-zA-Z][\w-]*$/.test(color) ? `var(--hub-sys-color-${color}, ${color})` : color;
}
