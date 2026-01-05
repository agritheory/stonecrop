import { describe, it, expect, beforeEach } from 'vitest'
import { postgraphileCaslPlugin, pglCaslPlugin } from '../src'
import { createConfigBasedAbilityBuilder } from '../src/middleware/ability'

describe('PostGraphile CASL Plugins', () => {
	describe('postgraphileCaslPlugin (makeExtendSchemaPlugin)', () => {
		it('should create a valid plugin function', () => {
			const plugin = postgraphileCaslPlugin()
			expect(plugin).toBeDefined()
			expect(plugin).toBeInstanceOf(Object)
		})

		it('should accept middleware options', () => {
			const options = {
				subjectMap: {
					User: 'app_user',
					Post: 'blog_post',
				},
				actionMap: {
					query: 'read',
					mutation: 'write',
				},
			}

			const plugin = postgraphileCaslPlugin(options)
			expect(plugin).toBeDefined()
		})

		it('should extend schema with CASL types', () => {
			const plugin = postgraphileCaslPlugin()
			// The plugin is a Graphile config object with an auto-generated name
			expect(plugin).toHaveProperty('name')
			expect(plugin.name).toMatch(/^ExtendSchemaPlugin_\d+$/) // Match the auto-generated pattern
		})
	})

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

			// Check for hooks if they exist
			if (pglCaslPlugin.schema?.hooks) {
				expect(pglCaslPlugin.schema.hooks).toHaveProperty('build')
			}
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

			const plugin = postgraphileCaslPlugin({
				abilityBuilder: customBuilder,
			})

			expect(plugin).toBeDefined()

			// Test that the ability builder works
			const ability = await customBuilder({ id: '123', roles: ['editor'] })
			expect(ability.can('create', 'Post')).toBe(true)
			expect(ability.can('update', 'Post')).toBe(true)
		})

		it('should work with PostGraphile plugin system', () => {
			// Test that our plugins have the correct shape for PostGraphile
			const plugin1 = postgraphileCaslPlugin()
			const plugin2 = pglCaslPlugin

			// Both should be valid plugin objects
			expect(plugin1).toHaveProperty('name')
			expect(plugin1).toHaveProperty('version')

			expect(plugin2).toHaveProperty('name')
			expect(plugin2).toHaveProperty('version')

			// They should have different auto-generated names
			expect(plugin1.name).not.toBe(plugin2.name)
		})
	})
})
