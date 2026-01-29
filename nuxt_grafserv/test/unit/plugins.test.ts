import type { GraphileConfig } from 'graphile-config'
import { describe, it, expect, vi } from 'vitest'

import type { ModuleOptions } from '../../src/types'

// Mock virtual modules FIRST
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {},
}))

vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

// Mock grafserv
vi.mock('grafserv/h3/v1', () => ({
	grafserv: vi.fn(() => ({
		handleGraphQLEvent: vi.fn(),
		handleGraphiqlEvent: vi.fn(),
		getPreset: vi.fn(),
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

describe('Grafserv Plugins', () => {
	describe('Plugin Integration', () => {
		it('should pass plugins to grafserv preset', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../../src/runtime/handler')

			await clearGrafservCache()

			const plugin: GraphileConfig.Plugin = {
				name: 'integration-test-plugin',
				version: '1.0.0',
			}

			const options: ModuleOptions = {
				schema: 'type Query { hello: String }',
				preset: {
					plugins: [plugin],
					grafserv: {
						websockets: false,
					},
				},
			}

			const serv = await getGrafservInstance(options)
			expect(serv).toBeDefined()
		})
	})
})
