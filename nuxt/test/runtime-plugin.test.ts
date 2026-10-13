import { GQL_SCALAR_MAP, WELL_KNOWN_SCALARS } from '@stonecrop/schema'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type App, createApp } from 'vue'

vi.mock('nuxt/app', async () => {
	const { createMemoryHistory, createRouter } = await import('vue-router')
	const router = createRouter({ history: createMemoryHistory(), routes: [] })
	return { defineNuxtPlugin: (plugin: unknown) => plugin, useRouter: () => router }
})

const { installCodeEditor } = vi.hoisted(() => ({ installCodeEditor: vi.fn() }))

vi.mock('@stonecrop/code-editor', async importOriginal => {
	const actual = await importOriginal<typeof import('@stonecrop/code-editor')>()
	installCodeEditor.mockImplementation(actual.install)
	return { ...actual, install: installCodeEditor }
})

type FakeNuxtApp = {
	vueApp: App
	$config: { app: { baseURL: string }; public: { stonecrop: { monacoPath: string } } }
}

// `defineNuxtPlugin` is mocked to return its argument, so the default export is the plugin object.
const { default: plugin } = (await import('../src/runtime/plugin')) as unknown as {
	default: { setup: (nuxt: FakeNuxtApp) => void }
}

const setUp = (baseURL = '/') => {
	const app = createApp({})
	plugin.setup({
		vueApp: app,
		$config: { app: { baseURL }, public: { stonecrop: { monacoPath: '/stonecrop-monaco/9.9.9' } } },
	})
	return app
}

describe('the runtime plugin', { tags: ['unit', 'nuxt'] }, () => {
	beforeEach(() => {
		installCodeEditor.mockClear()
	})

	it('registers every component the doctype generator gives a scalar', () => {
		const app = setUp()

		const generated = new Set(Object.values({ ...GQL_SCALAR_MAP, ...WELL_KNOWN_SCALARS }).map(field => field.component))
		expect(generated.has('ACodeEditor')).toBe(true)
		expect([...generated].filter(name => !app.component(name))).toEqual([])
	})

	it('points the code editor at the Monaco files the module serves', () => {
		const app = setUp()
		expect(installCodeEditor).toHaveBeenCalledWith(app, { vsPath: '/stonecrop-monaco/9.9.9/vs' })
	})

	it('serves those files under the app base URL', () => {
		const app = setUp('/fab/')
		expect(installCodeEditor).toHaveBeenCalledWith(app, { vsPath: '/fab/stonecrop-monaco/9.9.9/vs' })
	})
})
