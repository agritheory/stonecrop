import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
A host that sets or reads a --sc-* name the floor never defines gets no error: an override of a
name nothing reads does nothing, and a read of a name nothing sets computes to `unset`.
*/

const NUXT = join(__dirname, '..')
const FLOOR = join(NUXT, '..', 'themes', 'default', 'default.css')
const HOST_APPS = readdirSync(NUXT, { withFileTypes: true })
	.filter(entry => entry.isDirectory() && existsSync(join(NUXT, entry.name, 'nuxt.config.ts')))
	.map(entry => join(NUXT, entry.name, 'app'))
const SHARED_HOST_STYLESHEETS = readdirSync(NUXT)
	.filter(entry => entry.endsWith('.css'))
	.map(entry => join(NUXT, entry))

const collect = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) collect(path, out)
		else if (/\.(?:vue|css)$/.test(entry)) out.push(path)
	}
	return out
}

const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

const floorTokens = (): Set<string> => {
	const declaration = /^\s*(--sc-[a-zA-Z0-9-]+)\s*:/gm
	return new Set(Array.from(withoutComments(readFileSync(FLOOR, 'utf8')).matchAll(declaration), m => m[1]))
}

const hostTokens = (): string[] => {
	const declarationOrRead = /^\s*(--sc-[a-zA-Z0-9-]+)\s*:|var\(\s*(--sc-[a-zA-Z0-9-]+)\s*[,)]/gm
	return [...HOST_APPS.flatMap(dir => collect(dir)), ...SHARED_HOST_STYLESHEETS].flatMap(file =>
		Array.from(
			withoutComments(readFileSync(file, 'utf8')).matchAll(declarationOrRead),
			match => `${match[1] ?? match[2]} at ${file.replace(`${NUXT}/`, '')}`
		)
	)
}

describe('host --sc-* tokens', { tags: ['unit'] }, () => {
	it('sets and reads only tokens the floor defines', () => {
		const defined = floorTokens()
		const unknown = hostTokens().filter(entry => !defined.has(entry.split(' ')[0]))

		expect(unknown).toEqual([])
	})

	it('scans hosts that actually use tokens', () => {
		expect(HOST_APPS).toHaveLength(3)
		expect(floorTokens().size).toBeGreaterThan(50)
		expect(hostTokens().length).toBeGreaterThan(0)
	})

	it('scans the stylesheet the example hosts share', () => {
		expect(hostTokens().some(entry => entry.endsWith(' at example-host.css'))).toBe(true)
	})
})
