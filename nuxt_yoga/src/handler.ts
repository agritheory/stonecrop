import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import { createSchema, createYoga, type YogaServerInstance } from 'graphql-yoga'
import { defineEventHandler, type H3Event } from 'h3'
import { hash } from 'ohash'

import type { YogaContext, ModuleOptions, RemoteSchema } from './types'
import { loadRemoteSchemas } from './remote_schema'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'

// Cache configuration
const CACHE_PREFIX = 'yoga:cache:'
const DEFAULT_REMOTE_TTL = 5 * 60 * 1000 // 5 minutes
const DEFAULT_LOCAL_TTL = 60 * 60 * 1000 // 1 hour for production

interface CachedSchema {
	schema: any
	timestamp: number
	hash?: string
}

interface YogaCache {
	instance?: YogaServerInstance<any, any>
	localSchema?: CachedSchema
	remoteSchemas: Map<string, CachedSchema>
	stitchedSchema?: CachedSchema
}

// Global cache instance
let yogaCache: YogaCache = {
	remoteSchemas: new Map(),
}

// Helper to check if cache is expired
function isCacheExpired(cached: CachedSchema | undefined, ttl: number): boolean {
	if (!cached) return true
	return Date.now() - cached.timestamp > ttl
}

// Helper to get cache TTL based on environment
function getCacheTTL(config: ModuleOptions): number {
	const isDev = process.env.NODE_ENV === 'development'
	if (isDev && config.cache?.devMode === false) {
		return 0 // No caching in dev if explicitly disabled
	}
	return config.cache?.ttl || (isDev ? 0 : DEFAULT_LOCAL_TTL)
}

// Load and cache local schema
async function getCachedLocalSchema(schemaPath: string | string[], ttl: number, storage: any): Promise<any> {
	const cacheKey = `${CACHE_PREFIX}local`
	const schemaHash = hash(schemaPath)

	// Check memory cache first
	if (yogaCache.localSchema && !isCacheExpired(yogaCache.localSchema, ttl)) {
		if (yogaCache.localSchema.hash === schemaHash) {
			return yogaCache.localSchema.schema
		}
	}

	// Check storage cache
	if (ttl > 0) {
		const cached = (await storage.getItem(cacheKey)) as CachedSchema
		if (cached && !isCacheExpired(cached, ttl) && cached.hash === schemaHash) {
			yogaCache.localSchema = cached
			return cached.schema
		}
	}

	// Load fresh schema
	console.log('Loading local GraphQL schema...')
	const schema = await loadSchema(schemaPath, {
		loaders: [new GraphQLFileLoader()],
	})

	// Cache the schema
	const cacheEntry: CachedSchema = {
		schema,
		timestamp: Date.now(),
		hash: schemaHash,
	}

	yogaCache.localSchema = cacheEntry

	if (ttl > 0) {
		await storage.setItem(cacheKey, cacheEntry)
	}

	return schema
}

// Load and cache remote schemas
async function getCachedRemoteSchemas(remoteConfigs: RemoteSchema[], ttl: number, storage: any): Promise<any[]> {
	const schemas = await Promise.all(
		remoteConfigs.map(async config => {
			const cacheKey = `${CACHE_PREFIX}remote:${hash(config.url)}`
			const remoteTTL = config.cacheTTL !== undefined ? config.cacheTTL : ttl

			// Check memory cache
			const memoryCached = yogaCache.remoteSchemas.get(config.url)
			if (memoryCached && !isCacheExpired(memoryCached, remoteTTL)) {
				console.log(`Using cached remote schema from ${config.url}`)
				return memoryCached.schema
			}

			// Check storage cache
			if (remoteTTL > 0) {
				const storageCached = (await storage.getItem(cacheKey)) as CachedSchema
				if (storageCached && !isCacheExpired(storageCached, remoteTTL)) {
					console.log(`Using storage cached remote schema from ${config.url}`)
					yogaCache.remoteSchemas.set(config.url, storageCached)
					return storageCached.schema
				}
			}

			// Load fresh remote schema
			console.log(`Fetching remote schema from ${config.url}`)
			const schemas = await loadRemoteSchemas([config])
			const schema = schemas[0]

			if (schema) {
				// Cache the schema
				const cacheEntry: CachedSchema = {
					schema,
					timestamp: Date.now(),
				}

				yogaCache.remoteSchemas.set(config.url, cacheEntry)

				if (remoteTTL > 0) {
					await storage.setItem(cacheKey, cacheEntry)
				}
			}

			return schema
		})
	)

	return schemas.filter(s => s !== null)
}

// Create and cache stitched schema
async function getCachedStitchedSchema(
	localExecutableSchema: any,
	remoteSchemas: any[],
	ttl: number,
	storage: any
): Promise<any> {
	const cacheKey = `${CACHE_PREFIX}stitched`
	const schemaHash = hash({
		local: localExecutableSchema,
		remotes: remoteSchemas.length,
	})

	// Check memory cache
	if (yogaCache.stitchedSchema && !isCacheExpired(yogaCache.stitchedSchema, ttl)) {
		if (yogaCache.stitchedSchema.hash === schemaHash) {
			return yogaCache.stitchedSchema.schema
		}
	}

	// Check storage cache
	if (ttl > 0) {
		const cached = (await storage.getItem(cacheKey)) as CachedSchema
		if (cached && !isCacheExpired(cached, ttl) && cached.hash === schemaHash) {
			yogaCache.stitchedSchema = cached
			return cached.schema
		}
	}

	// Create fresh stitched schema
	console.log('Stitching schemas...')
	const schema = stitchSchemas({
		subschemas: [localExecutableSchema, ...remoteSchemas],
	})

	// Cache the stitched schema
	const cacheEntry: CachedSchema = {
		schema,
		timestamp: Date.now(),
		hash: schemaHash,
	}

	yogaCache.stitchedSchema = cacheEntry

	if (ttl > 0) {
		await storage.setItem(cacheKey, cacheEntry)
	}

	return schema
}

// Create or get cached Yoga instance
async function getCachedYogaInstance(event: H3Event): Promise<YogaServerInstance<any, any>> {
	const config = useRuntimeConfig()
	const yogaConfig = config.yoga as ModuleOptions
	const storage = useStorage()

	// Check if we have a cached instance and schemas aren't stale
	const ttl = getCacheTTL(yogaConfig)
	const remoteTTL = yogaConfig.cache?.remoteTTL || DEFAULT_REMOTE_TTL

	if (yogaCache.instance && yogaCache.localSchema && !isCacheExpired(yogaCache.localSchema, ttl)) {
		// Quick check if remote schemas are still valid
		let remotesValid = true
		if (yogaConfig.remoteSchemas?.length) {
			for (const remote of yogaConfig.remoteSchemas) {
				const cached = yogaCache.remoteSchemas.get(remote.url)
				const remoteSpecificTTL = remote.cacheTTL !== undefined ? remote.cacheTTL : remoteTTL
				if (isCacheExpired(cached, remoteSpecificTTL)) {
					remotesValid = false
					break
				}
			}
		}

		if (remotesValid) {
			return yogaCache.instance
		}
	}

	try {
		// Load local schema with caching
		const localSchema = await getCachedLocalSchema(yogaConfig.schema, ttl, storage)

		// Load resolvers and middleware (these are already cached by Node's module system)
		const resolvers = await import('#internal/yoga/resolvers').then(m => m.default)
		const middleware = await import('#internal/yoga/middleware').then(m => m.default || [])

		// Create local executable schema
		const localExecutableSchema = createSchema({
			typeDefs: localSchema,
			resolvers,
		})

		// Load remote schemas with caching
		let remoteSchemas: any[] = []
		if (yogaConfig.remoteSchemas?.length) {
			remoteSchemas = await getCachedRemoteSchemas(yogaConfig.remoteSchemas, remoteTTL, storage)
			console.log(`Loaded ${remoteSchemas.length} remote schemas (from cache or fresh)`)
		}

		// Get stitched schema with caching
		const schema =
			remoteSchemas.length > 0
				? await getCachedStitchedSchema(localExecutableSchema, remoteSchemas, ttl, storage)
				: localExecutableSchema

		// Create new Yoga instance
		console.log('Creating Yoga instance...')
		const yoga = createYoga({
			schema,
			...yogaConfig.yoga,
			context: async ({ request }): Promise<YogaContext> => {
				const context: YogaContext = {
					req: request,
					params: event.context.params || {},
				}

				// Apply middleware chain
				const applyMiddleware = async (index: number): Promise<YogaContext> => {
					if (index >= middleware.length) {
						return context
					}

					return middleware[index](context, () => applyMiddleware(index + 1))
				}

				return applyMiddleware(0)
			},
		})

		// Cache the instance
		yogaCache.instance = yoga

		return yoga
	} catch (error) {
		console.error('Error creating Yoga instance:', error)
		throw error
	}
}

// Clear all caches (useful for development or manual refresh)
export async function clearYogaCache(): Promise<void> {
	const storage = useStorage()

	// Clear memory cache
	yogaCache = {
		remoteSchemas: new Map(),
	}

	// Clear storage cache
	const keys = await storage.getKeys(CACHE_PREFIX)
	await Promise.all(keys.map(key => storage.removeItem(key)))

	console.log('Yoga cache cleared')
}

// Main handler
export default defineEventHandler(async event => {
	try {
		// Handle cache clear endpoint (useful for development)
		if (event.node.req.url === '/__yoga_cache_clear' && process.env.NODE_ENV === 'development') {
			await clearYogaCache()
			return { success: true, message: 'Cache cleared' }
		}

		// Get or create cached Yoga instance
		const yoga = await getCachedYogaInstance(event)

		// Handle the request
		return yoga.handle(event.node.req, event.node.res)
	} catch (error) {
		console.error('Error in GraphQL handler:', error)
		throw error
	}
})
