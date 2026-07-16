import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefs } from '@graphql-tools/load'
import { grafserv } from 'grafserv/h3/v1'
import { makeGrafastSchema } from 'grafast'
import type { GraphQLSchema, DocumentNode } from 'graphql'
import { defineEventHandler, setResponseStatus, type H3Event } from 'h3'
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
 * Get the GraphQL schema for 'schema' mode only.
 * PostGraphile mode uses pgl.createServ() which handles schema internally.
 */
async function getSchemaForSchemaMode(options: ModuleOptions & { type: 'schema' }): Promise<GraphQLSchema> {
	if (cachedSchema) {
		return cachedSchema
	}

	let schema: GraphQLSchema

	if (typeof options.schema === 'function') {
		// Schema provider function
		console.debug('[@stonecrop/nuxt-grafserv] Using schema provider function')
		schema = await options.schema()
	} else {
		// Load from file path(s)
		console.debug('[@stonecrop/nuxt-grafserv] Loading schema from file(s)')
		const typeDefDocs = await loadTypeDefsFromFiles(options.schema)

		// Load resolvers if provided
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- resolver module is dynamically imported; shape is unknown at compile time
		const objects: Record<string, any> = {}
		// @ts-expect-error - resolversPath exists on SchemaConfig runtime config
		if (options.resolversPath) {
			try {
				// Import resolvers through virtual module so Nitro's alias applies
				// @ts-expect-error - virtual module
				const resolverModule = await import('#internal/grafserv/resolvers')
				const resolvers = resolverModule.default || resolverModule
				console.debug('[@stonecrop/nuxt-grafserv] Resolvers loaded:', Object.keys(resolvers))

				// Resolvers should be in the format: { TypeName: { fieldName: resolver } }
				// or { TypeName: { plans: { fieldName: planResolver } } } for plan resolvers
				// Pass them through directly under 'objects' for makeGrafastSchema
				for (const typeName of Object.keys(resolvers)) {
					objects[typeName] = resolvers[typeName]
				}
			} catch (e) {
				console.error('[@stonecrop/nuxt-grafserv] Error loading resolvers:', e)
				throw e
			}
		} else {
			console.debug('[@stonecrop/nuxt-grafserv] No resolvers specified')
		}

		// Create schema with Grafast
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
	}

	cachedSchema = schema
	return schema
}

/**
 * Get or create the grafserv instance
 * Exported for use by separate handler files
 *
 * For PostGraphile mode: uses pgl.createServ(grafserv) to preserve the full
 * execution context (withPgClient, pgSettings, plugin middleware, etc.).
 * For schema mode: builds a schema from files/function and wraps with grafserv.
 */
export async function getGrafservInstance(options: ModuleOptions): Promise<ReturnType<typeof grafserv>> {
	if (grafservInstance) {
		console.log('[@stonecrop/nuxt-grafserv] Returning cached grafserv instance')
		return grafservInstance
	}

	if (options.type === 'postgraphile') {
		// Use pgl.createServ(grafserv) — the canonical PostGraphile v5 pattern.
		// This preserves the full execution context including withPgClient,
		// pgSettings, plugin middleware, lifecycle management, and watch mode.
		console.debug('[@stonecrop/nuxt-grafserv] Creating grafserv via pgl.createServ()')
		try {
			// @ts-expect-error - virtual module
			const { pgl } = await import('#internal/grafserv/pgl')
			grafservInstance = pgl.createServ(grafserv)
			console.log('[@stonecrop/nuxt-grafserv] PostGraphile grafserv instance created via pgl.createServ()')
		} catch (error) {
			if (error instanceof Error && 'code' in error && error.code === 'MODULE_NOT_FOUND') {
				throw new Error(
					'[@stonecrop/nuxt-grafserv] PostGraphile preset provided but "postgraphile" package not found. ' +
						'Install it with: npm install postgraphile',
					{ cause: error }
				)
			}
			console.error('[@stonecrop/nuxt-grafserv] Error creating PostGraphile grafserv instance:', error)
			throw error
		}
	} else if (options.type === 'schema') {
		const schema = await getSchemaForSchemaMode(options)
		grafservInstance = grafserv({ schema })
		console.log('[@stonecrop/nuxt-grafserv] Schema-mode grafserv instance created')
	} else {
		throw new Error(
			`[@stonecrop/nuxt-grafserv] Invalid configuration type: ${(options as Partial<ModuleOptions>).type}`
		)
	}

	return grafservInstance!
}

/**
 * Clear the cached instances (useful for development hot reload)
 *
 * For PostGraphile mode, only the grafserv reference is cleared — PostGraphile's
 * pgl instance manages its own schema lifecycle and watch mode.
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

	// Resolved to a concrete boolean by the module (explicit `graphiql`, else dev-only).
	// grafserv always builds the Ruru handler and, by default, serves it on any browser
	// GET (`graphiqlOnGraphQLGET`); neither is gated by the `graphiql` flag in this
	// direct-call setup. This module never enables `graphqlOverGET`, so a GET here is only
	// ever an IDE request — short-circuit it when the IDE is disabled so both the GET path
	// and the graphiql fallback below stay off.
	const graphiqlEnabled = options.graphiql ?? false

	try {
		// Get grafserv instance
		const serv = await getGrafservInstance(options)

		if (!graphiqlEnabled && event.method === 'GET') {
			setResponseStatus(event, 404)
			return 'GraphiQL is disabled'
		}

		// Try GraphQL handler first - it will return null if not a GraphQL operation
		const graphqlResult = await serv.handleGraphQLEvent(event)
		if (graphqlResult !== null) {
			return graphqlResult
		}

		// Not a GraphQL operation: serve the GraphiQL UI only when enabled
		if (graphiqlEnabled) {
			return serv.handleGraphiqlEvent(event)
		}
		setResponseStatus(event, 404)
		return 'GraphiQL is disabled'
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error in GraphQL handler:', error)
		throw error
	}
})
