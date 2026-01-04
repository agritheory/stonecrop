import type { YogaServerOptions } from 'graphql-yoga'

export type YogaContext = {
	req: Request
	params: Record<string, string>
}

export type RemoteSchema = {
	url: string
	prefix?: string
	headers?: Record<string, string>
	fieldRenames?: Record<string, string>
	transforms?: any[]
	cacheTTL?: number // Override TTL for this specific remote schema (ms)
}

export type MiddlewareFunction = (context: YogaContext, next: () => Promise<any>) => Promise<any>

export type CacheConfig = {
	enabled?: boolean // Enable/disable caching (default: true in production, false in dev)
	ttl?: number // TTL for local schema cache in ms (default: 1 hour in prod, 0 in dev)
	remoteTTL?: number // TTL for remote schemas in ms (default: 5 minutes)
	devMode?: boolean // Enable caching in development (default: false)
}

export interface ModuleOptions {
	schema: string | string[] // Path to GraphQL schema files
	resolvers: string // Path to resolvers file
	url?: string // GraphQL endpoint URL
	yoga?: Partial<Omit<YogaServerOptions<any, any>, 'schema'>>
	remoteSchemas?: RemoteSchema[]
	middleware?: MiddlewareFunction[]
	cache?: CacheConfig // Cache configuration
}
