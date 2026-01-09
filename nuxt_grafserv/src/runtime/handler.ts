import { grafserv } from 'grafserv/h3/v1'
import { makeGrafastSchema } from 'grafast'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefs } from '@graphql-tools/load'
import { defineEventHandler, type H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import type { GraphQLSchema, DocumentNode } from 'graphql'

import type { ModuleOptions, GrafastContext, MiddlewareFunction } from '../types'

// Lazy-load middleware from virtual module (preserves function references)
let middlewareFunctions: MiddlewareFunction[] | null = null

async function getMiddleware(): Promise<MiddlewareFunction[]> {
	if (middlewareFunctions !== null) {
		return middlewareFunctions
	}
	try {
		// @ts-expect-error - virtual module
		const mod = await import('#internal/grafserv/middleware')
		middlewareFunctions = mod.default || []
	} catch {
		middlewareFunctions = []
	}
	return middlewareFunctions
}

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
 * Get the GraphQL schema based on configuration
 */
async function getSchema(options: ModuleOptions): Promise<GraphQLSchema> {
	if (cachedSchema) {
		return cachedSchema
	}

	let schema: GraphQLSchema

	if (typeof options.schema === 'function') {
		// Schema provider function
		schema = await options.schema()
	} else if (options.schema) {
		// Load from file path(s)
		const typeDefDocs = await loadTypeDefsFromFiles(options.schema)

		// Load resolvers if provided
		let plans: Record<string, Record<string, { resolve: unknown }>> = {}
		if (options.resolvers) {
			try {
				const resolverModule = await import('#internal/grafserv/resolvers')
				const resolvers = resolverModule.default || resolverModule
				console.log('[@stonecrop/nuxt-grafserv] Resolvers loaded:', Object.keys(resolvers))

				// Transform GraphQL-style resolvers to Grafast plans format
				// Grafast expects { Type: { field: { resolve: fn } } } not { Type: { field: fn } }
				for (const typeName of Object.keys(resolvers)) {
					plans[typeName] = {}
					const typeResolvers = resolvers[typeName]
					for (const fieldName of Object.keys(typeResolvers)) {
						const resolver = typeResolvers[fieldName]
						if (typeof resolver === 'function') {
							plans[typeName][fieldName] = { resolve: resolver }
						} else {
							plans[typeName][fieldName] = resolver
						}
					}
				}
			} catch (e) {
				console.warn('[@stonecrop/nuxt-grafserv] Could not load resolvers:', e)
			}
		}

		// Create schema with grafast
		schema = makeGrafastSchema({
			typeDefs: typeDefDocs,
			plans,
		})
	} else {
		throw new Error('[@stonecrop/nuxt-grafserv] No schema provided. Configure schema path or provider function.')
	}

	cachedSchema = schema
	return schema
}

/**
 * Get or create the grafserv instance
 */
async function getGrafservInstance(options: ModuleOptions): Promise<ReturnType<typeof grafserv>> {
	if (grafservInstance) {
		return grafservInstance
	}

	const schema = await getSchema(options)
	const isDev = process.env.NODE_ENV === 'development'

	// Create grafserv instance with the schema
	grafservInstance = grafserv({
		schema,
		graphiql: options.graphiql ?? isDev,
		websockets: options.grafserv?.websockets ?? false,
	})

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
		// Handle cache clear endpoint (useful for development)
		if (event.node.req.url?.includes('/__grafserv_cache_clear') && process.env.NODE_ENV === 'development') {
			await clearGrafservCache()
			return { success: true, message: 'Cache cleared' }
		}

		// Build context for middleware
		const { req } = event.node
		const context: GrafastContext = {
			req: new Request(new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`), {
				method: req.method,
				headers: req.headers as HeadersInit,
			}),
			params: event.context.params || {},
		}

		// Apply middleware from virtual module
		const middleware = await getMiddleware()
		await applyMiddleware(context, middleware)

		// Get grafserv instance
		const serv = await getGrafservInstance(options)

		// Check URL to determine what type of request this is
		const url = event.node.req.url || ''
		const method = event.node.req.method || 'GET'

		// Handle Ruru static assets (CSS/JS)
		if (url.includes('/ruru-static/')) {
			return serv.handleGraphiqlStaticEvent(event)
		}

		// Handle GraphiQL HTML page (GET request to /graphql/)
		if (method === 'GET' && url.match(/\/graphql\/?(\?.*)?$/)) {
			return serv.handleGraphiqlEvent(event)
		}

		// Handle GraphQL requests (POST)
		return serv.handleGraphQLEvent(event)
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error in GraphQL handler:', error)
		throw error
	}
})
