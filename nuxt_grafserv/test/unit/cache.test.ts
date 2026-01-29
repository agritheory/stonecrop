import { getQuery, createError, type H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock virtual modules FIRST
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {},
}))

vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

// Mock h3
vi.mock('h3', () => ({
	defineEventHandler: vi.fn(handler => handler),
	getQuery: vi.fn(),
	createError: vi.fn(),
}))

// Mock the handler module
const mockClearGrafservCache = vi.fn().mockResolvedValue(undefined)
vi.mock('../../src/runtime/handler', () => ({
	clearGrafservCache: mockClearGrafservCache,
}))

describe('Cache Handler', () => {
	let originalEnv: string | undefined
	const mockEvent = {} as H3Event

	beforeEach(() => {
		originalEnv = process.env.NODE_ENV
		vi.clearAllMocks()
		vi.resetModules() // Reset module cache between tests
	})

	afterEach(() => {
		process.env.NODE_ENV = originalEnv
	})

	describe('Environment Checks', () => {
		it('should allow cache API in development', async () => {
			process.env.NODE_ENV = 'development'
			vi.mocked(getQuery).mockReturnValue({ action: 'status' })

			const { default: cacheHandler } = await import('../../src/runtime/cache')
			const result = await cacheHandler(mockEvent)

			expect(result).toEqual({
				success: true,
				data: {
					message: 'Grafserv cache status - schema and server instance cached in memory',
				},
			})
		})

		it('should deny cache API in production', async () => {
			process.env.NODE_ENV = 'production'
			vi.mocked(getQuery).mockReturnValue({ action: 'clear' })

			const mockError = new Error('Cache API is disabled in production')
			vi.mocked(createError).mockReturnValue(mockError as ReturnType<typeof createError>)

			const { default: cacheHandler } = await import('../../src/runtime/cache')

			await expect(cacheHandler(mockEvent)).rejects.toThrow('Cache API is disabled in production')
		})
	})

	describe('Clear Action', () => {
		it('should clear cache when action is clear', async () => {
			process.env.NODE_ENV = 'development'
			vi.mocked(getQuery).mockReturnValue({ action: 'clear' })

			const { default: cacheHandler } = await import('../../src/runtime/cache')

			const result = await cacheHandler(mockEvent)

			expect(mockClearGrafservCache).toHaveBeenCalledOnce()
			expect(result).toEqual({
				success: true,
				message: 'Grafserv cache cleared',
			})
		})
	})

	describe('Status Action', () => {
		it('should return cache status when action is status', async () => {
			process.env.NODE_ENV = 'development'
			vi.mocked(getQuery).mockReturnValue({ action: 'status' })

			const { default: cacheHandler } = await import('../../src/runtime/cache')
			const result = await cacheHandler(mockEvent)

			expect(result).toEqual({
				success: true,
				data: {
					message: 'Grafserv cache status - schema and server instance cached in memory',
				},
			})
		})
	})

	describe('Invalid Action', () => {
		it('should return error for invalid action', async () => {
			process.env.NODE_ENV = 'development'
			vi.mocked(getQuery).mockReturnValue({ action: 'invalid' })

			const { default: cacheHandler } = await import('../../src/runtime/cache')
			const result = await cacheHandler(mockEvent)

			expect(result).toEqual({
				success: false,
				message: 'Invalid action',
				availableActions: ['clear', 'status'],
			})
		})

		it('should return error when no action provided', async () => {
			process.env.NODE_ENV = 'development'
			vi.mocked(getQuery).mockReturnValue({})

			const { default: cacheHandler } = await import('../../src/runtime/cache')
			const result = await cacheHandler(mockEvent)

			expect(result).toEqual({
				success: false,
				message: 'Invalid action',
				availableActions: ['clear', 'status'],
			})
		})
	})
})
