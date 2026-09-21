import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { describe, expect, it, vi } from 'vitest'

import { installGrafserv } from '../../src/cli/installers/grafserv'
import { updateNuxtConfig } from '../../src/cli/utils/config'
import { addDependencies } from '../../src/cli/utils/package'
import { loadTemplate } from '../../src/cli/utils/templates'

// The app's files are never written; the templates are read from disk by the test itself.
vi.mock('node:fs', () => ({ existsSync: vi.fn(() => false) }))
vi.mock('node:fs/promises', async importOriginal => ({
	...(await importOriginal<typeof import('node:fs/promises')>()),
	mkdir: vi.fn(),
	writeFile: vi.fn(),
}))
vi.mock('../../src/cli/utils/templates', () => ({ loadTemplate: vi.fn(async () => '') }))
vi.mock('../../src/cli/utils/package', () => ({ addDependencies: vi.fn(async () => true) }))
vi.mock('../../src/cli/utils/config', () => ({ updateNuxtConfig: vi.fn(async () => true) }))
vi.mock('consola', () => ({
	default: { start: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

/** The package an import names, or undefined for a relative path, a Node built-in or an app alias. */
const packageOf = (specifier: string): string | undefined => {
	if (/^(?:[#.~]|node:)/.test(specifier)) return undefined
	const segments = specifier.split('/')
	return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
}

describe('the GraphQL server installer', { tags: ['unit', 'nuxt'] }, () => {
	// pnpm lets an app import only the packages its own package.json names, so a scaffolded file
	// importing one the installer leaves out fails to build in the new app.
	it('adds every package its scaffolded server files import', async () => {
		expect(await installGrafserv({ cwd: '/app' })).toBe(true)
		expect(updateNuxtConfig).toHaveBeenCalled()

		const added = vi.mocked(addDependencies).mock.calls.flatMap(([, dependencies]) => Object.keys(dependencies))
		const scripts = vi
			.mocked(loadTemplate)
			.mock.calls.map(([filename]) => filename)
			.filter(filename => filename.endsWith('.ts'))
		expect(scripts).toContain('resolvers.ts')

		const imported = new Set<string>()
		for (const script of scripts) {
			const source = await readFile(new URL(`../../templates/${script}`, import.meta.url), 'utf-8')
			for (const { fileName } of ts.preProcessFile(source).importedFiles) {
				const packageName = packageOf(fileName)
				if (packageName) imported.add(packageName)
			}
		}
		expect(imported).toContain('@stonecrop/graphql-middleware')
		expect([...imported].filter(packageName => !added.includes(packageName))).toEqual([])
	})
})
