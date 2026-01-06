import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'graphile-config'

/**
 * Context provided to GraphQL resolvers
 */
export type GrafastContext = {
	req: Request
	params: Record<string, string>
	[key: string]: unknown
}

/**
 * Middleware function type for request processing
 */
export type MiddlewareFunction = (
	context: GrafastContext,
	next: () => Promise<GrafastContext>
) => Promise<GrafastContext>

/**
 * Schema provider function - returns a GraphQL schema
 */
export type SchemaProvider = () => GraphQLSchema | Promise<GraphQLSchema>

/**
 * Configuration for the Grafast module
 */
export interface ModuleOptions {
	/** Path to schema file(s) or a schema provider function */
	schema?: string | string[] | SchemaProvider

	/** Path to resolvers file (for .graphql schema files) */
	resolvers?: string

	/**
	 * Resolved path to resolvers file (set internally)
	 * @internal
	 */
	resolversPath?: string

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/** Whether to enable GraphiQL IDE (default: true in dev, false in prod) */
	graphiql?: boolean

	/** Middleware functions to process requests */
	middleware?: MiddlewareFunction[]

	/** Custom Graphile preset to extend (for advanced grafast configuration) */
	preset?: GraphileConfig.Preset

	/** Additional Graphile plugins */
	plugins?: GraphileConfig.Plugin[]

	/** Grafserv options */
	grafserv?: {
		/** Whether to enable the GraphQL websocket endpoint */
		websockets?: boolean
		/** Whether to enable introspection (default: true in dev) */
		introspection?: boolean
	}
}
