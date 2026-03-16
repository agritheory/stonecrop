import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// useStonecropRegistry composable — unit tests
//
// These tests mock `nuxt/app`'s `useNuxtApp` to inject a fake Nuxt app context
// that simulates what the @stonecrop/nuxt plugin provides after installation.
// ---------------------------------------------------------------------------

// Mock the nuxt/app module before importing the composable
vi.mock('nuxt/app', () => ({
	useNuxtApp: vi.fn(),
}))

import { useNuxtApp } from 'nuxt/app'
import { useStonecropRegistry } from '../src/runtime/composables/useStonecropRegistry'

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
		_fetchRecord: undefined as unknown,
		_fetchRecords: undefined as unknown,
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
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as any)

		const result = useStonecropRegistry()
		expect(result.registry).toBe(registry)
	})

	it('throws when registry is not available', () => {
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(undefined, undefined) as any)

		expect(() => useStonecropRegistry()).toThrow('[useStonecropRegistry]')
	})

	describe('setMeta', () => {
		it('sets getMeta on the registry', () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as any)

			const mockGetMeta = vi.fn()
			useStonecropRegistry().setMeta(mockGetMeta)

			expect(registry.getMeta).toBe(mockGetMeta)
		})

		it('replaces an existing getMeta function', () => {
			const originalGetMeta = vi.fn()
			const registry = makeRegistry({ getMeta: originalGetMeta })
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, makeStonecrop()) as any)

			const newGetMeta = vi.fn()
			useStonecropRegistry().setMeta(newGetMeta)

			expect(registry.getMeta).toBe(newGetMeta)
			expect(registry.getMeta).not.toBe(originalGetMeta)
		})
	})

	describe('setFetchRecord', () => {
		it('sets _fetchRecord on the Stonecrop instance', () => {
			const registry = makeRegistry()
			const stonecrop = makeStonecrop()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as any)

			const fetchFn = vi.fn()
			useStonecropRegistry().setFetchRecord(fetchFn)

			expect(stonecrop._fetchRecord).toBe(fetchFn)
		})

		it('does nothing when Stonecrop instance is not available', () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, undefined) as any)

			// Should not throw
			expect(() => useStonecropRegistry().setFetchRecord(vi.fn())).not.toThrow()
		})
	})

	describe('setFetchRecords', () => {
		it('sets _fetchRecords on the Stonecrop instance', () => {
			const registry = makeRegistry()
			const stonecrop = makeStonecrop()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as any)

			const fetchFn = vi.fn()
			useStonecropRegistry().setFetchRecords(fetchFn)

			expect(stonecrop._fetchRecords).toBe(fetchFn)
		})

		it('does nothing when Stonecrop instance is not available', () => {
			const registry = makeRegistry()
			vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, undefined) as any)

			expect(() => useStonecropRegistry().setFetchRecords(vi.fn())).not.toThrow()
		})
	})

	it('all three setters can be chained on a single call', () => {
		const registry = makeRegistry()
		const stonecrop = makeStonecrop()
		vi.mocked(useNuxtApp).mockReturnValue(makeNuxtApp(registry, stonecrop) as any)

		const { setMeta, setFetchRecord, setFetchRecords } = useStonecropRegistry()

		const getMeta = vi.fn()
		const fetchRecord = vi.fn()
		const fetchRecords = vi.fn()

		setMeta(getMeta)
		setFetchRecord(fetchRecord)
		setFetchRecords(fetchRecords)

		expect(registry.getMeta).toBe(getMeta)
		expect(stonecrop._fetchRecord).toBe(fetchRecord)
		expect(stonecrop._fetchRecords).toBe(fetchRecords)
	})
})
