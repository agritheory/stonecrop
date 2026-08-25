import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
Guards the one direction that fails silently: a component reading a --sc-* token the
floor never defines. Such a declaration is invalid at computed-value time, so it does
not throw — it computes to `unset` and the element quietly renders wrong. Nothing else
in the pipeline can see it.

The reverse direction (a floor token nothing reads) is deliberately not asserted: several
tokens are referenced only from inside the floor itself, by the badge variants.
*/

const FLOOR = join(__dirname, '..', '..', 'themes', 'default', 'default.css')
const SRC = join(__dirname, '..', 'src')

/** Tokens this package supplies at runtime as inline styles, so the floor must not define them. */
const COMPONENT_SUPPLIED: string[] = []

const collect = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) collect(path, out)
		else if (/\.(vue|ts|css)$/.test(entry)) out.push(path)
	}
	return out
}

/**
 * Comments are stripped first. A commented-out declaration still matches the shape of a live
 * one, so leaving them in would let a token that no longer reaches the browser keep counting
 * as defined — the guard would pass while the component rendered unstyled.
 */
const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

const definedTokens = (): Set<string> => {
	const declaration = /^\s*(--sc-[a-zA-Z0-9-]+)\s*:/gm
	const floor = withoutComments(readFileSync(FLOOR, 'utf8'))
	return new Set(Array.from(floor.matchAll(declaration), m => m[1]))
}

const consumedTokens = (): Map<string, string[]> => {
	// A name built by interpolation (`var(--sc-badge-${variant}-accent)`) cannot be resolved
	// statically, so it is skipped rather than reported as a phantom partial name.
	const reference = /var\(\s*(--sc-[a-zA-Z0-9-]+)\s*[,)]/g
	const found = new Map<string, string[]>()
	for (const file of collect(SRC)) {
		for (const match of withoutComments(readFileSync(file, 'utf8')).matchAll(reference)) {
			const token = match[1]
			found.set(token, [...(found.get(token) ?? []), file])
		}
	}
	return found
}

describe('--sc-* token floor', { tags: ['unit'] }, () => {
	it('defines every token this package consumes', () => {
		const defined = definedTokens()
		const undefinedTokens = Array.from(consumedTokens())
			.filter(([token]) => !defined.has(token) && !COMPONENT_SUPPLIED.includes(token))
			.map(([token, files]) => `${token} — consumed at ${files.map(f => f.replace(SRC, 'src')).join(', ')}`)

		expect(undefinedTokens).toEqual([])
	})

	it('reads a floor that actually parsed', () => {
		// Guards the guard: a moved or renamed floor would otherwise make the test above
		// pass by finding nothing to check.
		expect(definedTokens().size).toBeGreaterThan(50)
		expect(consumedTokens().size).toBeGreaterThan(0)
	})
})
