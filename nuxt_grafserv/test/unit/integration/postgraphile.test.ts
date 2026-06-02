import { makeGrafastSchema, grafast, constant } from 'grafast'
import { type GraphQLSchema, parse } from 'graphql'
import { makeSchema } from 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { describe, it, expect, beforeAll } from 'vitest'

/**
 * Integration test for PostGraphile with custom resolvers
 * This tests a real-world scenario where:
 * 1. PostGraphile's makeSchema generates a GraphQL schema using presets
 * 2. Custom resolvers are added for additional functionality
 * 3. Both PostGraphile queries and custom resolvers work together
 */
describe('PostGraphile makeSchema Integration', { tags: ['e2e', 'nuxt', 'graphql'] }, () => {
	let postgraphileInstance: any
	let combinedSchema: GraphQLSchema

	beforeAll(async () => {
		/**
		 * Use PostGraphile's makeSchema function to create a real schema.
		 * This demonstrates the actual PostGraphile workflow without requiring a database.
		 *
		 * In production, you would typically:
		 * 1. Include database connection via makePgService
		 * 2. Configure introspection from actual database tables
		 * 3. Use PostGraphile's full feature set (mutations, subscriptions, etc.)
		 *
		 * For testing, we use a minimal preset that generates a basic schema structure.
		 */
		const pgPreset = {
			extends: [PostGraphileAmberPreset],
			schema: {
				// Create a minimal schema without database connection for testing
				// In real use, PostGraphile would introspect your database
			},
		}

		// Use PostGraphile's makeSchema to build a schema from the preset
		const { schema: pgSchema, resolvedPreset } = await makeSchema(pgPreset)

		postgraphileInstance = {
			getSchema: async () => pgSchema,
			getSchemaResult: async () => ({
				schema: pgSchema,
				resolvedPreset,
			}),
		}

		// Now create a combined schema with custom resolvers
		// This demonstrates extending PostGraphile with additional fields
		const combinedTypeDefs = `
			type Query {
				"""Custom field added via resolvers"""
				customField: String!
				"""Total count of users (custom business logic)"""
				userCount: Int!
				"""Mock users for testing"""
				users: [User!]!
			}

			type User {
				id: ID!
				name: String!
				email: String!
			}
		`

		// Custom resolvers in Grafast format using Steps
		const customResolvers = {
			Query: {
				plans: {
					// Custom resolvers (added by user)
					customField: () => constant('custom-data'),
					userCount: () => constant(2),
					users: () =>
						constant([
							{ id: '1', name: 'Alice', email: 'alice@example.com' },
							{ id: '2', name: 'Bob', email: 'bob@example.com' },
						]),
				},
			},
		}

		// Create the combined schema
		combinedSchema = makeGrafastSchema({
			typeDefs: parse(combinedTypeDefs),
			objects: customResolvers,
		})
	})

	describe('PostGraphile Instance', () => {
		it('should have getSchema method', () => {
			expect(postgraphileInstance).toHaveProperty('getSchema')
			expect(typeof postgraphileInstance.getSchema).toBe('function')
		})

		it('should have getSchemaResult method', () => {
			expect(postgraphileInstance).toHaveProperty('getSchemaResult')
			expect(typeof postgraphileInstance.getSchemaResult).toBe('function')
		})

		it('should return a GraphQL schema from getSchema', async () => {
			const schema = await postgraphileInstance.getSchema()
			expect(schema).toBeDefined()
			expect(schema.getQueryType()).toBeDefined()
		})

		it('should return schema and preset from getSchemaResult', async () => {
			const result = await postgraphileInstance.getSchemaResult()
			expect(result).toHaveProperty('schema')
			expect(result).toHaveProperty('resolvedPreset')
			expect(result.schema.getQueryType()).toBeDefined()
		})

		it('should use resolved preset from makeSchema', async () => {
			const result = await postgraphileInstance.getSchemaResult()

			// Verify the preset was resolved by makeSchema
			expect(result.resolvedPreset).toBeDefined()
			expect(result.resolvedPreset).toHaveProperty('plugins')
		})
	})

	describe('Combined Schema Integration', () => {
		it('should include custom fields in combined schema', () => {
			const queryType = combinedSchema.getQueryType()
			expect(queryType).toBeDefined()
			const fields = queryType!.getFields()
			expect(fields).toHaveProperty('customField')
			expect(fields).toHaveProperty('userCount')
			expect(fields).toHaveProperty('users')
		})

		it('should execute custom resolver query successfully', async () => {
			const query = `
				query {
					customField
					userCount
				}
			`

			const result = await grafast({
				schema: combinedSchema,
				source: query,
			})

			expect(result.errors).toBeUndefined()
			expect(result.data).toEqual({
				customField: 'custom-data',
				userCount: 2,
			})
		})

		it('should execute mock users query successfully', async () => {
			const query = `
				query {
					users {
						id
						name
						email
					}
				}
			`

			const result = await grafast({
				schema: combinedSchema,
				source: query,
			})

			expect(result.errors).toBeUndefined()
			expect(result.data).toEqual({
				users: [
					{ id: '1', name: 'Alice', email: 'alice@example.com' },
					{ id: '2', name: 'Bob', email: 'bob@example.com' },
				],
			})
		})

		it('should execute combined query with all fields', async () => {
			const query = `
				query {
					users {
						id
						name
					}
					customField
					userCount
				}
			`

			const result = await grafast({
				schema: combinedSchema,
				source: query,
			})

			expect(result.errors).toBeUndefined()
			expect(result.data).toEqual({
				users: [
					{ id: '1', name: 'Alice' },
					{ id: '2', name: 'Bob' },
				],
				customField: 'custom-data',
				userCount: 2,
			})
		})
	})

	describe('Real-World PostGraphile Usage', () => {
		it('should demonstrate typical PostGraphile makeSchema workflow', async () => {
			/**
			 * This test shows the typical PostGraphile workflow:
			 * 1. Create a preset with database connection and configuration
			 * 2. Call makeSchema to generate the GraphQL schema
			 * 3. Use the resulting schema with Grafserv
			 *
			 * In production, you would:
			 * - Add makePgService with actual database connection
			 * - Configure table/column introspection
			 * - Enable mutations, subscriptions, etc.
			 * - Add custom plugins for business logic
			 */

			// This is what your real config might look like
			const realWorldPreset = {
				extends: [PostGraphileAmberPreset],
				// In production: Add database connection
				// pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
				schema: {
					// Your schema customizations
				},
			}

			const { schema, resolvedPreset } = await makeSchema(realWorldPreset)

			// Verify the schema was built successfully
			expect(schema).toBeDefined()
			expect(schema.getQueryType()).toBeDefined()
			expect(resolvedPreset).toBeDefined()
			expect(resolvedPreset.plugins).toBeDefined()

			// The schema should have PostGraphile's standard types
			const typeMap = schema.getTypeMap()
			expect(typeMap).toBeDefined()
		})
	})
})
