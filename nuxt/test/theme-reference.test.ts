import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
The themes reference page restates the floor's defaults by hand, so nothing but this test notices
when the two disagree.
*/

const NUXT = join(__dirname, '..')
const FLOOR = join(NUXT, '..', 'themes', 'default', 'default.css')
const REFERENCE = join(NUXT, 'documentation', 'content', 'reference', 'themes.md')

const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

const floorDefaults = (): Map<string, string> => {
	const declaration = /^\s*(--sc-[a-zA-Z0-9-]+)\s*:([^;]+);/gm
	const css = withoutComments(readFileSync(FLOOR, 'utf8'))
	return new Map(Array.from(css.matchAll(declaration), match => [match[1], match[2].trim()]))
}

const reference = readFileSync(REFERENCE, 'utf8')

// A table row `| `--sc-x` | `value` |` or an inline pair `--sc-x` `value`.
const documentedDefaults = (): Map<string, string> => {
	const tableRow = /^\|\s*`(--sc-[a-zA-Z0-9-]+)`\s*\|\s*`([^`]+)`/gm
	const inlinePair = /`(--sc-[a-zA-Z0-9-]+)`\s+`([^`]+)`/g
	return new Map([...reference.matchAll(tableRow), ...reference.matchAll(inlinePair)].map(m => [m[1], m[2].trim()]))
}

// "Each variant (`neutral`, `success`, ...) defines `--sc-badge-{variant}-bg`, `-text` and `-accent`."
const documentedBadgeTokens = (): string[] => {
	const sentence = reference.match(
		/Each variant \(([^)]+)\) defines `--sc-badge-\{variant\}-bg`, `-text` and `-accent`/
	)
	if (!sentence) throw new Error('themes.md no longer describes the badge variants in the sentence this test reads')
	const variants = Array.from(sentence[1].matchAll(/`([a-z]+)`/g), m => m[1])
	return variants.flatMap(variant => ['bg', 'text', 'accent'].map(part => `--sc-badge-${variant}-${part}`))
}

describe('themes reference page', { tags: ['unit'] }, () => {
	it('states every default exactly as the floor declares it', () => {
		const floor = floorDefaults()
		const disagreements = [...documentedDefaults()]
			.filter(([token, value]) => floor.get(token) !== value)
			.map(([token, value]) => `${token}: page says ${value}, floor says ${floor.get(token) ?? '(not declared)'}`)

		expect(disagreements).toEqual([])
	})

	it('names every token the floor declares', () => {
		const named = new Set([...reference.matchAll(/`(--sc-[a-zA-Z0-9-]+)`/g)].map(m => m[1]))
		for (const token of documentedBadgeTokens()) named.add(token)
		const unnamed = [...floorDefaults().keys()].filter(token => !named.has(token))

		expect(unnamed).toEqual([])
	})

	it('reads enough of both files to mean something', () => {
		expect(floorDefaults().size).toBeGreaterThan(80)
		expect(documentedDefaults().size).toBeGreaterThan(55)
		expect(documentedBadgeTokens()).toHaveLength(15)
	})
})
