import { describe, it, expect } from 'vitest'

import { pglCaslPlugin } from '../src'
import { createConfigBasedAbilityBuilder } from '../src/middleware/ability'

describe('PostGraphile CASL Plugins', { tags: ['unit', 'graphql'] }, () => {
	describe('pglCaslPlugin (extendSchema)', () => {
		it('should be a valid extendSchema plugin object', () => {
			expect(pglCaslPlugin).toBeDefined()
			expect(pglCaslPlugin).toBeInstanceOf(Object) // It's an object, not a function
			expect(pglCaslPlugin).toHaveProperty('name')
			expect(pglCaslPlugin).toHaveProperty('version')
		})

		it('should have schema extension properties', () => {
			// The plugin object has specific properties
			expect(pglCaslPlugin).toHaveProperty('name')
			expect(pglCaslPlugin.name).toMatch(/^ExtendSchemaPlugin_/)

			// Check for schema extension function
			expect(pglCaslPlugin).toHaveProperty('schema')
			expect(typeof pglCaslPlugin.schema).toBe('object')

			// extendSchema always produces schema.hooks unconditionally
			expect(pglCaslPlugin.schema?.hooks).toBeDefined()
			expect(pglCaslPlugin.schema?.hooks).toHaveProperty('build')
		})

		it('should define schema extensions when executed', () => {
			// Since extendSchema creates a plugin object, we need to test differently
			// The actual schema extension happens when PostGraphile processes the plugin

			// We can verify the plugin has the expected structure
			expect(pglCaslPlugin).toHaveProperty('name')
			expect(pglCaslPlugin).toHaveProperty('version')

			// The schema extension function is wrapped inside the plugin
			// and will be executed by PostGraphile
		})
	})

	describe('Ability Integration', () => {
		it('should create abilities with custom builder', async () => {
			const customBuilder = createConfigBasedAbilityBuilder({
				defaultRules: [{ action: 'read', subject: 'Query' }],
				roles: {
					editor: [
						{ action: 'create', subject: 'Post' },
						{ action: 'update', subject: 'Post' },
					],
				},
			})

			// Test that the ability builder works
			const ability = await customBuilder({ id: '123', roles: ['editor'] })
			expect(ability.can('create', 'Post')).toBe(true)
			expect(ability.can('update', 'Post')).toBe(true)
		})

		it('should work with PostGraphile plugin system', () => {
			// Test that our plugin has the correct shape for PostGraphile
			expect(pglCaslPlugin).toHaveProperty('name')
			expect(pglCaslPlugin).toHaveProperty('version')
		})
	})
})
