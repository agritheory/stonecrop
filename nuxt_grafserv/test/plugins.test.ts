import type { GraphileConfig } from 'graphile-config'
import { describe, it, expect } from 'vitest'

import type { ModuleOptions } from '../src/types'

describe('Grafserv Plugins', () => {
	describe('Plugin Integration', () => {
		it('should pass plugins to grafserv preset', async () => {
			const { getGrafservInstance, clearGrafservCache } = await import('../src/runtime/handler')

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
