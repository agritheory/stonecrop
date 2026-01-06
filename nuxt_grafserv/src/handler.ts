import { existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefs } from '@graphql-tools/load'
import { makeGrafastSchema, type GrafastSchemaConfig } from 'grafast'
import { grafserv } from 'grafserv/h3/v1'
import type { GraphQLSchema } from 'graphql'
import { defineEventHandler, type H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import type { ModuleOptions, GrafastContext, MiddlewareFunction } from './types'

// Cache for the grafserv instance
let grafservInstance: ReturnType<typeof grafserv> | null = null
let cachedSchema: GraphQLSchema | null = null
let cacheInvalidated = false

/**
 * Check if cache should be invalidated based on flag file
 */
function checkCacheInvalidation(): void {
	if (process.env.NODE_ENV !== 'development') {
		return
	}

	try {
		// Check for flag file in Nitro build directory
		const buildDir = process.env.NITRO_BUILD_DIR || '.nuxt'
		const flagPath = resolve(buildDir, '.grafserv-cache-invalidate')

		if (existsSync(flagPath)) {
			cacheInvalidated = true
			// Remove the flag file after reading
			try {
				unlinkSync(flagPath)
			} catch {
				// Ignore errors when removing flag file
			}
		}
	} catch {
		// Ignore errors when checking flag file
	}
}

/**
 * Load schema from file path(s) using graphql-tools
 */
async function loadSchemaFromFiles(schemaPath: string | string[]): Promise<string> {
	const paths = Array.isArray(schemaPath) ? schemaPath : [schemaPath]
	const sources = await loadTypedefs(paths, {
		loaders: [new GraphQLFileLoader()],
	})

	// Combine all type definitions into a single string
	return sources
		.map(source => source.rawSDL || '')
		.filter(Boolean)
		.join('\n')
}

/**
 * Get the GraphQL schema based on configuration
 */
async function getSchema(options: ModuleOptions): Promise<GraphQLSchema> {
	// Clear cache if invalidation flag is set
	if (cacheInvalidated) {
		cachedSchema = null
		cacheInvalidated = false
	}

	if (cachedSchema) {
		return cachedSchema
	}

	let schema: GraphQLSchema

	if (typeof options.schema === 'function') {
		// Schema provider function
		schema = await options.schema()
	} else if (options.schema) {
		// Load from file path(s)
		const typeDefs = await loadSchemaFromFiles(options.schema)

		// Load resolvers/objects if provided
		let grafastConfig: GrafastSchemaConfig = { typeDefs }
		if (options.resolversPath) {
			try {
				const resolverModule = await import(options.resolversPath)
				const resolvers: Omit<GrafastSchemaConfig, 'typeDefs'> = resolverModule.default || resolverModule
				grafastConfig = { typeDefs, ...resolvers }
				console.log('[@stonecrop/nuxt-grafserv] Resolvers loaded successfully from:', options.resolversPath)
			} catch (e) {
				console.error('[@stonecrop/nuxt-grafserv] Failed to load resolvers from', options.resolversPath, ':', e)
				throw e
			}
		}

		// Create schema using Grafast's makeGrafastSchema
		schema = makeGrafastSchema(grafastConfig)
	} else {
		throw new Error('[@stonecrop/nuxt-grafserv] No schema provided. Configure schema path or provider function.')
	}

	cachedSchema = schema
	return schema
}

/**
 * Get or create the grafserv instance
 */
export async function getGrafservInstance(options: ModuleOptions): Promise<ReturnType<typeof grafserv>> {
	// Clear cache if invalidation flag is set
	if (cacheInvalidated) {
		grafservInstance = null
		cachedSchema = null
		cacheInvalidated = false
	}

	if (grafservInstance) {
		return grafservInstance
	}

	const schema = await getSchema(options)
	const isDev = process.env.NODE_ENV === 'development'

	// Create grafserv instance with the schema and proper configuration
	// grafserv uses GraphQL-config preset structure
	const grafservConfig = {
		schema,
		preset: {
			grafserv: {
				graphqlPath: options.url || '/graphql/',
				graphiqlPath: options.url || '/graphql/',
				graphiql: options.graphiql ?? isDev,
				graphiqlOnGraphQLGET: true,
				graphqlOverGET: true, // Enable GET requests for GraphQL
				websockets: options.grafserv?.websockets ?? false,
				introspection: options.grafserv?.introspection ?? isDev,
			},
		},
	}

	grafservInstance = grafserv(grafservConfig)

	console.log('[@stonecrop/nuxt-grafserv] Grafserv instance created with preset:', {
		graphqlPath: grafservConfig.preset.grafserv.graphqlPath,
		graphiql: grafservConfig.preset.grafserv.graphiql,
		graphiqlOnGraphQLGET: grafservConfig.preset.grafserv.graphiqlOnGraphQLGET,
		graphqlOverGET: grafservConfig.preset.grafserv.graphqlOverGET,
	})
	return grafservInstance
}

/**
 * Mark cache as invalid (useful for development hot reload)
 * Cache will be cleared on next request
 */
export function invalidateCache(): void {
	cacheInvalidated = true
}

/**
 * Apply middleware chain to context
 */
async function applyMiddleware(
	context: GrafastContext,
	middleware: ModuleOptions['middleware']
): Promise<GrafastContext> {
	if (!middleware || middleware.length === 0) {
		return context
	}

	const applyNext = async (index: number): Promise<GrafastContext> => {
		if (index >= middleware.length) {
			return context
		}

		if (!middleware[index]) {
			return applyNext(index + 1)
		}

		return middleware[index](context, () => applyNext(index + 1))
	}

	return applyNext(0)
}

/**
 * Main H3 event handler for GraphQL requests
 */
export default defineEventHandler(async (event: H3Event) => {
	const config = useRuntimeConfig()
	const options = config.grafserv as ModuleOptions

	try {
		// Check for cache invalidation flag in development
		checkCacheInvalidation()

		// Build context for middleware
		const { req } = event.node
		const context: GrafastContext = {
			req: new Request(new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`), {
				method: req.method,
				headers: req.headers as HeadersInit,
			}),
			params: event.context.params || {},
		}

		// Load and apply middleware from virtual module
		let middleware: MiddlewareFunction[] = []
		try {
			// @ts-expect-error - virtual module may not exist
			const middlewareModule = await import('#internal/grafserv/middleware')
			middleware = middlewareModule.default || []
		} catch (error) {
			// No middleware configured
			console.log(
				'[@stonecrop/nuxt-grafserv] No middleware module found, proceeding without middleware. Error: ',
				error
			)
		}

		await applyMiddleware(context, middleware)

		// Get grafserv instance
		const serv = await getGrafservInstance(options)

		// Handle the GraphQL request
		return serv.handleGraphQLEvent(event)
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error in GraphQL handler:', error)
		throw error
	}
})
