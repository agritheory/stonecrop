/**
 * Guards `resolve.dedupe` for the client singletons the inlined packages take as peers.
 *
 * The failure this protects against is silent. A package reached by `link:` — the ordinary way to
 * try a local Stonecrop fix against a consumer app — sits outside the consumer, so its peers
 * resolve from its own tree instead. Two Pinia copies each hold their own inject keys, and a store
 * resolved against the wrong one is simply never active: no error, no warning, just a component
 * reading undefined state.
 *
 * The list is derived from what the packages declare rather than restated, so a package that
 * later adds a client peer fails here instead of shipping a second copy to linked consumers.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, vi } from 'vitest'

import { STONECROP_PACKAGES } from '../src/module'

vi.mock('@nuxt/kit', () => ({
	addComponent: vi.fn(),
	addImportsDir: vi.fn(),
	addLayout: vi.fn(),
	addPlugin: vi.fn(),
	addServerHandler: vi.fn(),
	createResolver: () => ({ resolve: (...segments: string[]) => segments.join('/') }),
	defineNuxtModule: (definition: unknown) => definition,
	extendPages: vi.fn(),
	resolvePath: vi.fn((p: string) => Promise.resolve(p)),
	useLogger: () => ({ log: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() }),
}))

// Peers Nuxt already dedupes, so the module must not restate them. `vue` comes from
// @nuxt/vite-builder's base config; `vue-router` is pushed onto this same array by Nuxt's pages
// module, which always runs here because the module calls extendPages. Listing either would only
// duplicate the entry — verified against a playground build, not assumed.
const DEDUPED_BY_NUXT = new Set(['vue', 'vue-router'])

const workspaceRoot = resolve(__dirname, '../..')

/** Peer declarations read from the workspace sources, which are present whether or not a given
 * package is installed under `nuxt/`. */
function inlinedPackagePeers(): Map<string, string[]> {
	const found = new Map<string, string[]>()
	for (const entry of readdirSync(workspaceRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue
		let manifest: { name?: string; peerDependencies?: Record<string, string> }
		try {
			manifest = JSON.parse(readFileSync(resolve(workspaceRoot, entry.name, 'package.json'), 'utf-8'))
		} catch {
			continue
		}
		if (manifest.name && STONECROP_PACKAGES.includes(manifest.name)) {
			found.set(manifest.name, Object.keys(manifest.peerDependencies ?? {}))
		}
	}
	return found
}

async function runSetup() {
	const { default: rawModule } = await import('../src/module')
	const setup = (rawModule as unknown as { setup: (o: unknown, n: unknown) => Promise<void> }).setup
	const nuxt = {
		options: {
			dev: false,
			srcDir: '/app',
			rootDir: '/app',
			css: [],
			alias: {},
			vite: {},
			runtimeConfig: {},
			build: { transpile: [] },
			nitro: {},
			modules: [],
		},
		hook: vi.fn(),
		hooks: { hook: vi.fn() },
	}
	await setup({ docbuilder: false, doctypesDir: 'doctypes' }, nuxt)
	return nuxt
}

describe('client singleton dedupe', { tags: ['unit'] }, () => {
	const peers = inlinedPackagePeers()

	it('reads every inlined package to check against', () => {
		// Without this the coverage assertion below could pass by finding nothing at all.
		expect([...peers.keys()].toSorted()).toEqual([...STONECROP_PACKAGES].toSorted())
	})

	it('dedupes every declared client peer that Nuxt does not already handle', async () => {
		const required = [...new Set([...peers.values()].flat())].filter(dep => !DEDUPED_BY_NUXT.has(dep)).toSorted()
		const nuxt = await runSetup()
		const dedupe = (nuxt.options.vite as { resolve?: { dedupe?: string[] } }).resolve?.dedupe ?? []

		expect(
			required.filter(dep => !dedupe.includes(dep)),
			`A package declares these as peers and nothing dedupes them. Under a linked install ` +
				`each resolves from this repo's tree rather than the consumer's, giving the app a ` +
				`second copy whose inject keys never match — silently, with no error.`
		).toEqual([])
	})

	it('leaves the peers Nuxt owns to Nuxt', async () => {
		const nuxt = await runSetup()
		const dedupe = (nuxt.options.vite as { resolve?: { dedupe?: string[] } }).resolve?.dedupe ?? []

		expect(dedupe.filter(dep => DEDUPED_BY_NUXT.has(dep))).toEqual([])
	})
})
