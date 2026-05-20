import { describe, it, expect } from 'vitest'

import { createDebugPlugin } from '../src/debug'

describe('createDebugPlugin', { tags: ['unit', 'graphql'] }, () => {
	it('creates a plugin without arguments', () => {
		const plugin = createDebugPlugin()
		expect(plugin).toBeDefined()
	})

	it('creates a plugin with logPlans disabled', () => {
		const plugin = createDebugPlugin({ logPlans: false })
		expect(plugin).toBeDefined()
	})

	it('creates a plugin with logTiming enabled', () => {
		const plugin = createDebugPlugin({ logTiming: true })
		expect(plugin).toBeDefined()
	})

	it('creates a plugin with both options set', () => {
		const plugin = createDebugPlugin({ logPlans: true, logTiming: true })
		expect(plugin).toBeDefined()
	})
})
