import type { DataClient } from '@stonecrop/schema'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useNuxtApp, type NuxtApp } from 'nuxt/app'
import { useStonecropRegistry } from '../src/runtime/app/composables/useStonecropRegistry'

// ---------------------------------------------------------------------------
// useStonecropRegistry composable — unit tests
//
// These tests mock `nuxt/app`'s `useNuxtApp` to inject a fake Nuxt app context
// that simulates what the @stonecrop/nuxt plugin provides after installation.
// ---------------------------------------------------------------------------

vi.mock('nuxt/app', () => ({
	useNuxtApp: vi.fn(),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRegistry(overrides: Record<string, unknown> = {}) {
	return {
		getMeta: undefined as unknown,
		registry: {},
		addDoctype: vi.fn(),
		...overrides,
	}
}

function makeStonecrop(overrides: Record<string, unknown> = {}) {
	return {
		setClient: vi.fn(),
		getClient: vi.fn().mockReturnValue(undefined),
		dispatchAction: vi.fn().mockResolvedValue({ success: true, data: null, error: null }),
		...overrides,
	}
}

function makeNuxtApp(registry: unknown, stonecrop: unknown) {
	return {
		$registry: registry,
		$stonecrop: stonecrop,
	}
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useStonecropRegistry', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the raw registry instance', () => {
		const registry = makeRegistry()
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as unknown as NuxtApp)

		const result = useStonecropRegistry()
		expect(result.registry).toBe(registry)
	})

	it('throws when registry is not available', () => {
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)

		expect(() => useStonecropRegistry()).toThrow('[useStonecropRegistry]')
	})

	describe('setMeta', () => {
		it('sets getMeta on the registry', () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as unknown as NuxtApp)

			const mockGetMeta = vi.fn()
			useStonecropRegistry().setMeta(mockGetMeta)

			expect(registry.getMeta).toBe(mockGetMeta)
		})

		it('replaces an existing getMeta function', () => {
			const originalGetMeta = vi.fn()
			const registry = makeRegistry({ getMeta: originalGetMeta })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as unknown as NuxtApp)

			const newGetMeta = vi.fn()
			useStonecropRegistry().setMeta(newGetMeta)

			expect(registry.getMeta).toBe(newGetMeta)
			expect(registry.getMeta).not.toBe(originalGetMeta)
		})
	})

	describe('setClient', () => {
		it('sets the data client on the Stonecrop instance', () => {
			const registry = makeRegistry()
			const stonecrop = makeStonecrop()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

			const mockClient: DataClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			useStonecropRegistry().setClient(mockClient)

			expect(stonecrop.setClient).toHaveBeenCalledWith(mockClient)
		})

		it('throws when Stonecrop instance is not available', () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, undefined) as unknown as NuxtApp)

			const mockClient: DataClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}

			expect(() => useStonecropRegistry().setClient(mockClient)).toThrow('Stonecrop instance is not available')
		})
	})

	describe('getClient', () => {
		it('returns the current data client', () => {
			const registry = makeRegistry()
			const mockClient: DataClient = {
				getMeta: vi.fn(),
				getRecord: vi.fn(),
				getRecords: vi.fn(),
				runAction: vi.fn(),
			}
			const stonecrop = makeStonecrop({ getClient: vi.fn().mockReturnValue(mockClient) })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

			const result = useStonecropRegistry().getClient()

			expect(result).toBe(mockClient)
		})

		it('returns undefined when no client is set', () => {
			const registry = makeRegistry()
			const stonecrop = makeStonecrop({ getClient: vi.fn().mockReturnValue(undefined) })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

			const result = useStonecropRegistry().getClient()

			expect(result).toBeUndefined()
		})
	})

	describe('dispatchAction', () => {
		it('dispatches an action via the Stonecrop instance', async () => {
			const registry = makeRegistry()
			const mockResult = { success: true, data: { id: '1' }, error: null }
			const stonecrop = makeStonecrop({ dispatchAction: vi.fn().mockResolvedValue(mockResult) })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

			const doctype = { name: 'Task', slug: 'task' }
			const result = await useStonecropRegistry().dispatchAction(doctype, 'SUBMIT', ['1'])

			expect(stonecrop.dispatchAction).toHaveBeenCalledWith(doctype, 'SUBMIT', ['1'])
			expect(result).toEqual(mockResult)
		})

		it('throws when Stonecrop instance is not available', async () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, undefined) as unknown as NuxtApp)

			const { dispatchAction } = useStonecropRegistry()
			await expect(dispatchAction({ name: 'Task' }, 'SUBMIT')).rejects.toThrow('Stonecrop instance is not available')
		})
	})

	it('setMeta and setClient can be used together', () => {
		const registry = makeRegistry()
		const stonecrop = makeStonecrop()
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

		const { setMeta, setClient } = useStonecropRegistry()

		const getMeta = vi.fn()
		const mockClient: DataClient = {
			getMeta: vi.fn(),
			getRecord: vi.fn(),
			getRecords: vi.fn(),
			runAction: vi.fn(),
		}

		setMeta(getMeta)
		setClient(mockClient)

		expect(registry.getMeta).toBe(getMeta)
		expect(stonecrop.setClient).toHaveBeenCalledWith(mockClient)
	})
})
