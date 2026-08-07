// Integration tests for nuxt-grafserv with mocked dependencies

import type { EventHandler, H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { GrafservRuntimeConfig } from '../../../src/types'

// Mock virtual modules FIRST before any other imports
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {},
}))

vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

// Mock H3 and Nitro
const mockSetResponseStatus = vi.fn()
vi.mock('h3', () => ({
	defineEventHandler: (handler: EventHandler) => handler,
	setResponseStatus: mockSetResponseStatus,
}))

const mockUseRuntimeConfig = vi.fn((): { grafserv: Record<string, unknown> } => ({
	grafserv: {
		type: 'schema',
		schema: 'test.graphql',
		url: '/graphql/',
	},
}))
vi.mock('nitropack/runtime', () => ({
	useRuntimeConfig: mockUseRuntimeConfig,
}))

// Mock grafserv
const mockHandleGraphQLEvent = vi.fn()
const mockHandleGraphiqlEvent = vi.fn()
const mockHandleGraphiqlStaticEvent = vi.fn()

vi.mock('grafserv/h3/v1', () => ({
	grafserv: vi.fn(() => ({
		handleGraphQLEvent: mockHandleGraphQLEvent,
		handleGraphiqlEvent: mockHandleGraphiqlEvent,
		handleGraphiqlStaticEvent: mockHandleGraphiqlStaticEvent,
	})),
}))

// Mock grafast
vi.mock('grafast', () => ({
	makeGrafastSchema: vi.fn(() => ({ _type: 'MockSchema' })),
}))

// Mock graphql-tools
vi.mock('@graphql-tools/load', () => ({
	loadTypedefs: vi.fn(() =>
		Promise.resolve([
			{
				document: { kind: 'Document', definitions: [] },
			},
		])
	),
}))

vi.mock('@graphql-tools/graphql-file-loader', () => ({
	GraphQLFileLoader: vi.fn(),
}))

describe('Nuxt Grafserv Integration', { tags: ['e2e', 'nuxt', 'graphql'] }, () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.resetModules() // Reset module cache to pick up fresh mocks
	})

	describe('Module Configuration', () => {
		it('should export module as a function', async () => {
			const module = await import('../../../src/module')
			expect(module.default).toBeDefined()
			expect(typeof module.default).toBe('function')
			// defineNuxtModule returns a setup function
		})

		it('should export module', async () => {
			const module = await import('../../../src/module')
			// Check that default export exists (the module function)
			expect(module.default).toBeDefined()
			expect(typeof module.default).toBe('function')
		})
	})

	describe('Handler Endpoints', () => {
		it('should call handleGraphiqlStaticEvent for static assets handler', async () => {
			const { clearGrafservCache } = await import('../../../src/runtime/handler')
			await clearGrafservCache()

			const staticHandler = await import('../../../src/runtime/ruru-static')

			const mockEvent = {
				node: {
					req: {
						url: '/ruru-static/app.js',
						method: 'GET',
						headers: {},
					},
				},
				context: { params: {} },
			}

			await staticHandler.default(mockEvent as H3Event)

			expect(mockHandleGraphiqlStaticEvent).toHaveBeenCalledWith(mockEvent)
		})
	})

	describe('GraphiQL gating (handler.ts)', () => {
		const loadHandler = async (graphiql: boolean | undefined) => {
			mockUseRuntimeConfig.mockReturnValue({
				grafserv: { type: 'schema', schema: 'test.graphql', url: '/graphql/', graphiql },
			})
			const mod = await import('../../../src/runtime/handler')
			await mod.clearGrafservCache()
			return mod.default
		}

		it('lets a browser GET through to grafserv when the IDE is enabled', async () => {
			const handler = await loadHandler(true)
			const event = { method: 'GET', node: { req: { url: '/graphql/', method: 'GET', headers: {} } } }
			await handler(event as unknown as H3Event)
			expect(mockHandleGraphQLEvent).toHaveBeenCalledWith(event)
		})

		it('404s a browser GET without touching grafserv when the IDE is disabled', async () => {
			const handler = await loadHandler(false)
			const event = { method: 'GET', node: { req: { url: '/graphql/', method: 'GET', headers: {} } } }
			const result = await handler(event as unknown as H3Event)
			expect(mockHandleGraphQLEvent).not.toHaveBeenCalled()
			expect(mockHandleGraphiqlEvent).not.toHaveBeenCalled()
			expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 404)
			expect(result).toBe('GraphiQL is disabled')
		})

		it('still serves GraphQL POSTs when the IDE is disabled', async () => {
			const handler = await loadHandler(false)
			const event = { method: 'POST', node: { req: { url: '/graphql/', method: 'POST', headers: {} } } }
			await handler(event as unknown as H3Event)
			expect(mockHandleGraphQLEvent).toHaveBeenCalledWith(event)
		})

		it('falls back to the GraphiQL UI when enabled and the request is not a GraphQL operation', async () => {
			mockHandleGraphQLEvent.mockResolvedValueOnce(null)
			const handler = await loadHandler(true)
			const event = { method: 'POST', node: { req: { url: '/graphql/', method: 'POST', headers: {} } } }
			await handler(event as unknown as H3Event)
			expect(mockHandleGraphiqlEvent).toHaveBeenCalledWith(event)
		})
	})

	// This block was called "Preset Merging" and asserted the opposite of its name: schema mode never
	// merges a preset, because it calls `grafserv({ schema })` directly. The configs it passed carried
	// an inline `preset` key that `SchemaConfig` does not declare and the handler never reads.
	describe('Grafserv construction', () => {
		it('constructs grafserv from the resolved runtime config in schema mode', async () => {
			const { grafserv } = await import('grafserv/h3/v1')
			const { getGrafservInstance, clearGrafservCache } = await import('../../../src/runtime/handler')

			await clearGrafservCache()

			const options: GrafservRuntimeConfig = {
				type: 'schema',
				schema: 'test.graphql',
				url: '/graphql/',
				graphiql: false,
			}

			await getGrafservInstance(options)

			expect(grafserv).toHaveBeenCalledWith(
				expect.objectContaining({
					schema: expect.anything(),
				})
			)
		})
	})
})
