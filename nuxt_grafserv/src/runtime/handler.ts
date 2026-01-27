import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefs } from '@graphql-tools/load'
import { grafserv } from 'grafserv/h3/v1'
import { makeGrafastSchema } from 'grafast'
import type { GraphQLSchema, DocumentNode } from 'graphql'
import { defineEventHandler, type H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import type { ModuleOptions } from '../types'

// Cache for the grafserv instance
let grafservInstance: ReturnType<typeof grafserv> | null = null
let cachedSchema: GraphQLSchema | null = null

/**
 * Load typeDefs from file path(s) using graphql-tools
 */
async function loadTypeDefsFromFiles(schemaPath: string | string[]): Promise<DocumentNode[]> {
	const paths = Array.isArray(schemaPath) ? schemaPath : [schemaPath]
	const sources = await loadTypedefs(paths, {
		loaders: [new GraphQLFileLoader()],
	})
	return sources.map(source => source.document!).filter(Boolean)
}

/**
 * Check if value is a PostGraphile instance
 */
function isPostGraphileInstance(value: unknown): value is { getSchema(): unknown; getSchemaResult(): unknown } {
	return value !== null && typeof value === 'object' && 'getSchema' in value && typeof value.getSchema === 'function'
}

/**
 * Get the GraphQL schema based on configuration
 */
async function getSchema(options: ModuleOptions): Promise<GraphQLSchema> {
	if (cachedSchema) {
		return cachedSchema
	}

	let schema: GraphQLSchema

	// Handle PostGraphile instance
	if (isPostGraphileInstance(options.schema)) {
		console.debug('[@stonecrop/nuxt-grafserv] Using PostGraphile instance for schema')
		try {
			// Try getSchemaResult first (returns { schema, resolvedPreset })
			if ('getSchemaResult' in options.schema && typeof options.schema.getSchemaResult === 'function') {
				const result = await options.schema.getSchemaResult()
				schema = result.schema
			} else {
				// Fall back to getSchema
				schema = await options.schema.getSchema()
			}
			console.debug('[@stonecrop/nuxt-grafserv] PostGraphile schema loaded successfully')
		} catch (error) {
			console.error('[@stonecrop/nuxt-grafserv] Error loading PostGraphile schema:', error)
			throw error
		}
	} else if (typeof options.schema === 'function') {
		// Schema provider function
		schema = await options.schema()
	} else if (options.schema) {
		// Load from file path(s)
		const typeDefDocs = await loadTypeDefsFromFiles(options.schema)

		// Load resolvers if provided (optional - PostGraphile doesn't need this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const objects: Record<string, any> = {}
		if (options.resolvers) {
			try {
				// Import resolvers through virtual module so Nitro's alias applies
				// This ensures resolver's grafast imports use the same instance as the handler
				// @ts-expect-error - virtual module
				const resolverModule = await import('#internal/grafserv/resolvers')
				const resolvers = resolverModule.default || resolverModule
				console.debug('[@stonecrop/nuxt-grafserv] Resolvers loaded:', Object.keys(resolvers))

				// Transform resolvers to Grafast objects structure
				// Auto-detect if resolvers already have plans key (new format)
				// Otherwise, wrap them (backward compatibility)
				for (const typeName of Object.keys(resolvers)) {
					const typeResolvers = resolvers[typeName]

					// Check if already in objects format with plans key
					if (typeResolvers && typeof typeResolvers === 'object' && 'plans' in typeResolvers) {
						// Already in new format: { TypeName: { plans: { fieldName: fn } } }
						objects[typeName] = typeResolvers
					} else {
						// Old format: { TypeName: { fieldName: fn } }
						// Auto-wrap for backward compatibility
						objects[typeName] = { plans: typeResolvers }
					}
				}
			} catch (e) {
				console.error('[@stonecrop/nuxt-grafserv] Error loading resolvers:', e)
				console.warn('[@stonecrop/nuxt-grafserv] Continuing without resolvers - this is normal for PostGraphile setups')
			}
		} else {
			console.debug(
				'[@stonecrop/nuxt-grafserv] No resolvers specified - using schema-only mode (normal for PostGraphile)'
			)
		}

		// Important: Create schema lazily to ensure it's in the right execution context
		try {
			schema = makeGrafastSchema({
				typeDefs: typeDefDocs,
				objects,
			})
			console.debug('[@stonecrop/nuxt-grafserv] Grafast schema created successfully')
		} catch (error) {
			console.error('[@stonecrop/nuxt-grafserv] Error creating Grafast schema:', error)
			throw error
		}
	} else {
		throw new Error(
			'[@stonecrop/nuxt-grafserv] No schema provided. Configure schema path, provider function, or PostGraphile instance.'
		)
	}

	cachedSchema = schema
	return schema
}

/**
 * Get or create the grafserv instance
 * Exported for use by separate handler files
 */
export async function getGrafservInstance(options: ModuleOptions): Promise<ReturnType<typeof grafserv>> {
	if (grafservInstance) {
		console.log('[@stonecrop/nuxt-grafserv] Returning cached grafserv instance')
		return grafservInstance
	}

	const schema = await getSchema(options)
	grafservInstance = grafserv({ schema, preset: options.preset })

	console.log('[@stonecrop/nuxt-grafserv] Grafserv instance created')
	return grafservInstance
}

/**
 * Clear the cached instances (useful for development hot reload)
 */
export async function clearGrafservCache(): Promise<void> {
	grafservInstance = null
	cachedSchema = null
	console.log('[@stonecrop/nuxt-grafserv] Cache cleared')
}

/**
 * Main H3 event handler for GraphQL requests and Ruru UI
 * Routes between GraphQL operations and GraphiQL UI based on request type
 */
export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig()
	const options = config.grafserv as ModuleOptions

	try {
		// Get grafserv instance
		const serv = await getGrafservInstance(options)

		// Try GraphQL handler first - it will return null if not a GraphQL operation
		const graphqlResult = await serv.handleGraphQLEvent(event)
		if (graphqlResult !== null) {
			return graphqlResult
		}

		// If not a GraphQL operation, try GraphiQL UI handler
		return serv.handleGraphiqlEvent(event)
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error in GraphQL handler:', error)
		throw error
	}
})
