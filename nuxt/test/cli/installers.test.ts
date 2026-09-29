import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { describe, expect, it, vi } from 'vitest'

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
vi.mock('../../src/cli/utils/plugin', () => ({ addPluginToGrafservConfig: vi.fn(async () => true) }))
vi.mock('../../src/module', () => ({ STONECROP_PACKAGES: [] }))
vi.mock('consola', () => ({
	default: { start: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

type Installer = (options: { cwd: string }) => Promise<boolean>

// Found rather than listed, so an installer added later is checked too.
const installerModules = import.meta.glob<Record<string, unknown>>('../../src/cli/installers/*.ts', { eager: true })
const installers = new Map<string, Installer>()
for (const exports of Object.values(installerModules)) {
	for (const [name, value] of Object.entries(exports)) {
		if (name.startsWith('install') && typeof value === 'function') installers.set(name, value as Installer)
	}
}

// The setup tool runs only in a Nuxt app, so an app it scaffolds already has these.
const ALREADY_IN_THE_APP = new Set(['nuxt'])

/** The package an import names, or undefined for a relative path, a Node built-in or an app alias. */
const packageOf = (specifier: string): string | undefined => {
	if (/^(?:[#.~]|node:)/.test(specifier)) return undefined
	const segments = specifier.split('/')
	return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
}

/** A template's script: a single-file component's `<script>` blocks, or the whole file. */
const scriptOf = (filename: string, source: string) =>
	filename.endsWith('.vue')
		? [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(([, script]) => script).join('\n')
		: source

/** Runs an installer, and returns the packages each script it copies imports, and the packages it adds. */
const scaffold = async (install: Installer) => {
	vi.clearAllMocks()
	expect(await install({ cwd: '/app' })).toBe(true)
	const added = vi.mocked(addDependencies).mock.calls.flatMap(([, dependencies]) => Object.keys(dependencies))
	const scripts = vi
		.mocked(loadTemplate)
		.mock.calls.map(([filename]) => filename)
		.filter(filename => /\.(?:ts|vue)$/.test(filename))
	const importsByScript = new Map<string, string[]>()
	for (const script of scripts) {
		const source = await readFile(new URL(`../../templates/${script}`, import.meta.url), 'utf-8')
		const packages = ts
			.preProcessFile(scriptOf(script, source))
			.importedFiles.map(({ fileName }) => packageOf(fileName))
			.filter(packageName => packageName !== undefined)
		importsByScript.set(script, packages)
	}
	return { added, importsByScript, imported: new Set([...importsByScript.values()].flat()) }
}

describe("the setup tool's installers", { tags: ['unit', 'nuxt'] }, () => {
	// pnpm lets an app import only the packages its own package.json names, so a copied file
	// importing one its installer leaves out fails to build in the new app.
	it.each([...installers])('%s adds every package the scripts it copies import', async (_name, install) => {
		const { added, imported } = await scaffold(install)
		const missing = [...imported].filter(
			packageName => !added.includes(packageName) && !ALREADY_IN_THE_APP.has(packageName)
		)
		expect(missing).toEqual([])
	})

	it('reads the imports of the scripts the frontend and server installers copy', async () => {
		const frontend = await scaffold(installers.get('installFrontend')!)
		expect(frontend.importsByScript.get('index.vue')).toContain('@stonecrop/desktop')
		expect(frontend.importsByScript.get('stonecrop.client.ts')).toContain('@stonecrop/stonecrop')

		const server = await scaffold(installers.get('installGrafserv')!)
		expect(server.importsByScript.get('resolvers.ts')).toContain('@stonecrop/graphql-middleware')
	})
})
