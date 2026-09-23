import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
The module's own pages and panels are package code like aform's or desktop's, so they answer to the
same floor: every --sc-* name they read must be defined there, and none may carry a fallback, which
is a second copy of the default that renders only when the floor is missing.
*/

const NUXT = join(__dirname, '..')
const FLOOR = join(NUXT, '..', 'themes', 'default', 'default.css')
const RUNTIME = join(NUXT, 'src', 'runtime')

const collect = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) collect(path, out)
		else if (/\.(?:vue|ts|css)$/.test(entry)) out.push(path)
	}
	return out
}

const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

const definedTokens = (): Set<string> => {
	const declaration = /^\s*(--sc-[a-zA-Z0-9-]+)\s*:/gm
	return new Set(Array.from(withoutComments(readFileSync(FLOOR, 'utf8')).matchAll(declaration), m => m[1]))
}

const references = (pattern: RegExp): string[] =>
	collect(RUNTIME).flatMap(file =>
		Array.from(
			withoutComments(readFileSync(file, 'utf8')).matchAll(pattern),
			match => `${match[1]} at ${file.replace(`${NUXT}/`, '')}`
		)
	)

describe('nuxt runtime --sc-* tokens', { tags: ['unit'] }, () => {
	it('reads only tokens the floor defines', () => {
		const defined = definedTokens()
		const unknown = references(/var\(\s*(--sc-[a-zA-Z0-9-]+)\s*[,)]/g).filter(
			entry => !defined.has(entry.split(' ')[0])
		)

		expect(unknown).toEqual([])
	})

	it('reads every token without a fallback', () => {
		expect(references(/var\(\s*(--sc-[a-zA-Z0-9-]+)\s*,/g)).toEqual([])
	})

	it('paints no colour of its own: no literal, and no mix against white or black', () => {
		// A hand-written tint of a floor colour is a second copy of a floor token, and stops following the theme.
		const styles = (file: string) =>
			Array.from(withoutComments(readFileSync(file, 'utf8')).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), m => m[1])
				.join('\n')
				.replace(/\/\/[^\n]*/g, '')
		const literal =
			/(#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)|color-mix\([^;]*\b(?:white|black)\b[^;]*\))/g
		const painted = collect(RUNTIME)
			.filter(file => file.endsWith('.vue'))
			.flatMap(file => Array.from(styles(file).matchAll(literal), m => `${m[1]} at ${file.replace(`${NUXT}/`, '')}`))

		expect(painted).toEqual([])
	})

	it('reads a floor and a runtime that actually parsed', () => {
		expect(definedTokens().size).toBeGreaterThan(50)
		expect(references(/var\(\s*(--sc-[a-zA-Z0-9-]+)\s*[,)]/g).length).toBeGreaterThan(20)
	})
})
