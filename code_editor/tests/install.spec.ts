import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import { install } from '../src/index'

const { mockLoader } = vi.hoisted(() => ({ mockLoader: { init: vi.fn(), config: vi.fn() } }))

vi.mock('@monaco-editor/loader', () => ({ default: mockLoader }))

describe('install', { tags: ['unit'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('registers ACodeEditor', () => {
		const app = createApp({})
		install(app)
		expect(app.component('ACodeEditor')).toBeDefined()
	})

	it('points every editor at the Monaco files the app serves', () => {
		install(createApp({}), { vsPath: '/app/stonecrop-monaco/vs' })
		expect(mockLoader.config).toHaveBeenCalledWith({ paths: { vs: '/app/stonecrop-monaco/vs' } })
	})

	it('leaves the loader on its default source when no path is given', () => {
		install(createApp({}))
		expect(mockLoader.config).not.toHaveBeenCalled()
	})
})
