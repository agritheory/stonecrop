import type { DataClient } from '@stonecrop/schema'
import type { Doctype } from '@stonecrop/stonecrop'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useNuxtApp, type NuxtApp } from 'nuxt/app'
import { useStonecropRegistry } from '../src/runtime/app/composables/useStonecropRegistry'
import { useStonecropSetup } from '../src/runtime/app/composables/useStonecropSetup'

// ---------------------------------------------------------------------------
// useStonecropRegistry and useStonecropSetup composables — unit tests
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

const makeRegistry = vi.defineHelper((overrides: Record<string, unknown> = {}) => {
	return {
		getMeta: undefined as unknown,
		getDoctype: vi.fn().mockReturnValue({ doctype: 'Task', slug: 'task' }),
		registry: {},
		addDoctype: vi.fn(),
		...overrides,
	}
})

const makeStonecrop = vi.defineHelper((overrides: Record<string, unknown> = {}) => {
	return {
		setClient: vi.fn(),
		getClient: vi.fn().mockReturnValue(undefined),
		dispatchAction: vi.fn().mockResolvedValue({ success: true, data: null, error: null }),
		...overrides,
	}
})

const makeNuxtApp = vi.defineHelper((registry: unknown, stonecrop: unknown) => {
	return {
		$registry: registry,
		$stonecrop: stonecrop,
	}
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useStonecropRegistry', { tags: ['unit', 'nuxt'] }, () => {
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
			const mockDoctype = { doctype: 'Task', slug: 'task' }
			const registry = makeRegistry({ getDoctype: vi.fn().mockReturnValue(mockDoctype) })
			const mockResult = { success: true, data: { id: '1' }, error: null }
			const stonecrop = makeStonecrop({ dispatchAction: vi.fn().mockResolvedValue(mockResult) })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as unknown as NuxtApp)

			const result = await useStonecropRegistry().dispatchAction({ name: 'Task' }, 'SUBMIT', ['1'])

			expect(stonecrop.dispatchAction).toHaveBeenCalledWith(mockDoctype, 'SUBMIT', ['1'])
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

// ---------------------------------------------------------------------------
// useStonecropSetup Tests
// ---------------------------------------------------------------------------

describe('useStonecropSetup', { tags: ['unit', 'nuxt'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('registry and stonecrop getters', () => {
		it('returns undefined for registry when Stonecrop plugin has not run', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { registry } = useStonecropSetup()
			expect(registry).toBeUndefined()
		})

		it('returns undefined for stonecrop when Stonecrop plugin has not run', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { stonecrop } = useStonecropSetup()
			expect(stonecrop).toBeUndefined()
		})

		it('returns the registry instance when available', () => {
			const mockRegistry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(mockRegistry, undefined) as unknown as NuxtApp)
			const { registry } = useStonecropSetup()
			expect(registry).toBe(mockRegistry)
		})

		it('returns the stonecrop instance when available', () => {
			const mockStonecrop = makeStonecrop()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, mockStonecrop) as unknown as NuxtApp)
			const { stonecrop } = useStonecropSetup()
			expect(stonecrop).toBe(mockStonecrop)
		})
	})

	describe('isReady', () => {
		it('returns false when both registry and stonecrop are undefined', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { isReady } = useStonecropSetup()
			expect(isReady).toBe(false)
		})

		it('returns false when only registry is available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(makeRegistry(), undefined) as unknown as NuxtApp)
			const { isReady } = useStonecropSetup()
			expect(isReady).toBe(false)
		})

		it('returns false when only stonecrop is available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, makeStonecrop()) as unknown as NuxtApp)
			const { isReady } = useStonecropSetup()
			expect(isReady).toBe(false)
		})

		it('returns true when both registry and stonecrop are available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(makeRegistry(), makeStonecrop()) as unknown as NuxtApp)
			const { isReady } = useStonecropSetup()
			expect(isReady).toBe(true)
		})
	})

	describe('registerClient', () => {
		it('throws error when stonecrop is not available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { registerClient } = useStonecropSetup()
			const client = makeMockClient()

			expect(() => registerClient(client)).toThrow(
				'[useStonecropSetup] Stonecrop instance not available. ' +
					'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
			)
		})

		it('calls setClient on the stonecrop instance', () => {
			const mockStonecrop = makeStonecrop()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(makeRegistry(), mockStonecrop) as unknown as NuxtApp)
			const { registerClient } = useStonecropSetup()
			const client = makeMockClient()
			registerClient(client)

			expect(mockStonecrop.setClient).toHaveBeenCalledWith(client)
		})
	})

	describe('registerMeta', () => {
		it('throws error when registry is not available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { registerMeta } = useStonecropSetup()
			const metaFn = vi.fn()

			expect(() => registerMeta(metaFn)).toThrow(
				'[useStonecropSetup] Registry not available. ' +
					'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
			)
		})

		it('sets getMeta on the registry', () => {
			const mockRegistry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(mockRegistry, undefined) as unknown as NuxtApp)
			const { registerMeta } = useStonecropSetup()
			const metaFn = vi.fn()
			registerMeta(metaFn)

			expect(mockRegistry.getMeta).toBe(metaFn)
		})
	})

	describe('registerDoctype', () => {
		it('throws error when registry is not available', () => {
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)
			const { registerDoctype } = useStonecropSetup()
			const mockDoctype = {} as Doctype

			expect(() => registerDoctype(mockDoctype)).toThrow(
				'[useStonecropSetup] Registry not available. ' +
					'Ensure the @stonecrop/nuxt module is installed and its plugin has run before calling this.'
			)
		})

		it('calls addDoctype on the registry', () => {
			const mockRegistry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(mockRegistry, undefined) as unknown as NuxtApp)
			const { registerDoctype } = useStonecropSetup()
			const mockDoctype = {} as Doctype
			registerDoctype(mockDoctype)

			expect(mockRegistry.addDoctype).toHaveBeenCalledWith(mockDoctype)
		})
	})
})

// ---------------------------------------------------------------------------
// Context Separation Tests
// ---------------------------------------------------------------------------

describe('useStonecropSetup vs useStonecropRegistry context separation', { tags: ['unit', 'nuxt'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('useStonecropSetup returns undefined values without throwing (plugin context)', () => {
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)

		const { registry, stonecrop, isReady } = useStonecropSetup()

		expect(registry).toBeUndefined()
		expect(stonecrop).toBeUndefined()
		expect(isReady).toBe(false)
	})

	it('useStonecropRegistry throws when not initialized (component context)', () => {
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as unknown as NuxtApp)

		expect(() => useStonecropRegistry()).toThrow('use useStonecropSetup() instead')
	})

	it('both composables work when Stonecrop is fully initialized', () => {
		const mockRegistry = makeRegistry()
		const mockStonecrop = makeStonecrop()
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(mockRegistry, mockStonecrop) as unknown as NuxtApp)

		// useStonecropSetup works
		const setup = useStonecropSetup()
		expect(setup.isReady).toBe(true)
		expect(setup.registry).toBe(mockRegistry)
		expect(setup.stonecrop).toBe(mockStonecrop)

		// useStonecropRegistry also works
		const runtime = useStonecropRegistry()
		expect(runtime.registry).toBe(mockRegistry)
		expect(runtime.stonecrop).toBe(mockStonecrop)
	})
})

// ---------------------------------------------------------------------------
// Helper for mock client
// ---------------------------------------------------------------------------

const makeMockClient = vi.defineHelper((): DataClient => {
	return {
		getMeta: vi.fn(),
		getRecord: vi.fn(),
		getRecords: vi.fn(),
		runAction: vi.fn(),
	}
})
