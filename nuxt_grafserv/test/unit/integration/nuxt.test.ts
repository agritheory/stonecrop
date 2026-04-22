import { StonecropPreset } from '@stonecrop/graphql-middleware'
import { makeSchema } from 'postgraphile'
import { describe, it, expect } from 'vitest'

/**
 * Nuxt Integration Tests (Unit-style)
 *
 * These tests verify PostGraphile integration patterns with nuxt-grafserv
 * without requiring a full Nuxt server environment.
 *
 * For full e2e tests with a running Nuxt server, see the playground directory.
 */

/**
 * Unit-style tests for Nuxt integration
 */
describe('Nuxt Integration - PostGraphile makeSchema', () => {
	describe('PostGraphile Schema Creation', () => {
		it('should create schema with makeSchema for Nuxt usage', async () => {
			const preset = {
				extends: [StonecropPreset],
				schema: {},
			}

			const { schema, resolvedPreset } = await makeSchema(preset)

			// Verify schema is ready for Nuxt
			expect(schema).toBeDefined()
			expect(schema.getQueryType()).toBeDefined()

			// Verify preset was resolved with all plugins
			expect(resolvedPreset).toBeDefined()
			expect(Array.isArray(resolvedPreset.plugins)).toBe(true)
			expect(resolvedPreset.plugins.length).toBeGreaterThan(0)
		})

		it('should create schema that can be used as PostGraphileInstance', async () => {
			const { schema, resolvedPreset } = await makeSchema({
				extends: [StonecropPreset],
			})

			// Create instance interface
			const instance = {
				getSchema: async () => schema,
				getSchemaResult: async () => ({ schema, resolvedPreset }),
			}

			// Verify it matches PostGraphileInstance interface
			const retrievedSchema = await instance.getSchema()
			expect(retrievedSchema).toBe(schema)

			const result = await instance.getSchemaResult()
			expect(result.schema).toBe(schema)
			expect(result.resolvedPreset).toBe(resolvedPreset)
		})
	})

	describe('Module Type Compatibility', () => {
		it('should accept PostGraphileInstance as schema option', async () => {
			const { schema, resolvedPreset } = await makeSchema({
				extends: [StonecropPreset],
			})

			// This demonstrates the type compatibility with ModuleOptions
			const postgraphileInstance = {
				getSchema: async () => schema,
				getSchemaResult: async () => ({ schema, resolvedPreset }),
			}

			// Module should accept this as schema option
			const moduleOptions = {
				schema: postgraphileInstance,
				// No resolvers needed with PostGraphile
				url: '/graphql/',
				graphiql: true,
			}

			expect(moduleOptions.schema).toBe(postgraphileInstance)
			expect(moduleOptions).not.toHaveProperty('resolvers')
		})
	})
})
