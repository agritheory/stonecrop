/**
 * The module registers the base `home` layout. Nuxt's own `addLayout` already dedupes within one
 * instance — it keeps the first entry and reports NUXT_B4014 — so any guard the module adds on top
 * of that must be scoped to the Nuxt instance. A module-scope latch survives the ESM module cache,
 * which silently leaves every *subsequent* Nuxt in the process (a dev restart, a multi-app build,
 * an in-process test harness) with no `home` layout at all.
 */
import { describe, it, expect, vi } from 'vitest'

const addLayout = vi.fn()

vi.mock('@nuxt/kit', () => ({
	addComponent: vi.fn(),
	addImportsDir: vi.fn(),
	addLayout,
	addPlugin: vi.fn(),
	addServerHandler: vi.fn(),
	createResolver: () => ({ resolve: (...segments: string[]) => segments.join('/') }),
	defineNuxtModule: (definition: unknown) => definition,
	extendPages: vi.fn(),
	resolvePath: vi.fn((p: string) => Promise.resolve(p)),
	useLogger: () => ({ log: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() }),
}))

function stubNuxt() {
	return {
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
}

describe('module home layout registration', { tags: ['unit'] }, () => {
	it('registers the home layout for every Nuxt instance in the process', async () => {
		// `defineNuxtModule` is stubbed above to return the definition verbatim, so the default
		// export here is the raw `{ setup }` object rather than the wrapped NuxtModule.
		const { default: rawModule } = await import('../src/module')
		const setup = (rawModule as unknown as { setup: (o: unknown, n: unknown) => Promise<void> }).setup

		await setup({ doctypesDir: 'doctypes' }, stubNuxt())
		expect(addLayout).toHaveBeenCalledTimes(1)

		await setup({ doctypesDir: 'doctypes' }, stubNuxt())
		expect(addLayout).toHaveBeenCalledTimes(2)
	})
})
